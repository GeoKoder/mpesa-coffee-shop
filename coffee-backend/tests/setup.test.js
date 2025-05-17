import { jest } from '@jest/globals';

describe('Environment Setup Tests', () => {
    test('should have all required environment variables', () => {
        const requiredEnvVars = [
            'PAYBILL',
            'PASSKEY',
            'CONSUMER_KEY',
            'SECRET',
            'CALLBACK_URL'
        ];

        requiredEnvVars.forEach(envVar => {
            expect(process.env[envVar]).toBeDefined();
            expect(process.env[envVar]).not.toBe('');
        });
    });

    test('should have valid PAYBILL format', () => {
        const paybill = process.env.PAYBILL;
        expect(paybill).toMatch(/^\d{5,7}$/);
    });

    test('should have valid CALLBACK_URL format', () => {
        const callbackUrl = process.env.CALLBACK_URL;
        expect(callbackUrl).toMatch(/^https?:\/\/.+/);
    });
}); 