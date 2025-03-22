
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, CreditCard } from 'lucide-react';
import { CartItem } from '@/types/cart';

export interface CartSectionProps {
  items: CartItem[];
  onOrder: () => void;
  onPaymentComplete: () => Promise<void>;
}

const CartSection: React.FC<CartSectionProps> = ({ 
  items, 
  onOrder,
  onPaymentComplete
}) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 299; // €2.99
  const total = subtotal + deliveryFee;
  
  const formatPrice = (price: number) => {
    return (price / 100).toFixed(2) + ' €';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Votre panier</CardTitle>
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
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-4 text-center">{item.quantity}</span>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <div className="pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sous-total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frais de livraison</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex-col space-y-2">
        <Button 
          onClick={onOrder}
          disabled={items.length === 0}
          className="w-full"
        >
          Commander maintenant
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full mt-2"
          onClick={async () => await onPaymentComplete()}
          disabled={items.length === 0}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Paiement rapide
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CartSection;
