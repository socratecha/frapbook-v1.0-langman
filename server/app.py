from .util import get_config
from flask import Flask, g
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from flask_restplus import Api
from flask_cors import CORS
import flask_jwt_extended as JWT
from .games_api import games_api
from .auth_api import auth_api

app = Flask(__name__)                         # Create Flask app
app.config.update(get_config(
    app.config['ENV'], app.open_resource('config.yaml')))
CORS(app)                                     # Cross-origin resource sharing

api = Api(app, doc=False)
api.add_namespace(games_api, path='/api/games')
api.add_namespace(auth_api, path='/api/auth')

assert ('JWT_SECRET_KEY' in app.config), 'Must set FLASK_JWT_SECRET_KEY env variable'
if 'JWT_ACCESS_TOKEN_EXPIRES' not in app.config:
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 86400   # default is 1 day

app.config['PROPAGATE_EXCEPTIONS'] = True    # avoids server error w/bad JWTs in gunicorn

jwt = JWT.JWTManager(app)  # do this after config is set


print('URL MAP', app.url_map)   # useful for debugging
@app.before_request
def init_db():
    '''Initialize db by creating the global db_session

    This runs on each request.
    '''
    db_auth = create_engine(app.config['DB_AUTH'])
    g.auth_db = sessionmaker(db_auth)()
        
    db_usage = create_engine(app.config['DB_USAGE'])
    g.usage_db = sessionmaker(db_usage)()
        
    db_games = create_engine(app.config['DB_GAMES'])
    g.games_db = sessionmaker(db_games)()

@app.teardown_request
def close_db(exception):    
    '''Close down db connection; same one cannot be used b/w threads

    This runs after each request.
    '''
    if hasattr(g, 'auth_db'):
        g.auth_db.close()
        _ = g.pop('auth_db')

    if hasattr(g, 'usage_db'):
        g.usage_db.close()
        _ = g.pop('usage_db')
        
    if hasattr(g, 'games_db'):
        g.games_db.close()
        _ = g.pop('games_db')
