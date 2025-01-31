import { useState, useEffect } from 'react';
import { ShoppingCart, Loader2, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useCart } from '@/contexts/CartContext';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';
import MobilePayment from '@/components/MobilePayment';

interface CartDrawerProps {
  onOrderAmount?: (amount: number) => void;
}

interface StockStatus {
  [key: string]: {
    currentStock: number;
    reservedStock: number;
  }
}

interface InventoryPayload {
  menu_item_id: string;
  current_stock: number;
  reserved_stock: number;
}

const CartDrawer = ({ onOrderAmount }: CartDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stockStatus, setStockStatus] = useState<StockStatus>({});
  const [validatingStock, setValidatingStock] = useState(false);
  const [showMobilePayment, setShowMobilePayment] = useState(false);
  const { state, removeFromCart, updateQuantity } = useCart();
  const { toast } = useToast();

  // Écoute des changements de stock en temps réel
  useEffect(() => {
    const itemIds = state.items.map(item => item.id);
    if (itemIds.length === 0) return;

    // Récupération initiale du stock
    const fetchStockLevels = async () => {
      const { data, error } = await supabase
        .from('inventory_levels')
        .select('menu_item_id, current_stock, reserved_stock')
        .in('menu_item_id', itemIds);

      if (error) {
        console.error('Erreur lors de la récupération du stock:', error);
        return;
      }

      const stockData: StockStatus = {};
      data?.forEach(item => {
        stockData[item.menu_item_id] = {
          currentStock: item.current_stock,
          reservedStock: item.reserved_stock
        };
      });
      setStockStatus(stockData);
    };

    fetchStockLevels();

    // Abonnement aux changements de stock en temps réel
    const channel = supabase
      .channel('inventory-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory_levels',
          filter: `menu_item_id=in.(${itemIds.map(id => `'${id}'`).join(',')})`,
        },
        (payload) => {
          console.log('Changement de stock détecté:', payload);
          const newData = payload.new as InventoryPayload;
          if (newData && newData.menu_item_id) {
            setStockStatus(current => ({
              ...current,
              [newData.menu_item_id]: {
                currentStock: newData.current_stock,
                reservedStock: newData.reserved_stock
              }
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [state.items]);

  const validateStock = async () => {
    setValidatingStock(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .rpc('validate_order_stock', {
          items: state.items.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity
          }))
        });

      if (error) throw error;

      if (!data[0].is_valid) {
        const invalidItems = data[0].invalid_items;
        console.error('Articles en rupture de stock:', invalidItems);
        throw new Error('Certains articles ne sont plus disponibles en stock');
      }

      return true;
    } catch (error) {
      console.error('Erreur de validation du stock:', error);
      setError(error instanceof Error ? error.message : 'Erreur de validation du stock');
      return false;
    } finally {
      setValidatingStock(false);
    }
  };

  const handleCheckout = async () => {
    try {
      setError(null);
      setIsProcessing(true);
      console.log('Début du processus de commande...');

      if (state.items.length === 0) {
        throw new Error('Votre panier est vide');
      }

      // Validation du stock avant la commande
      const isStockValid = await validateStock();
      if (!isStockValid) {
        throw new Error('Problème de stock, veuillez vérifier votre panier');
      }

      setShowMobilePayment(true);

    } catch (error) {
      console.error('Erreur lors du checkout:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue lors de la commande');
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la commande",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    if (onOrderAmount) {
      onOrderAmount(total);
    }
    setShowMobilePayment(false);
    setIsOpen(false);
    toast({
      title: "Commande validée",
      description: "Votre commande a été validée avec succès",
    });
  };

  const handlePaymentError = (error: Error) => {
    setError(error.message);
    setShowMobilePayment(false);
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      if (newQuantity < 0) {
        throw new Error('La quantité ne peut pas être négative');
      }

      // Vérification du stock disponible
      const stockInfo = stockStatus[itemId];
      if (stockInfo && (stockInfo.currentStock - stockInfo.reservedStock) < newQuantity) {
        throw new Error('Stock insuffisant pour cette quantité');
      }

      updateQuantity(itemId, newQuantity);
      console.log(`Quantité mise à jour pour l'item ${itemId}: ${newQuantity}`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la quantité:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la mise à jour de la quantité",
        variant: "destructive",
      });
    }
  };

  const handleRemoveItem = (itemId: string) => {
    try {
      removeFromCart(itemId);
      console.log(`Item ${itemId} retiré du panier`);
      toast({
        title: "Article retiré",
        description: "L'article a été retiré de votre panier",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'item:', error);
      toast({
        title: "Erreur",
        description: "Impossible de retirer l'article du panier",
        variant: "destructive",
      });
    }
  };

  const total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="relative">
      <Button 
        onClick={() => setIsOpen(!isOpen)} 
        className="relative bg-orange-500 hover:bg-orange-600"
        disabled={isProcessing}
      >
        {isProcessing ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <ShoppingCart className="h-5 w-5" />
        )}
        {state.items.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
            {state.items.length}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-80 bg-white rounded-lg shadow-xl p-4 border border-gray-200">
          <h3 className="font-semibold mb-4">Votre Panier</h3>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {showMobilePayment ? (
            <MobilePayment 
              amount={total}
              onPaymentComplete={handlePaymentSuccess}
              description="Paiement de commande"
            />
          ) : (
            <>
              {state.items.length === 0 ? (
                <p className="text-gray-500">Votre panier est vide</p>
              ) : (
                <>
                  <div className="space-y-4 max-h-60 overflow-auto">
                    {state.items.map((item) => {
                      const stock = stockStatus[item.id];
                      const availableStock = stock ? stock.currentStock - stock.reservedStock : null;
                      
                      return (
                        <div key={item.id} className="flex items-center justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-gray-500">{item.price} FCFA</p>
                            {availableStock !== null && availableStock < item.quantity && (
                              <p className="text-xs text-red-500">
                                Stock disponible: {availableStock}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                              disabled={isProcessing}
                            >
                              -
                            </Button>
                            <span>{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={isProcessing || (availableStock !== null && item.quantity >= availableStock)}
                            >
                              +
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={isProcessing}
                            >
                              <AlertCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between mb-4">
                      <span className="font-semibold">Total:</span>
                      <span className="font-semibold">{total} FCFA</span>
                    </div>
                    <Button 
                      className="w-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center gap-2"
                      onClick={handleCheckout}
                      disabled={isProcessing || validatingStock || state.items.length === 0}
                    >
                      {isProcessing || validatingStock ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {validatingStock ? 'Vérification du stock...' : 'Traitement...'}
                        </>
                      ) : (
                        'Commander'
                      )}
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CartDrawer;
