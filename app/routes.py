from app import app, db
from flask import render_template, request, redirect, url_for, session, jsonify
from app.models import Note, Mood
from app.routes import app
from sqlalchemy.sql import func
from datetime import datetime



app.secret_key = 'your_secret_key_here'  # Set a secret key for session management

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        mood = request.form.get('mood')
        print(mood)
        if mood:
            session['mood'] = mood
            currentMood = Mood(
            mood=mood,
            date=datetime.now()
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
    print(mood)
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
def get_all_moods_of_Month():
    month  = request.args.get('month')
    year = request.args.get('year')
    if not month or not year:
        return jsonify({"error": "Month or Year parameters are missing"}), 400
    


    #Get the last mood of the day
    ranked_moods = db.session.query(
        Mood,
        func.rank().over(
            partition_by=func.date(Mood.date),
            order_by=Mood.date.desc()
        ).label('rnk')
    ).filter(
        func.extract('month', Mood.date) == int(month),
        func.extract('year', Mood.date) == int(year)
    ).subquery()

    # 
    monthMood = db.session.query(ranked_moods).filter(ranked_moods.c.rnk == 1).order_by(ranked_moods.c.date.desc()).all()

    
    mood_list = [
        {
            "mood": mood.mood,
            "date": mood.date.strftime('%Y-%m-%d %H:%m:%s')
        } for mood in monthMood
    ] 

    if mood_list:
        return jsonify(mood_list)
    else:
        return jsonify({"mood": None, "date": None})
    
@app.route('/write-note')
def write_note():
    return  render_template("write-notes.html")
    

@app.route('/confirmation_register_note', methods=["GET", "POST"])
def register_note():

    if request.method == "POST":
        note_title = request.form.get('title')
        note_content = request.form.get('note-contain')
        mood = request.form.get('mood')

        if note_title and note_content:
            session['note'] = note_content
            currentNote = Note(
                title=note_title,
                content=note_content,

                date=datetime.now()
            )
        if mood:
            currentNote.mood_id = mood
            db.session.add(currentNote)
            db.session.commit()

            return redirect(url_for('confirmation_register_note'))
        else:
            return redirect(url_for('error_register_note')) 
    
    return url_for('write_note')
 



