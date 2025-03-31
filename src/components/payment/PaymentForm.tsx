
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";
import { PaymentFormData } from '@/types/payment';

interface PaymentFormProps {
  amount: number;
  orderId: string;
  onPaymentComplete: () => void;
  description?: string;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ 
  amount, 
  orderId, 
  onPaymentComplete, 
  description = "Paiement"
}) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile' | 'cash'>('mobile');
  const [formData, setFormData] = useState<PaymentFormData>({
    mobileNumber: '',
    provider: 'orange_money'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === 'mobile' && !formData.mobileNumber) {
      toast({
        title: "Erreur",
        description: "Veuillez fournir un numéro de téléphone valide",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Paiement réussi",
        description: "Votre paiement a été traité avec succès."
      });
      
      onPaymentComplete();
    } catch (error) {
      console.error('Erreur de paiement:', error);
      toast({
        title: "Échec du paiement",
        description: "Une erreur s'est produite lors du traitement de votre paiement. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <CardTitle className="mb-2">Méthode de paiement</CardTitle>
          <RadioGroup 
            value={paymentMethod} 
            onValueChange={(value) => setPaymentMethod(value as 'card' | 'mobile' | 'cash')}
            className="grid grid-cols-3 gap-4 mb-6"
          >
            <div className="border rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10">
              <RadioGroupItem value="mobile" id="mobile" className="sr-only" />
              <Label htmlFor="mobile" className="cursor-pointer flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                </div>
                <span className="text-sm font-medium">Mobile Money</span>
              </Label>
            </div>

            <div className="border rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10">
              <RadioGroupItem value="card" id="card" className="sr-only" />
              <Label htmlFor="card" className="cursor-pointer flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                </div>
                <span className="text-sm font-medium">Carte bancaire</span>
              </Label>
            </div>

            <div className="border rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10">
              <RadioGroupItem value="cash" id="cash" className="sr-only" />
              <Label htmlFor="cash" className="cursor-pointer flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
                </div>
                <span className="text-sm font-medium">Espèces</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {paymentMethod === 'mobile' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mobileNumber">Numéro de téléphone</Label>
              <Input
                id="mobileNumber"
                name="mobileNumber"
                placeholder="Exemple: 07XXXXXXXX"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="provider">Choisir un opérateur</Label>
              <RadioGroup 
                value={formData.provider || 'orange_money'} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, provider: value }))}
                className="grid grid-cols-3 gap-2"
              >
                <div className="border rounded-lg p-3 text-center cursor-pointer hover:bg-muted/50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10">
                  <RadioGroupItem value="orange_money" id="orange_money" className="sr-only" />
                  <Label htmlFor="orange_money" className="cursor-pointer text-sm">Orange Money</Label>
                </div>
                <div className="border rounded-lg p-3 text-center cursor-pointer hover:bg-muted/50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10">
                  <RadioGroupItem value="mtn_momo" id="mtn_momo" className="sr-only" />
                  <Label htmlFor="mtn_momo" className="cursor-pointer text-sm">MTN MoMo</Label>
                </div>
                <div className="border rounded-lg p-3 text-center cursor-pointer hover:bg-muted/50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10">
                  <RadioGroupItem value="airtel_money" id="airtel_money" className="sr-only" />
                  <Label htmlFor="airtel_money" className="cursor-pointer text-sm">Airtel Money</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

        {paymentMethod === 'card' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Numéro de carte</Label>
              <Input
                id="cardNumber"
                name="cardNumber"
                placeholder="0000 0000 0000 0000"
                value={formData.cardNumber || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Date d'expiration</Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  placeholder="MM/AA"
                  value={formData.expiryDate || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  name="cvv"
                  placeholder="123"
                  type="password"
                  maxLength={4}
                  value={formData.cvv || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cardHolder">Nom du titulaire</Label>
              <Input
                id="cardHolder"
                name="cardHolder"
                placeholder="Nom complet"
                value={formData.cardHolder || ''}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        )}

        {paymentMethod === 'cash' && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-800 text-sm">
                Vous paierez en espèces au moment de la livraison. Assurez-vous d'avoir le montant exact.
              </p>
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Montant total:</span>
            <span className="font-semibold">{amount.toLocaleString('fr-FR')} FCFA</span>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traitement en cours...
              </>
            ) : (
              `Payer ${amount.toLocaleString('fr-FR')} FCFA`
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default PaymentForm;
