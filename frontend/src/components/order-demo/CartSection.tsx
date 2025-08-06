
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, CreditCard } from 'lucide-react';
import { CartItem } from '@/types/cart';
import { useCart } from '@/hooks/useCart';
import { Badge } from '@/components/ui/badge';

interface CartSectionProps {
  onOrder?: () => void;
  onPaymentComplete?: () => Promise<void>;
  loading?: boolean;
  error?: string | null;
  currentStep?: number;
}

const CartSection: React.FC<CartSectionProps> = ({ 
  onOrder,
  onPaymentComplete,
  loading = false,
  error = null,
  currentStep = 0
}) => {
  const { items, total, totalItems, removeItem, updateQuantity } = useCart();
  
  const deliveryFee = 299; // FCFA 2.99
  const totalWithDelivery = total + deliveryFee;
  
  const formatPrice = (price: number) => {
    return (price / 100).toFixed(2) + ' FCFA ';
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    updateQuantity(id, newQuantity);
  };

  // Si la commande est en cours, on n'affiche pas le panier
  if (currentStep > 0) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Votre panier</CardTitle>
        {totalItems > 0 && (
          <Badge variant="outline" className="ml-2">
            {totalItems} article{totalItems > 1 ? 's' : ''}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">Votre panier est vide</p>
          </div>
        ) : (
          <>
            {items.map((item) => (
              <div key={item.id} className="flex justify-between py-2 border-b">
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(item.price)} × {item.quantity}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-4 text-center">{item.quantity}</span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <div className="pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sous-total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frais de livraison</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>Total</span>
                <span>{formatPrice(totalWithDelivery)}</span>
              </div>
            </div>
          </>
        )}
        
        {error && (
          <div className="text-destructive text-sm mt-2 p-2 bg-destructive/10 rounded-md">
            {error}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col space-y-2">
        <Button 
          onClick={onOrder}
          disabled={items.length === 0 || loading}
          className="w-full"
        >
          Commander maintenant
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full mt-2"
          onClick={async () => onPaymentComplete && await onPaymentComplete()}
          disabled={items.length === 0 || loading}
        >
          {loading ? (
            <span className="flex items-center">
              <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
              Traitement...
            </span>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Paiement rapide
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CartSection;
