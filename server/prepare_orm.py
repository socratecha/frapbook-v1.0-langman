import os
import csv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from .langman_orm import base_games, Usage
from .util import get_config

import click
from flask import Flask

app = Flask(__name__)

@app.cli.command('init-db')
def init_db():
    config = get_config(os.environ['FLASK_ENV'], open('server/config.yaml'))
    db   = create_engine(config['DB'])
    base_games.metadata.create_all(db)
                
    Session = sessionmaker(db)
    session = Session()
    if session.query(Usage).count() == 0:
        data = []
        R = csv.reader(open('data/usages.csv', encoding='utf8'))
        for row in R:
            if len(row[4]) <= 500:
                data.append( Usage(
                    usage_id    = int(row[0]),
                    language    = row[1],
                    secret_word = row[3],
                    usage       = row[4],
                    source      = row[5]
                ))

        print('Adding', len(data), 'rows to Usage table')
        session.add_all(data)
        session.commit()
