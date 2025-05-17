import express from 'express';
import axios from 'axios';
import generateToken from '../middleware/generateToken.js';

const router = express.Router();

// Store payment statuses in memory (in production, use a database)
const paymentStatuses = new Map();

// Generate password for STK Push
const generatePassword = (timestamp) => {
    const str = process.env.PAYBILL + process.env.PASSKEY + timestamp;
    return Buffer.from(str).toString('base64');
};

// Validation middleware
const validatePayRequest = (req, res, next) => {
    const { phone, amount } = req.body;
    if (!phone || !amount) {
        return res.status(400).json({ error: 'Phone and amount are required' });
    }
    // Phone must be a string of 12 digits starting with '254'
    if (typeof phone !== 'string' || !/^254\d{9}$/.test(phone)) {
        return res.status(400).json({ error: 'Phone and amount are required' });
    }
    // Amount must be a number
    if (typeof amount !== 'number' || isNaN(amount)) {
        return res.status(400).json({ error: 'Phone and amount are required' });
    }
    next();
};

// Initiate STK Push
router.post('/', validatePayRequest, generateToken, async (req, res) => {
    try {
        console.log('Received payment request:', req.body);
        const { phone, amount } = req.body;

        // Generate timestamp
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
        const password = generatePassword(timestamp);

        const response = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            {
                BusinessShortCode: process.env.PAYBILL,
                Password: password,
                Timestamp: timestamp,
                TransactionType: 'CustomerPayBillOnline',
                Amount: amount,
                PartyA: phone,
                PartyB: process.env.PAYBILL,
                PhoneNumber: phone,
                CallBackURL: process.env.CALLBACK_URL,
                AccountReference: 'CoffeeKiosk',
                TransactionDesc: 'Payment for coffee'
            },
            {
                headers: {
                    Authorization: `Bearer ${req.token}`
                }
            }
        );

        // Store initial status
        const checkoutRequestId = response.data.CheckoutRequestID;
        paymentStatuses.set(checkoutRequestId, 'pending');
        console.log('Payment status set to pending for:', checkoutRequestId);

        res.json({
            message: 'STK Push request sent',
            CheckoutRequestID: checkoutRequestId,
            ResponseCode: response.data.ResponseCode
        });
    } catch (error) {
        console.error('STK Push error:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Failed to initiate STK Push',
            details: error.response?.data || error.message
        });
    }
});

// Check payment status
router.get('/status/:checkoutRequestId', (req, res) => {
    const { checkoutRequestId } = req.params;
    console.log('Checking status for:', checkoutRequestId);
    console.log('Current statuses:', Array.from(paymentStatuses.entries()));
    
    const status = paymentStatuses.get(checkoutRequestId) || 'unknown';
    console.log('Status found:', status);
    
    res.json({ status });
});

// Update payment status (for callback use)
router.post('/status/:checkoutRequestId', (req, res) => {
    const { checkoutRequestId } = req.params;
    const { status } = req.body;
    
    if (!status) {
        return res.status(400).json({ error: 'Status is required' });
    }
    
    paymentStatuses.set(checkoutRequestId, status);
    console.log('Payment status updated:', { checkoutRequestId, status });
    
    res.json({ message: 'Status updated successfully' });
});

export { paymentStatuses };
export default router; 