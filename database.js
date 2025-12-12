// Database module using better-sqlite3 (Node.js)
// Install: npm install better-sqlite3

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create or connect to database
const db = new Database(path.join(__dirname, 'bookings.db'));

// Enable WAL mode for better concurrent access
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    date TEXT NOT NULL,
    guests INTEGER NOT NULL,
    eventType TEXT NOT NULL,
    hall TEXT NOT NULL,
    package TEXT NOT NULL,
    total REAL NOT NULL,
    deposit REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_booking_date ON bookings(date);
  CREATE INDEX IF NOT EXISTS idx_booking_hall ON bookings(hall);
  CREATE INDEX IF NOT EXISTS idx_booking_status ON bookings(status);
`);

// Prepared statements for bookings
const insertBooking = db.prepare(`
  INSERT INTO bookings (id, name, email, phone, date, guests, eventType, hall, package, total, deposit, status, createdAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const getAllBookings = db.prepare('SELECT * FROM bookings ORDER BY createdAt DESC');

const getBookingById = db.prepare('SELECT * FROM bookings WHERE id = ?');

const updateBookingStatus = db.prepare('UPDATE bookings SET status = ? WHERE id = ?');

const deleteBooking = db.prepare('DELETE FROM bookings WHERE id = ?');

const getBookedDatesByHall = db.prepare('SELECT date FROM bookings WHERE hall = ? AND status != "cancelled"');

// Prepared statements for contact messages
const insertContactMessage = db.prepare(`
  INSERT INTO contact_messages (name, email, message, createdAt)
  VALUES (?, ?, ?, ?)
`);

const getAllContactMessages = db.prepare('SELECT * FROM contact_messages ORDER BY createdAt DESC');

// Export functions
export const bookingDB = {
  // Create booking
  createBooking: (booking) => {
    return insertBooking.run(
      booking.id,
      booking.name,
      booking.email,
      booking.phone,
      booking.date,
      booking.guests,
      booking.eventType,
      booking.hall,
      booking.package,
      booking.total,
      booking.deposit,
      booking.status || 'pending',
      booking.createdAt
    );
  },

  // Get all bookings
  getAllBookings: () => {
    return getAllBookings.all();
  },

  // Get booking by ID
  getBookingById: (id) => {
    return getBookingById.get(id);
  },

  // Update booking status
  updateStatus: (id, status) => {
    return updateBookingStatus.run(status, id);
  },

  // Delete booking
  deleteBooking: (id) => {
    return deleteBooking.run(id);
  },

  // Get booked dates by hall
  getBookedDates: () => {
    const smallDates = getBookedDatesByHall.all('small').map(row => row.date);
    const bigDates = getBookedDatesByHall.all('big').map(row => row.date);
    return { small: smallDates, big: bigDates };
  },

  // Contact messages
  createContactMessage: (name, email, message) => {
    return insertContactMessage.run(name, email, message, new Date().toISOString());
  },

  getAllContactMessages: () => {
    return getAllContactMessages.all();
  }
};

export default db;
