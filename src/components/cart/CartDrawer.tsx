import { useState } from 'react';
import { ShoppingCart, Loader2, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useCart } from '@/contexts/CartContext';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CartDrawerProps {
  onOrderAmount?: (amount: number) => void;
}

const CartDrawer = ({ onOrderAmount }: CartDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { state, removeFromCart, updateQuantity } = useCart();
  const { toast } = useToast();

  const handleCheckout = async () => {
    try {
      setError(null);
      setIsProcessing(true);
      console.log('Début du processus de commande...');

      if (state.items.length === 0) {
        throw new Error('Votre panier est vide');
      }

      toast({
        title: "Commande en cours",
        description: "Traitement de votre commande...",
      });

      // Simulate a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (onOrderAmount) {
        onOrderAmount(total);
      }

      toast({
        title: "Commande validée",
        description: "Redirection vers le paiement...",
      });
      
      console.log('Commande validée avec succès');
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

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    try {
      if (newQuantity < 0) {
        throw new Error('La quantité ne peut pas être négative');
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
          
          {state.items.length === 0 ? (
            <p className="text-gray-500">Votre panier est vide</p>
          ) : (
            <>
              <div className="space-y-4 max-h-60 overflow-auto">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-500">{item.price} FCFA</p>
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
                        disabled={isProcessing}
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
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between mb-4">
                  <span className="font-semibold">Total:</span>
                  <span className="font-semibold">{total} FCFA</span>
                </div>
                <Button 
                  className="w-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center gap-2"
                  onClick={handleCheckout}
                  disabled={isProcessing || state.items.length === 0}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Traitement...
                    </>
                  ) : (
                    'Commander'
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CartDrawer;