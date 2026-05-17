from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from backend.config import Config

db = SQLAlchemy()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Allow frontend to communicate with backend
    CORS(app)
    db.init_app(app)

    # Routes import aur register karna
    from backend.app.routes import bp as main_bp
    app.register_blueprint(main_bp)

    # Pehli dafa run hone par tables create karna
    with app.app_context():
        db.create_all()

    return app