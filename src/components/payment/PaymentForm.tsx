
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Banknote, Smartphone } from "lucide-react";
import PaymentButton from "./PaymentButton";
import { formatPrice } from '@/components/taxi/booking-form/bookingFormUtils';
import { toast } from 'sonner';

interface PaymentFormProps {
  amount: number;
  orderId: string;
  onPaymentComplete: () => Promise<void>;
  description?: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  orderId,
  onPaymentComplete,
  description = 'Paiement'
}) => {
  const [paymentMethod, setPaymentMethod] = useState<string>('mobile_money');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvv, setCardCvv] = useState<string>('');
  const [cardName, setCardName] = useState<string>('');
  
  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Validation basique des données de paiement
      if (paymentMethod === 'mobile_money' && !phoneNumber) {
        throw new Error('Veuillez entrer un numéro de téléphone');
      } else if (paymentMethod === 'card') {
        if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
          throw new Error('Veuillez remplir tous les champs de la carte');
        }
      }
      
      // Simuler un appel API de paiement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simuler le succès du paiement
      toast.success("Paiement effectué avec succès");
      
      // Appeler le callback de succès de paiement
      await onPaymentComplete();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue lors du paiement';
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const formatMobileNumber = (value: string) => {
    // Formater le numéro de téléphone pour l'affichage (ex: 06 123 45 67)
    return value.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4');
  };
  
  const formatCardNumber = (value: string) => {
    // Formater le numéro de carte pour l'affichage (ex: 1234 5678 9012 3456)
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };
  
  const formatExpiryDate = (value: string) => {
    // Formater la date d'expiration (MM/YY)
    return value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2').substring(0, 5);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">Détails du paiement</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="text-2xl font-bold text-primary">
          {formatPrice(amount)}
        </div>
      </div>
      
      <Tabs 
        defaultValue="mobile_money" 
        value={paymentMethod}
        onValueChange={setPaymentMethod}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mobile_money" className="flex items-center gap-2 text-xs sm:text-sm">
            <Smartphone className="h-4 w-4" />
            <span className="hidden sm:inline">Mobile Money</span>
          </TabsTrigger>
          <TabsTrigger value="card" className="flex items-center gap-2 text-xs sm:text-sm">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Carte</span>
          </TabsTrigger>
          <TabsTrigger value="cash" className="flex items-center gap-2 text-xs sm:text-sm">
            <Banknote className="h-4 w-4" />
            <span className="hidden sm:inline">Espèces</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Mobile Money */}
        <TabsContent value="mobile_money" className="pt-6">
          <Card>
            <CardContent className="pt-6 pb-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Numéro de téléphone Mobile Money</Label>
                <Input
                  id="phone"
                  placeholder="06 123 45 67"
                  value={phoneNumber}
                  onChange={(e) => {
                    // Ne garder que les chiffres
                    const digits = e.target.value.replace(/\D/g, '');
                    if (digits.length <= 8) {
                      setPhoneNumber(digits);
                    }
                  }}
                  className="pl-12"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-sm text-gray-500">+242</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="flex-1 flex items-center gap-2">
                  <img src="/assets/mobile-money/mtn-momo-logo.png" alt="MTN MoMo" className="h-5" />
                  <span>MTN MoMo</span>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <img src="/assets/mobile-money/airtel-logo.png" alt="Airtel Money" className="h-5" />
                  <span>Airtel Money</span>
                </div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-md border border-blue-100 text-blue-600 text-sm">
                <p>Un code de confirmation sera envoyé à ce numéro après validation.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Carte Bancaire */}
        <TabsContent value="card" className="pt-6">
          <Card>
            <CardContent className="pt-6 pb-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-name">Nom sur la carte</Label>
                <Input
                  id="card-name"
                  placeholder="Ex: JEAN DUPONT"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="card-number">Numéro de carte</Label>
                <div className="relative">
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => {
                      const formattedValue = formatCardNumber(e.target.value);
                      if (formattedValue.replace(/\s/g, '').length <= 16) {
                        setCardNumber(formattedValue);
                      }
                    }}
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Date d'expiration</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => {
                      const formattedValue = formatExpiryDate(e.target.value);
                      setCardExpiry(formattedValue);
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cvv">Code de sécurité (CVV)</Label>
                  <Input
                    id="cvv"
                    type="password"
                    placeholder="123"
                    value={cardCvv}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '');
                      if (digits.length <= 3) {
                        setCardCvv(digits);
                      }
                    }}
                  />
                </div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-md border border-blue-100 text-blue-600 text-sm">
                <p>Vos données de carte sont sécurisées et cryptées.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Espèces */}
        <TabsContent value="cash" className="pt-6">
          <Card>
            <CardContent className="pt-6 pb-6 space-y-4">
              <div className="text-center space-y-3">
                <Banknote className="h-12 w-12 mx-auto text-primary" />
                <h3 className="text-lg font-medium">Paiement en espèces</h3>
                <p className="text-sm text-muted-foreground">
                  Vous paierez directement au chauffeur à la fin de la course.
                </p>
              </div>
              
              <Separator />
              
              <div className="bg-amber-50 p-3 rounded-md border border-amber-100 text-amber-700 text-sm">
                <p>Assurez-vous d'avoir le montant exact pour faciliter la transaction.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="pt-4">
        <PaymentButton
          isProcessing={isProcessing}
          handlePayment={handlePayment}
        />
      </div>
    </div>
  );
};

export default PaymentForm;
