import json, random, os
import pytest, yaml

from server.app import app

@pytest.fixture(scope='module')
def test_app():
    '''Uses ``app`` imported from flask_app to create a testable Flask
    application.

    :yield: Flask application with a context, ready for testing
    '''
#    global app                         # Uses global variable "app"
    app.config['TESTING'] = True
    test_app = app.test_client() 
    ctx = app.app_context()
    ctx.push()
    yield test_app 
    ctx.pop()

def random_string():
    '''Create a random string of upper and lower case letters, digits, and
    some punctuation, of length 0, 3, 8, or 22 for testing.'''
    valid_chars = ('abcdefghijklmnopqrstuvwxyz'
                   'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
                   '0123456789!@#$%^&*()_-+=~?')
    return ''.join([ random.choice(valid_chars)
                     for i in range(random.choice([0,3,8,22])) ])

def test_full_random_game(test_app):
    '''Randomly step through a game to see if any assertions are triggered
    by the API's own consistency checks.
    '''
    username = random_string()
    language = random.choice(('en', 'es', 'fr', 'bad'))
    
    # POST to start a game, extract the game_id
    response = test_app.post(
        '/api/games',
        data=json.dumps(dict(username=username,language=language)),
        headers = {'Content-Type': 'application/json',
                   'Accept': 'application/json'}
    )
    if language == 'bad':
        assert response.status_code == 400, 'Wrong response for invalid language'
        return
    assert response.status_code == 200, 'Error when POSTing to start new game'
    game_id = json.loads(response.data.decode())['game_id']

    # GET just for fun
    response = test_app.get(
        '/api/games/' + game_id,
        headers = {'Content-Type': 'application/json',
                   'Accept': 'application/json'}
    )
    assert response.status_code == 200, 'Error in GET game'
    game_status = json.loads(response.data.decode())['result']

    # PUT random letters until game is no longer active
    guesses = ''
    while game_status == 'active':
        letter = random.choice('abcdefghijklmnopqrstuvwxyz123!')
        guesses = guesses + letter
        response = test_app.put(
            '/api/games/' + game_id,
            data = json.dumps(dict(letter=letter)),
            headers = {'Content-Type': 'application/json',
                       'Accept': 'application/json'}
        )
        if letter.isalpha():
            if guesses.count(letter) == 1:
                assert response.status_code == 200, 'Error in PUT letter guess'
                game_status = json.loads(response.data.decode())['result']
            else:
                assert response.status_code == 403, 'Repeated code should be forbidden'
        assert len(guesses) < 100, 'Too many guesses; something is probably broken'
        
    # Check that the final number of bad_guesses looks right
    game_data = json.loads(response.data.decode())
    assert ( ((game_data['result'] == 'lost') and (game_data['bad_guesses'] == 6))
             or ((game_data['result'] == 'won') and (game_data['bad_guesses'] < 6)) )

    # PUT in another guess just to see it complain
    letter = random.choice('abcdefghijklmnopqrstuvwxyz')
    response = test_app.put(
        '/api/games/' + game_id,
        data = json.dumps(dict(letter=letter)),
        headers = {'Content-Type': 'application/json',
                   'Accept': 'application/json'}
    )
    assert response.status_code == 403, 'Post-game guess should be forbidden'

    test_app.delete(
        '/api/games/' + game_id
    )
    
def test_multiple_games(test_app):   # takes about 1s
    for i in range(10):
        test_full_random_game(test_app)
