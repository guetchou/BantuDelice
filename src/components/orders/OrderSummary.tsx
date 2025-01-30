import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCart } from '@/contexts/CartContext';
import MobilePayment from '@/components/MobilePayment';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

export const OrderSummary = () => {
  const { state, clearCart } = useCart();
  const { toast } = useToast();
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validatingStock, setValidatingStock] = useState(false);

  const total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePaymentComplete = async () => {
    try {
      setLoading(true);
      console.log('Début du processus de paiement...');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      // Validation du stock
      setValidatingStock(true);
      console.log('Validation du stock...');
      // Ici vous pouvez ajouter la logique de validation du stock

      // Créer la commande
      console.log('Création de la commande...');
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: total,
          status: 'pending',
          payment_status: 'completed',
          delivery_status: 'pending',
          restaurant_id: state.items[0]?.restaurantId || '',
          delivery_address: 'À implémenter'
        })
        .select()
        .single();

      if (error) throw error;

      // Créer les éléments de la commande
      console.log('Création des éléments de la commande...');
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
      setValidatingStock(false);
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
          className="w-full flex items-center justify-center gap-2"
          onClick={() => setShowPayment(true)}
          disabled={loading || validatingStock || state.items.length === 0}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {validatingStock ? 'Validation du stock...' : 'Traitement...'}
            </>
          ) : (
            'Procéder au paiement'
          )}
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