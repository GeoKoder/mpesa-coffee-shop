import { useState } from 'react';
import { Product } from '@/types';

interface PaymentResponse {
    CheckoutRequestID: string;
    status: string;
    message?: string;
}

export const usePayment = (product: Product) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);

    const initiatePayment = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/payment/initiate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: product.price,
                    phone: "", // This should be collected from the user
                    productId: product.id,
                }),
            });

            const data = await response.json() as PaymentResponse;
            setCheckoutRequestId(data.CheckoutRequestID);
            pollPaymentStatus(data.CheckoutRequestID);
        } catch (err) {
            setError("Failed to initiate payment. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const pollPaymentStatus = async (requestId: string) => {
        try {
            const response = await fetch(`/api/payment/status/${requestId}`);
            const status = await response.json() as PaymentResponse;

            if (status.status === "completed") {
                // Handle successful payment
                return true;
            } else if (status.status === "failed") {
                setError(status.message || "Payment failed. Please try again.");
                return false;
            }

            // Continue polling if payment is still pending
            setTimeout(() => pollPaymentStatus(requestId), 5000);
        } catch (err) {
            setError("Failed to check payment status. Please try again.");
            return false;
        }
    };

    return {
        initiatePayment,
        isLoading,
        error,
        checkoutRequestId,
    };
}; 