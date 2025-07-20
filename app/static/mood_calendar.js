function updateWeekdayNames() {
    document.querySelectorAll('.day').forEach(el => {
        const isTooSmall = el.offsetWidth < 80;
        el.textContent = isTooSmall ? el.dataset.short : el.dataset.long;
    });
}

window.addEventListener('resize', updateWeekdayNames);
window.addEventListener('DOMContentLoaded', updateWeekdayNames);


const NEXT_BUTTON = document.querySelector('.arrow-next');
const PREVIOUS_BUTTON = document.querySelector('.arrow-previous');
var today = new Date();

NEXT_BUTTON.addEventListener('click', () => updateMonth('next'));
PREVIOUS_BUTTON.addEventListener('click', () => updateMonth('previous'));
window.addEventListener('DOMContentLoaded', () => updateMonth('current'));

function updateMonth(state) {
    if (state === 'previous') {
        today.setMonth(today.getMonth() - 1);
    } else if (state === 'next') {
        today.setMonth(today.getMonth() + 1);
    } else {
        today = new Date();
    }

    const currentMonth = today.toLocaleString('en-US', { month: 'long' });
    const currentYear = today.toLocaleString('en-US', { year: 'numeric' });

    document.querySelector(".month").innerHTML = `${currentMonth}, ${currentYear}`;

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const firstWeekdayIndex = firstDayOfMonth.getDay();
    const lastDate = lastDayOfMonth.getDate();

    document.querySelector('.jour').innerHTML = "";

    const dayElements = [];
    const moodPromises = [];
    moodPromises.push(getMoodForMonth(firstDayOfMonth));


    for (let i = 0; i <= 41; i++) {
        const DAY_ELEMENT = document.createElement('div');
        const fullDate = new Date(today.getFullYear(), today.getMonth(), i - firstWeekdayIndex + 1);
        fullDate.setHours(0, 0, 0, 0);

        if (i < firstWeekdayIndex) {
            // Previous month
            const prevMonthDate = new Date(today.getFullYear(), today.getMonth(), 0);
            DAY_ELEMENT.className = 'journee-inactive';
            DAY_ELEMENT.textContent = prevMonthDate.getDate() - (firstWeekdayIndex - i - 1);
        } else if (i >= lastDate + firstWeekdayIndex) {
            // Next month
            DAY_ELEMENT.className = 'journee-inactive';
            DAY_ELEMENT.textContent = i - lastDate - firstWeekdayIndex + 1;
        } else {
            // Current month
            const dayOfMonth = i - firstWeekdayIndex + 1;
            DAY_ELEMENT.className = 'journee-active';
            DAY_ELEMENT.dataset.date = fullDate.toISOString().split('T')[0];
            DAY_ELEMENT.innerHTML = dayOfMonth;

            // Collect mood request and element
            dayElements.push(DAY_ELEMENT);
            ;
        }

        document.querySelector('.jour').appendChild(DAY_ELEMENT);

    }

    update_calendar_moods();



    async function update_calendar_moods() {
        // Once all moods are loaded, update elements
        const moodResults = await Promise.all(moodPromises);


        moodResults[0].forEach((mood) => {


            const date = mood.date.split(" ")[0]
            const element_date = date.split("-")[2]
            const el = dayElements[element_date - 1];
            const mood_per_day = mood.mood


            if (mood) {
                el.style.backgroundImage = `url('/static/images/${mood_per_day}.png')`;
                el.style.backgroundSize = 'contain';
                el.style.backgroundPosition = 'center';
                el.style.backgroundRepeat = 'no-repeat';
                el.innerHTML = '';
            }
        });
    }
}



document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("journee-active")) {
        const date = e.target.dataset.date;
        const listOfNotes = await getNotesForDay(date);
        const noteSection = document.querySelector('#notes-section');



        // Apply scroll styles here
        noteSection.style.maxHeight = "300px";
        noteSection.style.overflowY = "auto";
        noteSection.style.boxSizing = "border-box";

        noteSection.innerHTML = '';

        if (listOfNotes.length === undefined) {
            const emptyNote = document.createElement('div');
            emptyNote.className = 'note-empty';
            emptyNote.textContent = 'No notes for this day 🐾';
            noteSection.appendChild(emptyNote);

        } else {



            listOfNotes.forEach(note => {
                const NOTE_ALL_ELEMENT = document.createElement('div');
                NOTE_ALL_ELEMENT.className = 'note';

                const NOTE_TOP_ELEMENT = document.createElement('div');
                NOTE_TOP_ELEMENT.className = 'top-section-note';

                const NOTE_TOP_TITLE = document.createElement('h1');
                NOTE_TOP_TITLE.className = 'note-title';
                NOTE_TOP_TITLE.textContent = note.title;

                const NOTE_TOP_DATE = document.createElement('span');
                NOTE_TOP_DATE.className = 'note-date';
                NOTE_TOP_DATE.textContent = note.date;

                const NOTE_BOTTOM_ELEMENT = document.createElement('div');
                NOTE_BOTTOM_ELEMENT.className = 'note-content';
                NOTE_BOTTOM_ELEMENT.textContent = note.content;

                NOTE_TOP_ELEMENT.appendChild(NOTE_TOP_TITLE);
                NOTE_TOP_ELEMENT.appendChild(NOTE_TOP_DATE);
                NOTE_ALL_ELEMENT.appendChild(NOTE_TOP_ELEMENT);
                NOTE_ALL_ELEMENT.appendChild(NOTE_BOTTOM_ELEMENT);

                noteSection.appendChild(NOTE_ALL_ELEMENT);
            });
        }
    }

});



async function getMoodForMonth(day) {
    const formattedDate = day.toISOString().split('T')[0];
    const month = formattedDate.split('-')[1];
    const year = formattedDate.split('-')[0];
    try {
        const response = await fetch(`/api/current_mood?month=${month}&year=${year}`);
        const data = await response.json();
        return data
    } catch (error) {
        console.error('Error fetching mood:', error);
        return null;
    }
}


async function getNotesForDay(date) {
    try {
        const response = await fetch(`/api/current_notes?date=${date}`);
        const data = await response.json();
        return data
    } catch (error) {
        console.error('Error fetching mood:', error);
        return null;
    }
}

