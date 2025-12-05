// ---------------------------------------------------------------------
//  Fake booked dates (replace later with database results)
// ---------------------------------------------------------------------
const bookedDates = {
    intimate: [
        "2025-01-12",
        "2025-01-20",
        "2025-02-05",
        "2025-02-18"
    ],
    grand: [
        "2025-01-15",
        "2025-01-22",
        "2025-02-10",
        "2025-02-28"
    ]
};

// Current month trackers
const calendarState = {
    intimate: new Date(),
    grand: new Date()
};

// ---------------------------------------------------------------------
//  Render Calendar
// ---------------------------------------------------------------------
function renderCalendar(hall) {
    const stateDate = calendarState[hall];
    const year = stateDate.getFullYear();
    const month = stateDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const container = document.getElementById(`${hall}-calendar`);
    const monthLabel = document.getElementById(`${hall}-month-year`);

    const monthNames = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
    ];

    monthLabel.textContent = `${monthNames[month]} ${year}`;

    let html = `<div class="calendar-grid">
        <div class="day-header">Sun</div>
        <div class="day-header">Mon</div>
        <div class="day-header">Tue</div>
        <div class="day-header">Wed</div>
        <div class="day-header">Thu</div>
        <div class="day-header">Fri</div>
        <div class="day-header">Sat</div>
    `;

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
        html += `<div class="day-cell empty"></div>`;
    }

    const today = new Date();

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
        const dateObj = new Date(year, month, day);
        const isoDate = dateObj.toISOString().split("T")[0];

        let className = "day-cell";

        if (dateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
            className += " past";
        } else if (bookedDates[hall].includes(isoDate)) {
            className += " booked";
        } else {
            className += " available";
        }

        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            className += " today";
        }

        html += `<div class="${className}" onclick="handleDateClick('${hall}', '${isoDate}', '${className}')">${day}</div>`;
    }

    html += `</div>`;
    container.innerHTML = html;
}

// ---------------------------------------------------------------------
//  Month Navigation
// ---------------------------------------------------------------------
function changeMonth(hall, direction) {
    calendarState[hall].setMonth(
        calendarState[hall].getMonth() + direction
    );
    renderCalendar(hall);
}

// ---------------------------------------------------------------------
//  Date Click Handler
// ---------------------------------------------------------------------
function handleDateClick(hall, date, className) {
    if (!className.includes("available")) return;

    document.getElementById("bookingModal").classList.add("active");
    document.getElementById("modalInfo").innerText =
        `Selected Hall: ${hall.toUpperCase()}\nDate: ${date}`;
    
    window.selectedHall = hall;
    window.selectedDate = date;
}

// Close modal
function closeModal() {
    document.getElementById("bookingModal").classList.remove("active");
}

// Confirm booking action (you can connect backend here)
function confirmBooking() {
    alert(`Booking confirmed:\nHall: ${window.selectedHall}\nDate: ${window.selectedDate}`);
    closeModal();
}

// ---------------------------------------------------------------------
//  Initialize Calendars
// ---------------------------------------------------------------------
renderCalendar("intimate");
renderCalendar("grand");
