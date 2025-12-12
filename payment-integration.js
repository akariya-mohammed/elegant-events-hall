/**
 * Payment Integration Examples
 *
 * This file contains examples for integrating payment gateways
 * Uncomment and configure the one you want to use
 */

// ============================================
// STRIPE PAYMENT INTEGRATION
// ============================================
// Install: npm install stripe
// Docs: https://stripe.com/docs

/*
import Stripe from 'stripe';
const stripe = new Stripe('your_stripe_secret_key');

export async function createStripePayment(booking) {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(booking.deposit * 100), // Convert to cents
            currency: 'usd',
            description: `Deposit for ${booking.hall} on ${booking.date}`,
            metadata: {
                booking_id: booking.id,
                customer_name: booking.name,
                customer_email: booking.email
            }
        });

        return {
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        };
    } catch (error) {
        console.error('Stripe payment error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Frontend integration (add to script.js)
async function processStripePayment(booking) {
    const stripe = Stripe('your_stripe_publishable_key');

    // Get client secret from backend
    const response = await fetch(`${API_URL}/create-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: booking.id })
    });

    const { clientSecret } = await response.json();

    // Redirect to Stripe checkout or use Elements
    const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: cardElement,
            billing_details: {
                name: booking.name,
                email: booking.email
            }
        }
    });

    if (error) {
        alert('Payment failed: ' + error.message);
    } else {
        alert('Payment successful!');
    }
}
*/

// ============================================
// PAYPAL PAYMENT INTEGRATION
// ============================================
// Install: npm install @paypal/checkout-server-sdk
// Docs: https://developer.paypal.com/

/*
import paypal from '@paypal/checkout-server-sdk';

function environment() {
    let clientId = 'your_paypal_client_id';
    let clientSecret = 'your_paypal_client_secret';

    // Use sandbox for testing
    return new paypal.core.SandboxEnvironment(clientId, clientSecret);
    // Use live for production
    // return new paypal.core.LiveEnvironment(clientId, clientSecret);
}

function client() {
    return new paypal.core.PayPalHttpClient(environment());
}

export async function createPayPalOrder(booking) {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'USD',
                value: booking.deposit.toFixed(2),
                breakdown: {
                    item_total: {
                        currency_code: 'USD',
                        value: booking.deposit.toFixed(2)
                    }
                }
            },
            description: `Wedding Hall Deposit - ${booking.hall} on ${booking.date}`,
            custom_id: booking.id
        }]
    });

    try {
        const order = await client().execute(request);
        return {
            success: true,
            orderId: order.result.id
        };
    } catch (error) {
        console.error('PayPal error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Frontend integration (add to index.html)
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"></script>
<div id="paypal-button-container"></div>

<script>
paypal.Buttons({
    createOrder: async function(data, actions) {
        const response = await fetch('/api/create-paypal-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookingId: currentBooking.id })
        });
        const order = await response.json();
        return order.orderId;
    },
    onApprove: async function(data, actions) {
        const response = await fetch('/api/capture-paypal-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: data.orderID })
        });
        const result = await response.json();
        alert('Payment successful!');
    }
}).render('#paypal-button-container');
</script>
*/

// ============================================
// ISRAELI PAYMENT - TRANZILA
// ============================================
// Popular in Israel for local credit card processing
// Docs: https://www.tranzila.com/

/*
export function generateTranzilaPaymentForm(booking) {
    const form = {
        supplier: 'your_supplier_id',
        sum: booking.deposit.toFixed(2),
        currency: 1, // 1 = ILS (Shekel)
        cred_type: 1, // Regular credit
        order_id: booking.id,
        description: `Deposit - ${booking.hall}`,
        contact: booking.name,
        email: booking.email,
        phone: booking.phone,
        success_url: 'https://yoursite.com/payment-success',
        fail_url: 'https://yoursite.com/payment-failed'
    };

    // Create form and submit to Tranzila
    const formHtml = `
        <form id="tranzilaForm" action="https://direct.tranzila.com/YOUR_TERMINAL/iframenew.php" method="post">
            ${Object.entries(form).map(([key, value]) =>
                `<input type="hidden" name="${key}" value="${value}">`
            ).join('')}
        </form>
    `;

    return formHtml;
}
*/

// ============================================
// EMAIL NOTIFICATION AFTER PAYMENT
// ============================================
// Install: npm install nodemailer
// For production, use SendGrid, Mailgun, or AWS SES

/*
import nodemailer from 'nodemailer';

export async function sendBookingConfirmation(booking) {
    // Create transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-app-password'
        }
    });

    const hallName = booking.hall === 'small' ? 'Intimate Hall' : 'Grand Ballroom';

    // Email to customer
    await transporter.sendMail({
        from: '"Elegant Events Hall" <noreply@eleganteventshall.com>',
        to: booking.email,
        subject: `Booking Confirmation - ${hallName}`,
        html: `
            <h2>Booking Confirmation</h2>
            <p>Dear ${booking.name},</p>
            <p>Your booking has been confirmed!</p>

            <h3>Booking Details:</h3>
            <ul>
                <li><strong>Booking ID:</strong> ${booking.id}</li>
                <li><strong>Hall:</strong> ${hallName}</li>
                <li><strong>Date:</strong> ${booking.date}</li>
                <li><strong>Guests:</strong> ${booking.guests}</li>
                <li><strong>Package:</strong> ${booking.package}</li>
                <li><strong>Total Price:</strong> $${booking.total.toLocaleString()}</li>
                <li><strong>Deposit Paid:</strong> $${booking.deposit.toLocaleString()}</li>
            </ul>

            <p>We will contact you at ${booking.phone} to finalize the details.</p>

            <p>Thank you for choosing Elegant Events Hall!</p>
        `
    });

    // Email to admin
    await transporter.sendMail({
        from: '"Elegant Events Hall System" <noreply@eleganteventshall.com>',
        to: 'admin@eleganteventshall.com',
        subject: `New Booking - ${booking.date}`,
        html: `
            <h2>New Booking Received</h2>
            <p><strong>Customer:</strong> ${booking.name}</p>
            <p><strong>Email:</strong> ${booking.email}</p>
            <p><strong>Phone:</strong> ${booking.phone}</p>
            <p><strong>Hall:</strong> ${hallName}</p>
            <p><strong>Date:</strong> ${booking.date}</p>
            <p><strong>Booking ID:</strong> ${booking.id}</p>
        `
    });
}
*/

// ============================================
// SMS NOTIFICATION (TWILIO)
// ============================================
// Install: npm install twilio
// Docs: https://www.twilio.com/docs

/*
import twilio from 'twilio';

const client = twilio('your_account_sid', 'your_auth_token');

export async function sendBookingSMS(booking) {
    const hallName = booking.hall === 'small' ? 'Intimate Hall' : 'Grand Ballroom';

    await client.messages.create({
        body: `Booking confirmed! ${hallName} on ${booking.date}. Booking ID: ${booking.id}. We'll call you soon!`,
        from: '+1234567890', // Your Twilio number
        to: booking.phone
    });
}
*/

// ============================================
// INTEGRATION INSTRUCTIONS
// ============================================

/*
To integrate payments into your booking system:

1. Choose a payment provider (Stripe, PayPal, Tranzila, etc.)

2. Install the required package:
   npm install stripe
   // or
   npm install @paypal/checkout-server-sdk

3. Add payment endpoints to server.js:

   app.post('/api/create-payment', async (req, res) => {
       const { bookingId } = req.body;
       const booking = bookings.find(b => b.id === bookingId);

       const payment = await createStripePayment(booking);
       res.json(payment);
   });

4. Update the submitBooking() function in script.js:
   - After form validation passes
   - Create booking in database
   - Redirect to payment page
   - On payment success, update booking status to 'confirmed'
   - Send confirmation email

5. For Israeli customers, consider:
   - Tranzila for local credit cards
   - Bit/Paybox for Israeli digital wallets
   - Display prices in ILS (Shekels) as well as USD
*/

export default {
    // Placeholder - implement the payment method you choose
    processPayment: async (booking) => {
        console.log('Payment processing not configured yet');
        console.log('See payment-integration.js for examples');
        return { success: false, message: 'Payment not configured' };
    }
};
