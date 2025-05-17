import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import crypto from 'crypto';
import payRoutes from './routes/pay.js';
import callbackRoutes from './routes/callback.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Request body:', req.body);
    next();
});

// Token generation middleware
const generateToken = async (req, res, next) => {
    try {
        const auth = Buffer.from(`${process.env.CONSUMER_KEY}:${process.env.SECRET}`).toString('base64');
        const response = await axios.get(
            'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
            {
                headers: {
                    Authorization: `Basic ${auth}`
                }
            }
        );
        req.token = response.data.access_token;
        next();
    } catch (error) {
        console.error('Token generation error:', error.message);
        res.status(500).json({ error: 'Failed to generate access token' });
    }
};

// Generate password for STK Push
const generatePassword = (timestamp) => {
    const str = process.env.PAYBILL + process.env.PASSKEY + timestamp;
    return Buffer.from(str).toString('base64');
};

// Routes
app.use('/pay', payRoutes);
app.use('/callback', callbackRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        details: err.message
    });
});

// Start server
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log('Environment variables loaded:', {
        PAYBILL: process.env.PAYBILL,
        PASSKEY: process.env.PASSKEY ? 'Set' : 'Not set',
        CONSUMER_KEY: process.env.CONSUMER_KEY ? 'Set' : 'Not set',
        SECRET: process.env.SECRET ? 'Set' : 'Not set',
        CALLBACK_URL: process.env.CALLBACK_URL
    });
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Please try a different port.`);
        process.exit(1);
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
}); 