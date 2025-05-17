import api from './api';

const mpesaService = {
    // Initiate STK Push
    initiatePayment: async (phone: string, amount: number) => {
        try {
            const response = await api.post('/pay', {
                phone,
                amount
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to initiate payment');
        }
    },

    // Check payment status
    checkPaymentStatus: async (checkoutRequestId: string) => {
        try {
            const response = await api.get(`/status/${checkoutRequestId}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to check payment status');
        }
    }
};

export default mpesaService; 