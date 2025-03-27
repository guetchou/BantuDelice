
import { apiRequest } from "./core";

// Types pour les paiements
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

// Fonctions pour l'API de paiement
export const paymentApi = {
  // Pré-autorisation du paiement pour une course
  preAuthorize: async (data: PaymentPreAuthRequest): Promise<PaymentResponse> => {
    return apiRequest('/payments/pre-authorize', 'POST', data);
  },
  
  // Capture d'un paiement pré-autorisé (débit effectif)
  capture: async (data: PaymentCaptureRequest): Promise<PaymentResponse> => {
    return apiRequest(`/payments/capture`, 'POST', data);
  },
  
  // Annulation d'une pré-autorisation
  cancelPreAuth: async (authorizationId: string): Promise<PaymentResponse> => {
    return apiRequest(`/payments/pre-authorize/${authorizationId}/cancel`, 'POST');
  },
  
  // Remboursement d'un paiement capturé
  refund: async (data: PaymentRefundRequest): Promise<PaymentResponse> => {
    return apiRequest(`/payments/refund`, 'POST', data);
  },
  
  // Obtention des détails d'une transaction
  getTransaction: async (transactionId: string): Promise<PaymentResponse> => {
    return apiRequest(`/payments/transactions/${transactionId}`);
  },
  
  // Création d'une facture pour une course
  createInvoice: async (rideId: string): Promise<{ invoice_id: string; invoice_url: string; }> => {
    return apiRequest(`/payments/invoices`, 'POST', { ride_id: rideId });
  },
  
  // Obtention d'une facture
  getInvoice: async (invoiceId: string): Promise<any> => {
    return apiRequest(`/payments/invoices/${invoiceId}`);
  },
  
  // Envoi d'une facture par email
  sendInvoiceByEmail: async (invoiceId: string, email: string): Promise<{ success: boolean; message: string; }> => {
    return apiRequest(`/payments/invoices/${invoiceId}/send`, 'POST', { email });
  },
  
  // Vérification d'un code promo
  validatePromoCode: async (code: string, amount: number, vehicleType?: string): Promise<{ 
    valid: boolean; 
    discount: number; 
    discount_type: string;
    final_amount: number;
    message: string;
  }> => {
    return apiRequest('/payments/promo-codes/validate', 'POST', { 
      code, 
      amount,
      vehicle_type: vehicleType
    });
  }
};
