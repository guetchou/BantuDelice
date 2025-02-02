import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { CreditCard, Smartphone } from 'lucide-react';

interface PaymentFormProps {
  amount: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export default function PaymentForm({ amount, onSuccess, onError }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile'>('mobile');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      // Simuler un paiement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Paiement réussi",
        description: "Votre paiement a été traité avec succès",
      });
      
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erreur de paiement",
        description: "Une erreur est survenue lors du paiement",
        variant: "destructive",
      });
      onError?.(error as Error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Paiement Sécurisé</h2>
          <p className="text-gray-500">Montant à payer: {amount.toLocaleString()} FCFA</p>
        </div>

        <div className="space-y-4">
          <div className="flex space-x-4">
            <Button
              type="button"
              variant={paymentMethod === 'mobile' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setPaymentMethod('mobile')}
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Mobile Money
            </Button>
            <Button
              type="button"
              variant={paymentMethod === 'card' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setPaymentMethod('card')}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Carte Bancaire
            </Button>
          </div>

          {paymentMethod === 'mobile' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Opérateur</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un opérateur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                    <SelectItem value="orange">Orange Money</SelectItem>
                    <SelectItem value="moov">Moov Money</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Numéro de téléphone</Label>
                <Input type="tel" placeholder="+243..." />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Numéro de carte</Label>
                <Input type="text" placeholder="4242 4242 4242 4242" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date d'expiration</Label>
                  <Input type="text" placeholder="MM/YY" />
                </div>
                <div className="space-y-2">
                  <Label>CVC</Label>
                  <Input type="text" placeholder="123" />
                </div>
              </div>
            </div>
          )}
        </div>

        <Button
          className="w-full"
          onClick={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? "Traitement en cours..." : "Payer maintenant"}
        </Button>
      </motion.div>
    </Card>
  );
}