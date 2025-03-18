
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Phone, CreditCard, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export interface MobilePaymentProps {
  amount: number;
  description?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onPaymentComplete?: () => void;
  savePaymentMethod?: boolean;
}

const MobilePayment = ({ 
  amount, 
  description, 
  onSuccess, 
  onError,
  onPaymentComplete,
  savePaymentMethod
}: MobilePaymentProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [operator, setOperator] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saveMethod, setSaveMethod] = useState(savePaymentMethod || false);
  const { toast } = useToast();

  const validatePhoneNumber = (number: string) => {
    const regex = /^[0-9]{9}$/;
    return regex.test(number);
  };

  const formatPhoneNumber = (number: string) => {
    // Format en groupes de 3 chiffres
    if (number.length <= 3) return number;
    if (number.length <= 6) return `${number.slice(0, 3)} ${number.slice(3)}`;
    return `${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6, 9)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Garder seulement les chiffres
    const rawValue = e.target.value.replace(/\D/g, '');
    if (rawValue.length <= 9) {
      setPhoneNumber(rawValue);
    }
  };

  const handlePayment = async () => {
    try {
      setError(null);
      setIsProcessing(true);

      // Validation
      if (!phoneNumber || !operator) {
        throw new Error('Veuillez remplir tous les champs');
      }

      if (!validatePhoneNumber(phoneNumber)) {
        throw new Error('Numéro de téléphone invalide (9 chiffres requis)');
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      // Create payment record
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          amount,
          payment_method_id: operator === 'mtn' ? 'mobile_mtn' : 'mobile_airtel',
          status: 'pending',
          description,
          metadata: {
            phone_number: phoneNumber,
            operator
          }
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Si l'utilisateur veut sauvegarder la méthode de paiement
      // Cette fonctionnalité sera implémentée ultérieurement quand la table sera disponible
      if (saveMethod) {
        console.log("Sauvegarde de la méthode de paiement demandée - à implémenter");
        // Nous allons simuler une sauvegarde réussie sans accéder à une table qui n'existe pas
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update payment status
      const { error: updateError } = await supabase
        .from('payments')
        .update({ status: 'completed' })
        .eq('id', payment.id);

      if (updateError) throw updateError;

      toast({
        title: "Paiement réussi",
        description: "Votre paiement a été traité avec succès",
      });

      onSuccess?.();
      onPaymentComplete?.();

    } catch (error) {
      console.error('Erreur de paiement:', error);
      setError(error instanceof Error ? error.message : "Une erreur est survenue");
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
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Paiement Mobile</h3>
        <p className="text-sm text-muted-foreground">
          {description || 'Veuillez choisir votre opérateur et entrer votre numéro de téléphone'}
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <Select
          value={operator}
          onValueChange={setOperator}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionnez un opérateur" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mtn">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                MTN Mobile Money
              </div>
            </SelectItem>
            <SelectItem value="airtel">
              <div className="flex items-center">
                <CreditCard className="w-4 h-4 mr-2" />
                Airtel Money
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        <div>
          <label htmlFor="phone" className="text-sm font-medium block mb-1">
            Numéro de téléphone
          </label>
          <Input
            id="phone"
            type="tel"
            placeholder="Entrez 9 chiffres"
            value={formatPhoneNumber(phoneNumber)}
            onChange={handleInputChange}
            className="w-full"
            maxLength={13} // 9 chiffres + espaces
          />
          <p className="text-xs text-gray-500 mt-1">Format: XXX XXX XXX</p>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="saveMethod" 
            checked={saveMethod} 
            onCheckedChange={(checked) => setSaveMethod(!!checked)} 
          />
          <Label htmlFor="saveMethod" className="text-sm">
            Enregistrer ce mode de paiement
          </Label>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex justify-between text-sm">
            <span>Montant à payer:</span>
            <span className="font-semibold">{amount.toLocaleString()} FCFA</span>
          </div>
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
    </div>
  );
};

export default MobilePayment;
