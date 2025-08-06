import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface MTNMoMoConfig {
  subscriptionKey: string;
  apiKey: string;
  userId: string;
  targetEnvironment: 'sandbox' | 'production';
  providerCallbackHost: string;
  baseUrl: string;
}

export interface MTNPaymentRequest {
  amount: number;
  currency: string;
  externalId: string;
  payer: {
    partyIdType: 'msisdn';
    partyId: string;
  };
  payerMessage: string;
  payeeNote: string;
}

export interface MTNPaymentResponse {
  status: boolean;
  message: string;
  transactionId?: string;
  financialTransactionId?: string;
  externalId?: string;
}

@Injectable()
export class MTNMoMoService {
  private readonly logger = new Logger(MTNMoMoService.name);
  private config: MTNMoMoConfig;
  private demoMode: boolean;

  constructor(private configService: ConfigService) {
    const subscriptionKey = this.configService.get<string>('MTN_MOMO_SUBSCRIPTION_KEY');
    const apiKey = this.configService.get<string>('MTN_MOMO_API_KEY');
    const userId = this.configService.get<string>('MTN_MOMO_API_USER_ID');
    const baseUrl = this.configService.get<string>('MTN_MOMO_BASE_URL');
    const demoMode = this.configService.get<string>('DEMO_PAYMENT') === 'true';

    if (!subscriptionKey || !apiKey || !userId || !baseUrl) {
      throw new Error('Configuration MTN Mobile Money manquante. Vérifiez les variables d\'environnement.');
    }

    this.config = {
      subscriptionKey,
      apiKey,
      userId,
      targetEnvironment: this.configService.get<string>('NODE_ENV') === 'production' ? 'production' : 'sandbox',
      providerCallbackHost: baseUrl,
      baseUrl: this.configService.get<string>('NODE_ENV') === 'production' 
        ? 'https://proxy.momoapi.mtn.com'
        : 'https://sandbox.momodeveloper.mtn.com'
    };

    // Mode démo pour les tests
    this.demoMode = demoMode;
    this.logger.log(`Mode démo MTN Mobile Money: ${this.demoMode ? 'activé' : 'désactivé'}`);
  }

  /**
   * Obtenir un token d'accès pour l'API MTN
   */
  private async getAccessToken(): Promise<string> {
    try {
      const auth = Buffer.from(`${this.config.userId}:${this.config.apiKey}`).toString('base64');
      
      const response = await fetch(`${this.config.baseUrl}/collection/token/`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'X-Reference-Id': this.generateReferenceId(),
          'X-Target-Environment': this.config.targetEnvironment,
          'Ocp-Apim-Subscription-Key': this.config.subscriptionKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur d'authentification MTN: ${response.status}`);
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      this.logger.error('Erreur lors de l\'obtention du token MTN:', error);
      throw error;
    }
  }

  /**
   * Vérifier si un compte est actif
   */
  async isAccountActive(phoneNumber: string): Promise<boolean> {
    try {
      const token = await this.getAccessToken();
      const referenceId = this.generateReferenceId();

      const response = await fetch(
        `${this.config.baseUrl}/collection/v1_0/accountholder/msisdn/${phoneNumber}/active`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Reference-Id': referenceId,
            'X-Target-Environment': this.config.targetEnvironment,
            'Ocp-Apim-Subscription-Key': this.config.subscriptionKey
          }
        }
      );

      return response.ok;
    } catch (error) {
      this.logger.error('Erreur lors de la vérification du compte:', error);
      return false;
    }
  }

  /**
   * Initier un paiement MTN Mobile Money
   */
  async initiatePayment(paymentRequest: MTNPaymentRequest): Promise<MTNPaymentResponse> {
    try {
      // En mode démo, simuler une réponse réussie sans appeler l'API MTN
      if (this.demoMode) {
        this.logger.log('Mode démo activé - Simulation du paiement MTN');
        return {
          status: true,
          message: 'Paiement MTN Mobile Money traité avec succès (Mode démo)',
          transactionId: `MTN_DEMO_${Date.now()}`,
          externalId: paymentRequest.externalId
        };
      }

      // Vérifier si le compte est actif
      const isActive = await this.isAccountActive(paymentRequest.payer.partyId);
      if (!isActive) {
        return {
          status: false,
          message: 'Le numéro de téléphone n\'est pas actif sur MTN Mobile Money'
        };
      }

      const token = await this.getAccessToken();
      const referenceId = this.generateReferenceId();

      const response = await fetch(`${this.config.baseUrl}/collection/v1_0/requesttopay`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Reference-Id': referenceId,
          'X-Target-Environment': this.config.targetEnvironment,
          'Ocp-Apim-Subscription-Key': this.config.subscriptionKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: paymentRequest.amount.toString(),
          currency: paymentRequest.currency,
          externalId: paymentRequest.externalId,
          payer: paymentRequest.payer,
          payerMessage: paymentRequest.payerMessage,
          payeeNote: paymentRequest.payeeNote
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        this.logger.error('Erreur MTN API:', errorData);
        return {
          status: false,
          message: `Erreur MTN: ${errorData.message || 'Erreur inconnue'}`
        };
      }

      // Vérifier le statut du paiement
      const paymentStatus = await this.getPaymentStatus(referenceId);
      
      return {
        status: paymentStatus.status === 'SUCCESSFUL',
        message: paymentStatus.status === 'SUCCESSFUL' 
          ? 'Paiement MTN Mobile Money traité avec succès'
          : `Statut du paiement: ${paymentStatus.status}`,
        transactionId: referenceId,
        externalId: paymentRequest.externalId
      };

    } catch (error) {
      this.logger.error('Erreur lors du paiement MTN:', error);
      return {
        status: false,
        message: `Erreur lors du paiement: ${error.message}`
      };
    }
  }

  /**
   * Vérifier le statut d'un paiement
   */
  private async getPaymentStatus(referenceId: string): Promise<any> {
    try {
      const token = await this.getAccessToken();

      const response = await fetch(
        `${this.config.baseUrl}/collection/v1_0/requesttopay/${referenceId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Target-Environment': this.config.targetEnvironment,
            'Ocp-Apim-Subscription-Key': this.config.subscriptionKey
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur lors de la vérification du statut: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      this.logger.error('Erreur lors de la vérification du statut:', error);
      return { status: 'UNKNOWN' };
    }
  }

  /**
   * Générer un ID de référence unique
   */
  private generateReferenceId(): string {
    return `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
} 