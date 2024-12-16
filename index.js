const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Razorpay Configuration
const razorpay = new Razorpay({
    key_id: 'rzp_test_8lCA3HtrXpU4Ir', 
    key_secret: 'LO8wBL2FjJaVAAqbH64nEfSJ' 
});

// Create an Order
app.post('/create-order', async (req, res) => {
    const { amount, currency } = req.body;

    try {
        const options = {
            amount: amount * 100,  
            currency,
            receipt: `receipt_${Math.floor(Math.random() * 10000)}`,
            payment_capture: 1    
        };
        const order = await razorpay.orders.create(options);
        res.status(200).json({ order_id: order.id, amount: order.amount, currency: order.currency });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).send("Error creating order");
    }
});


app.post('/verify-payment', (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', 'your_key_secret') // Use your Razorpay key_secret here
                                    .update(body.toString())
                                    .digest('hex');
    if (expectedSignature === razorpay_signature) {
        res.status(200).json({ message: 'Payment successful' });
    } else {
        res.status(400).json({ message: 'Payment verification failed' });
    }
});

// Start the server
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});