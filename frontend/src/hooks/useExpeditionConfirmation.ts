import { useState, useCallback } from 'react';
import { expeditionConfirmationService, ConfirmationResponse } from '@/services/expeditionConfirmationService';
import { useToast } from '@/hooks/use-toast';

interface ExpeditionConfirmationData {
  trackingNumber: string;
  expeditionId: string;
  paymentMethod: string;
  paymentReference: string;
  expeditionData: {
    sender: string;
    recipient: string;
    origin: string;
    destination: string;
    amount: number;
    recipientEmail?: string;
    recipientPhone?: string;
  };
}

interface UseExpeditionConfirmationReturn {
  // État
  isConfirming: boolean;
  isConfirmed: boolean;
  hasError: boolean;
  error: string | null;
  confirmationData: any | null;
  retryCount: number;
  
  // Actions
  confirmExpedition: (data: ExpeditionConfirmationData) => Promise<boolean>;
  retryConfirmation: () => Promise<boolean>;
  resetConfirmation: () => void;
  checkConfirmationStatus: (trackingNumber: string) => Promise<boolean>;
}

export const useExpeditionConfirmation = (): UseExpeditionConfirmationReturn => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationData, setConfirmationData] = useState<any | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  const confirmExpedition = useCallback(async (data: ExpeditionConfirmationData): Promise<boolean> => {
    setIsConfirming(true);
    setHasError(false);
    setError(null);
    setRetryCount(0);

    try {
      console.log(`🚀 Début confirmation expédition: ${data.trackingNumber}`);
      
      const response = await expeditionConfirmationService.confirmExpedition({
        trackingNumber: data.trackingNumber,
        expeditionId: data.expeditionId,
        paymentMethod: data.paymentMethod,
        paymentReference: data.paymentReference
      });

      if (response.success && response.data) {
        setConfirmationData(response.data);
        setIsConfirmed(true);
        setHasError(false);
        setError(null);
        
        // Envoi automatique des notifications
        await sendNotifications(data);
        
        toast({
          title: 'Expédition confirmée !',
          description: 'Votre expédition a été confirmée avec succès.',
          variant: 'default'
        });

        return true;
      } else {
        throw new Error(response.error || 'Erreur lors de la confirmation');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      setHasError(true);
      setIsConfirmed(false);
      
      toast({
        title: 'Erreur de confirmation',
        description: errorMessage,
        variant: 'destructive'
      });

      return false;
    } finally {
      setIsConfirming(false);
    }
  }, [toast]);

  const retryConfirmation = useCallback(async (): Promise<boolean> => {
    if (!confirmationData) {
      setError('Aucune donnée de confirmation disponible pour la nouvelle tentative');
      return false;
    }

    setRetryCount(prev => prev + 1);
    setIsConfirming(true);
    setHasError(false);
    setError(null);

    try {
      console.log(`🔄 Nouvelle tentative de confirmation #${retryCount + 1}`);
      
      const response = await expeditionConfirmationService.confirmExpedition({
        trackingNumber: confirmationData.trackingNumber,
        expeditionId: confirmationData.expeditionId,
        paymentMethod: confirmationData.paymentMethod,
        paymentReference: confirmationData.paymentReference
      });

      if (response.success && response.data) {
        setConfirmationData(response.data);
        setIsConfirmed(true);
        setHasError(false);
        setError(null);
        
        toast({
          title: 'Confirmation réussie !',
          description: 'La nouvelle tentative a fonctionné.',
          variant: 'default'
        });

        return true;
      } else {
        throw new Error(response.error || 'Erreur lors de la nouvelle tentative');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      setHasError(true);
      setIsConfirmed(false);
      
      toast({
        title: 'Échec de la nouvelle tentative',
        description: errorMessage,
        variant: 'destructive'
      });

      return false;
    } finally {
      setIsConfirming(false);
    }
  }, [confirmationData, retryCount, toast]);

  const checkConfirmationStatus = useCallback(async (trackingNumber: string): Promise<boolean> => {
    try {
      console.log(`🔍 Vérification du statut: ${trackingNumber}`);
      
      const response = await expeditionConfirmationService.checkConfirmationStatus(trackingNumber);
      
      if (response.success && response.data) {
        setConfirmationData(response.data);
        setIsConfirmed(response.data.status === 'confirmed');
        setHasError(response.data.status === 'failed');
        setError(response.data.status === 'failed' ? 'La confirmation a échoué' : null);
        
        return response.data.status === 'confirmed';
      } else {
        setError('Impossible de vérifier le statut de confirmation');
        setHasError(true);
        setIsConfirmed(false);
        return false;
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la vérification';
      setError(errorMessage);
      setHasError(true);
      setIsConfirmed(false);
      return false;
    }
  }, []);

  const resetConfirmation = useCallback(() => {
    setIsConfirming(false);
    setIsConfirmed(false);
    setHasError(false);
    setError(null);
    setConfirmationData(null);
    setRetryCount(0);
  }, []);

  const sendNotifications = async (data: ExpeditionConfirmationData) => {
    try {
      // Notification par email
      if (data.expeditionData.recipientEmail) {
        await expeditionConfirmationService.sendConfirmationNotification(
          data.trackingNumber,
          data.expeditionData.recipientEmail
        );
      }

      // Notification par SMS
      if (data.expeditionData.recipientPhone) {
        await expeditionConfirmationService.sendConfirmationNotification(
          data.trackingNumber,
          undefined,
          data.expeditionData.recipientPhone
        );
      }
    } catch (error) {
      console.error('Erreur envoi notifications:', error);
      // Ne pas faire échouer la confirmation pour une erreur de notification
    }
  };

  return {
    // État
    isConfirming,
    isConfirmed,
    hasError,
    error,
    confirmationData,
    retryCount,
    
    // Actions
    confirmExpedition,
    retryConfirmation,
    resetConfirmation,
    checkConfirmationStatus
  };
}; 