
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useCart } from '@/contexts/CartContext';
import MobilePayment from '@/components/MobilePayment';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertCircle, Check, Truck, Package } from 'lucide-react';
import { Steps, Step } from "@/components/ui/steps";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import LoyaltyStatus from "@/components/loyalty/LoyaltyStatus";

const mockMenu = [
  {
    id: "1",
    name: "Poulet Braisé",
    price: 5000,
    description: "Poulet braisé aux épices africaines",
    restaurant_id: "1",
    available: true,
    category: "Plats principaux",
    image_url: "https://picsum.photos/200/300?random=1",
  },
  {
    id: "2",
    name: "Alloco",
    price: 2000,
    description: "Bananes plantains frites accompagnées de sauce tomate",
    restaurant_id: "1",
    available: true,
    category: "Accompagnements",
    image_url: "https://picsum.photos/200/300?random=2",
  },
  {
    id: "3",
    name: "Jus de Bissap",
    price: 1500,
    description: "Boisson rafraîchissante à base de fleurs d'hibiscus",
    restaurant_id: "1",
    available: true,
    category: "Boissons",
    image_url: "https://picsum.photos/200/300?random=3",
  }
];

export default function OrderDemo() {
  const { state, addToCart, clearCart } = useCart();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deliveryInfo, setDeliveryInfo] = useState({
    driver: "Mamadou Diop",
    estimatedTime: "20-30 min",
    status: "en préparation"
  });
  const [showLoyalty, setShowLoyalty] = useState(false);

  const total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleAddToCart = (item: typeof mockMenu[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      restaurant_id: item.restaurant_id
    });
    toast({
      title: "Article ajouté",
      description: `${item.name} a été ajouté au panier`,
    });
  };

  const handleOrder = () => {
    if (state.items.length === 0) {
      toast({
        title: "Erreur",
        description: "Votre panier est vide",
        variant: "destructive",
      });
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentComplete = async () => {
    try {
      setError(null);
      setLoading(true);
      setShowPayment(false);
      console.log('Simulation: Début du processus de paiement...');

      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Générer un faux orderId
      const fakeOrderId = `order_${Date.now().toString(36)}`;
      setOrderId(fakeOrderId);
      
      toast({
        title: "Paiement accepté",
        description: "Votre commande a été confirmée",
      });

      setCurrentStep(1);
      
      // Simuler la préparation de la commande
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setDeliveryInfo(prev => ({...prev, status: "en préparation"}));
      setCurrentStep(2);
      
      // Simuler la livraison
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      setDeliveryInfo(prev => ({...prev, status: "en livraison"}));
      setCurrentStep(3);
      
      // Simuler la livraison terminée
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setDeliveryInfo(prev => ({...prev, status: "livrée"}));
      setCurrentStep(4);
      
      toast({
        title: "Commande livrée",
        description: "Votre commande a été livrée avec succès",
      });
      
      // Afficher les points de fidélité
      setShowLoyalty(true);
      
    } catch (error) {
      console.error('Erreur lors de la simulation:', error);
      setError(error instanceof Error ? error.message : "Une erreur est survenue");
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetDemo = () => {
    clearCart();
    setCurrentStep(0);
    setOrderId(null);
    setShowLoyalty(false);
    setDeliveryInfo({
      driver: "Mamadou Diop",
      estimatedTime: "20-30 min",
      status: "en préparation"
    });
  };

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Démo de Commande (de l'ajout au panier à la livraison)</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {currentStep === 0 ? (
            <>
              <h2 className="text-xl font-semibold mb-4">Menu</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {mockMenu.map(item => (
                  <Card key={item.id} className="p-4 flex flex-col">
                    <div className="mb-2">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    <div className="mt-auto flex justify-between items-center">
                      <span className="font-bold">{item.price} FCFA</span>
                      <Button 
                        onClick={() => handleAddToCart(item)}
                        size="sm"
                      >
                        Ajouter
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Suivi de commande #{orderId}</h2>
              
              <Steps activeStep={currentStep} className="mb-6">
                <Step icon={Check}>Commande confirmée</Step>
                <Step icon={Package}>Préparation</Step>
                <Step icon={Truck}>En livraison</Step>
                <Step icon={Check}>Livrée</Step>
              </Steps>
              
              {currentStep > 1 && (
                <div className="mt-4 p-4 border rounded-lg">
                  <div className="flex items-center gap-4 mb-2">
                    <Avatar>
                      <AvatarFallback>MD</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">Livreur: {deliveryInfo.driver}</h3>
                      <p className="text-sm">Estimation: {deliveryInfo.estimatedTime}</p>
                    </div>
                  </div>
                  <p className="text-sm">Statut: <span className="font-semibold">{deliveryInfo.status}</span></p>
                </div>
              )}
              
              {currentStep === 4 && (
                <Alert className="mt-4 bg-green-50 border-green-200">
                  <Check className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    Votre commande a été livrée avec succès!
                  </AlertDescription>
                </Alert>
              )}
              
              <Button 
                onClick={resetDemo} 
                className="mt-6 w-full"
                variant="outline"
              >
                Recommencer la démo
              </Button>
            </Card>
          )}
          
          {showLoyalty && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Programme de Fidélité</h2>
              <LoyaltyStatus />
            </div>
          )}
        </div>
        
        <div className="md:col-span-1">
          <Card className="p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Votre Panier</h2>
            
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {state.items.length === 0 ? (
              <p className="text-center text-gray-500 my-8">Votre panier est vide</p>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.quantity}x {item.name}</span>
                    <span>{item.price * item.quantity} FCFA</span>
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{total} FCFA</span>
                  </div>
                </div>

                <Button 
                  className="w-full"
                  onClick={handleOrder}
                  disabled={loading || currentStep > 0}
                >
                  Commander
                </Button>
              </div>
            )}
            
            {showPayment && (
              <div className="mt-4 border-t pt-4">
                <h3 className="font-semibold mb-2">Paiement</h3>
                <MobilePayment
                  amount={total}
                  onPaymentComplete={handlePaymentComplete}
                />
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
