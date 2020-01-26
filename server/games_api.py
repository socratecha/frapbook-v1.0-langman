import datetime
import random
import uuid

from flask import g
from flask_restplus import Resource, Namespace
from sqlalchemy.sql import func
from unidecode import unidecode
import flask_jwt_extended as JWT
from .langman_orm import Usage, User, Game

games_api = Namespace('games', description='Creating and playing games')

@games_api.route('')
class Games(Resource):
    valid_langs = ('en', 'es', 'fr')
    @JWT.jwt_required
    def post(self):
        '''Start a new game and return the game id

        :route: ``/`` GET (valid token required)

        :payload:
              * ``language`` Language to play in (e.g., 'en')

        :returns:
           A success message:
              * ``message`` Literal 'success'
              * ``game_id`` The new game's UUID
        '''
        # check input is valid
        if not (games_api.payload and
                'language' in games_api.payload):
            games_api.abort(400, 'New game POST requires language')
        lang = games_api.payload['language']
        name = JWT.get_jwt_claims()['name']
        user_id = JWT.get_jwt_identity()
        if lang not in self.valid_langs:
            return {'message': 'New game POST language must be from ' +
                               ', '.join(Games.valid_langs)}, 400

        # if user does not exist, create user; get user id
        user = g.games_db.query(User).filter(User.user_id == user_id).one_or_none()
        if user is None:
            user = User(
                user_id = user_id, 
                user_name = name,
                first_time = datetime.datetime.now(),
            )
            g.games_db.add(user)
            g.games_db.commit()
            user = g.games_db.query(User).filter(User.user_name == name).one()
        user._game_started(lang)
        
        # select a usage example
        usage = g.usage_db.query(Usage).filter(
            Usage.language==lang
        ).order_by(func.random()).first()
        
        # create the new game
        new_game_id = str(uuid.uuid4())
        new_game = Game(
            game_id  = new_game_id,
            player   = user.user_id,
            usage_id = usage.usage_id,
            bad_guesses = 0,
            reveal_word = '_' * len(usage.secret_word),
            start_time = datetime.datetime.now()
        )
        g.games_db.add(new_game)
        g.games_db.commit()

        # return the new game id
        return { 'message': 'success', 'game_id':new_game_id,
                 'access_token': JWT.create_access_token(
                     identity=user_id,
                     user_claims={'access':'player',
                                  'name':name,
                                  'game_id':new_game_id}) }

@games_api.route('/<game_id>')
class OneGame(Resource):
    @JWT.jwt_required
    def get(self, game_id):
        '''Get the game ``game_id`` information

        :route: ``/<game_id>`` GET (valid token required)

        :returns:
           The object for a game, including:
              * ``game_id`` The game's UUID
              * ``player`` The player's name
              * ``usage_id`` The game usage id from the Usages table
              * ``guessed`` A string of guessed letters
              * ``reveal_word`` Guessed letters in otherwise blanked word string
              * ``bad_guesses`` Number of incorrect guesses so far
              * ``start_time`` The epoch ordinal time when game began
              * ``end_time`` The epoch ordinal time when game ended
              * ``result`` Game outcome from ('lost', 'won', 'active')
              * ``usage`` The full sentence example with guess-word blanked
              * ``lang`` The language of the example, such as 'en'
              * ``source`` The book from which the usage example originated
        '''
        # check input is valid
        game = g.games_db.query(Game).filter(Game.game_id == game_id).one_or_none()
        
        # if game does not exist or belongs to another user, produce error code
        if (game is None or game.player != JWT.get_jwt_identity()
            or 'game_id' in JWT.get_jwt_claims()):
            print(game._to_dict(), JWT.get_jwt_identity(), JWT.get_jwt_claims())
            games_api.abort(404, 'Game {} is unauthorized'.format(game_id))
        
        # get usage record because it contains the language and usage example
        usage = g.usage_db.query(Usage).filter(Usage.usage_id == game.usage_id).one()
        
        # return game state
        game_dict = game._to_dict()
        game_dict['usage']  = usage.usage.format(word='_'*len(usage.secret_word))
        game_dict['lang']   = usage.language
        game_dict['source'] = usage.source

        # provide the access token for this game
        game_dict['access_token'] = JWT.create_access_token(
                identity   = JWT.get_jwt_identity(), 
                user_claims={'access':'player', 'game_id':game_id,
                             'name':JWT.get_jwt_claims()['name']})
        return game_dict
    
    @JWT.jwt_required
    def put(self, game_id):
        '''Update game ``game_id`` as resulting from a guessed letter

        :route: ``/<game_id>`` PUT (valid game-specific token required)

        :payload:
           The guessed letter as an object:
              * ``letter`` A single guessed letter

        :returns:
           The object for a game, including:
              * ``game_id`` The game's UUID
              * ``player`` The player's name
              * ``usage_id`` The game usage id from the Usages table
              * ``guessed`` A string of guessed letters
              * ``reveal_word`` Guessed letters in otherwise blanked word string
              * ``bad_guesses`` Number of incorrect guesses so far
              * ``start_time`` The epoch ordinal time when game began
              * ``end_time`` The epoch ordinal time when game ended
              * ``result`` Game outcome from ('lost', 'won', 'active')

        This method interacts with the database to update the
        indicated game.
        '''
        user_claims = JWT.get_jwt_claims()
        if user_claims.get('game_id', '') != game_id:
            games_api.abort(503, 'Unauthorized access to game {}'.format(game_id))
        # check input is valid; return error if game non-existent or inactive
        game = g.games_db.query(Game).filter(Game.game_id == game_id).one_or_none()
        if game is None:
            games_api.abort(404, 'Game with id {} does not exist'.format(game_id))
        if game._result() != 'active':
            games_api.abort(403, 'Game with id {} is over'.format(game_id))
        old_dict = game._to_dict()       # NEW LINE IN UPDATE
        if ('letter' not in games_api.payload or
            not games_api.payload['letter'].isalpha() or
            len(games_api.payload['letter']) != 1):
            games_api.abort(400, 'PUT requires one alphabetic character in "letter" field')
        letter = games_api.payload['letter'].lower()
        
        # update game state according to guess
        if letter in game.guessed:             # check for repeated guess
            games_api.abort(403, 'Letter {} was already guessed'.format(letter))
        game.guessed = game.guessed + letter
        usage  = g.usage_db.query(Usage).filter(Usage.usage_id == game.usage_id).one()
        if letter in unidecode(usage.secret_word.lower()):
            game.reveal_word = ''.join([
                l if unidecode(l.lower()) in game.guessed else '_'
                for l in usage.secret_word])
        else:
            game.bad_guesses += 1
            
        # if game is over, update the user record
        outcome = game._result()
        if outcome != 'active':
            user = g.games_db.query(User).filter(User.user_id == game.player).one()
            game.end_time = datetime.datetime.now()
            user._game_ended(outcome, game.end_time - game.start_time)            

        # return the modified game state
        game_dict = game._to_dict(old_dict)
        game_dict['usage']  = usage.usage.format(word='_'*len(usage.secret_word))
        game_dict['lang']   = usage.language
        game_dict['source'] = usage.source
        if outcome != 'active':
            game_dict['secret_word'] = usage.secret_word
        
        g.games_db.commit()

        return game_dict
    
    @JWT.jwt_required
    def delete(self, game_id):
        '''Delete record for game ``game_id``

        :route: ``/<game_id>`` DELETE (valid game-specific token required)
        :returns:
           An acknowledgment object:
              * ``message`` Either 'One' or 'Zero' records deleted

        This method removed the game from its table
        '''
        # Make sure token can access this game
        if JWT.get_jwt_claims().get('game_id', '') != game_id:
            games_api.abort(503, 'Unauthorized access to game {}'.format(game_id))

        game = g.games_db.query(Game).filter(Game.game_id == game_id).one_or_none()
        if game is not None:
            g.games_db.delete(game)
            g.games_db.commit()
            msg = 'One record deleted'
        else:
            msg = 'Zero records deleted'

        return {'message': msg}
    
