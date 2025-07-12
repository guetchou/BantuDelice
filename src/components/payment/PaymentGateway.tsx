import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { 
  CreditCard, 
  Smartphone, 
  Banknote, 
  Wallet, 
  QrCode, 
  Shield, 
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface PaymentGatewayProps {
  amount: number;
  currency?: string;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: string) => void;
  description?: string;
  orderId?: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  requiresPhone?: boolean;
  requiresCard?: boolean;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'mobile_money',
    name: 'Mobile Money',
    description: 'MTN, Airtel, Orange Money',
    icon: <Smartphone className="w-5 h-5" />,
    color: '#10B981',
    requiresPhone: true
  },
  {
    id: 'card',
    name: 'Carte bancaire',
    description: 'Visa, Mastercard, etc.',
    icon: <CreditCard className="w-5 h-5" />,
    color: '#3B82F6',
    requiresCard: true
  },
  {
    id: 'cash',
    name: 'Paiement à la livraison',
    description: 'Espèces ou chèque',
    icon: <Banknote className="w-5 h-5" />,
    color: '#F59E0B'
  },
  {
    id: 'wallet',
    name: 'Portefeuille Buntudelice',
    description: 'Solde disponible',
    icon: <Wallet className="w-5 h-5" />,
    color: '#8B5CF6'
  },
  {
    id: 'qr_code',
    name: 'Code QR',
    description: 'Scanner pour payer',
    icon: <QrCode className="w-5 h-5" />,
    color: '#EC4899'
  }
];

const mobileOperators = [
  { id: 'mtn', name: 'MTN Mobile Money', icon: '🟡' },
  { id: 'airtel', name: 'Airtel Money', icon: '🔴' },
  { id: 'orange', name: 'Orange Money', icon: '🟠' },
  { id: 'moov', name: 'Moov Money', icon: '🟢' }
];

export default function PaymentGateway({
  amount,
  currency = 'XOF',
  onPaymentSuccess,
  onPaymentError,
  description = 'Paiement de commande',
  orderId
}: PaymentGatewayProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('mobile_money');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const selectedPaymentMethod = paymentMethods.find(m => m.id === selectedMethod);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const validateForm = () => {
    if (selectedMethod === 'mobile_money') {
      if (!phoneNumber || !selectedOperator) {
        toast.error('Veuillez remplir tous les champs pour Mobile Money');
        return false;
      }
      if (!/^[0-9]{9,10}$/.test(phoneNumber.replace(/\s/g, ''))) {
        toast.error('Numéro de téléphone invalide');
        return false;
      }
    }
    
    if (selectedMethod === 'card') {
      if (!cardNumber || !cardExpiry || !cardCvv || !cardHolder) {
        toast.error('Veuillez remplir tous les champs de la carte');
        return false;
      }
      if (!/^[0-9]{16}$/.test(cardNumber.replace(/\s/g, ''))) {
        toast.error('Numéro de carte invalide');
        return false;
      }
    }
    
    return true;
  };

  const processPayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // Simulation du traitement de paiement
      await new Promise(resolve => setTimeout(resolve, 3000));

      const paymentData = {
        id: `pay_${Date.now()}`,
        method: selectedMethod,
        amount,
        currency,
        status: 'success',
        timestamp: new Date().toISOString(),
        orderId,
        description
      };

      // Ajouter les détails spécifiques à la méthode
      if (selectedMethod === 'mobile_money') {
        paymentData.phoneNumber = phoneNumber;
        paymentData.operator = selectedOperator;
      } else if (selectedMethod === 'card') {
        paymentData.lastFour = cardNumber.slice(-4);
      }

      toast.success('Paiement traité avec succès !');
      onPaymentSuccess(paymentData);

    } catch (error) {
      console.error('Erreur de paiement:', error);
      const errorMessage = 'Une erreur est survenue lors du traitement du paiement';
      toast.error(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateQRCode = () => {
    const qrData = {
      amount,
      currency,
      orderId,
      timestamp: Date.now()
    };
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify(qrData))}`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Paiement sécurisé
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Résumé du paiement */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Montant à payer</p>
                <p className="text-2xl font-bold text-green-700">{formatCurrency(amount)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Commande</p>
                <p className="font-medium">{orderId || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Sélection de la méthode de paiement */}
          <div>
            <Label className="text-base font-medium mb-4 block">Méthode de paiement</Label>
            <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod} className="space-y-3">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full" style={{ backgroundColor: `${method.color}20` }}>
                        <div style={{ color: method.color }}>
                          {method.icon}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-gray-500">{method.description}</p>
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Formulaire Mobile Money */}
          {selectedMethod === 'mobile_money' && (
            <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-medium text-green-800">Mobile Money</h3>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="operator">Opérateur</Label>
                  <select
                    id="operator"
                    value={selectedOperator}
                    onChange={(e) => setSelectedOperator(e.target.value)}
                    className="w-full p-3 border rounded-lg mt-1"
                  >
                    <option value="">Sélectionner un opérateur</option>
                    {mobileOperators.map((operator) => (
                      <option key={operator.id} value={operator.id}>
                        {operator.icon} {operator.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="phone">Numéro de téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Ex: 06 12 34 56 78"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Formulaire Carte bancaire */}
          {selectedMethod === 'card' && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-800">Carte bancaire</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="cardNumber">Numéro de carte</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="cardHolder">Nom du titulaire</Label>
                  <Input
                    id="cardHolder"
                    placeholder="JOHN DOE"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="cardExpiry">Date d'expiration</Label>
                  <Input
                    id="cardExpiry"
                    placeholder="MM/AA"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="cardCvv">CVV</Label>
                  <Input
                    id="cardCvv"
                    placeholder="123"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* QR Code */}
          {selectedMethod === 'qr_code' && (
            <div className="space-y-4 p-4 bg-pink-50 rounded-lg border border-pink-200">
              <h3 className="font-medium text-pink-800">Code QR</h3>
              
              <div className="text-center">
                <img 
                  src={generateQRCode()} 
                  alt="QR Code de paiement"
                  className="mx-auto border rounded-lg"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Scannez ce code avec votre application mobile pour effectuer le paiement
                </p>
              </div>
            </div>
          )}

          {/* Informations de sécurité */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="w-4 h-4" />
            <span>Vos données de paiement sont protégées par un chiffrement SSL</span>
          </div>

          {/* Bouton de paiement */}
          <Button
            onClick={processPayment}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 rounded-lg"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Traitement en cours...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Payer {formatCurrency(amount)}
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 