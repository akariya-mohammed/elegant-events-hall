import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// In-memory database (will be replaced with real database)
let bookings = [];
let bookedDates = {
  small: ['2024-12-15', '2024-12-20', '2024-12-25', '2025-01-05', '2025-01-12'],
  big: ['2024-12-18', '2024-12-24', '2024-12-31', '2025-01-01', '2025-01-15']
};

// Get booked dates for both halls
app.get("/api/booked-dates", (req, res) => {
  res.json(bookedDates);
});

// Get all bookings (admin)
app.get("/api/bookings", (req, res) => {
  res.json(bookings);
});

// Create new booking
app.post("/api/book", (req, res) => {
  const { name, email, phone, date, guests, eventType, hall, package: pkg } = req.body;

  // Validation
  if (!name || !email || !phone || !date || !guests || !eventType || !hall || !pkg) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Check if date is already booked
  if (bookedDates[hall] && bookedDates[hall].includes(date)) {
    return res.status(400).json({ error: "This date is already booked" });
  }

  // Calculate pricing
  const packagePrices = { basic: 2500, premium: 5000, luxury: 8500 };
  const hallPrices = { small: 2000, big: 5000 };
  const total = (packagePrices[pkg] || 0) + (hallPrices[hall] || 0);
  const deposit = total * 0.10;

  // Create booking
  const booking = {
    id: Date.now().toString(),
    name,
    email,
    phone,
    date,
    guests: parseInt(guests),
    eventType,
    hall,
    package: pkg,
    total,
    deposit,
    createdAt: new Date().toISOString(),
    status: 'pending' // pending, confirmed, cancelled
  };

  // Add to bookings and booked dates
  bookings.push(booking);
  if (!bookedDates[hall]) bookedDates[hall] = [];
  bookedDates[hall].push(date);

  res.json({
    success: true,
    message: "Booking created successfully",
    booking
  });
});

// Update booking status (admin)
app.patch("/api/bookings/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const booking = bookings.find(b => b.id === id);
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }

  booking.status = status;
  res.json({ success: true, booking });
});

// Delete booking (admin)
app.delete("/api/bookings/:id", (req, res) => {
  const { id } = req.params;
  const bookingIndex = bookings.findIndex(b => b.id === id);

  if (bookingIndex === -1) {
    return res.status(404).json({ error: "Booking not found" });
  }

  const booking = bookings[bookingIndex];

  // Remove from booked dates
  if (bookedDates[booking.hall]) {
    const dateIndex = bookedDates[booking.hall].indexOf(booking.date);
    if (dateIndex > -1) {
      bookedDates[booking.hall].splice(dateIndex, 1);
    }
  }

  bookings.splice(bookingIndex, 1);
  res.json({ success: true, message: "Booking deleted" });
});

// Send contact message
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // In production, this would send an email
  console.log("Contact message received:", { name, email, message });

  res.json({
    success: true,
    message: "Message sent successfully. We'll contact you soon!"
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
