import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import axios from 'axios';

// Mock axios
jest.mock('axios', () => ({
    post: jest.fn(),
    get: jest.fn()
}));

describe('M-PESA API Integration Tests', () => {
    let app;
    let payRoutes;

    beforeEach(async () => {
        process.env.PAYBILL = '123456';
        process.env.PASSKEY = 'testpasskey';
        process.env.CONSUMER_KEY = 'testkey';
        process.env.SECRET = 'testsecret';
        process.env.CALLBACK_URL = 'https://example.com/callback';

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

        // Reset all mocks before each test
        jest.clearAllMocks();
    });

    describe('STK Push Request', () => {
        test('should make correct API call with valid data', async () => {
            const mockResponse = {
                data: {
                    CheckoutRequestID: 'ws_CO_123456789',
                    ResponseCode: '0',
                    ResponseDescription: 'Success'
                }
            };
            axios.post.mockResolvedValueOnce(mockResponse);

            const response = await request(app)
                .post('/pay')
                .send({ phone: '254712345678', amount: 100 });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                message: 'STK Push request sent',
                CheckoutRequestID: 'ws_CO_123456789',
                ResponseCode: '0'
            });

            // Verify the API call
            expect(axios.post).toHaveBeenCalledWith(
                'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
                expect.objectContaining({
                    BusinessShortCode: process.env.PAYBILL,
                    TransactionType: 'CustomerPayBillOnline',
                    Amount: 100,
                    PartyA: '254712345678',
                    PartyB: process.env.PAYBILL,
                    PhoneNumber: '254712345678',
                    AccountReference: 'CoffeeKiosk',
                    TransactionDesc: 'Payment for coffee'
                }),
                expect.objectContaining({
                    headers: {
                        Authorization: 'Bearer mock-token'
                    }
                })
            );
        });

        test('should handle API timeout', async () => {
            axios.post.mockRejectedValueOnce({
                code: 'ECONNABORTED',
                message: 'timeout of 5000ms exceeded'
            });

            const response = await request(app)
                .post('/pay')
                .send({ phone: '254712345678', amount: 100 });

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Failed to initiate STK Push');
            expect(response.body.details).toContain('timeout');
        });

        test('should handle API network errors', async () => {
            axios.post.mockRejectedValueOnce({
                code: 'ECONNREFUSED',
                message: 'Connection refused'
            });

            const response = await request(app)
                .post('/pay')
                .send({ phone: '254712345678', amount: 100 });

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Failed to initiate STK Push');
            expect(response.body.details).toContain('Connection refused');
        });

        test('should handle API validation errors', async () => {
            const mockError = {
                response: {
                    data: {
                        errorCode: '400.002.02',
                        errorMessage: 'Bad Request - Invalid CallBackURL'
                    },
                    status: 400
                }
            };
            axios.post.mockRejectedValueOnce(mockError);

            const response = await request(app)
                .post('/pay')
                .send({ phone: '254712345678', amount: 100 });

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Failed to initiate STK Push');
            expect(response.body.details.errorCode).toBe('400.002.02');
        });

        test('should handle API authentication errors', async () => {
            const mockError = {
                response: {
                    data: {
                        errorCode: '401.002.01',
                        errorMessage: 'Unauthorized - Invalid credentials'
                    },
                    status: 401
                }
            };
            axios.post.mockRejectedValueOnce(mockError);

            const response = await request(app)
                .post('/pay')
                .send({ phone: '254712345678', amount: 100 });

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Failed to initiate STK Push');
            expect(response.body.details.errorCode).toBe('401.002.01');
        });
    });
}); 