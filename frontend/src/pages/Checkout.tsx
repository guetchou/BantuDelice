
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  ArrowLeft, 
  CreditCard, 
  Smartphone, 
  MapPin, 
  Clock,
  Truck,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import PaymentService, { PaymentMethod } from '@/services/paymentService';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  restaurant: string;
}

interface CheckoutData {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  restaurantId: string;
  restaurantName: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('mobile_money');
  const [orderData, setOrderData] = useState<CheckoutData | null>(null);

  // Données de livraison
  const [deliveryData, setDeliveryData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: 'Kinshasa',
    instructions: '',
    email: ''
  });

  // Données de paiement
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    mobileNumber: ''
  });

  useEffect(() => {
    // Récupérer les données du panier depuis localStorage ou state
    const cartData = localStorage.getItem('restaurant_cart');
    if (cartData) {
      try {
        const parsed = JSON.parse(cartData);
        setOrderData(parsed);
      } catch (error) {
        console.error('Erreur parsing cart data:', error);
        toast.error('Erreur lors du chargement du panier');
        navigate('/restaurants');
      }
    } else {
      // Données mockées pour la démonstration
      const mockOrderData: CheckoutData = {
        items: [
          {
            id: '1',
            name: 'Poulet Moambé',
            price: 4500,
            quantity: 2,
            restaurant: 'Le Gourmet Congolais'
          },
          {
            id: '2',
            name: 'Fufu et Poisson Braisé',
            price: 4000,
            quantity: 1,
            restaurant: 'Le Gourmet Congolais'
          },
          {
            id: '5',
            name: 'Alloco',
            price: 6000,
            quantity: 1,
            restaurant: 'Le Gourmet Congolais'
          }
        ],
        subtotal: 19000,
        deliveryFee: 1000,
        total: 20000,
        restaurantId: '1',
        restaurantName: 'Le Gourmet Congolais'
      };
      setOrderData(mockOrderData);
    }
  }, [navigate]);

  const handleDeliveryChange = (field: string, value: string) => {
    setDeliveryData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentChange = (field: string, value: string) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!deliveryData.fullName || !deliveryData.phone || !deliveryData.address) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return false;
    }

    if (paymentMethod === 'mobile_money' && !paymentData.mobileNumber) {
      toast.error('Veuillez saisir votre numéro de téléphone');
      return false;
    }

    if (paymentMethod === 'card' && (!paymentData.cardNumber || !paymentData.cardHolder || !paymentData.expiryDate || !paymentData.cvv)) {
      toast.error('Veuillez remplir tous les champs de paiement par carte');
      return false;
    }

    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Préparer les données de paiement
      const paymentRequest = {
        amount: orderData.total,
        method: paymentData.method as PaymentMethod,
        phoneNumber: paymentData.method === 'mobile_money' ? PaymentService.formatPhoneNumber(deliveryData.phone) : undefined,
        orderId: PaymentService.generateOrderId(),
        description: `Commande ${orderData.restaurantName} - ${orderData.items.length} articles`,
        cardDetails: paymentData.method === 'card' ? {
          number: paymentData.cardNumber,
          expiry: paymentData.expiryDate,
          cvv: paymentData.cvv,
          name: paymentData.cardHolder,
        } : undefined,
      };

      // Valider selon la méthode de paiement
      if (paymentData.method === 'mobile_money') {
        if (!PaymentService.validateMTNPhone(deliveryData.phone) && !PaymentService.validateAirtelPhone(deliveryData.phone)) {
          toast.error('Numéro de téléphone invalide. Format attendu: +242 0X XXX XXXX');
          setLoading(false);
          return;
        }
      } else if (paymentData.method === 'card') {
        if (!PaymentService.validateCardDetails(paymentRequest.cardDetails)) {
          toast.error('Informations de carte invalides. Vérifiez tous les champs.');
          setLoading(false);
          return;
        }
      }

      // Traiter le paiement via l'API
      const paymentResult = await PaymentService.processPayment(paymentRequest);

      if (paymentResult.success) {
        toast.success(`Paiement effectué avec succès ! ${paymentResult.message}`);
        
        // Vider le panier
        localStorage.removeItem('restaurant_cart');
        
        // Rediriger vers la page de suivi de commande
    setTimeout(() => {
          navigate('/order-tracking', { 
            state: { 
              orderId: paymentRequest.orderId,
              transactionId: paymentResult.transactionId,
              restaurantName: orderData.restaurantName,
              estimatedTime: '25-30 minutes',
              paymentMethod: paymentData.method
            }
          });
        }, 1500);
      } else {
        toast.error(`Paiement échoué: ${paymentResult.message}`);
      }
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      toast.error('Erreur lors du paiement. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de votre commande...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Finaliser votre commande</h1>
            <div className="w-20"></div> {/* Spacer */}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire de commande */}
          <div className="space-y-6">
            {/* Informations de livraison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  Informations de livraison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Nom complet *</Label>
                    <Input
                      id="fullName"
                      value={deliveryData.fullName}
                      onChange={(e) => handleDeliveryChange('fullName', e.target.value)}
                      placeholder="Votre nom complet"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      value={deliveryData.phone}
                      onChange={(e) => handleDeliveryChange('phone', e.target.value)}
                      placeholder="+242 XXX XXX XXX"
                    />
            </div>
          </div>

                <div>
                  <Label htmlFor="address">Adresse de livraison *</Label>
                  <Textarea
                    id="address"
                    value={deliveryData.address}
                    onChange={(e) => handleDeliveryChange('address', e.target.value)}
                    placeholder="Votre adresse complète"
                    rows={3}
                  />
              </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      value={deliveryData.city}
                      onChange={(e) => handleDeliveryChange('city', e.target.value)}
                      placeholder="Kinshasa"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={deliveryData.email}
                      onChange={(e) => handleDeliveryChange('email', e.target.value)}
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="instructions">Instructions spéciales</Label>
                  <Textarea
                    id="instructions"
                    value={deliveryData.instructions}
                    onChange={(e) => handleDeliveryChange('instructions', e.target.value)}
                    placeholder="Instructions pour le livreur (optionnel)"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Méthode de paiement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-orange-500" />
                  Méthode de paiement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="mobile_money" id="mobile_money" />
                      <Label htmlFor="mobile_money" className="flex items-center gap-2 cursor-pointer">
                        <Smartphone className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="font-medium">Mobile Money</div>
                          <div className="text-sm text-gray-500">MTN Momo,Airtel Money</div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium">Carte bancaire</div>
                          <div className="text-sm text-gray-500">Visa, Mastercard, American Express</div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer">
                        <div className="w-5 h-5 text-green-600 font-bold">$</div>
                        <div>
                          <div className="font-medium">Paiement à la livraison</div>
                          <div className="text-sm text-gray-500">Payer en espèces à la réception</div>
                  </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>

                {/* Champs de paiement selon la méthode */}
                {paymentMethod === 'mobile_money' && (
                  <div className="mt-4">
                    <Label htmlFor="mobileNumber">Numéro de téléphone *</Label>
                    <Input
                      id="mobileNumber"
                      value={paymentData.mobileNumber}
                      onChange={(e) => handlePaymentChange('mobileNumber', e.target.value)}
                      placeholder="+242 XXX XXX XXX"
                    />
                </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Numéro de carte *</Label>
                      <Input
                        id="cardNumber"
                        value={paymentData.cardNumber}
                        onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                        placeholder="1234 5678 9012 3456"
                      />
              </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cardHolder">Nom sur la carte *</Label>
                        <Input
                          id="cardHolder"
                          value={paymentData.cardHolder}
                          onChange={(e) => handlePaymentChange('cardHolder', e.target.value)}
                          placeholder="NOM PRENOM"
                        />
            </div>
                      <div>
                        <Label htmlFor="expiryDate">Date d'expiration *</Label>
                        <Input
                          id="expiryDate"
                          value={paymentData.expiryDate}
                          onChange={(e) => handlePaymentChange('expiryDate', e.target.value)}
                          placeholder="MM/AA"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="cvv">Code de sécurité *</Label>
                      <Input
                        id="cvv"
                        value={paymentData.cvv}
                        onChange={(e) => handlePaymentChange('cvv', e.target.value)}
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
              </div>

          {/* Résumé de la commande */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Résumé de votre commande
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Restaurant */}
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">🍽️</span>
                  </div>
                  <div>
                    <div className="font-medium">{orderData.restaurantName}</div>
                    <div className="text-sm text-gray-500">Livraison estimée: 25-30 min</div>
                      </div>
                      </div>

                {/* Articles */}
                <div className="space-y-3">
                  {orderData.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{item.quantity}x</Badge>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className="font-medium">{(item.price * item.quantity).toLocaleString()} FCFA</span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totaux */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{orderData.subtotal.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frais de livraison</span>
                    <span>{orderData.deliveryFee.toLocaleString()} FCFA</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{orderData.total.toLocaleString()} FCFA</span>
                  </div>
                </div>

                {/* Bouton de paiement */}
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handlePayment}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Traitement en cours...
                    </div>
                  ) : (
                    `Payer ${orderData.total.toLocaleString()} FCFA`
                  )}
                </Button>

                {/* Sécurité */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>Paiement sécurisé par SSL</span>
              </div>
              </CardContent>
            </Card>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
