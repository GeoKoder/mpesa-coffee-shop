export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    inStock: boolean;
}

export interface PaymentStatus {
    status: 'pending' | 'completed' | 'failed' | 'timeout';
    message?: string;
}

export interface PaymentResponse {
    success: boolean;
    message: string;
    checkoutRequestId?: string;
    merchantRequestId?: string;
    error?: string;
}

export interface PaymentError {
    error: string;
    details?: string;
} 