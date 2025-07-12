
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, CreditCard, Clock, MapPin, ShoppingBag, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const OrderSummary: React.FC = () => {
  const { state, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState<string>('credit_card');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [deliveryFee, setDeliveryFee] = useState<number>(399); // 3.99€ in cents
  const [restaurantDetails, setRestaurantDetails] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if there are items in the cart
    if (state.items.length === 0) {
      navigate('/restaurants');
      toast({
        title: "Panier vide",
        description: "Votre panier est vide. Veuillez ajouter des articles avant de passer commande.",
        variant: "destructive"
      });
      return;
    }
    
    // Get current user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        navigate('/login');
        toast({
          title: "Connexion requise",
          description: "Veuillez vous connecter pour passer commande.",
          variant: "destructive"
        });
      }
    };
    
    // Get restaurant details
    const getRestaurantDetails = async () => {
      // Assuming all items in cart are from the same restaurant
      const restaurantId = state.items[0]?.restaurant_id;
      
      if (restaurantId) {
        const { data, error } = await supabase
          .from('restaurants')
          .select('*')
          .eq('id', restaurantId)
          .single();
          
        if (error) {
          console.error('Error fetching restaurant:', error);
        } else {
          setRestaurantDetails(data);
          
          // Adjust delivery fee based on restaurant settings
          if (data.delivery_fee) {
            setDeliveryFee(data.delivery_fee);
          }
        }
      }
    };
    
    getUser();
    getRestaurantDetails();
  }, [state.items, navigate, toast]);
  
  const handleSubmitOrder = async () => {
    if (!userId) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour passer commande.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          restaurant_id: state.items[0]?.restaurant_id,
          status: 'pending',
          total_amount: state.total + deliveryFee,
          payment_method: paymentMethod,
          payment_status: paymentMethod === 'cash' ? 'pending' : 'paid',
          delivery_address: 'Address to be implemented', // This would come from a form
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Create order items
      const orderItems = state.items.map(item => ({
        order_id: order.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        price: item.price,
        notes: ''
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) throw itemsError;
      
      // Create payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: userId,
          order_id: order.id,
          amount: state.total + deliveryFee,
          payment_method: paymentMethod,
          status: paymentMethod === 'cash' ? 'pending' : 'completed',
          created_at: new Date().toISOString()
        });
      
      if (paymentError) throw paymentError;
      
      // Update wallet if using wallet as payment method
      if (paymentMethod === 'wallet') {
        const { data: wallet, error: walletFetchError } = await supabase
          .from('wallets')
          .select('balance')
          .eq('user_id', userId)
          .single();
        
        if (walletFetchError) throw walletFetchError;
        
        const newBalance = wallet.balance - (state.total + deliveryFee);
        
        if (newBalance < 0) {
          throw new Error('Solde du wallet insuffisant');
        }
        
        const { error: walletUpdateError } = await supabase
          .from('wallets')
          .update({ balance: newBalance })
          .eq('user_id', userId);
        
        if (walletUpdateError) throw walletUpdateError;
      }
      
      // Success! Clear the cart and navigate to confirmation page
      clearCart();
      navigate(`/order-confirmation/${order.id}`);
      
      toast({
        title: "Commande passée avec succès !",
        description: "Votre commande a été enregistrée et sera bientôt en préparation.",
      });
    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la commande",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const totalWithDelivery = state.total + deliveryFee;
  
  return (
    <div className="container max-w-3xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Finaliser votre commande</h1>
      
      <div className="grid gap-6 md:grid-cols-5">
        <div className="md:col-span-3 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Articles commandés
              </CardTitle>
            </CardHeader>
            <CardContent>
              {state.items.map((item) => (
                <div key={item.id} className="flex justify-between py-2">
                  <div className="flex items-start">
                    <div className="font-medium">{item.quantity}x</div>
                    <div className="ml-2">
                      <div className="font-medium">{item.name}</div>
                      {item.options && item.options.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          {item.options.map(opt => `${opt.name}: ${opt.value}`).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="font-medium">
                    {((item.price * item.quantity) / 100).toFixed(2)} €
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          {/* Delivery Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="mr-2 h-5 w-5" />
                Livraison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start mb-4">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Adresse de livraison</p>
                  <p className="text-muted-foreground">123 Rue de Paris, 75001 Paris</p>
                  <Button variant="link" className="px-0 h-auto py-1">Modifier</Button>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Temps de livraison estimé</p>
                  <p className="text-muted-foreground">30-45 minutes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Méthode de paiement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                defaultValue="credit_card" 
                value={paymentMethod} 
                onValueChange={setPaymentMethod}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="credit_card" id="credit_card" />
                  <Label htmlFor="credit_card" className="flex-1 cursor-pointer">
                    <div className="font-medium">Carte de crédit</div>
                    <div className="text-sm text-muted-foreground">Paiement sécurisé en ligne</div>
                  </Label>
                  <div className="flex gap-1">
                    <div className="h-6 w-10 rounded bg-[#252525] dark:bg-[#555]"></div>
                    <div className="h-6 w-10 rounded bg-[#2566AF]"></div>
                    <div className="h-6 w-10 rounded bg-[#6C6BBD]"></div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="wallet" id="wallet" />
                  <Label htmlFor="wallet" className="flex-1 cursor-pointer">
                    <div className="font-medium">Wallet</div>
                    <div className="text-sm text-muted-foreground">Solde disponible: 50,00 €</div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="flex-1 cursor-pointer">
                    <div className="font-medium">Espèces</div>
                    <div className="text-sm text-muted-foreground">Payer à la livraison</div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
        
        {/* Order Summary */}
        <div className="md:col-span-2">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Récapitulatif</CardTitle>
              {restaurantDetails && (
                <CardDescription>
                  {restaurantDetails.name}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{(state.total / 100).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Frais de livraison</span>
                  <span>{(deliveryFee / 100).toFixed(2)} €</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{(totalWithDelivery / 100).toFixed(2)} €</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                    Traitement...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Check className="mr-2 h-5 w-5" />
                    Confirmer la commande
                  </div>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
