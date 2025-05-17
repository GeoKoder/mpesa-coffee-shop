export interface PaymentRequest {
    phone: string;
    amount: number;
}

export interface PaymentResponse {
    MerchantRequestID: string;
    CheckoutRequestID: string;
    ResponseCode: string;
    ResponseDescription: string;
    CustomerMessage: string;
}

export interface PaymentStatus {
    status: 'pending' | 'completed' | 'failed';
    message?: string;
    transactionId?: string;
}

export interface CallbackData {
    Body: {
        stkCallback: {
            MerchantRequestID: string;
            CheckoutRequestID: string;
            ResultCode: number;
            ResultDesc: string;
            CallbackMetadata?: {
                Item: Array<{
                    Name: string;
                    Value: string | number;
                }>;
            };
        };
    };
} 