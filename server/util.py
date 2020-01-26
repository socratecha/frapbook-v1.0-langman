import yaml
import os

def get_config(env, config_resource):
    '''Get application config

    :arguments:
        - ``env`` - a string indicating the Flask application
        - ``config_resource`` - file object for the config yaml file

    Sets up the application config as follows:
        1. Sets the environment key from app.config['ENV'], which is automatically set by Flask.
        2. Loads config values from within the environment key of the config.yaml file
        3. Loads an FLASK_KEY=VAL environment variables as app.config['KEY']='VAL'
        4. For any variable with value starting with "env:" load the corresponding value
    '''
    # Load config options for the given environment
    config_dict = yaml.load(config_resource, Loader=yaml.Loader)
    try:
        config_dict = config_dict[env]
    except KeyError:
        raise KeyError("Invalid ENV value '{}' should be in {}, set using FLASK_ENV=value".format(
            env, list(config_dict.keys())) )
    # Load any FLASK_ environment variables
    for key, value in os.environ.items():
        if key.startswith('FLASK_'):
            config_dict[key[6:]] = value
    # Load any env: values from the environment
    for key, value in config_dict.items():
        if isinstance(value, str) and value.startswith('env:'):
            config_dict[key] = os.environ[value[4:]]
    # Put the values into the application config
    return config_dict
