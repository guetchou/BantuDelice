
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

// Import new component files
import PaymentMethodSelector from './PaymentMethodSelector';
import PhoneNumberInput from './PhoneNumberInput';
import CardPaymentForm from './CardPaymentForm';
import CashDeliveryInfo from './CashDeliveryInfo';
import PaymentSummary from './PaymentSummary';
import PaymentButton from './PaymentButton';

export interface MobilePaymentProps {
  amount: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onPaymentComplete?: () => void;
  savePaymentMethod?: boolean;
  description?: string;
}

// Mobile network operators
const operators = [
  { value: "mtn", label: "MTN Mobile Money", icon: "🟡" },
  { value: "airtel", label: "Airtel Money", icon: "🔴" },
  { value: "orange", label: "Orange Money", icon: "🟠" },
];

const MobilePayment = ({ 
  amount, 
  onSuccess, 
  onError,
  onPaymentComplete,
  savePaymentMethod,
  description
}: MobilePaymentProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [operator, setOperator] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saveMethod, setSaveMethod] = useState(savePaymentMethod || false);
  const [paymentMethod, setPaymentMethod] = useState<'mobile' | 'card' | 'cashdelivery'>('mobile');
  const [openOperatorSelect, setOpenOperatorSelect] = useState(false);
  const { toast } = useToast();

  const validatePhoneNumber = (number: string) => {
    const regex = /^[0-9]{9}$/;
    return regex.test(number);
  };

  const formatPhoneNumber = (number: string) => {
    if (number.length <= 3) return number;
    if (number.length <= 6) return `${number.slice(0, 3)} ${number.slice(3)}`;
    return `${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6, 9)}`;
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

        if (!/^[0-9]{9}$/.test(phoneNumber)) {
          throw new Error('Numéro de téléphone invalide (9 chiffres requis)');
        }
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const userId = "user123";
      const paymentId = "payment-" + Date.now();
      const paymentMethodId = paymentMethod === 'mobile' 
        ? `mobile_${operator}`
        : paymentMethod === 'card'
          ? 'card'
          : 'cash_delivery';
      
      if (saveMethod && paymentMethod === 'mobile') {
        console.log('Saving payment method:', {
          user_id: userId,
          payment_type: paymentMethod,
          provider: operator,
          last_four: phoneNumber.slice(-4),
          is_default: false,
          metadata: { phone_number: phoneNumber },
          last_used: new Date().toISOString()
        });
      }

      toast({
        title: "Paiement réussi",
        description: `${description || "Votre paiement a été traité avec succès"}`,
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
            phoneNumber={formatPhoneNumber(phoneNumber)}
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

export default MobilePayment;
