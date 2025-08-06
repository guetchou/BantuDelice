import { colisApi } from './colisApi';

export interface ExpeditionConfirmationData {
  trackingNumber: string;
  expeditionId: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: string;
  details?: {
    sender: string;
    recipient: string;
    origin: string;
    destination: string;
    amount: number;
  };
}

export interface ConfirmationResponse {
  success: boolean;
  data?: ExpeditionConfirmationData;
  error?: string;
  message?: string;
  retryCount?: number;
}

class ExpeditionConfirmationService {
  private maxRetries = 3;
  private retryDelay = 2000; // 2 secondes

  /**
   * Confirme une expédition avec retry automatique et gestion d'erreurs robuste
   */
  async confirmExpedition(
    expeditionData: {
      trackingNumber: string;
      expeditionId: string;
      paymentMethod: string;
      paymentReference: string;
    },
    retryCount = 0
  ): Promise<ConfirmationResponse> {
    try {
      console.log(`🔄 Tentative de confirmation d'expédition #${retryCount + 1}/${this.maxRetries + 1}`);
      console.log(`📦 Tracking: ${expeditionData.trackingNumber}`);

      // Appel API avec timeout
      const response = await this.callConfirmationAPI(expeditionData);

      if (response.success) {
        console.log(`✅ Confirmation d'expédition réussie: ${expeditionData.trackingNumber}`);
        return {
          success: true,
          data: response.data,
          message: 'Expédition confirmée avec succès'
        };
      } else {
        throw new Error(response.error || 'Erreur lors de la confirmation');
      }

    } catch (error) {
      console.error(`❌ Erreur confirmation expédition (tentative ${retryCount + 1}):`, error);

      // Retry automatique si possible
      if (retryCount < this.maxRetries) {
        console.log(`⏳ Nouvelle tentative dans ${this.retryDelay}ms...`);
        await this.delay(this.retryDelay);
        return this.confirmExpedition(expeditionData, retryCount + 1);
      }

      // Échec définitif
      return {
        success: false,
        error: this.getErrorMessage(error),
        message: 'Impossible de confirmer l\'expédition. Veuillez réessayer.',
        retryCount: retryCount + 1
      };
    }
  }

  /**
   * Appel API avec timeout et gestion d'erreurs
   */
  private async callConfirmationAPI(expeditionData: any): Promise<ConfirmationResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 secondes timeout

    try {
      const response = await colisApi.createExpedition({
        trackingNumber: expeditionData.trackingNumber,
        expeditionId: expeditionData.expeditionId,
        paymentMethod: expeditionData.paymentMethod,
        paymentReference: expeditionData.paymentReference,
        status: 'confirmed'
      }, controller.signal);

      clearTimeout(timeoutId);

      if (response.success) {
        return {
          success: true,
          data: {
            trackingNumber: expeditionData.trackingNumber,
            expeditionId: expeditionData.expeditionId,
            status: 'confirmed',
            timestamp: new Date().toISOString(),
            details: response.data
          }
        };
      } else {
        return {
          success: false,
          error: response.error || 'Erreur API',
          message: response.message
        };
      }

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Timeout: La confirmation a pris trop de temps');
      }
      
      throw error;
    }
  }

  /**
   * Vérifie le statut d'une confirmation
   */
  async checkConfirmationStatus(trackingNumber: string): Promise<ConfirmationResponse> {
    try {
      console.log(`🔍 Vérification du statut: ${trackingNumber}`);
      
      const response = await colisApi.trackColis(trackingNumber);
      
      if (response.success) {
        return {
          success: true,
          data: {
            trackingNumber,
            expeditionId: response.data?.expeditionId || '',
            status: response.data?.status === 'confirmed' ? 'confirmed' : 'pending',
            timestamp: new Date().toISOString(),
            details: response.data
          }
        };
      } else {
        return {
          success: false,
          error: 'Statut non trouvé',
          message: 'Impossible de vérifier le statut de confirmation'
        };
      }

    } catch (error) {
      console.error(`❌ Erreur vérification statut:`, error);
      return {
        success: false,
        error: this.getErrorMessage(error),
        message: 'Erreur lors de la vérification du statut'
      };
    }
  }

  /**
   * Envoie une notification de confirmation
   */
  async sendConfirmationNotification(
    trackingNumber: string,
    recipientEmail?: string,
    recipientPhone?: string
  ): Promise<boolean> {
    try {
      console.log(`📧 Envoi notification confirmation: ${trackingNumber}`);
      
      const notificationData = {
        trackingNumber,
        recipientEmail,
        recipientPhone,
        type: 'confirmation',
        message: `Votre expédition ${trackingNumber} a été confirmée avec succès.`
      };

      const response = await colisApi.sendNotification(notificationData);
      return response.success;

    } catch (error) {
      console.error(`❌ Erreur envoi notification:`, error);
      return false;
    }
  }

  /**
   * Génère un reçu de confirmation
   */
  generateConfirmationReceipt(confirmationData: ExpeditionConfirmationData): string {
    const receipt = `
      ========================================
      RECU DE CONFIRMATION D'EXPÉDITION
      ========================================
      
      Numéro de tracking: ${confirmationData.trackingNumber}
      ID Expédition: ${confirmationData.expeditionId}
      Statut: ${confirmationData.status.toUpperCase()}
      Date: ${new Date(confirmationData.timestamp).toLocaleString('fr-FR')}
      
      ${confirmationData.details ? `
      Détails:
      - Expéditeur: ${confirmationData.details.sender}
      - Destinataire: ${confirmationData.details.recipient}
      - De: ${confirmationData.details.origin}
      - Vers: ${confirmationData.details.destination}
      - Montant: ${confirmationData.details.amount.toLocaleString()} FCFA
      ` : ''}
      
      ========================================
      BantuDelice - Service de livraison
      ========================================
    `;
    
    return receipt;
  }

  /**
   * Gestionnaire d'erreurs centralisé
   */
  private getErrorMessage(error: any): string {
    if (error.message?.includes('Timeout')) {
      return 'La confirmation a pris trop de temps. Vérifiez votre connexion.';
    }
    
    if (error.message?.includes('Network')) {
      return 'Erreur de connexion réseau. Vérifiez votre internet.';
    }
    
    if (error.message?.includes('API')) {
      return 'Erreur du serveur. Veuillez réessayer plus tard.';
    }
    
    return error.message || 'Erreur inconnue lors de la confirmation';
  }

  /**
   * Délai pour les retry
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const expeditionConfirmationService = new ExpeditionConfirmationService(); 