import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { Body: { stkCallback } } = req.body;

        if (!stkCallback) {
            return res.status(400).json({ error: 'Invalid callback format' });
        }

        const { ResultCode, CheckoutRequestID, CallbackMetadata } = stkCallback;

        // Update payment status
        const status = ResultCode === 0 ? 'completed' : 'failed';
        await axios.post(`http://localhost:${process.env.PORT || 3000}/pay/status/${CheckoutRequestID}`, {
            status
        });

        if (ResultCode === 0) {
            // Payment successful
            const amount = CallbackMetadata.Item.find(item => item.Name === 'Amount')?.Value;
            const receiptNumber = CallbackMetadata.Item.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
            const phoneNumber = CallbackMetadata.Item.find(item => item.Name === 'PhoneNumber')?.Value;

            console.log('Payment successful:', {
                amount,
                receiptNumber,
                phoneNumber
            });
        } else {
            // Payment failed
            const errorMessage = stkCallback.ResultDesc || 'Payment failed';
            console.log('Payment failed:', errorMessage);
        }

        res.json({ message: 'Callback processed successfully' });
    } catch (error) {
        console.error('Callback processing error:', error.message);
        res.status(500).json({ error: 'Failed to process callback' });
    }
});

export default router; 