# Elegant Events Hall - Wedding Reservation System

A complete wedding hall reservation website with HTML, CSS, JavaScript frontend and backend options in both Node.js and Python.

## Features

- Interactive calendar showing real-time availability for 2 halls
- Online booking form with validation (Hebrew & English names, Israeli phone numbers)
- Automatic price calculation with 10% deposit
- Admin panel for managing bookings
- Mobile-responsive design with hamburger menu
- Contact form
- Month-by-month calendar navigation
- Backend API with database integration

## Project Structure

```
halls/
├── index.html          # Main website
├── admin.html          # Admin panel
├── style.css           # All styles
├── script.js           # Frontend JavaScript
├── server.js           # Node.js backend (Express)
├── server.py           # Python backend (Flask)
├── database.js         # Node.js database module
├── package.json        # Node.js dependencies
├── requirements.txt    # Python dependencies
└── bookings.db         # SQLite database (auto-created)
```

## Installation & Setup

### Option 1: Node.js Backend (Recommended)

1. **Install Node.js** (if not installed): https://nodejs.org/

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```
   Or:
   ```bash
   node server.js
   ```

4. **Open your browser:**
   ```
   http://localhost:3000
   ```

### Option 2: Python Backend

1. **Install Python 3** (if not installed): https://www.python.org/

2. **Install dependencies:**
   ```bash
   pip install flask flask-cors
   ```

3. **Start the server:**
   ```bash
   python server.py
   ```

4. **Open your browser:**
   ```
   http://localhost:3000
   ```

## Usage

### For Customers

1. **View Availability:**
   - Navigate to the "Availability" section
   - Browse the interactive calendar for both halls
   - Green dates are available, red dates are booked

2. **Make a Booking:**
   - Click on an available date or go to "Booking" section
   - Fill out the form with your details
   - Select hall, package, and event details
   - Submit to reserve your date

3. **Contact Us:**
   - Use the contact form at the bottom
   - Messages are sent directly to the admin

### For Administrators

1. **Access Admin Panel:**
   ```
   http://localhost:3000/admin.html
   ```

2. **View Statistics:**
   - Total bookings
   - Confirmed/pending counts
   - Total revenue

3. **Manage Bookings:**
   - View all bookings in a table
   - Filter by hall, status, or search by name/email
   - Confirm or cancel pending bookings
   - Delete bookings

## API Endpoints

### Public Endpoints

- `GET /api/booked-dates` - Get all booked dates for both halls
- `POST /api/book` - Create a new booking
- `POST /api/contact` - Send contact message

### Admin Endpoints

- `GET /api/bookings` - Get all bookings
- `PATCH /api/bookings/:id` - Update booking status
- `DELETE /api/bookings/:id` - Delete a booking

## Form Validation

The booking form includes comprehensive validation:

- **Name:** Letters and spaces only (supports Hebrew and English)
  - Example: `John Doe` or `יוחנן דו`

- **Email:** Valid email format
  - Example: `john@example.com`

- **Phone:** Israeli phone number formats
  - Accepted formats:
    - `050-1234567`
    - `0501234567`
    - `+972-50-1234567`
    - `972501234567`

## Pricing

### Halls
- **Intimate Hall:** $2,000 (50-150 guests)
- **Grand Ballroom:** $5,000 (200-500 guests)

### Packages
- **Basic:** $2,500
  - Venue rental (6 hours)
  - Tables & chairs
  - Basic lighting
  - Parking

- **Premium:** $5,000
  - Venue rental (8 hours)
  - Tables & chairs
  - Premium lighting
  - Decoration
  - Sound system
  - Parking

- **Luxury:** $8,500
  - Venue rental (10 hours)
  - Premium lighting & decoration
  - Sound & DJ
  - Catering service
  - Photography
  - Wedding planner

**Note:** 10% deposit required at booking

## Database

The system uses SQLite for data storage:

- **bookings table:** Stores all booking information
- **contact_messages table:** Stores contact form submissions

Database file (`bookings.db`) is created automatically on first run.

## Customization

### Change Colors

Edit `style.css` and replace `#e11d48` (rose red) with your brand color.

### Change Pricing

Edit the pricing in:
- `script.js` (lines 24-27 and 46-48)
- `server.js` or `server.py` (pricing calculation sections)

### Add More Halls

1. Add calendar in `index.html` availability section
2. Update `bookedDates` object in `script.js`
3. Add hall option in booking form
4. Update backend pricing logic

## Future Enhancements

- Email notifications (Nodemailer/SendGrid)
- Payment gateway integration (Stripe/PayPal)
- SMS confirmations (Twilio)
- Image gallery for venues
- Customer reviews and ratings
- Multi-language support
- Calendar export (iCal)
- Advanced analytics dashboard

## Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Node.js (Express) or Python (Flask)
- **Database:** SQLite
- **Styling:** Custom CSS with responsive design

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is open source and available for personal and commercial use.

## Support

For issues or questions, please contact the development team.

---

Made with ❤️ for Elegant Events Hall
