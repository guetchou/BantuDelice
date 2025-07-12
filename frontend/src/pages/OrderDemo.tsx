
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useCart } from '@/contexts/CartContext';
import LoyaltyStatus from "@/components/loyalty/LoyaltyStatus";
import MenuSection from '@/components/order-demo/MenuSection';
import CartSection from '@/components/order-demo/CartSection';
import OrderTrackingSection from '@/components/order-demo/OrderTrackingSection';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deliveryInfo, setDeliveryInfo] = useState({
    driver: "Mamadou Diop",
    estimatedTime: "20-30 min",
    status: "en préparation"
  });
  const [showLoyalty, setShowLoyalty] = useState(false);

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
  };

  const handlePaymentComplete = async () => {
    try {
      setError(null);
      setLoading(true);
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
            <MenuSection items={mockMenu} onAddToCart={handleAddToCart} />
          ) : (
            <OrderTrackingSection 
              orderId={orderId}
              currentStep={currentStep}
              deliveryInfo={deliveryInfo}
              onReset={resetDemo}
            />
          )}
          
          {showLoyalty && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Programme de Fidélité</h2>
              <LoyaltyStatus />
            </div>
          )}
        </div>
        
        <div className="md:col-span-1">
          <CartSection 
            items={state.items}
            loading={loading}
            error={error}
            currentStep={currentStep}
            onOrder={handleOrder}
            onPaymentComplete={handlePaymentComplete}
          />
        </div>
      </div>
    </div>
  );
}
