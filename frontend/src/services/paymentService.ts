import apiService from './apiService';

export enum PaymentMethod {
  MTN_MOBILE_MONEY = 'MTN_MOBILE_MONEY',
  AIRTEL_MONEY = 'AIRTEL_MONEY',
  CASH = 'CASH',
  VISA = 'VISA',
  MASTERCARD = 'MASTERCARD',
}

export interface PaymentRequest {
  amount: number;
  method: PaymentMethod;
  phoneNumber?: string;
  orderId: string;
  description: string;
  cardDetails?: {
    number: string;
    expiry: string;
    cvv: string;
    name: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  message: string;
  status?: 'pending' | 'completed' | 'failed';
}

class PaymentService {
  private get API_BASE_URL() {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    // S'assurer qu'il n'y a pas de double /api
    return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
  }

  /**
   * Traite un paiement via l'API backend
   */
  async processPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/payments/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiService.getToken()}`,
        },
        body: JSON.stringify(paymentRequest),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors du paiement',
      };
    }
  }

  /**
   * Vérifie le statut d'un paiement
   */
  async checkPaymentStatus(transactionId: string): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/payments/status/${transactionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiService.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Erreur lors de la vérification du statut:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors de la vérification',
      };
    }
  }

  /**
   * Valide un numéro de téléphone MTN
   */
  validateMTNPhone(phone: string): boolean {
    // Format MTN Congo: +242 0X XXX XXXX
    const mtnRegex = /^\+242\s?0[1-9]\s?\d{3}\s?\d{4}$/;
    return mtnRegex.test(phone);
  }

  /**
   * Valide un numéro de téléphone Airtel
   */
  validateAirtelPhone(phone: string): boolean {
    // Format Airtel Congo: +242 0X XXX XXXX
    const airtelRegex = /^\+242\s?0[1-9]\s?\d{3}\s?\d{4}$/;
    return airtelRegex.test(phone);
  }

  /**
   * Valide les détails d'une carte bancaire
   */
  validateCardDetails(cardDetails: any): boolean {
    if (!cardDetails) return false;

    // Validation basique
    const cardNumber = cardDetails.number?.replace(/\s/g, '');
    const expiry = cardDetails.expiry;
    const cvv = cardDetails.cvv;
    const name = cardDetails.name;

    // Numéro de carte (Luhn algorithm simplifié)
    if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
      return false;
    }

    // Date d'expiration (format MM/YY)
    if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
      return false;
    }

    // CVV (3-4 chiffres)
    if (!cvv || !/^\d{3,4}$/.test(cvv)) {
      return false;
    }

    // Nom sur la carte
    if (!name || name.trim().length < 2) {
      return false;
    }

    return true;
  }

  /**
   * Formate un numéro de téléphone pour l'API
   */
  formatPhoneNumber(phone: string): string {
    // Supprime les espaces et caractères spéciaux
    return phone.replace(/[\s\-\(\)]/g, '');
  }

  /**
   * Génère un ID de commande unique
   */
  generateOrderId(): string {
    return `CMD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default new PaymentService(); 