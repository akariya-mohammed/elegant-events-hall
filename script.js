document.addEventListener('DOMContentLoaded', function() {
    generateCalendar();
});

function generateCalendar() {
    const calendarContainer = document.getElementById('calendar');
    
    // Safety Check: If the HTML element isn't found, stop here.
    if (!calendarContainer) {
        console.error("Calendar Error: Could not find <div id='calendar'> in the HTML.");
        return;
    }

    // Get current date details
    const date = new Date();
    const currentMonth = date.toLocaleString('default', { month: 'long' });
    const currentYear = date.getFullYear();
    
    // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
    const firstDayIndex = new Date(currentYear, date.getMonth(), 1).getDay();
    // Get total number of days in the month
    const daysInMonth = new Date(currentYear, date.getMonth() + 1, 0).getDate();

    // --- Build the HTML ---
    
    // 1. Month and Year Header
    let html = `
        <div class="calendar-header">
            <h3>${currentMonth} ${currentYear}</h3>
        </div>
        <div class="calendar-grid-view">
    `;

    // 2. Days of the Week Headers
    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    weekDays.forEach(day => {
        html += `<div class="day-name">${day}</div>`;
    });

    // 3. Empty slots for days before the 1st of the month
    for (let i = 0; i < firstDayIndex; i++) {
        html += `<div></div>`;
    }

    // 4. Actual Days
    for (let i = 1; i <= daysInMonth; i++) {
        html += `
            <div class="calendar-day" onclick="selectDate(${i})">
                ${i}
            </div>
        `;
    }

    html += `</div>`; // Close grid view

    // Inject into the HTML
    calendarContainer.innerHTML = html;
}

// Function that runs when a user clicks a date
function selectDate(day) {
    const dateInput = document.getElementById('date');
    
    if (dateInput) {
        // Construct date string YYYY-MM-DD for the input field
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const dayString = String(day).padStart(2, '0');
        
        const formattedDate = `${year}-${month}-${dayString}`;
        
        // Set the value in the booking form
        dateInput.value = formattedDate;
        
        // Scroll to the booking section
        document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
        
        alert(`You selected ${dayString}/${month}/${year}. We have scrolled you to the booking form!`);
    } else {
        alert(`You clicked on day: ${day}`);
    }
}

// Placeholder function for the booking button
function submitBooking() {
    alert("Booking feature is currently in demo mode.");
}
