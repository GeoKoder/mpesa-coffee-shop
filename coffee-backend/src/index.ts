import app from './app';

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log('Environment variables loaded:', {
        PAYBILL: process.env.PAYBILL,
        PASSKEY: process.env.PASSKEY ? 'Set' : 'Not set',
        CONSUMER_KEY: process.env.CONSUMER_KEY ? 'Set' : 'Not set',
        SECRET: process.env.SECRET ? 'Set' : 'Not set',
        CALLBACK_URL: process.env.CALLBACK_URL
    });
}).on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Please try a different port.`);
        process.exit(1);
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
}); 