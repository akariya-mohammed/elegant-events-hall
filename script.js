// Booked dates for each hall
const bookedDates = {
    small: ['2024-12-15', '2024-12-20', '2024-12-25', '2025-01-05', '2025-01-12'],
    big: ['2024-12-18', '2024-12-24', '2024-12-31', '2025-01-01', '2025-01-15']
};

// Validation functions
function validateName(name) {
    const nameRegex = /^[a-zA-Z\u0590-\u05FF\s]+$/;
    return nameRegex.test(name) && name.trim().length >= 2;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateIsraeliPhone(phone) {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    const israeliPhoneRegex = /^(\+?972|0)([23489]|5[0-9]|7[0-9])\d{7}$/;
    return israeliPhoneRegex.test(cleaned);
}

function calculateDeposit(hall, packageType) {
    const packagePrices = { basic: 2500, premium: 5000, luxury: 8500 };
    const hallPrices = { small: 2000, big: 5000 };
    const total = (packagePrices[packageType] || 0) + (hallPrices[hall] || 0);
    return { total, deposit: total * 0.10 };
}

// Generate calendar
function generateCalendar(hall, hallName, capacity) {
    const now = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let html = `
        <div class="calendar">
            <div style="text-align: center; margin-bottom: 20px;">
                <h3>${hallName}</h3>
                <p style="color: #666;">${capacity}</p>
            </div>
            <div class="calendar-header">
                <button class="calendar-nav" onclick="changeMonth(-1)">← Prev</button>
                <h3>${monthNames[month]} ${year}</h3>
                <button class="calendar-nav" onclick="changeMonth(1)">Next →</button>
            </div>
            <div class="calendar-days">
    `;

    dayNames.forEach(day => {
        html += `<div class="day-name">${day}</div>`;
    });

    html += `</div><div class="calendar-dates">`;

    // Empty cells before month starts
    for (let i = 0; i < firstDay; i++) {
        html += `<div></div>`;
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isBooked = bookedDates[hall].includes(dateStr);
        const isPast = new Date(year, month, day) < new Date().setHours(0, 0, 0, 0);

        let className = 'calendar-day ';
        if (isBooked) {
            className += 'booked';
        } else if (isPast) {
            className += 'past';
        } else {
            className += 'available';
        }

        html += `
            <div class="${className}" ${!isBooked && !isPast ? `onclick="selectDate('${dateStr}', '${hall}')"` : ''}>
                <div style="font-weight: 600;">${day}</div>
                <div style="font-size: 11px;">${isBooked ? 'Booked' : !isPast ? 'Free' : ''}</div>
            </div>
        `;
    }

    html += `
            </div>
            <div class="calendar-legend">
                <div class="legend-item">
                    <div class="legend-box" style="background: #d1fae5;"></div>
                    <span>Available</span>
                </div>
                <div class="legend-item">
                    <div class="legend-box" style="background: #fecaca;"></div>
                    <span>Booked</span>
                </div>
                <div class="legend-item">
                    <div class="legend-box" style="background: #f3f4f6;"></div>
                    <span>Past</span>
                </div>
            </div>
        </div>
    `;

    return html;
}

// Initialize calendars
function initCalendars() {
    const calendarsDiv = document.getElementById('calendars');
    if (calendarsDiv) {
        calendarsDiv.innerHTML = 
            generateCalendar('small', 'Intimate Hall', '50-150 guests') +
            generateCalendar('big', 'Grand Ballroom', '200-500 guests');
    }
}

// Select date from calendar
function selectDate(date, hall) {
    document.getElementById('date').value = date;
    document.getElementById('hall').value = hall;
    
    // Scroll to booking section
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    
    alert(`Selected: ${hall === 'small' ? 'Intimate Hall' : 'Grand Ballroom'} on ${date}`);
}

// Change month (for future enhancement)
function changeMonth(direction) {
    alert('Calendar navigation coming soon!');
}

// Update payment summary
function updateSummary() {
    const hall = document.getElementById('hall').value;
    const pkg = document.getElementById('package').value;
    const summaryDiv = document.getElementById('paymentSummary');
    const contentDiv = document.getElementById('summaryContent');
    
    if (hall && pkg) {
        const { total, deposit } = calculateDeposit(hall, pkg);
        const hallName = hall === 'small' ? 'Intimate Hall ($2,000)' : 'Grand Ballroom ($5,000)';
        const hallPrice = hall === 'small' ? 2000 : 5000;
        const pkgPrice = total - hallPrice;
        
        contentDiv.innerHTML = `
            <div class="summary-row">
                <span><strong>Hall:</strong></span>
                <span>${hallName}</span>
            </div>
            <div class="summary-row">
                <span><strong>Package:</strong></span>
                <span class="capitalize">${pkg} ($${pkgPrice.toLocaleString()})</span>
            </div>
            <div class="summary-row summary-total">
                <span><strong>Total Price:</strong></span>
                <span style="color: #e11d48;">$${total.toLocaleString()}</span>
            </div>
            <div class="summary-row" style="font-size: 1.3rem; font-weight: bold; color: #059669;">
                <span><strong>Deposit Required (10%):</strong></span>
                <span>$${deposit.toLocaleString()}</span>
            </div>
            <p style="text-align: center; margin-top: 15px; color: #666; font-size: 14px;">
                Pay $${deposit.toLocaleString()} now to secure your booking
            </p>
        `;
        summaryDiv.style.display = 'block';
    } else {
        summaryDiv.style.display = 'none';
    }
}

// Submit booking
function submitBooking() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const date = document.getElementById('date').value;
    const guests = document.getElementById('guests').value;
    const eventType = document.getElementById('eventType').value;
    const hall = document.getElementById('hall').value;
    const pkg = document.getElementById('package').value;

    // Validation
    if (!name || !email || !phone || !date || !guests || !eventType || !hall || !pkg) {
        alert('❌ Please fill in all required fields');
        return;
    }

    if (!validateName(name)) {
        alert('❌ Invalid name. Please use only letters and spaces (Hebrew or English).\nExample: John Doe or יוחנן דו');
        return;
    }

    if (!validateEmail(email)) {
        alert('❌ Invalid email address.\nExample: john@example.com');
        return;
    }

    if (!validateIsraeliPhone(phone)) {
        alert('❌ Invalid Israeli phone number.\nValid formats:\n• 050-1234567\n• 0501234567\n• +972-50-1234567\n• 972501234567');
        return;
    }

    // Calculate payment
    const { total, deposit } = calculateDeposit(hall, pkg);
    const hallName = hall === 'small' ? 'Intimate Hall' : 'Grand Ballroom';

    // Add to booked dates
    bookedDates[hall].push(date);

    // Success message
    alert(`✅ Booking Confirmed!\n\n` +
          `Hall: ${hallName}\n` +
          `Date: ${date}\n` +
          `Guests: ${guests}\n` +
          `Package: ${pkg}\n\n` +
          `💰 PAYMENT DETAILS:\n` +
          `Total Price: $${total.toLocaleString()}\n` +
          `Deposit Required (10%): $${deposit.toLocaleString()}\n\n` +
          `📧 Confirmation sent to: ${email}\n` +
          `📱 We'll contact you at: ${phone}\n\n` +
          `In the live version, you'll be redirected to payment page.`);

    // Reset form
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('date').value = '';
    document.getElementById('guests').value = '';
    document.getElementById('eventType').value = '';
    document.getElementById('hall').value = '';
    document.getElementById('package').value = '';
    document.getElementById('paymentSummary').style.display = 'none';

    // Refresh calendars
    initCalendars();
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize calendars
    initCalendars();
    
    // Add event listeners for payment summary
    const hallSelect = document.getElementById('hall');
    const packageSelect = document.getElementById('package');
    
    if (hallSelect) hallSelect.addEventListener('change', updateSummary);
    if (packageSelect) packageSelect.addEventListener('change', updateSummary);
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});