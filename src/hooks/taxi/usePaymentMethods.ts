
import { useState } from 'react';
import { toast } from 'sonner';

export interface PaymentMethod {
  id: string;
  type: 'card' | 'mobile_money' | 'cash' | 'wallet' | 'qr_code';
  details: {
    name?: string;
    number?: string;
    provider?: string;
    expiry?: string;
    isDefault?: boolean;
    lastUsed?: string;
  };
}

export function usePaymentMethods() {
  const [isLoading, setIsLoading] = useState(false);
  const [savedMethods, setSavedMethods] = useState<PaymentMethod[]>([
    {
      id: 'mm1',
      type: 'mobile_money',
      details: {
        name: 'Orange Money',
        number: '076*****78',
        provider: 'Orange',
        isDefault: true,
        lastUsed: '2023-11-15'
      }
    },
    {
      id: 'card1',
      type: 'card',
      details: {
        name: 'Visa ****5678',
        number: '****5678',
        expiry: '03/26',
        isDefault: false,
        lastUsed: '2023-10-05'
      }
    }
  ]);
  
  const addPaymentMethod = async (method: Omit<PaymentMethod, 'id'>): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulons un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newMethod: PaymentMethod = {
        ...method,
        id: `method-${Date.now()}`,
      };
      
      setSavedMethods(prev => [...prev, newMethod]);
      
      toast.success('Moyen de paiement ajouté avec succès');
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du moyen de paiement:', error);
      toast.error('Erreur lors de l\'ajout du moyen de paiement');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const removePaymentMethod = async (methodId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulons un délai d'API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSavedMethods(prev => prev.filter(method => method.id !== methodId));
      
      toast.success('Moyen de paiement supprimé');
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du moyen de paiement:', error);
      toast.error('Erreur lors de la suppression');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const setDefaultPaymentMethod = async (methodId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulons un délai d'API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSavedMethods(prev => prev.map(method => ({
        ...method,
        details: {
          ...method.details,
          isDefault: method.id === methodId
        }
      })));
      
      toast.success('Moyen de paiement par défaut mis à jour');
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du moyen de paiement par défaut:', error);
      toast.error('Erreur lors de la mise à jour');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const processPayment = async (
    amount: number,
    methodId: string,
    description?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulons un délai d'API et une chance de 90% de succès
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const success = Math.random() > 0.1;
      
      if (!success) {
        throw new Error('Payment failed');
      }
      
      // Mise à jour de lastUsed pour la méthode utilisée
      setSavedMethods(prev => prev.map(method => {
        if (method.id === methodId) {
          return {
            ...method,
            details: {
              ...method.details,
              lastUsed: new Date().toISOString().split('T')[0]
            }
          };
        }
        return method;
      }));
      
      toast.success('Paiement effectué avec succès');
      return true;
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      toast.error('Échec du paiement. Veuillez réessayer.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    savedMethods,
    isLoading,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    processPayment
  };
}
