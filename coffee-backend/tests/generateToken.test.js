import { jest } from '@jest/globals';
import generateToken from '../middleware/generateToken.js';
import axios from 'axios';

// Mock axios
jest.mock('axios', () => ({
    get: jest.fn()
}));

describe('Token Generation Middleware Tests', () => {
    let mockReq;
    let mockRes;
    let nextFunction;

    beforeEach(() => {
        process.env.CONSUMER_KEY = 'test-consumer-key';
        process.env.SECRET = 'test-secret';
        
        mockReq = {};
        mockRes = {
            status: jest.fn(() => mockRes),
            json: jest.fn()
        };
        nextFunction = jest.fn();
        
        jest.clearAllMocks();
    });

    describe('Successful Token Generation', () => {
        test('should generate token successfully', async () => {
            const mockToken = 'mock-access-token';
            axios.get.mockResolvedValueOnce({
                data: {
                    access_token: mockToken
                }
            });

            await generateToken(mockReq, mockRes, nextFunction);

            expect(mockReq.token).toBe(mockToken);
            expect(nextFunction).toHaveBeenCalled();
            expect(mockRes.status).not.toHaveBeenCalled();
        });

        test('should use correct auth header', async () => {
            const expectedAuth = Buffer.from('test-consumer-key:test-secret').toString('base64');

            await generateToken(mockReq, mockRes, nextFunction);

            expect(axios.get).toHaveBeenCalledWith(
                'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
                {
                    headers: {
                        Authorization: `Basic ${expectedAuth}`
                    }
                }
            );
        });
    });

    describe('Error Handling', () => {
        test('should handle API error with response', async () => {
            const errorMessage = 'API Error';
            const mockError = {
                response: {
                    data: {
                        error: 'invalid_client',
                        error_description: errorMessage
                    },
                    status: 401
                }
            };
            axios.get.mockRejectedValueOnce(mockError);

            await generateToken(mockReq, mockRes, nextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Failed to generate access token',
                details: errorMessage
            });
            expect(nextFunction).not.toHaveBeenCalled();
        });

        test('should handle network error', async () => {
            const errorMessage = 'Network Error';
            axios.get.mockRejectedValueOnce(new Error(errorMessage));

            await generateToken(mockReq, mockRes, nextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Failed to generate access token',
                details: errorMessage
            });
            expect(nextFunction).not.toHaveBeenCalled();
        });

        test('should handle timeout error', async () => {
            const errorMessage = 'timeout of 5000ms exceeded';
            axios.get.mockRejectedValueOnce({
                code: 'ECONNABORTED',
                message: errorMessage
            });

            await generateToken(mockReq, mockRes, nextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Failed to generate access token',
                details: errorMessage
            });
            expect(nextFunction).not.toHaveBeenCalled();
        });
    });

    describe('Environment Variables', () => {
        test('should handle missing CONSUMER_KEY', async () => {
            delete process.env.CONSUMER_KEY;

            await generateToken(mockReq, mockRes, nextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Failed to generate access token',
                details: expect.any(String)
            });
            expect(nextFunction).not.toHaveBeenCalled();
        });

        test('should handle missing SECRET', async () => {
            delete process.env.SECRET;

            await generateToken(mockReq, mockRes, nextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Failed to generate access token',
                details: expect.any(String)
            });
            expect(nextFunction).not.toHaveBeenCalled();
        });
    });
}); 