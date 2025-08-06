import { Injectable } from '@nestjs/common';
import { MTNMoMoService, MTNPaymentRequest } from './mtn-momo.service';

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
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  message: string;
}

@Injectable()
export class PaymentsService {
  constructor(private readonly mtnMoMoService: MTNMoMoService) {}

  async processPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    switch (paymentRequest.method) {
      case PaymentMethod.MTN_MOBILE_MONEY:
        return this.processMTNPayment(paymentRequest);
      case PaymentMethod.AIRTEL_MONEY:
        return this.processAirtelPayment(paymentRequest);
      case PaymentMethod.CASH:
        return this.processCashPayment(paymentRequest);
      case PaymentMethod.VISA:
      case PaymentMethod.MASTERCARD:
        return this.processCardPayment(paymentRequest);
      default:
        return {
          success: false,
          message: 'Méthode de paiement non supportée',
        };
    }
  }

  private async processMTNPayment(payment: PaymentRequest): Promise<PaymentResponse> {
    try {
      if (!payment.phoneNumber) {
        return {
          success: false,
          message: 'Numéro de téléphone requis pour MTN Mobile Money',
        };
      }

      // Formater le numéro de téléphone (enlever les espaces et ajouter l'indicatif si nécessaire)
      const formattedPhone = this.formatPhoneNumber(payment.phoneNumber);

      const mtnPaymentRequest: MTNPaymentRequest = {
        amount: payment.amount,
        currency: 'XOF', // Franc CFA pour l'Afrique de l'Ouest
        externalId: payment.orderId,
        payer: {
          partyIdType: 'msisdn',
          partyId: formattedPhone
        },
        payerMessage: `Paiement pour ${payment.description}`,
        payeeNote: `Commande ${payment.orderId}`
      };

      const result = await this.mtnMoMoService.initiatePayment(mtnPaymentRequest);

      return {
        success: result.status,
        transactionId: result.transactionId,
        message: result.message
      };
    } catch (error) {
      return {
        success: false,
        message: `Erreur lors du paiement MTN: ${error.message}`,
      };
    }
  }

  private async processAirtelPayment(payment: PaymentRequest): Promise<PaymentResponse> {
    // TODO: Implémenter l'API Airtel Money
    return {
      success: true,
      transactionId: `AIRTEL_${Date.now()}`,
      message: 'Paiement Airtel Money traité avec succès (Simulation)',
    };
  }

  private async processCashPayment(payment: PaymentRequest): Promise<PaymentResponse> {
    return {
      success: true,
      transactionId: `CASH_${Date.now()}`,
      message: 'Paiement en espèces confirmé',
    };
  }

  private async processCardPayment(payment: PaymentRequest): Promise<PaymentResponse> {
    // TODO: Implémenter l'API de cartes bancaires
    return {
      success: true,
      transactionId: `CARD_${Date.now()}`,
      message: 'Paiement par carte traité avec succès (Simulation)',
    };
  }

  /**
   * Formater un numéro de téléphone pour l'API MTN
   */
  private formatPhoneNumber(phoneNumber: string): string {
    // Enlever tous les caractères non numériques
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // Si le numéro commence par +242, le garder
    if (cleaned.startsWith('242')) {
      return cleaned;
    }
    
    // Si le numéro commence par 0, le remplacer par 242
    if (cleaned.startsWith('0')) {
      return '242' + cleaned.substring(1);
    }
    
    // Si le numéro a 9 chiffres, ajouter 242
    if (cleaned.length === 9) {
      return '242' + cleaned;
    }
    
    return cleaned;
  }
} 