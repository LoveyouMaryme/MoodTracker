from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


DB_NAME = "mood_tracker.db"
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy()
db.init_app(app)


from app import routes, models
