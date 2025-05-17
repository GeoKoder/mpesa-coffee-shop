import React, { useState } from 'react';
import { toast } from 'react-toastify';
import usePayment from '@/hooks/usePayment';

interface PaymentFormProps {
    amount: number;
    onPaymentComplete?: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ amount, onPaymentComplete }) => {
    const [phone, setPhone] = useState('');
    const { loading, error, paymentStatus, initiatePayment } = usePayment();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate phone number
        if (!phone.match(/^2547\d{8}$/)) {
            toast.error('Please enter a valid phone number starting with 2547');
            return;
        }

        try {
            await initiatePayment(phone, amount);
            toast.info('Please check your phone for the M-PESA prompt');
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const renderStatus = () => {
        switch (paymentStatus) {
            case 'pending':
                return (
                    <div className="text-yellow-600">
                        <p>Waiting for payment confirmation...</p>
                        <p className="text-sm">Please complete the payment on your phone</p>
                    </div>
                );
            case 'completed':
                toast.success('Payment completed successfully!');
                onPaymentComplete?.();
                return (
                    <div className="text-green-600">
                        <p>Payment completed successfully!</p>
                    </div>
                );
            case 'failed':
                return (
                    <div className="text-red-600">
                        <p>Payment failed</p>
                        <p className="text-sm">{error}</p>
                    </div>
                );
            case 'timeout':
                return (
                    <div className="text-red-600">
                        <p>Payment status check timed out</p>
                        <p className="text-sm">Please contact support if payment was made</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">M-PESA Payment</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="2547XXXXXXXX"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        disabled={loading || paymentStatus === 'pending'}
                        required
                    />
                    <p className="mt-1 text-sm text-gray-500">
                        Enter your M-PESA registered phone number
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Amount
                    </label>
                    <div className="mt-1 block w-full p-2 bg-gray-100 rounded-md">
                        KES {amount.toFixed(2)}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || paymentStatus === 'pending'}
                    className={`w-full py-2 px-4 rounded-md text-white font-medium
                        ${loading || paymentStatus === 'pending'
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {loading ? 'Processing...' : 'Pay with M-PESA'}
                </button>
            </form>

            {renderStatus()}
        </div>
    );
};

export default PaymentForm; 