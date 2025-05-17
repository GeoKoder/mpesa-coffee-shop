import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

describe('Payment Validation Tests', () => {
    let app;
    let payRoutes;

    beforeEach(async () => {
        // Mock the token generation middleware
        jest.mock('../middleware/generateToken.js', () => {
            return jest.fn((req, res, next) => {
                req.token = 'mock-token';
                next();
            });
        });

        payRoutes = (await import('../routes/pay.js')).default;
        app = express();
        app.use(express.json());
        app.use('/pay', payRoutes);
    });

    describe('Phone Number Validation', () => {
        test('should reject phone numbers not starting with 254', async () => {
            const response = await request(app)
                .post('/pay')
                .send({ phone: '0712345678', amount: 100 });
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Phone and amount are required');
        });

        test('should reject phone numbers with incorrect length', async () => {
            const response = await request(app)
                .post('/pay')
                .send({ phone: '254123', amount: 100 });
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Phone and amount are required');
        });

        test('should reject phone numbers with non-numeric characters', async () => {
            const response = await request(app)
                .post('/pay')
                .send({ phone: '25471234567a', amount: 100 });
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Phone and amount are required');
        });

        test('should accept valid phone number format', async () => {
            const response = await request(app)
                .post('/pay')
                .send({ phone: '254712345678', amount: 100 });
            expect(response.status).not.toBe(400);
        });
    });

    describe('Amount Validation', () => {
        test('should reject negative amounts', async () => {
            const response = await request(app)
                .post('/pay')
                .send({ phone: '254712345678', amount: -100 });
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Phone and amount are required');
        });

        test('should reject zero amount', async () => {
            const response = await request(app)
                .post('/pay')
                .send({ phone: '254712345678', amount: 0 });
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Phone and amount are required');
        });

        test('should reject non-numeric amount', async () => {
            const response = await request(app)
                .post('/pay')
                .send({ phone: '254712345678', amount: '100' });
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Phone and amount are required');
        });

        test('should accept valid amount', async () => {
            const response = await request(app)
                .post('/pay')
                .send({ phone: '254712345678', amount: 100 });
            expect(response.status).not.toBe(400);
        });
    });

    describe('Required Fields Validation', () => {
        test('should reject empty request body', async () => {
            const response = await request(app)
                .post('/pay')
                .send({});
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Phone and amount are required');
        });

        test('should reject missing phone', async () => {
            const response = await request(app)
                .post('/pay')
                .send({ amount: 100 });
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Phone and amount are required');
        });

        test('should reject missing amount', async () => {
            const response = await request(app)
                .post('/pay')
                .send({ phone: '254712345678' });
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Phone and amount are required');
        });
    });
}); 