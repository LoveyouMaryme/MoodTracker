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

    print(monthMood)
    
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
