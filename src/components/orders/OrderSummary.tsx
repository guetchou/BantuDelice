import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from '@/contexts/CartContext';
import MobilePayment from '@/components/MobilePayment';
import { supabase } from '@/integrations/supabase/client';

export const OrderSummary = () => {
  const { state, clearCart } = useCart();
  const { toast } = useToast();
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);

  const total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePaymentComplete = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      // Créer la commande
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: total,
          status: 'pending',
          payment_status: 'completed',
          delivery_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // Créer les éléments de la commande
      const orderItems = state.items.map(item => ({
        order_id: order.id,
        item_name: item.name,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      toast({
        title: "Commande confirmée",
        description: "Votre commande a été enregistrée avec succès",
      });

      clearCart();
      setShowPayment(false);
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
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
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Résumé de la commande</h2>
      
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
          onClick={() => setShowPayment(true)}
          disabled={loading || state.items.length === 0}
        >
          Procéder au paiement
        </Button>
      </div>

      {showPayment && (
        <MobilePayment
          amount={total}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </Card>
  );
};

export default OrderSummary;