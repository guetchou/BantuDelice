import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Phone, CreditCard, AlertCircle, QrCode, ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface MobilePaymentProps {
  amount: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onPaymentComplete?: () => void;
  savePaymentMethod?: boolean;
  description?: string; // Ajout de la prop description qui était manquante
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
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Paiement</h3>
        <p className="text-sm text-muted-foreground">
          {description || "Choisissez votre méthode de paiement préférée"}
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="flex space-x-2">
          <Button 
            type="button" 
            variant={paymentMethod === 'mobile' ? 'default' : 'outline'} 
            className="flex-1"
            onClick={() => setPaymentMethod('mobile')}
          >
            <Phone className="h-4 w-4 mr-2" />
            Mobile Money
          </Button>
          <Button 
            type="button" 
            variant={paymentMethod === 'card' ? 'default' : 'outline'} 
            className="flex-1"
            onClick={() => setPaymentMethod('card')}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Carte Bancaire
          </Button>
          <Button 
            type="button" 
            variant={paymentMethod === 'cashdelivery' ? 'default' : 'outline'} 
            className="flex-1"
            onClick={() => setPaymentMethod('cashdelivery')}
          >
            <QrCode className="h-4 w-4 mr-2" />
            À la livraison
          </Button>
        </div>

        {paymentMethod === 'mobile' && (
          <>
            <div>
              <Label className="text-sm font-medium block mb-1">
                Opérateur
              </Label>
              <Popover open={openOperatorSelect} onOpenChange={setOpenOperatorSelect}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openOperatorSelect}
                    className="w-full justify-between"
                  >
                    {operator
                      ? operators.find((op) => op.value === operator)?.label
                      : "Sélectionnez un opérateur"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Rechercher un opérateur..." />
                    <CommandEmpty>Aucun opérateur trouvé.</CommandEmpty>
                    <CommandGroup>
                      {operators.map((op) => (
                        <CommandItem
                          key={op.value}
                          value={op.value}
                          onSelect={(currentValue) => {
                            setOperator(currentValue === operator ? "" : currentValue);
                            setOpenOperatorSelect(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              operator === op.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <span className="mr-2">{op.icon}</span>
                          {op.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

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
                maxLength={13}
              />
              <p className="text-xs text-gray-500 mt-1">Format: XXX XXX XXX</p>
            </div>
          </>
        )}

        {paymentMethod === 'card' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="cardNumber" className="text-sm font-medium block mb-1">
                Numéro de carte
              </label>
              <Input
                id="cardNumber"
                type="text"
                placeholder="4242 4242 4242 4242"
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiryDate" className="text-sm font-medium block mb-1">
                  Date d'expiration
                </label>
                <Input
                  id="expiryDate"
                  type="text"
                  placeholder="MM/YY"
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="cvv" className="text-sm font-medium block mb-1">
                  Code de sécurité
                </label>
                <Input
                  id="cvv"
                  type="text"
                  placeholder="123"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'cashdelivery' && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-start space-x-3">
              <QrCode className="w-6 h-6 text-primary" />
              <div>
                <p className="font-medium">Paiement à la livraison</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Un code QR sera généré pour votre livraison. Le livreur scannera ce code pour confirmer le paiement. Cela permet d'éviter les fraudes et d'assurer la sécurité des transactions.
                </p>
              </div>
            </div>
          </div>
        )}

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
