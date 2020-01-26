import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from .langman_orm import base_games
from .util import get_config

import click
from flask import Flask

app = Flask(__name__)

@app.cli.command('init-db')
def init_db():
    config = get_config(os.environ['FLASK_ENV'], open('server/config.yaml'))
    db   = create_engine(config['DB'])
    base_games.metadata.create_all(db)
                
