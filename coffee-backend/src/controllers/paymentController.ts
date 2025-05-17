import { Request, Response } from 'express';
import { PaymentRequest, PaymentResponse, PaymentStatus } from '../types';
import { generateToken, generatePassword } from '../utils/mpesa';

export const initiatePayment = async (req: Request<{}, {}, PaymentRequest>, res: Response) => {
    try {
        const { phone, amount } = req.body;
        
        // Generate access token
        const token = await generateToken();
        
        // Generate timestamp
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
        
        // Generate password
        const password = generatePassword(timestamp);
        
        // Prepare STK Push request
        const response = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                BusinessShortCode: process.env.PAYBILL,
                Password: password,
                Timestamp: timestamp,
                TransactionType: 'CustomerPayBillOnline',
                Amount: amount,
                PartyA: phone,
                PartyB: process.env.PAYBILL,
                PhoneNumber: phone,
                CallBackURL: `${process.env.CALLBACK_URL}/callback`,
                AccountReference: 'CoffeeKiosk',
                TransactionDesc: 'Payment for coffee'
            })
        });

        const data: PaymentResponse = await response.json();
        
        if (data.ResponseCode === '0') {
            res.json(data);
        } else {
            res.status(400).json({ error: data.ResponseDescription });
        }
    } catch (error: any) {
        console.error('Payment initiation error:', error);
        res.status(500).json({ error: 'Failed to initiate payment' });
    }
};

export const checkPaymentStatus = async (req: Request<{ checkoutRequestId: string }>, res: Response) => {
    try {
        const { checkoutRequestId } = req.params;
        
        // In a real application, you would check the payment status from your database
        // For now, we'll return a mock response
        const status: PaymentStatus = {
            status: 'pending',
            message: 'Payment is being processed'
        };
        
        res.json(status);
    } catch (error: any) {
        console.error('Payment status check error:', error);
        res.status(500).json({ error: 'Failed to check payment status' });
    }
}; 