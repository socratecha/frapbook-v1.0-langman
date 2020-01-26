from sqlalchemy import create_engine, Column, types, MetaData
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

