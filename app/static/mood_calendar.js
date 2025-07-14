function updateWeekdayNames() {
    document.querySelectorAll('.day').forEach(el => {
        const isTooSmall = el.offsetWidth < 80;;
        el.textContent = isTooSmall ? el.dataset.short : el.dataset.long;
    });
}

window.addEventListener('resize', updateWeekdayNames);
window.addEventListener('DOMContentLoaded', updateWeekdayNames);



const NEXT_BUTTON = document.querySelector('.arrow-next');
const PREVIOUS_BUTTON = document.querySelector('.arrow-previous');
var today = new Date()

NEXT_BUTTON.addEventListener('click', () => updateMonth('next'));
PREVIOUS_BUTTON.addEventListener('click', () => updateMonth('previous'));
window.addEventListener('DOMContentLoaded', () => updateMonth('current'));





async function updateMonth(state) {



    if (state === 'previous') {
        today.setMonth(today.getMonth() - 1);
    } else if (state === 'next') {
        today.setMonth(today.getMonth() + 1)
    } else {
        today = new Date();
    }


    const currentMonth = today.toLocaleString('en-US', { month: 'long' });
    const currentYear = today.toLocaleString('en-US', { year: 'numeric' });

    document.querySelector(".month").innerHTML = `${currentMonth}, ${currentYear}`;

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);


    document.querySelector('.jour').innerHTML = "";
    for (let i = firstDayOfMonth.getDate(); i <= 42; i++) {
        const DAY_ELEMENT = document.createElement('div');
        const LAST_DAY_OF_PAST_MONTH = new Date(today.getFullYear(), today.getMonth(), 0);

        if (i <= firstDayOfMonth.getDay()) {


            let day = LAST_DAY_OF_PAST_MONTH.getDate() - (firstDayOfMonth.getDay() - i);


            DAY_ELEMENT.className = 'journee inactive';
            DAY_ELEMENT.textContent = day;
            document.querySelector('.jour').appendChild(DAY_ELEMENT);
        } else if (i > lastDayOfMonth.getDate() + firstDayOfMonth.getDay()) {


            let day = i - lastDayOfMonth.getDate() - firstDayOfMonth.getDay();
            DAY_ELEMENT.className = 'journee inactive';
            DAY_ELEMENT.textContent = day;
            document.querySelector('.jour').appendChild(DAY_ELEMENT);

        } else {

            DAY_ELEMENT.className = 'journee active';
            const dayOfMonth = i - firstDayOfMonth.getDay();
            console.log('This is the current day: ', dayOfMonth);
            const fullDate = new Date(today.getFullYear(), today.getMonth(), dayOfMonth);
            fullDate.setHours(0, 0, 0, 0);
            fullDate.toISOString().split('T')[0];


            const MOOD_DATA = await getMoodForDay(fullDate);

            if (MOOD_DATA) {
                DAY_ELEMENT.style.backgroundImage = `url('/static/images/${MOOD_DATA}.png')`;
                DAY_ELEMENT.style.backgroundSize = 'contain';
                DAY_ELEMENT.style.backgroundPosition = 'center';
                DAY_ELEMENT.style.backgroundRepeat = 'no-repeat';

            } else {
                DAY_ELEMENT.textContent = i - firstDayOfMonth.getDay();
            }
            document.querySelector('.jour').appendChild(DAY_ELEMENT);
        }

    }

}


async function getMoodForDay(day) {

    const formattedDate = day.toISOString().split('T')[0]; // Format the date to YYYY-MM-DD

    try {
        const response = await fetch(`/api/current_mood?date=${formattedDate}`);
        const data = await response.json();
        return data.mood;
    } catch (error) {
        console.error('Error fetching mood:', error);
        return null;
    }
}





