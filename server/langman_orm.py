from sqlalchemy import create_engine, Column, types, MetaData, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
meta = MetaData()
base_games = declarative_base(meta)

class Usage(base_games):
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
    usage       = Column(types.String(length=500), nullable=False)
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

