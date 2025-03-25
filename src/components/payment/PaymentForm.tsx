
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { PhoneNumberInput } from './PhoneNumberInput'; 
import { CardPaymentForm } from './CardPaymentForm';
import { CashDeliveryInfo } from './CashDeliveryInfo';
import { PaymentSummary } from './PaymentSummary';
import { PaymentButton } from './PaymentButton';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import { paymentService } from '@/services/apiService';

export interface PaymentFormProps {
  amount: number;
  orderId?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onPaymentComplete?: () => void;
  description?: string;
}

const operators = [
  { value: "mtn", label: "MTN Mobile Money", icon: "🟡" },
  { value: "airtel", label: "Airtel Money", icon: "🔴" },
  { value: "orange", label: "Orange Money", icon: "🟠" },
];

export const PaymentForm: React.FC<PaymentFormProps> = ({ 
  amount, 
  orderId,
  onSuccess, 
  onError,
  onPaymentComplete,
  description = "Paiement"
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [operator, setOperator] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saveMethod, setSaveMethod] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'mobile' | 'card' | 'cashdelivery'>('mobile');
  const [openOperatorSelect, setOpenOperatorSelect] = useState(false);
  const { toast } = useToast();

  const validatePhoneNumber = (number: string) => {
    const regex = /^[0-9]{9}$/;
    return regex.test(number);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    if (rawValue.length <= 9) {
      setPhoneNumber(rawValue);
    }
  };

  const handlePayment = async () => {
    try {
      setError(null);
      setIsProcessing(true);

      if (paymentMethod === 'mobile') {
        if (!phoneNumber || !operator) {
          throw new Error('Veuillez remplir tous les champs');
        }

        if (!/^[0-9]{9}$/.test(phoneNumber.replace(/\s/g, ''))) {
          throw new Error('Numéro de téléphone invalide (9 chiffres requis)');
        }
      }

      // Simuler un traitement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Créer un enregistrement de paiement
      if (orderId) {
        const { data, error } = await paymentService.create({
          order_id: orderId,
          amount,
          payment_method: paymentMethod,
          payment_provider: paymentMethod === 'mobile' ? operator : 
                           paymentMethod === 'card' ? 'card' : 'cash',
          status: paymentMethod === 'cashdelivery' ? 'pending' : 'completed',
          metadata: paymentMethod === 'mobile' ? { phone_number: phoneNumber } : {}
        });
        
        if (error) throw error;
      }
      
      // Sauvegarder la méthode de paiement si demandé
      if (saveMethod && paymentMethod !== 'cashdelivery') {
        // Logique pour sauvegarder la méthode de paiement
        console.log('Méthode de paiement sauvegardée');
      }

      toast({
        title: "Paiement réussi",
        description: `${description} a été traité avec succès`,
      });

      if (onSuccess) onSuccess();
      if (onPaymentComplete) onPaymentComplete();

    } catch (error) {
      console.error('Erreur de paiement:', error);
      setError(error instanceof Error ? error.message : "Une erreur est survenue");
      toast({
        title: "Erreur de paiement",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      });
      if (onError) onError(error instanceof Error ? error : new Error('Unknown error'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <PaymentMethodSelector 
          paymentMethod={paymentMethod} 
          setPaymentMethod={setPaymentMethod} 
        />

        {paymentMethod === 'mobile' && (
          <PhoneNumberInput
            phoneNumber={phoneNumber}
            operator={operator}
            handleInputChange={handleInputChange}
            openOperatorSelect={openOperatorSelect}
            setOpenOperatorSelect={setOpenOperatorSelect}
            setOperator={setOperator}
            operators={operators}
          />
        )}

        {paymentMethod === 'card' && <CardPaymentForm />}

        {paymentMethod === 'cashdelivery' && <CashDeliveryInfo />}

        <PaymentSummary 
          amount={amount} 
          saveMethod={saveMethod} 
          setSaveMethod={setSaveMethod} 
        />

        <PaymentButton 
          isProcessing={isProcessing} 
          handlePayment={handlePayment} 
        />
      </div>
    </div>
  );
};
