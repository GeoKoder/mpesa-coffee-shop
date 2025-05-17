import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const mpesaService = {
    // Initiate STK Push
    initiatePayment: async (phone, amount) => {
        try {
            const response = await axios.post(`${API_URL}/pay`, {
                phone,
                amount
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to initiate payment');
        }
    },

    // Check payment status
    checkPaymentStatus: async (checkoutRequestId) => {
        try {
            const response = await axios.get(`${API_URL}/status/${checkoutRequestId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to check payment status');
        }
    }
};

export default mpesaService; 