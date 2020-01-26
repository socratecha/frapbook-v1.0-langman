import datetime
import json

from sqlalchemy import create_engine, Column, types, MetaData, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from unidecode import unidecode

from .util import date_to_ordinal

meta = MetaData()
base_games = declarative_base(meta)
base_usage = declarative_base(meta)

class Usage(base_usage):
    '''Table ``usages`` with fields:
      * ``usage_id`` - UUID primary key string of length 38
      * ``language`` - Two-letter language code (en, es, fr)
      * ``secret_word`` - Word to be guesses (length <= 25)
      * ``usage`` - Usage sentence, length <= 400,  with word blanked
      * ``source`` - Text from which the usage sentence is drawn
    '''
    __tablename__ = 'usages'
    usage_id    = Column(types.Integer, primary_key=True)
    language    = Column(types.Enum("en","es","fr", name='language_codes'), nullable=False)
    secret_word = Column(types.String(length=25), nullable=False)
    usage       = Column(types.String(length=400), nullable=False)
    source      = Column(types.String(length=100))

class User(base_games):
    '''Table ``users`` with fields:
      * ``user_id`` - UUID primary key of length 38
      * ``user_name`` - String of maximum length 30
      * ``num_games`` - Integer count of games started
      * ``outcomes`` - JSON string storing game counts by outcome
      * ``by_lang`` - JSON string storing game counts by game language
      * ``first_time`` - DateTime indicating when first game was played
      * ``total_time`` - TimeDelta of total time with active games
      * ``avg_time`` - TimeDelta of the average game length
    '''
    __tablename__ = 'users'
    user_id        = Column(types.String(length=38), primary_key=True)
    user_name      = Column(types.String(length=30), nullable=False)
    num_games      = Column(types.Integer, default=0)
    outcomes       = Column(types.Text, default='{}')
    by_lang        = Column(types.Text, default='{}')
    first_time     = Column(types.DateTime)
    total_time     = Column(types.Interval)
    avg_time       = Column(types.Interval)

    # TODO: fix this
    # games          = relationship('Game', foreign_keys='Game.user_id')
    def _incr_json_field(self, field, key):
        '''Increment the value of self.``field``[``key``] by one where 
        ``field`` is a JSON text string. (Does not commit.)'''
        d = json.loads(getattr(self, field))
        d[key] = d.get(key, 0) + 1
        setattr(self, field, json.dumps(d))

    def _decr_json_field(self, field, key):
        '''Decrement the value of self.``field``[``key``] by one where 
        ``field`` is a JSON text string.  (Does not commit.)'''
        d = json.loads(getattr(self, field))
        d[key] = d.get(key, 0) - 1
        setattr(self, field, json.dumps(d))
        
    def _game_started(self, lang):
        '''Update the number of games ``num_games`` and both ``outcomes`` and
        ``by_lang`` counts by one. (Does not commit.)'''
        self.num_games = (self.num_games or 0) + 1
        self._incr_json_field('outcomes', 'active')
        self._incr_json_field('by_lang', lang)

    def _game_ended(self, outcome, time_delta):
        '''Update the ``total_time`` and ``avg_time`` according to a game that 
        took ``time_delta`` time. Also, update ``outcomes`` by converting one
        active game to have outcome ``outcome``. (Does not commit.)'''
        self._decr_json_field('outcomes', 'active')
        self._incr_json_field('outcomes', outcome)
        self.total_time  = time_delta + (self.total_time or datetime.timedelta(0))
        self.avg_time    = self.total_time / self.num_games
class Game(base_games):
    '''Table ``games`` with fields:
      * ``game_id`` - UUID primary key of length 38
      * ``player`` - Player key from ``users`` table, length 38
      * ``usage_id`` - Integer index usage in ``usages`` table
      * ``guessed`` - A string of the letters guessed so far
      * ``reveal_word`` - Secret word with guessed letters filled in
      * ``bad_guesses`` - Number of bad guesses so far as an integer
      * ``start_time`` - DateTime indicating when the game started
      * ``end_time`` - DateTime indicating when the game ended
    '''
    __tablename__ = 'games'
    game_id     = Column(types.String(length=38), primary_key=True)
    player      = Column(types.String(length=38), ForeignKey(User.user_id), nullable=False)
    usage_id    = Column(types.Integer, nullable=False) # no foreignkey across DBs
    guessed     = Column(types.String(length=30), default='')
    reveal_word = Column(types.String(length=25), nullable=False)
    bad_guesses = Column(types.Integer)
    start_time  = Column(types.DateTime)
    end_time    = Column(types.DateTime)

    # TODO: update langman_orm to use relationships correctly
    # user = relationship('User', foreign_keys='Friend.user_id')
    # friend = relationship('User', foreign_keys='Friend.friend_id')

    def _result(self):
        '''Return the result of the game: lost, won, or active'''
        if self.bad_guesses == 6:
            return 'lost'
        elif '_' not in self.reveal_word:
            return 'won'
        else:
            return 'active'

    def _to_dict(self, old_dict=None):
        '''Convert the game into a dictionary suitable for JSON serialization

        Special attention is paid to DateTime fields using the
        date_to_ordinals function.'''
        as_dict = { k:v for k,v in self.__dict__.items() if not k.startswith('_') }
        as_dict['result'] = self._result()
        as_dict['start_time'] = date_to_ordinal(as_dict.get('start_time'))
        as_dict['end_time'] = date_to_ordinal(as_dict.get('end_time'))

        if old_dict is not None:
            print('checking new dict vs old dict in game class')
            assert ( (as_dict['player'] == old_dict['player']) and
                     (as_dict['usage_id'] == old_dict['usage_id']) and
                     (old_dict['result'] == 'active') and 
                     (as_dict['guessed'].startswith(old_dict['guessed'])) and
                     (len(as_dict['guessed']) - len(old_dict['guessed']) in (0,1)) ), \
                     'Invalid game state update from {} to {}'.format(old_dict, as_dict)
        self._check_consistent()

        return as_dict

    def _check_consistent(self):
        '''Test record to make sure ``guessed`` and ``reveal_word`` are
        consistent'''
        dec_reveal = unidecode(self.reveal_word)
        good_guesses = set([ l for l in self.guessed if l in dec_reveal ])
        bad_guesses = set([ l for l in self.guessed if l not in dec_reveal ])
        result = self._result()
        assert ( (len(bad_guesses) == self.bad_guesses) and
                 (len(bad_guesses.intersection(dec_reveal)) == 0) and
                 (result in ('lost', 'won', 'active')) and
                 (self.bad_guesses <= 6) and
                 ((self.bad_guesses == 6) or (result in ('active', 'won'))) ), \
                'Invalid game state: {} {} {}'.format(good_guesses, bad_guesses, self.reveal_word)
        
