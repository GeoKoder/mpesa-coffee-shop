import axios from 'axios';
import crypto from 'crypto';

export const generateToken = async (): Promise<string> => {
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
        return response.data.access_token;
    } catch (error) {
        console.error('Token generation error:', error);
        throw new Error('Failed to generate access token');
    }
};

export const generatePassword = (timestamp: string): string => {
    const str = `${process.env.PAYBILL}${process.env.PASSKEY}${timestamp}`;
    return Buffer.from(str).toString('base64');
};

export const validatePhoneNumber = (phone: string): boolean => {
    // Remove any non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Check if it's a valid Safaricom number
    return /^(?:254|\+254|0)?([71](?:(?:0[0-8])|(?:[12][0-9])|(?:9[0-9])|(?:4[0-3]))[0-9]{6})$/.test(cleanPhone);
}; 