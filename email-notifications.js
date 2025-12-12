/**
 * Email Notification System
 * Install: npm install nodemailer
 *
 * For production, use a service like:
 * - SendGrid (https://sendgrid.com/)
 * - Mailgun (https://www.mailgun.com/)
 * - AWS SES (https://aws.amazon.com/ses/)
 * - Postmark (https://postmarkapp.com/)
 */

import nodemailer from 'nodemailer';

// Configure email transporter
// For Gmail (development only):
const createTransporter = () => {
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER || 'your-email@gmail.com',
            pass: process.env.EMAIL_PASSWORD || 'your-app-password' // Use App Password, not regular password
        }
    });
};

// For SendGrid (production recommended):
/*
const createTransporter = () => {
    return nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        auth: {
            user: 'apikey',
            pass: process.env.SENDGRID_API_KEY
        }
    });
};
*/

// Email templates
const emailTemplates = {
    bookingConfirmation: (booking) => {
        const hallName = booking.hall === 'small' ? 'Intimate Hall' : 'Grand Ballroom';
        const packageName = booking.package.charAt(0).toUpperCase() + booking.package.slice(1);

        return {
            subject: `Booking Confirmation - ${hallName}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #e11d48 0%, #be123c 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                        .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
                        .details { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
                        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
                        .detail-label { font-weight: 600; }
                        .footer { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
                        .button { display: inline-block; background: #e11d48; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🎉 Booking Confirmed!</h1>
                            <p>Elegant Events Hall</p>
                        </div>
                        <div class="content">
                            <p>Dear ${booking.name},</p>
                            <p>Thank you for choosing Elegant Events Hall for your special event! Your booking has been successfully confirmed.</p>

                            <div class="details">
                                <h3 style="margin-top: 0; color: #e11d48;">Booking Details</h3>
                                <div class="detail-row">
                                    <span class="detail-label">Booking ID:</span>
                                    <span>#${booking.id.substring(0, 8)}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Hall:</span>
                                    <span>${hallName}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Event Date:</span>
                                    <span>${booking.date}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Event Type:</span>
                                    <span>${booking.eventType}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Number of Guests:</span>
                                    <span>${booking.guests}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Package:</span>
                                    <span>${packageName}</span>
                                </div>
                                <div class="detail-row" style="border-bottom: none; font-size: 1.2rem; color: #e11d48;">
                                    <span class="detail-label">Total Price:</span>
                                    <span><strong>$${booking.total.toLocaleString()}</strong></span>
                                </div>
                                <div class="detail-row" style="border-bottom: none; color: #059669;">
                                    <span class="detail-label">Deposit Paid:</span>
                                    <span><strong>$${booking.deposit.toLocaleString()}</strong></span>
                                </div>
                            </div>

                            <h3>What's Next?</h3>
                            <ul>
                                <li>Our team will contact you within 24 hours at ${booking.phone}</li>
                                <li>We'll discuss final details and customizations</li>
                                <li>Remaining balance is due 7 days before the event</li>
                                <li>You can make changes up to 14 days before the event</li>
                            </ul>

                            <p>If you have any questions, please don't hesitate to contact us.</p>

                            <p>We look forward to making your event unforgettable!</p>

                            <p>Best regards,<br>
                            <strong>Elegant Events Hall Team</strong></p>
                        </div>
                        <div class="footer">
                            <p><strong>Elegant Events Hall</strong></p>
                            <p>123 Wedding Street, City, Israel</p>
                            <p>📞 050-123-4567 | 📧 info@eleganteventshall.com</p>
                            <p style="font-size: 12px; margin-top: 15px; opacity: 0.8;">
                                This is an automated message. Please do not reply to this email.
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };
    },

    adminNotification: (booking) => {
        const hallName = booking.hall === 'small' ? 'Intimate Hall' : 'Grand Ballroom';

        return {
            subject: `🔔 New Booking - ${booking.date} - ${hallName}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .alert { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 20px; }
                        .info { background: #f3f4f6; padding: 15px; border-radius: 8px; }
                        .info-row { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="alert">
                            <h2 style="margin: 0;">🆕 New Booking Received</h2>
                        </div>

                        <div class="info">
                            <h3>Customer Information</h3>
                            <div class="info-row"><strong>Name:</strong> ${booking.name}</div>
                            <div class="info-row"><strong>Email:</strong> ${booking.email}</div>
                            <div class="info-row"><strong>Phone:</strong> ${booking.phone}</div>

                            <h3>Booking Information</h3>
                            <div class="info-row"><strong>Booking ID:</strong> #${booking.id}</div>
                            <div class="info-row"><strong>Hall:</strong> ${hallName}</div>
                            <div class="info-row"><strong>Date:</strong> ${booking.date}</div>
                            <div class="info-row"><strong>Event Type:</strong> ${booking.eventType}</div>
                            <div class="info-row"><strong>Guests:</strong> ${booking.guests}</div>
                            <div class="info-row"><strong>Package:</strong> ${booking.package}</div>
                            <div class="info-row"><strong>Total:</strong> $${booking.total.toLocaleString()}</div>
                            <div class="info-row" style="border: none;"><strong>Deposit:</strong> $${booking.deposit.toLocaleString()}</div>
                        </div>

                        <p style="margin-top: 20px;">
                            <a href="http://localhost:3000/admin.html" style="background: #e11d48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                                View in Admin Panel
                            </a>
                        </p>

                        <p style="color: #666; font-size: 14px; margin-top: 20px;">
                            Please contact the customer within 24 hours to confirm details.
                        </p>
                    </div>
                </body>
                </html>
            `
        };
    },

    contactMessage: (contact) => {
        return {
            subject: `📧 New Contact Message from ${contact.name}`,
            html: `
                <!DOCTYPE html>
                <html>
                <body style="font-family: Arial, sans-serif; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #e11d48;">New Contact Message</h2>

                        <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
                            <p><strong>From:</strong> ${contact.name}</p>
                            <p><strong>Email:</strong> ${contact.email}</p>
                            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>

                            <h3>Message:</h3>
                            <p style="background: white; padding: 15px; border-left: 3px solid #e11d48;">
                                ${contact.message}
                            </p>
                        </div>

                        <p style="margin-top: 20px;">
                            Reply to: <a href="mailto:${contact.email}">${contact.email}</a>
                        </p>
                    </div>
                </body>
                </html>
            `
        };
    }
};

// Send booking confirmation email
export async function sendBookingConfirmation(booking) {
    try {
        const transporter = createTransporter();
        const template = emailTemplates.bookingConfirmation(booking);

        // Send to customer
        await transporter.sendMail({
            from: '"Elegant Events Hall" <noreply@eleganteventshall.com>',
            to: booking.email,
            subject: template.subject,
            html: template.html
        });

        console.log(`Confirmation email sent to ${booking.email}`);
        return { success: true };
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        return { success: false, error: error.message };
    }
}

// Send admin notification
export async function sendAdminNotification(booking) {
    try {
        const transporter = createTransporter();
        const template = emailTemplates.adminNotification(booking);

        await transporter.sendMail({
            from: '"Booking System" <system@eleganteventshall.com>',
            to: process.env.ADMIN_EMAIL || 'admin@eleganteventshall.com',
            subject: template.subject,
            html: template.html
        });

        console.log('Admin notification sent');
        return { success: true };
    } catch (error) {
        console.error('Error sending admin notification:', error);
        return { success: false, error: error.message };
    }
}

// Send contact message notification
export async function sendContactNotification(contact) {
    try {
        const transporter = createTransporter();
        const template = emailTemplates.contactMessage(contact);

        await transporter.sendMail({
            from: '"Website Contact Form" <noreply@eleganteventshall.com>',
            to: process.env.ADMIN_EMAIL || 'admin@eleganteventshall.com',
            subject: template.subject,
            html: template.html
        });

        console.log('Contact notification sent');
        return { success: true };
    } catch (error) {
        console.error('Error sending contact notification:', error);
        return { success: false, error: error.message };
    }
}

// Test email configuration
export async function testEmailConfiguration() {
    try {
        const transporter = createTransporter();
        await transporter.verify();
        console.log('✅ Email configuration is working!');
        return true;
    } catch (error) {
        console.error('❌ Email configuration error:', error);
        return false;
    }
}

export default {
    sendBookingConfirmation,
    sendAdminNotification,
    sendContactNotification,
    testEmailConfiguration
};
