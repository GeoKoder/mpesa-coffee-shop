import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaymentForm from './components/PaymentForm';

function App() {
    const handlePaymentComplete = () => {
        // Handle successful payment
        console.log('Payment completed successfully');
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12">
            <div className="container mx-auto px-4">
                <ToastContainer position="top-right" />
                
                <PaymentForm 
                    amount={100} // Example amount
                    onPaymentComplete={handlePaymentComplete}
                />
            </div>
        </div>
    );
}

export default App; 