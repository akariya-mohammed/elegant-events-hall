# Quick Start Guide

## Get Your Wedding Hall Website Running in 5 Minutes

### Step 1: Choose Your Backend

**Option A: Node.js (Recommended)**
```bash
npm install
npm start
```

**Option B: Python**
```bash
pip install -r requirements.txt
python server.py
```

### Step 2: Open Your Browser

Visit: http://localhost:3000

That's it! Your website is now running.

---

## What You Can Do Now

### For Testing

1. **Browse the Website**
   - Go to http://localhost:3000
   - Check the calendar, venues, packages

2. **Make a Test Booking**
   - Click "Check Availability"
   - Select an available date (green)
   - Fill out the booking form
   - Submit the booking

3. **View Admin Panel**
   - Go to http://localhost:3000/admin.html
   - See all bookings
   - Confirm/cancel bookings
   - View statistics

### Sample Test Data

Use this for testing the booking form:

- **Name:** John Doe
- **Email:** test@example.com
- **Phone:** 050-1234567
- **Date:** Any green date on calendar
- **Guests:** 100
- **Event Type:** Wedding
- **Hall:** Intimate Hall or Grand Ballroom
- **Package:** Premium

---

## File Structure

```
halls/
├── index.html              ← Main website
├── admin.html              ← Admin panel (manage bookings)
├── style.css               ← All styles
├── script.js               ← Frontend logic
│
├── server.js               ← Node.js backend ⭐
├── server.py               ← Python backend
├── database.js             ← Database module (Node.js)
│
├── payment-integration.js  ← Payment examples (Stripe, PayPal)
├── email-notifications.js  ← Email templates
│
├── package.json            ← Node.js config
├── requirements.txt        ← Python config
├── .env.example            ← Environment variables template
│
├── README.md               ← Full documentation
└── QUICK-START.md          ← This file
```

---

## Next Steps

### 1. Customize Your Website

Edit these files to match your business:

**Change Colors** - [style.css](style.css)
```css
/* Find and replace #e11d48 with your color */
```

**Change Prices** - [script.js](script.js)
```javascript
// Line 24-27 and 46-48
const packagePrices = { basic: 2500, premium: 5000, luxury: 8500 };
const hallPrices = { small: 2000, big: 5000 };
```

**Change Contact Info** - [index.html](index.html)
```html
<!-- Search for "123 Wedding Street" and update -->
<!-- Search for "050-123-4567" and update -->
```

### 2. Add Real Payment Processing

See [payment-integration.js](payment-integration.js) for:
- Stripe integration
- PayPal integration
- Israeli payment gateways (Tranzila)

### 3. Enable Email Notifications

See [email-notifications.js](email-notifications.js) for:
- Booking confirmations
- Admin notifications
- Contact form emails

Copy `.env.example` to `.env` and add your credentials:
```bash
cp .env.example .env
# Then edit .env with your email settings
```

### 4. Deploy to Production

**Free hosting options:**
- Vercel (recommended for Node.js)
- Netlify
- Railway
- Render

**With database:**
- Railway (includes database)
- Render (includes database)
- DigitalOcean App Platform

---

## Common Issues

### Port Already in Use
```bash
# Change port in server.js or server.py
# Or kill the process using port 3000
```

### Database Locked
```bash
# Close all connections to bookings.db
# Restart the server
```

### CORS Errors
```bash
# Make sure the backend server is running
# Check API_URL in script.js matches your server
```

---

## Need Help?

1. Check [README.md](README.md) for full documentation
2. Look at the code comments
3. Check browser console for errors (F12)
4. Check server console for errors

---

## Features Checklist

✅ Interactive calendar with real-time availability
✅ Two venue options (Intimate Hall & Grand Ballroom)
✅ Online booking form with validation
✅ Automatic price calculation
✅ Admin panel for managing bookings
✅ Mobile responsive design
✅ Contact form
✅ Month navigation on calendar
✅ Database storage (SQLite)
✅ RESTful API backend

📋 Ready to add:
⬜ Payment processing (examples included)
⬜ Email notifications (code included)
⬜ SMS notifications (examples included)
⬜ Image gallery
⬜ Customer reviews

---

**Made with ❤️ for Elegant Events Hall**
