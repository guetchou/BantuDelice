import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useCart } from '@/contexts/CartContext';
import MobilePayment from '@/components/payment/MobilePayment';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertCircle, ArrowRight, Coins } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export const OrderSummary = () => {
  const { state, clearCart } = useCart();
  const { toast } = useToast();
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validatingStock, setValidatingStock] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cashbackDetails, setCashbackDetails] = useState<{
    available: number;
    willEarn: number;
    isApplied: boolean;
    toApply: number;
  }>({
    available: 0,
    willEarn: 0,
    isApplied: false,
    toApply: 0
  });

  const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 0 ? 1000 : 0; // Example delivery fee
  const serviceFee = subtotal > 0 ? Math.round(subtotal * 0.05) : 0; // 5% service fee
  
  // Apply cashback if selected
  const cashbackDiscount = cashbackDetails.isApplied ? cashbackDetails.toApply : 0;
  const total = subtotal + deliveryFee + serviceFee - cashbackDiscount;

  // Calculate potential cashback (5% standard rate)
  const potentialCashback = Math.round(subtotal * 0.05);

  // Fetch user's cashback balance
  useState(() => {
    const fetchCashbackBalance = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Check if cashback table exists
        const { data, error } = await supabase
          .from('cashback')
          .select('balance')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching cashback:', error);
          return;
        }

        if (data) {
          const availableCashback = data.balance;
          const maxApplicable = Math.min(availableCashback, Math.round(total * 0.1));
          
          setCashbackDetails({
            available: availableCashback,
            willEarn: potentialCashback,
            isApplied: false,
            toApply: maxApplicable
          });
        }
      } catch (err) {
        console.error('Error fetching cashback balance:', err);
      }
    };

    fetchCashbackBalance();
  }, []);

  const toggleCashback = () => {
    setCashbackDetails(prev => ({
      ...prev,
      isApplied: !prev.isApplied
    }));
  };

  const handlePaymentComplete = async () => {
    try {
      setError(null);
      setLoading(true);
      console.log('Début du processus de paiement...');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Veuillez vous connecter pour finaliser la commande');
      }

      // Validation du stock
      setValidatingStock(true);
      console.log('Validation du stock...');
      // Ici vous pouvez ajouter la logique de validation du stock

      // Créer la commande
      console.log('Création de la commande...');
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: total,
          subtotal_amount: subtotal,
          delivery_fee: deliveryFee,
          service_fee: serviceFee,
          status: 'pending',
          payment_status: 'completed',
          delivery_status: 'pending',
          restaurant_id: state.items[0]?.restaurant_id || '',
          delivery_address: 'À implémenter'
        })
        .select()
        .single();

      if (orderError) {
        console.error('Erreur lors de la création de la commande:', orderError);
        throw new Error('Impossible de créer la commande');
      }

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

      if (itemsError) {
        console.error('Erreur lors de la création des éléments de la commande:', itemsError);
        throw new Error('Impossible d\'ajouter les articles à la commande');
      }

      // Apply cashback if selected
      if (cashbackDetails.isApplied && cashbackDetails.toApply > 0) {
        try {
          // Deduct cashback from user's balance
          await supabase
            .from('cashback')
            .update({ 
              balance: supabase.rpc('decrement', { x: cashbackDetails.toApply }),
              last_updated: new Date().toISOString()
            })
            .eq('user_id', user.id);
          
          // Add cashback transaction record
          await supabase
            .from('cashback_transactions')
            .insert({
              user_id: user.id,
              amount: cashbackDetails.toApply,
              type: 'used',
              reference_id: order.id,
              reference_type: 'order',
              description: `Utilisé pour la commande #${order.id}`,
              created_at: new Date().toISOString()
            });
        } catch (cashbackError) {
          console.error('Erreur lors de l\'application du cashback:', cashbackError);
          // Don't throw here, order is still valid
        }
      }

      // Add earned cashback
      try {
        // Check if user has cashback entry
        const { data: cashbackData } = await supabase
          .from('cashback')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (cashbackData) {
          // Update existing cashback
          await supabase
            .from('cashback')
            .update({ 
              balance: supabase.rpc('increment', { x: potentialCashback }),
              lifetime_earned: supabase.rpc('increment', { x: potentialCashback }),
              last_updated: new Date().toISOString()
            })
            .eq('user_id', user.id);
        } else {
          // Create new cashback entry
          await supabase
            .from('cashback')
            .insert({
              user_id: user.id,
              balance: potentialCashback,
              lifetime_earned: potentialCashback,
              tier: 'bronze',
              tier_progress: 0,
              last_updated: new Date().toISOString(),
              created_at: new Date().toISOString()
            });
        }
        
        // Add cashback transaction record
        await supabase
          .from('cashback_transactions')
          .insert({
            user_id: user.id,
            amount: potentialCashback,
            type: 'earned',
            reference_id: order.id,
            reference_type: 'order',
            description: `Cashback gagné sur la commande #${order.id}`,
            created_at: new Date().toISOString()
          });
      } catch (cashbackError) {
        console.error('Erreur lors de l\'ajout du cashback:', cashbackError);
        // Don't throw here, order is still valid
      }

      toast({
        title: "Commande confirmée",
        description: "Votre commande a été enregistrée avec succès",
      });

      clearCart();
      setShowPayment(false);
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue lors de la création de la commande');
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la création de la commande",
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
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        {state.items.map((item) => (
          <div key={item.id} className="flex justify-between">
            <span>{item.quantity}x {item.name}</span>
            <span>{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
        
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Sous-total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Frais de livraison</span>
            <span>{formatCurrency(deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Frais de service (5%)</span>
            <span>{formatCurrency(serviceFee)}</span>
          </div>
          
          {/* Cashback section */}
          {cashbackDetails.available > 0 && (
            <div className="py-2 mt-2 border-t border-dashed">
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="useCashback" 
                  checked={cashbackDetails.isApplied}
                  onCheckedChange={toggleCashback}
                />
                <div>
                  <Label htmlFor="useCashback" className="flex items-center">
                    <Coins className="h-4 w-4 mr-1 text-amber-500" />
                    Utiliser mon cashback
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatCurrency(cashbackDetails.toApply)} disponible sur cette commande (max 10%)
                  </p>
                </div>
              </div>
              
              {cashbackDetails.isApplied && (
                <div className="flex justify-between text-sm mt-2 text-amber-600">
                  <span>Cashback appliqué</span>
                  <span>-{formatCurrency(cashbackDetails.toApply)}</span>
                </div>
              )}
            </div>
          )}
          
          <div className="flex justify-between font-bold pt-2 border-t">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          
          {/* Cashback reward info */}
          <div className="flex justify-between text-sm text-amber-600 items-center mt-1">
            <span className="flex items-center">
              <Coins className="h-4 w-4 mr-1" />
              Cashback à gagner
            </span>
            <span>+{formatCurrency(potentialCashback)}</span>
          </div>
        </div>

        {!showPayment ? (
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
              <>
                Procéder au paiement
                <ArrowRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        ) : (
          <MobilePayment
            amount={total}
            description="Paiement de commande"
            onSuccess={handlePaymentComplete}
            onError={() => setError("Erreur lors du paiement. Veuillez réessayer.")}
            savePaymentMethod={true}
          />
        )}
      </div>
    </Card>
  );
};

export default OrderSummary;
