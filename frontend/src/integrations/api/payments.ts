
import { apiRequest } from "./core";

// Types for payments
export interface PaymentPreAuthRequest {
  amount: number;
  currency: string;
  payment_method: string;
  customer_id?: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface PaymentCaptureRequest {
  authorization_id: string;
  amount: number;
  tip?: number;
  description?: string;
  metadata?: Record<string, any>;
}

export interface PaymentRefundRequest {
  transaction_id: string;
  amount?: number;
  reason?: string;
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  success: boolean;
  transaction_id?: string;
  authorization_id?: string;
  status: 'not_started' | 'pre_authorized' | 'authorized' | 'captured' | 'refunded' | 'failed';
  message: string;
  amount: number;
  currency: string;
  timestamp: string;
  receipt_url?: string;
}

// Payment API functions
export const paymentApi = {
  // Pre-authorize payment for a ride
  preAuthorize: async (data: PaymentPreAuthRequest): Promise<PaymentResponse> => {
    return apiRequest('/payments/pre-authorize', 'POST', data);
  },
  
  // Capture a pre-authorized payment (actual debit)
  capture: async (data: PaymentCaptureRequest): Promise<PaymentResponse> => {
    return apiRequest(`/payments/capture`, 'POST', data);
  },
  
  // Cancel a pre-authorization
  cancelPreAuth: async (authorizationId: string): Promise<PaymentResponse> => {
    return apiRequest(`/payments/pre-authorize/${authorizationId}/cancel`, 'POST');
  },
  
  // Refund a captured payment
  refund: async (data: PaymentRefundRequest): Promise<PaymentResponse> => {
    return apiRequest(`/payments/refund`, 'POST', data);
  },
  
  // Get transaction details
  getTransaction: async (transactionId: string): Promise<PaymentResponse> => {
    return apiRequest(`/payments/transactions/${transactionId}`);
  },
  
  // Create an invoice for a ride
  createInvoice: async (rideId: string, data?: {
    include_tip?: boolean;
    custom_amount?: number;
    additional_items?: Array<{name: string; amount: number}>;
    customer_email?: string;
    send_email?: boolean;
  }): Promise<{ invoice_id: string; invoice_url: string; }> => {
    return apiRequest(`/payments/invoices`, 'POST', { ride_id: rideId, ...data });
  },
  
  // Get invoice details
  getInvoice: async (invoiceId: string): Promise<{
    id: string;
    ride_id: string;
    user_id: string;
    driver_id: string;
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    payment_method: string;
    currency: string;
    issued_at: string;
    due_at?: string;
    paid_at?: string;
    status: 'draft' | 'issued' | 'paid' | 'cancelled';
    invoice_url?: string;
    pdf_url?: string;
    reference_number: string;
  }> => {
    return apiRequest(`/payments/invoices/${invoiceId}`);
  },
  
  // Send invoice by email
  sendInvoiceByEmail: async (invoiceId: string, email: string): Promise<{ success: boolean; message: string; }> => {
    return apiRequest(`/payments/invoices/${invoiceId}/send`, 'POST', { email });
  },
  
  // Validate a promo code
  validatePromoCode: async (code: string, amount: number, vehicleType?: string): Promise<{ 
    valid: boolean; 
    discount: number; 
    discount_type: 'percentage' | 'fixed_amount' | 'free_ride';
    final_amount: number;
    message: string;
  }> => {
    return apiRequest('/payments/promo-codes/validate', 'POST', { 
      code, 
      amount,
      vehicle_type: vehicleType
    });
  },
  
  // Apply payment to a ride
  applyPayment: async (rideId: string, paymentData: {
    amount: number;
    payment_method: string;
    tip?: number;
    promo_code?: string;
  }): Promise<PaymentResponse> => {
    return apiRequest(`/payments/rides/${rideId}/pay`, 'POST', paymentData);
  }
};
