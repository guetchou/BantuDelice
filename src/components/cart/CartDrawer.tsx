import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import MobilePayment from '@/components/MobilePayment';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocation } from 'react-router-dom';

const CartDrawer = () => {
  const { state, updateQuantity, removeFromCart, clearCart } = useCart();
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const location = useLocation();
  const restaurantId = location.pathname.split('/')[2]; // Get restaurant ID from URL

  const handleCheckout = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour passer une commande",
          variant: "destructive",
        });
        return;
      }

      setShowPayment(true);
    } catch (error) {
      console.error('Error during checkout:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la commande",
        variant: "destructive",
      });
    }
  };

  const handlePaymentComplete = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Créer la commande
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          restaurant_id: restaurantId,
          total_amount: state.total,
          status: 'pending',
          payment_status: 'completed',
          delivery_address: "À implémenter", // TODO: Add address input
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Créer les éléments de la commande
      const orderItems = state.items.map(item => ({
        order_id: order.id,
        item_name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Initialiser le suivi de livraison
      const { error: trackingError } = await supabase
        .from('delivery_tracking')
        .insert({
          order_id: order.id,
          status: 'preparing',
        });

      if (trackingError) throw trackingError;

      toast({
        title: "Commande confirmée",
        description: "Votre commande a été enregistrée avec succès",
      });

      clearCart();
      setShowPayment(false);
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la commande",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {state.items.length > 0 && (
            <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {state.items.reduce((acc, item) => acc + item.quantity, 0)}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Votre panier</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-200px)] mt-4">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mb-4" />
              <p>Votre panier est vide</p>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {(item.price * item.quantity / 100).toLocaleString()} FCFA
                    </p>
                    {item.options && Object.entries(item.options).map(([key, value]) => (
                      <p key={key} className="text-xs text-muted-foreground">
                        {key}: {value}
                      </p>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        {state.items.length > 0 && (
          <div className="mt-4 space-y-4">
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{(state.total / 100).toLocaleString()} FCFA</span>
            </div>
            <Button 
              className="w-full" 
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? "Traitement en cours..." : "Passer la commande"}
            </Button>
          </div>
        )}
      </SheetContent>

      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Paiement</DialogTitle>
            <DialogDescription>
              Choisissez votre mode de paiement pour finaliser la commande
            </DialogDescription>
          </DialogHeader>
          <MobilePayment
            amount={state.total}
            onPaymentComplete={handlePaymentComplete}
          />
        </DialogContent>
      </Dialog>
    </Sheet>
  );
};

export default CartDrawer;
