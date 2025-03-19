
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MobilePaymentProps {
  amount: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

const MobilePayment = ({ amount, onSuccess, onError }: MobilePaymentProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [operator, setOperator] = useState('');
  const { toast } = useToast();

  const handlePayment = async () => {
    try {
      setIsProcessing(true);

      // Validation
      if (!phoneNumber || !operator) {
        throw new Error('Veuillez remplir tous les champs');
      }

      if (!/^[0-9]{9}$/.test(phoneNumber)) {
        throw new Error('Numéro de téléphone invalide');
      }

      // Mock API call - in a real app this would be an API call to your backend
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Paiement réussi",
        description: "Votre paiement a été traité avec succès",
      });

      onSuccess?.();

    } catch (error) {
      console.error('Erreur de paiement:', error);
      toast({
        title: "Erreur de paiement",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      });
      onError?.(error instanceof Error ? error : new Error('Unknown error'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <Select
        value={operator}
        onValueChange={setOperator}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionnez un opérateur" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="mtn">MTN Mobile Money</SelectItem>
          <SelectItem value="airtel">Airtel Money</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="tel"
        placeholder="Numéro de téléphone (9 chiffres)"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        maxLength={9}
      />

      <div className="text-sm text-gray-500 mb-4">
        Montant à payer: {amount} FCFA
      </div>

      <Button
        className="w-full"
        onClick={handlePayment}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Traitement en cours...
          </>
        ) : (
          'Payer maintenant'
        )}
      </Button>
    </div>
  );
};

export default MobilePayment;
