import { useState, useEffect } from 'react';
import { ShoppingCart, Loader2, AlertCircle, X, Plus, Minus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useCart } from '@/contexts/CartContext';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';
import MobilePayment from '@/components/payment/MobilePayment';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  useEffect(() => {
    const itemIds = state.items.map(item => item.id);
    if (itemIds.length === 0) return;

    console.log('Initializing stock monitoring for items:', itemIds);

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
      console.log('Initial stock levels:', stockData);
    };

    fetchStockLevels();

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
          console.log('Stock change detected:', payload);
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
      console.log('Cleaning up stock monitoring subscription');
      supabase.removeChannel(channel);
    };
  }, [state.items]);

  const validateStock = async () => {
    setValidatingStock(true);
    setError(null);
    
    try {
      console.log('Validating stock for items:', state.items);
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

      console.log('Stock validation successful');
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

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      if (newQuantity < 0) {
        throw new Error('La quantité ne peut pas être négative');
      }

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
          <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center">
            {state.items.length}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-80 bg-white rounded-lg shadow-xl p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Votre Panier</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
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
                <p className="text-gray-500 text-center py-4">Votre panier est vide</p>
              ) : (
                <>
                  <ScrollArea className="h-[60vh] pr-4">
                    <div className="space-y-4">
                      {state.items.map((item) => {
                        const stock = stockStatus[item.id];
                        const availableStock = stock ? stock.currentStock - stock.reservedStock : null;
                        
                        return (
                          <div key={item.id} className="flex flex-col gap-2 p-3 border rounded-lg">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-medium">{item.name}</h4>
                                <p className="text-sm text-gray-500">{item.price.toLocaleString()} FCFA</p>
                                {availableStock !== null && availableStock < item.quantity && (
                                  <p className="text-xs text-red-500">
                                    Stock disponible: {availableStock}
                                  </p>
                                )}
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleRemoveItem(item.id)}
                                disabled={isProcessing}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-2 justify-end">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                disabled={isProcessing}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                disabled={isProcessing || (availableStock !== null && item.quantity >= availableStock)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between mb-4">
                      <span className="font-semibold">Total:</span>
                      <span className="font-semibold">{total.toLocaleString()} FCFA</span>
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
