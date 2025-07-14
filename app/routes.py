from app import app, db
from flask import render_template, request, redirect, url_for, session, jsonify
from app.models import Note, Mood
from app.routes import app
from sqlalchemy.sql import func



app.secret_key = 'your_secret_key_here'  # Set a secret key for session management

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        mood = request.form.get('mood')
        if mood:
            session['mood'] = mood
            currentMood = Mood(
            mood=mood
            )
            db.session.add(currentMood)
            db.session.commit()
            return redirect(url_for('thank_you'))
        else:
            return redirect(url_for('error_message'))
    return render_template("index.html", name="Love")

    
@app.route('/show_calendar')
def show_mood_calendar():
    return  render_template("mood_calendar.html")


@app.route('/thank_you')
def thank_you():
    mood = session.get('mood')
    return render_template('display_mood.html', mood=mood)


@app.route('/error_message')
def error_message():
    return render_template('error.html')


@app.route("/show_calendar/mood_list")
def get_mood_list():
    moods = db.session.execute(
        db.select(Mood).order_by(Mood.date.desc()).limit(1)
    ).scalars().all()
    return render_template("moods_history.html", mood_list=moods)


@app.route("/api/current_mood")
def get_currentDay_mood():
    date = request.args.get('date')
    if not date:
        return jsonify({"error": "Date parameter is required"}), 400
    
   
    #This function retrieves the last mood recorded for a specific date.
    currentMood = db.session.execute(
        db.select(Mood).where(func.date(Mood.date) == date).order_by(Mood.date.desc()).limit(1)).scalars().first()
    
    print(currentMood)

    if currentMood:
        return jsonify({
            "mood": currentMood.mood,
            "date": currentMood.date.strftime('%Y-%m-%d')
        })
    else:
        return jsonify({"mood": None, "date": None})