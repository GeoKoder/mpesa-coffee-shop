jest.mock('../middleware/generateToken.js', () => {
    return jest.fn((req, res, next) => {
        req.token = 'mock-token';
        next();
    });
});
jest.mock('axios');

import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import axios from 'axios';

describe('Pay Endpoint Tests', () => {
    beforeEach(() => {
        process.env.PAYBILL = '123456';
        process.env.PASSKEY = 'testpasskey';
        process.env.CONSUMER_KEY = 'testkey';
        process.env.SECRET = 'testsecret';
        process.env.CALLBACK_URL = 'https://example.com/callback';
        axios.post = jest.fn();
    });

    test('should return 400 if phone is missing', async () => {
        const payRoutes = (await import('../routes/pay.js')).default;
        const app = express();
        app.use(express.json());
        app.use('/pay', payRoutes);
        const response = await request(app)
            .post('/pay')
            .send({ amount: 100 });
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Phone and amount are required');
    });

    test('should return 400 if amount is missing', async () => {
        const payRoutes = (await import('../routes/pay.js')).default;
        const app = express();
        app.use(express.json());
        app.use('/pay', payRoutes);
        const response = await request(app)
            .post('/pay')
            .send({ phone: '254712345678' });
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Phone and amount are required');
    });

    test('should return 400 if phone number is invalid', async () => {
        const payRoutes = (await import('../routes/pay.js')).default;
        const app = express();
        app.use(express.json());
        app.use('/pay', payRoutes);
        const response = await request(app)
            .post('/pay')
            .send({ phone: '123', amount: 100 });
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Phone and amount are required');
    });

    test('should return 400 if amount is not a number', async () => {
        const payRoutes = (await import('../routes/pay.js')).default;
        const app = express();
        app.use(express.json());
        app.use('/pay', payRoutes);
        const response = await request(app)
            .post('/pay')
            .send({ phone: '254712345678', amount: 'invalid' });
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Phone and amount are required');
    });

    test('should return 500 if M-PESA API call fails', async () => {
        jest.resetModules();
        jest.doMock('../middleware/generateToken.js', () => {
            return jest.fn((req, res, next) => {
                req.token = 'mock-token';
                next();
            });
        });
        const payRoutes = (await import('../routes/pay.js')).default;
        const app = express();
        app.use(express.json());
        app.use('/pay', payRoutes);
        axios.post.mockRejectedValueOnce({
            response: {
                data: {
                    errorCode: '400.002.02',
                    errorMessage: 'Bad Request - Invalid CallBackURL'
                }
            }
        });
        const response = await request(app)
            .post('/pay')
            .send({ phone: '254712345678', amount: 100 });
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Failed to initiate STK Push');
        expect(response.body.details.errorCode).toBe('400.002.02');
    });

    test('should return 200 and success response if M-PESA API call succeeds', async () => {
        jest.resetModules();
        jest.doMock('../middleware/generateToken.js', () => {
            return jest.fn((req, res, next) => {
                req.token = 'mock-token';
                next();
            });
        });
        const payRoutes = (await import('../routes/pay.js')).default;
        const app = express();
        app.use(express.json());
        app.use('/pay', payRoutes);
        axios.post.mockResolvedValueOnce({
            data: {
                CheckoutRequestID: 'ws_CO_123456789',
                ResponseCode: '0'
            }
        });
        const response = await request(app)
            .post('/pay')
            .send({ phone: '254712345678', amount: 100 });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('STK Push request sent');
        expect(response.body.CheckoutRequestID).toBe('ws_CO_123456789');
        expect(response.body.ResponseCode).toBe('0');
    });
}); 