from app import db
from sqlalchemy.sql import func

class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable = True)
    content = db.Column(db.String(20000), nullable=True)
    date_created = db.Column(db.DateTime(timezone=True), default=func.now())
    mood_id = db.Column(db.Integer,  db.ForeignKey('mood.id'), nullable=True)

    def __repr__(self):
        return f'<Note number {self.id}; {self.title} created on {self.date_created}>'

class Mood(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    mood = db.Column(db.String(15), nullable=False)
    date = db.Column(db.DateTime(timezone=True), default=func.now())
    notes = db.relationship('Note', backref='mood', lazy=True)

    def __repr__(self):
        return f'<Mood number {self.id}; {self.mood} on {self.date}>'