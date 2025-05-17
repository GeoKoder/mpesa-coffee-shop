import { useState } from 'react';
import mpesaService from '../services/mpesaService';

const usePayment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [checkoutRequestId, setCheckoutRequestId] = useState(null);

    const initiatePayment = async (phone, amount) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await mpesaService.initiatePayment(phone, amount);
            setCheckoutRequestId(response.CheckoutRequestID);
            setPaymentStatus('pending');
            
            // Start polling for payment status
            pollPaymentStatus(response.CheckoutRequestID);
            
            return response;
        } catch (err) {
            setError(err.message);
            setPaymentStatus('failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const pollPaymentStatus = async (requestId) => {
        const pollInterval = setInterval(async () => {
            try {
                const status = await mpesaService.checkPaymentStatus(requestId);
                
                if (status.status === 'completed') {
                    setPaymentStatus('completed');
                    clearInterval(pollInterval);
                } else if (status.status === 'failed') {
                    setPaymentStatus('failed');
                    setError(status.message);
                    clearInterval(pollInterval);
                }
            } catch (err) {
                setError(err.message);
                clearInterval(pollInterval);
            }
        }, 5000); // Poll every 5 seconds

        // Stop polling after 5 minutes
        setTimeout(() => {
            clearInterval(pollInterval);
            if (paymentStatus === 'pending') {
                setError('Payment status check timed out');
                setPaymentStatus('timeout');
            }
        }, 300000);
    };

    const resetPayment = () => {
        setLoading(false);
        setError(null);
        setPaymentStatus(null);
        setCheckoutRequestId(null);
    };

    return {
        loading,
        error,
        paymentStatus,
        checkoutRequestId,
        initiatePayment,
        resetPayment
    };
};

export default usePayment; 