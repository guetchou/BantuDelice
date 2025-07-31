import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface PaymentGatewayProps {
    amount: number;
    onPaymentInitiate: (paymentMethod: 'momo' | 'airtel', phoneNumber: string) => Promise<void>;
    isProcessing: boolean;
}

/**
 * PaymentGateway - Composant de sélection et d'initiation du paiement multi-provider (MTN MoMo, Airtel Money)
 * - UX moderne avec feedback utilisateur
 * - Logs frontend pour monitoring
 * - Props : amount, onPaymentInitiate, isProcessing
 */
const PaymentGateway: React.FC<PaymentGatewayProps> = ({ amount, onPaymentInitiate, isProcessing }) => {
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'airtel' | ''>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handlePayment = () => {
    console.log(`[Paiement] Provider sélectionné: ${paymentMethod}`);
    if (!phoneNumber.match(/^(06|05|04)[0-9]{7}$/)) {
        // Idéalement, utiliser un toast pour cette erreur
        alert('Numéro de téléphone invalide.');
        return;
    }
    setShowConfirmation(true);
  };

  const confirmPayment = async () => {
    if(!paymentMethod) return;
    console.log(`[Paiement] Confirmation demandée pour ${phoneNumber} via ${paymentMethod}`);
    await onPaymentInitiate(paymentMethod, phoneNumber);
    // Le parent gère maintenant l'état 'isProcessing' et la suite
    // setShowConfirmation(false) sera géré par le parent au changement d'étape
  }

  const renderPaymentForm = () => (
    <div className="mt-4 space-y-4 animate-fadeIn">
        <p className="text-sm text-gray-600">
            Veuillez entrer votre numéro de téléphone {paymentMethod === 'momo' ? 'MTN Mobile Money' : 'Airtel Money'} pour initier le paiement.
        </p>
        <Input 
            type="tel"
            placeholder="Ex: 06xxxxxxx"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="text-lg"
        />
        <Button onClick={handlePayment} disabled={!phoneNumber || isProcessing} className="w-full">
            {isProcessing ? 'Initialisation...' : `Payer ${amount.toLocaleString('fr-FR')} FCFA`}
        </Button>
    </div>
  );

  return (
    <Card className="mt-6 bg-white/40 backdrop-blur-md border border-white/30 shadow-lg">
        <CardHeader>
            <CardTitle>Paiement de la commande</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 gap-4">
                <Button variant={paymentMethod === 'momo' ? 'default' : 'outline'} onClick={() => setPaymentMethod('momo')}>
                    <img src="/images/momo.jpg" alt="MTN Mobile Money" className="w-6 h-6 mr-2"/>
                    MTN MoMo
                </Button>
                <Button variant={paymentMethod === 'airtel' ? 'default' : 'outline'} onClick={() => setPaymentMethod('airtel')}>
                    <img src="/images/airtel.png" alt="Airtel Money" className="w-6 h-6 mr-2"/>
                    Airtel Money
                </Button>
            </div>

            {paymentMethod && renderPaymentForm()}
            
            <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Confirmez votre paiement</AlertDialogTitle>
                    <AlertDialogDescription>
                        Une demande de paiement de <span className="font-bold">{amount.toLocaleString('fr-FR')} FCFA</span> va être envoyée sur le numéro <span className="font-bold">{phoneNumber}</span>. 
                        Veuillez confirmer en tapant votre code secret sur votre téléphone.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmPayment} disabled={isProcessing}>
                        {isProcessing ? (
                            <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                En attente...
                            </div>
                        ) : "J'ai confirmé"}
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </CardContent>
    </Card>
  )
}

export default PaymentGateway; 