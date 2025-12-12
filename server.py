"""
Flask backend server for Wedding Hall Reservation System
Install dependencies: pip install flask flask-cors
Run: python server.py
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Database setup
DB_PATH = 'bookings.db'

def init_db():
    """Initialize database tables"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute('''
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
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS contact_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            createdAt TEXT NOT NULL
        )
    ''')

    cursor.execute('CREATE INDEX IF NOT EXISTS idx_booking_date ON bookings(date)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_booking_hall ON bookings(hall)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_booking_status ON bookings(status)')

    conn.commit()
    conn.close()

def get_db():
    """Get database connection"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    """Serve index.html"""
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    """Serve static files"""
    return send_from_directory('.', path)

@app.route('/api/booked-dates', methods=['GET'])
def get_booked_dates():
    """Get all booked dates for both halls"""
    conn = get_db()
    cursor = conn.cursor()

    small_dates = cursor.execute(
        "SELECT date FROM bookings WHERE hall = 'small' AND status != 'cancelled'"
    ).fetchall()

    big_dates = cursor.execute(
        "SELECT date FROM bookings WHERE hall = 'big' AND status != 'cancelled'"
    ).fetchall()

    conn.close()

    return jsonify({
        'small': [row['date'] for row in small_dates],
        'big': [row['date'] for row in big_dates]
    })

@app.route('/api/bookings', methods=['GET'])
def get_all_bookings():
    """Get all bookings (admin)"""
    conn = get_db()
    cursor = conn.cursor()

    bookings = cursor.execute(
        'SELECT * FROM bookings ORDER BY createdAt DESC'
    ).fetchall()

    conn.close()

    return jsonify([dict(row) for row in bookings])

@app.route('/api/book', methods=['POST'])
def create_booking():
    """Create new booking"""
    data = request.json

    # Validation
    required_fields = ['name', 'email', 'phone', 'date', 'guests', 'eventType', 'hall', 'package']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'All fields are required'}), 400

    # Check if date is already booked
    conn = get_db()
    cursor = conn.cursor()

    existing = cursor.execute(
        "SELECT * FROM bookings WHERE hall = ? AND date = ? AND status != 'cancelled'",
        (data['hall'], data['date'])
    ).fetchone()

    if existing:
        conn.close()
        return jsonify({'error': 'This date is already booked'}), 400

    # Calculate pricing
    package_prices = {'basic': 2500, 'premium': 5000, 'luxury': 8500}
    hall_prices = {'small': 2000, 'big': 5000}
    total = package_prices.get(data['package'], 0) + hall_prices.get(data['hall'], 0)
    deposit = total * 0.10

    # Create booking
    booking_id = str(int(datetime.now().timestamp() * 1000))
    created_at = datetime.now().isoformat()

    cursor.execute('''
        INSERT INTO bookings (id, name, email, phone, date, guests, eventType, hall, package, total, deposit, status, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        booking_id,
        data['name'],
        data['email'],
        data['phone'],
        data['date'],
        int(data['guests']),
        data['eventType'],
        data['hall'],
        data['package'],
        total,
        deposit,
        'pending',
        created_at
    ))

    conn.commit()

    booking = cursor.execute('SELECT * FROM bookings WHERE id = ?', (booking_id,)).fetchone()
    conn.close()

    return jsonify({
        'success': True,
        'message': 'Booking created successfully',
        'booking': dict(booking)
    })

@app.route('/api/bookings/<booking_id>', methods=['PATCH'])
def update_booking(booking_id):
    """Update booking status (admin)"""
    data = request.json
    status = data.get('status')

    if not status:
        return jsonify({'error': 'Status is required'}), 400

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute('UPDATE bookings SET status = ? WHERE id = ?', (status, booking_id))
    conn.commit()

    if cursor.rowcount == 0:
        conn.close()
        return jsonify({'error': 'Booking not found'}), 404

    booking = cursor.execute('SELECT * FROM bookings WHERE id = ?', (booking_id,)).fetchone()
    conn.close()

    return jsonify({
        'success': True,
        'booking': dict(booking)
    })

@app.route('/api/bookings/<booking_id>', methods=['DELETE'])
def delete_booking(booking_id):
    """Delete booking (admin)"""
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute('DELETE FROM bookings WHERE id = ?', (booking_id,))
    conn.commit()

    if cursor.rowcount == 0:
        conn.close()
        return jsonify({'error': 'Booking not found'}), 404

    conn.close()

    return jsonify({
        'success': True,
        'message': 'Booking deleted'
    })

@app.route('/api/contact', methods=['POST'])
def send_contact_message():
    """Send contact message"""
    data = request.json

    if not all(field in data for field in ['name', 'email', 'message']):
        return jsonify({'error': 'All fields are required'}), 400

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute('''
        INSERT INTO contact_messages (name, email, message, createdAt)
        VALUES (?, ?, ?, ?)
    ''', (data['name'], data['email'], data['message'], datetime.now().isoformat()))

    conn.commit()
    conn.close()

    return jsonify({
        'success': True,
        'message': 'Message sent successfully. We\'ll contact you soon!'
    })

if __name__ == '__main__':
    init_db()
    print('Server running on http://localhost:3000')
    app.run(host='0.0.0.0', port=3000, debug=True)
