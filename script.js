// ---------------------------------------------------------------------
//  Backend API Configuration
// ---------------------------------------------------------------------
const API_URL = 'https://elegant-events-hall-backend.onrender.com';

// Store booked dates fetched from backend
let bookedDates = {
    intimate: [],
    grand: []
};

// Current month trackers
const calendarState = {
    intimate: new Date(),
    grand: new Date()
};

// ---------------------------------------------------------------------
//  Fetch Bookings from Backend
// ---------------------------------------------------------------------
async function fetchBookings() {
    try {
        const response = await fetch(`${API_URL}/api/bookings`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const bookings = await response.json();
        
        // Clear existing dates
        bookedDates.intimate = [];
        bookedDates.grand = [];
        
        // Populate booked dates from backend
        bookings.forEach(booking => {
            const hall = booking.hallType.toLowerCase();
            if (bookedDates[hall]) {
                bookedDates[hall].push(booking.date);
            }
        });
        
        // Re-render calendars with new data
        renderCalendar("intimate");
        renderCalendar("grand");
        
        console.log('Bookings loaded successfully:', bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        // Show user-friendly message
        showNotification('Unable to load bookings. Please refresh the page.', 'error');
    }
}

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

// ---------------------------------------------------------------------
//  Close Modal
// ---------------------------------------------------------------------
function closeModal() {
    document.getElementById("bookingModal").classList.remove("active");
}

// ---------------------------------------------------------------------
//  Confirm Booking - Send to Backend
// ---------------------------------------------------------------------
async function confirmBooking() {
    const customerName = document.getElementById("customerName")?.value || "Guest";
    const customerEmail = document.getElementById("customerEmail")?.value || "";
    const customerPhone = document.getElementById("customerPhone")?.value || "";
    
    const bookingData = {
        hallType: window.selectedHall,
        date: window.selectedDate,
        customerName: customerName,
        customerEmail: customerEmail,
        customerPhone: customerPhone
    };
    
    try {
        // Show loading state
        const originalButton = event.target;
        originalButton.disabled = true;
        originalButton.textContent = 'Booking...';
        
        const response = await fetch(`${API_URL}/api/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Booking failed');
        }
        
        const result = await response.json();
        
        // Show success message
        showNotification(`Booking confirmed! Hall: ${window.selectedHall}, Date: ${window.selectedDate}`, 'success');
        
        // Refresh bookings to update calendar
        await fetchBookings();
        
        // Close modal
        closeModal();
        
        // Reset button
        originalButton.disabled = false;
        originalButton.textContent = 'Confirm Booking';
        
    } catch (error) {
        console.error('Error creating booking:', error);
        showNotification(`Booking failed: ${error.message}`, 'error');
        
        // Reset button
        event.target.disabled = false;
        event.target.textContent = 'Confirm Booking';
    }
}

// ---------------------------------------------------------------------
//  Notification System
// ---------------------------------------------------------------------
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        document.body.appendChild(notification);
    }
    
    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    notification.textContent = message;
    notification.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}

// Add CSS animation for notification
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// ---------------------------------------------------------------------
//  Initialize Application
// ---------------------------------------------------------------------
async function initializeApp() {
    // Show loading indicator
    console.log('Loading bookings from backend...');
    
    // Fetch bookings from backend
    await fetchBookings();
    
    // Render calendars (will use fetched data)
    renderCalendar("intimate");
    renderCalendar("grand");
    
    console.log('Application initialized successfully');
}

// Start the application when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
