from flask import Flask, g
from flask_restplus import Api
from flask_cors import CORS
import flask_jwt_extended as JWT
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from .util import get_config
from .auth_api import auth_api

app = Flask(__name__)
app.config.update(
    get_config(
        app.config['ENV'],
        app.open_resource('config.yaml')
    )
)
CORS(app)
api = Api(app)
api.add_namespace(auth_api, path='/auth')

if 'JWT_SECRET_KEY' not in app.config:
    app.config['JWT_SECRET_KEY'] = 'some secret key'

if 'JWT_ACCESS_TOKEN_EXPIRES' not in app.config:
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 86400 # default to 1 day

jwt = JWT.JWTManager(app)

@app.before_request
def init_db():
    '''Initialize db by creating the global db_session'''
    if not hasattr(g, 'auth_db'):
        db_auth = create_engine(app.config['DB_AUTH'])
        g.auth_db = sessionmaker(db_auth)()

@app.teardown_request
def close_db(exception):
    '''Close down db connection'''
    if hasattr(g, 'auth_db'):
        g.auth_db.close()
        _ = g.pop('auth_db')


