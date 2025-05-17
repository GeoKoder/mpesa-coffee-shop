import dotenv from 'dotenv';

// Load environment variables from .env.test file
dotenv.config({ path: '.env.test' });

// Mock environment variables for testing
process.env.PAYBILL = process.env.PAYBILL || '174379';
process.env.PASSKEY = process.env.PASSKEY || 'test_passkey';
process.env.CONSUMER_KEY = process.env.CONSUMER_KEY || 'test_consumer_key';
process.env.SECRET = process.env.SECRET || 'test_secret';
process.env.CALLBACK_URL = process.env.CALLBACK_URL || 'http://localhost:3000'; 