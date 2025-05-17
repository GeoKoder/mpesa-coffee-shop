import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

describe('Callback Route Tests', () => {
    let app;
    let callbackRoutes;

    beforeEach(async () => {
        callbackRoutes = (await import('../routes/callback.js')).default;
        app = express();
        app.use(express.json());
        app.use('/callback', callbackRoutes);
    });

    describe('STK Push Callback', () => {
        test('should handle successful payment callback', async () => {
            const mockCallback = {
                Body: {
                    stkCallback: {
                        MerchantRequestID: '29115-34620561-1',
                        CheckoutRequestID: 'ws_CO_123456789',
                        ResultCode: 0,
                        ResultDesc: 'The service request is processed successfully.',
                        CallbackMetadata: {
                            Item: [
                                { Name: 'Amount', Value: 100.00 },
                                { Name: 'MpesaReceiptNumber', Value: 'NLJ7RT61SV' },
                                { Name: 'TransactionDate', Value: '20240215123456' },
                                { Name: 'PhoneNumber', Value: '254712345678' }
                            ]
                        }
                    }
                }
            };

            const response = await request(app)
                .post('/callback')
                .send(mockCallback);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Callback processed successfully');
        });

        test('should handle failed payment callback', async () => {
            const mockCallback = {
                Body: {
                    stkCallback: {
                        MerchantRequestID: '29115-34620561-1',
                        CheckoutRequestID: 'ws_CO_123456789',
                        ResultCode: 1032,
                        ResultDesc: 'Request cancelled by user'
                    }
                }
            };

            const response = await request(app)
                .post('/callback')
                .send(mockCallback);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Callback processed successfully');
        });

        test('should handle invalid callback format', async () => {
            const invalidCallback = {
                invalid: 'format'
            };

            const response = await request(app)
                .post('/callback')
                .send(invalidCallback);

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Invalid callback format');
        });

        test('should handle missing required fields', async () => {
            const incompleteCallback = {
                Body: {
                    stkCallback: {
                        MerchantRequestID: '29115-34620561-1'
                        // Missing other required fields
                    }
                }
            };

            const response = await request(app)
                .post('/callback')
                .send(incompleteCallback);

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Invalid callback format');
        });

        test('should handle malformed callback data', async () => {
            const malformedCallback = {
                Body: {
                    stkCallback: {
                        MerchantRequestID: '29115-34620561-1',
                        CheckoutRequestID: 'ws_CO_123456789',
                        ResultCode: 0,
                        ResultDesc: 'The service request is processed successfully.',
                        CallbackMetadata: {
                            Item: [
                                { Name: 'Amount', Value: 'invalid' }, // Invalid amount
                                { Name: 'MpesaReceiptNumber', Value: 'NLJ7RT61SV' },
                                { Name: 'TransactionDate', Value: 'invalid-date' }, // Invalid date
                                { Name: 'PhoneNumber', Value: 'invalid-phone' } // Invalid phone
                            ]
                        }
                    }
                }
            };

            const response = await request(app)
                .post('/callback')
                .send(malformedCallback);

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Invalid callback data');
        });
    });

    describe('Error Handling', () => {
        test('should handle empty request body', async () => {
            const response = await request(app)
                .post('/callback')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Invalid callback format');
        });

        test('should handle non-JSON request', async () => {
            const response = await request(app)
                .post('/callback')
                .send('not json')
                .set('Content-Type', 'text/plain');

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Invalid request format');
        });
    });
}); 