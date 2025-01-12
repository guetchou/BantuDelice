import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DeliveryMap from "@/components/DeliveryMap";
import MobilePayment from "@/components/MobilePayment";
import { ShoppingCart, MapPin } from "lucide-react";

const RestaurantMenu = () => {
  const { restaurantId } = useParams();
  const { toast } = useToast();
  const [cart, setCart] = useState<any[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Fetch restaurant details
  const { data: restaurant } = useQuery({
    queryKey: ['restaurant', restaurantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', restaurantId)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch menu items
  const { data: menuItems } = useQuery({
    queryKey: ['menuItems', restaurantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurantId);
      
      if (error) throw error;
      return data;
    }
  });

  const addToCart = (item: any) => {
    setCart([...cart, item]);
    toast({
      title: "Article ajouté",
      description: `${item.name} a été ajouté au panier`,
    });
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const handlePaymentComplete = async () => {
    try {
      // Create order in database
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            restaurant_id: restaurantId,
            total_amount: getTotalAmount(),
            status: 'pending',
            payment_status: 'completed',
            delivery_address: "Address to be implemented", // TODO: Add address input
          }
        ]);

      if (error) throw error;

      setShowPaymentModal(false);
      setCart([]);
      
      toast({
        title: "Commande confirmée",
        description: "Votre commande a été enregistrée avec succès",
      });
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la commande",
        variant: "destructive",
      });
    }
  };

  if (!restaurant || !menuItems) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-3xl font-bold mb-6">{restaurant.name}</h1>
          
          <div className="mb-8">
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{restaurant.address}</span>
            </div>
            
            <DeliveryMap 
              restaurantLocation={[restaurant.longitude, restaurant.latitude]}
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {menuItems.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600">{item.description}</p>
                    <p className="mt-2 font-bold">{item.price.toLocaleString()} FC</p>
                  </div>
                  <Button onClick={() => addToCart(item)}>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="sticky top-20">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Votre commande</h2>
            {cart.length === 0 ? (
              <p className="text-gray-600">Votre panier est vide</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.name}</span>
                      <span>{item.price.toLocaleString()} FC</span>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{getTotalAmount().toLocaleString()} FC</span>
                    </div>
                  </div>
                </div>
                <Button 
                  className="w-full"
                  onClick={() => setShowPaymentModal(true)}
                >
                  Procéder au paiement
                </Button>
              </>
            )}
          </Card>
        </div>
      </div>

      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Paiement mobile</DialogTitle>
          </DialogHeader>
          <MobilePayment 
            amount={getTotalAmount()} 
            onPaymentComplete={handlePaymentComplete}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RestaurantMenu;