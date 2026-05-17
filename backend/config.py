import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '../.env'))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'hard-to-guess-string'
    # SQLite database jo root ke 'database' folder me save hogi
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, '../database/app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False