import axios from 'axios';

const generateToken = async (req, res, next) => {
    try {
        console.log('Generating access token...');
        const auth = Buffer.from(`${process.env.CONSUMER_KEY}:${process.env.SECRET}`).toString('base64');
        
        console.log('Making token request to Safaricom...');
        const response = await axios.get(
            'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
            {
                headers: {
                    Authorization: `Basic ${auth}`
                }
            }
        );
        
        console.log('Token generated successfully');
        req.token = response.data.access_token;
        next();
    } catch (error) {
        console.error('Token generation error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        res.status(500).json({ 
            error: 'Failed to generate access token',
            details: error.response?.data || error.message
        });
    }
};

export default generateToken; 