
import { useState } from 'react';
import { toast } from 'sonner';

export type PaymentStatus = 
  | 'not_started'
  | 'pre_authorized'
  | 'authorized'
  | 'captured'
  | 'refunded'
  | 'failed';

export interface PaymentAuthorizationResult {
  success: boolean;
  transactionId?: string;
  authorizationId?: string;
  status: PaymentStatus;
  message: string;
  amount: number;
  timestamp: string;
}

export interface CaptureOptions {
  finalAmount: number;
  tip?: number;
  requireConfirmation?: boolean;
  confirmationThreshold?: number;
}

/**
 * Hook pour la gestion des pré-autorisations de paiement
 */
export function usePaymentAuthorization() {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('not_started');
  const [authorizationId, setAuthorizationId] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [authorizedAmount, setAuthorizedAmount] = useState<number>(0);

  /**
   * Pré-autorise un montant sur le moyen de paiement
   */
  const preAuthorizePayment = async (
    amount: number,
    paymentMethod: string,
    currency: string = 'FCFA',
    customerId?: string
  ): Promise<PaymentAuthorizationResult> => {
    setIsLoading(true);
    
    try {
      // Simulation d'un appel API pour la pré-autorisation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Générer des IDs fictifs pour la démonstration
      const mockAuthId = `auth_${Date.now()}`;
      const mockTxnId = `txn_${Date.now()}`;
      
      // Mettre à jour l'état
      setAuthorizationId(mockAuthId);
      setTransactionId(mockTxnId);
      setAuthorizedAmount(amount);
      setPaymentStatus('pre_authorized');
      
      // Retourner le résultat
      const result: PaymentAuthorizationResult = {
        success: true,
        authorizationId: mockAuthId,
        transactionId: mockTxnId,
        status: 'pre_authorized',
        message: `Montant de ${amount} ${currency} pré-autorisé avec succès`,
        amount,
        timestamp: new Date().toISOString()
      };
      
      toast.success('Paiement pré-autorisé', {
        description: `Un montant de ${amount} ${currency} a été pré-autorisé`
      });
      
      return result;
    } catch (error) {
      console.error('Erreur lors de la pré-autorisation du paiement:', error);
      
      // Mettre à jour l'état
      setPaymentStatus('failed');
      
      // Retourner l'erreur
      const result: PaymentAuthorizationResult = {
        success: false,
        status: 'failed',
        message: 'Échec de la pré-autorisation du paiement',
        amount,
        timestamp: new Date().toISOString()
      };
      
      toast.error('Échec de la pré-autorisation', {
        description: 'Impossible de pré-autoriser le paiement'
      });
      
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Capture le paiement pré-autorisé (débit effectif)
   */
  const capturePayment = async (
    options: CaptureOptions
  ): Promise<PaymentAuthorizationResult> => {
    if (!authorizationId) {
      const result: PaymentAuthorizationResult = {
        success: false,
        status: 'failed',
        message: 'Aucune pré-autorisation active',
        amount: 0,
        timestamp: new Date().toISOString()
      };
      
      toast.error('Échec de la capture', {
        description: 'Aucune pré-autorisation active'
      });
      
      return result;
    }
    
    setIsLoading(true);
    
    try {
      const { finalAmount, tip = 0, requireConfirmation = true, confirmationThreshold = 15 } = options;
      
      // Calculer la différence en pourcentage
      const difference = finalAmount - authorizedAmount;
      const percentageDifference = (difference / authorizedAmount) * 100;
      
      // Si la différence est supérieure au seuil et la confirmation est requise
      if (requireConfirmation && percentageDifference > confirmationThreshold) {
        // Dans une implémentation réelle, on demanderait confirmation à l'utilisateur
        // Ici, on simule une confirmation automatique
        
        toast.info('Montant final supérieur à l\'estimation', {
          description: `Le montant final est supérieur de ${percentageDifference.toFixed(1)}% à l'estimation. Confirmation requise.`,
          action: {
            label: 'Confirmer',
            onClick: () => {
              toast.success('Paiement confirmé', {
                description: 'Le paiement a été autorisé pour le montant final'
              });
            }
          }
        });
        
        // Simuler un délai pour la confirmation
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Simulation d'un appel API pour la capture
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mettre à jour l'état
      setPaymentStatus('captured');
      
      // Retourner le résultat
      const totalAmount = finalAmount + tip;
      const result: PaymentAuthorizationResult = {
        success: true,
        authorizationId,
        transactionId,
        status: 'captured',
        message: `Paiement de ${totalAmount} FCFA capturé avec succès`,
        amount: totalAmount,
        timestamp: new Date().toISOString()
      };
      
      toast.success('Paiement effectué', {
        description: `Un montant de ${totalAmount} FCFA a été débité`
      });
      
      return result;
    } catch (error) {
      console.error('Erreur lors de la capture du paiement:', error);
      
      // Mettre à jour l'état
      setPaymentStatus('failed');
      
      // Retourner l'erreur
      const result: PaymentAuthorizationResult = {
        success: false,
        authorizationId,
        transactionId,
        status: 'failed',
        message: 'Échec de la capture du paiement',
        amount: authorizedAmount,
        timestamp: new Date().toISOString()
      };
      
      toast.error('Échec du paiement', {
        description: 'Impossible de finaliser le paiement'
      });
      
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Rembourse un paiement capturé
   */
  const refundPayment = async (
    amount?: number,
    reason?: string
  ): Promise<PaymentAuthorizationResult> => {
    if (!transactionId || paymentStatus !== 'captured') {
      const result: PaymentAuthorizationResult = {
        success: false,
        status: 'failed',
        message: 'Aucun paiement capturé à rembourser',
        amount: 0,
        timestamp: new Date().toISOString()
      };
      
      toast.error('Échec du remboursement', {
        description: 'Aucun paiement capturé à rembourser'
      });
      
      return result;
    }
    
    setIsLoading(true);
    
    try {
      // Déterminer le montant à rembourser
      const refundAmount = amount !== undefined ? amount : authorizedAmount;
      
      // Simulation d'un appel API pour le remboursement
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Mettre à jour l'état
      setPaymentStatus('refunded');
      
      // Retourner le résultat
      const result: PaymentAuthorizationResult = {
        success: true,
        transactionId,
        status: 'refunded',
        message: `Remboursement de ${refundAmount} FCFA effectué avec succès`,
        amount: refundAmount,
        timestamp: new Date().toISOString()
      };
      
      toast.success('Remboursement effectué', {
        description: `Un montant de ${refundAmount} FCFA a été remboursé`
      });
      
      return result;
    } catch (error) {
      console.error('Erreur lors du remboursement:', error);
      
      // Retourner l'erreur
      const result: PaymentAuthorizationResult = {
        success: false,
        transactionId,
        status: 'failed',
        message: 'Échec du remboursement',
        amount: amount !== undefined ? amount : authorizedAmount,
        timestamp: new Date().toISOString()
      };
      
      toast.error('Échec du remboursement', {
        description: 'Impossible de procéder au remboursement'
      });
      
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Annule une pré-autorisation
   */
  const cancelPreAuthorization = async (): Promise<PaymentAuthorizationResult> => {
    if (!authorizationId || paymentStatus !== 'pre_authorized') {
      const result: PaymentAuthorizationResult = {
        success: false,
        status: 'failed',
        message: 'Aucune pré-autorisation active à annuler',
        amount: 0,
        timestamp: new Date().toISOString()
      };
      
      toast.error('Échec de l\'annulation', {
        description: 'Aucune pré-autorisation active à annuler'
      });
      
      return result;
    }
    
    setIsLoading(true);
    
    try {
      // Simulation d'un appel API pour l'annulation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mettre à jour l'état
      setPaymentStatus('not_started');
      setAuthorizationId(null);
      setAuthorizedAmount(0);
      
      // Retourner le résultat
      const result: PaymentAuthorizationResult = {
        success: true,
        status: 'not_started',
        message: 'Pré-autorisation annulée avec succès',
        amount: 0,
        timestamp: new Date().toISOString()
      };
      
      toast.success('Pré-autorisation annulée', {
        description: 'La pré-autorisation a été annulée avec succès'
      });
      
      return result;
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la pré-autorisation:', error);
      
      // Retourner l'erreur
      const result: PaymentAuthorizationResult = {
        success: false,
        authorizationId,
        status: 'failed',
        message: 'Échec de l\'annulation de la pré-autorisation',
        amount: authorizedAmount,
        timestamp: new Date().toISOString()
      };
      
      toast.error('Échec de l\'annulation', {
        description: 'Impossible d\'annuler la pré-autorisation'
      });
      
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    paymentStatus,
    authorizationId,
    transactionId,
    authorizedAmount,
    preAuthorizePayment,
    capturePayment,
    refundPayment,
    cancelPreAuthorization
  };
}
