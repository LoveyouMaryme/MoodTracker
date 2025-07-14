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

async function updateMonth(state) {
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

    for (let i = 0; i <= 41; i++) {
        const DAY_ELEMENT = document.createElement('div');
        const currentDate = new Date(today.getFullYear(), today.getMonth(), 1);
        const fullDate = new Date(today.getFullYear(), today.getMonth(), i - firstWeekdayIndex + 1);
        fullDate.setHours(0, 0, 0, 0);

        if (i < firstWeekdayIndex) {
            // Previous month
            const prevMonthDate = new Date(today.getFullYear(), today.getMonth(), 0);
            DAY_ELEMENT.className = 'journee inactive';
            DAY_ELEMENT.textContent = prevMonthDate.getDate() - (firstWeekdayIndex - i - 1);
        } else if (i >= lastDate + firstWeekdayIndex) {
            // Next month
            DAY_ELEMENT.className = 'journee inactive';
            DAY_ELEMENT.textContent = i - lastDate - firstWeekdayIndex + 1;
        } else {
            // Current month
            const dayOfMonth = i - firstWeekdayIndex + 1;
            DAY_ELEMENT.className = 'journee active';
            DAY_ELEMENT.dataset.date = fullDate.toISOString().split('T')[0];
            DAY_ELEMENT.textContent = dayOfMonth;

            // Collect mood request and element
            dayElements.push(DAY_ELEMENT);
            moodPromises.push(getMoodForDay(fullDate));
        }

        document.querySelector('.jour').appendChild(DAY_ELEMENT);
    }


    // Once all moods are loaded, update elements
    const moodResults = await Promise.all(moodPromises);
    moodResults.forEach((mood, idx) => {
        const el = dayElements[idx];

        if (mood) {
            el.style.backgroundImage = `url('/static/images/${mood}.png')`;
            el.style.backgroundSize = 'contain';
            el.style.backgroundPosition = 'center';
            el.style.backgroundRepeat = 'no-repeat';
        }
    });
}

async function getMoodForDay(day) {
    const formattedDate = day.toISOString().split('T')[0];
    try {
        const response = await fetch(`/api/current_mood?date=${formattedDate}`);
        const data = await response.json();
        return data.mood;
    } catch (error) {
        console.error('Error fetching mood:', error);
        return null;
    }
}
