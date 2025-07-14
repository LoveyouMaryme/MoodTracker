from app import db
from sqlalchemy.sql import func

class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    mood_id = db.Column(db.Integer,  db.ForeignKey('mood.id'), nullable=False)
    content = db.Column(db.String(20000), nullable=True)
    date_created = db.Column(db.DateTime(timezone=True), default=func.now())

    def __repr__(self):
        return f'<Note {self.content} created on {self.date_created}>'

class Mood(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    mood = db.Column(db.String(15), nullable=False)
    date = db.Column(db.DateTime(timezone=True), default=func.now())
    notes = db.relationship('Note', backref='mood', lazy=True)

    def __repr__(self):
        return f'<Mood {self.mood} on {self.date}>'