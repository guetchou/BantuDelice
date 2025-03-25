
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { Separator } from '@/components/ui/separator';
import { Check, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CartSummaryProps {
  showCheckoutButton?: boolean;
  title?: string;
  description?: string;
}

const CartSummary = ({ 
  showCheckoutButton = true, 
  title = "Récapitulatif du panier",
  description
}: CartSummaryProps) => {
  const { items, total } = useCart();
  const navigate = useNavigate();
  const deliveryFee = 299; // €2.99
  const totalWithDelivery = total + deliveryFee;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">Votre panier est vide</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">{item.quantity}×</span>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {item.options && item.options.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        {item.options.map(opt => `${opt.name}`).join(', ')}
                      </p>
                    )}
                  </div>
                </div>
                <p className="font-medium">{((item.price * item.quantity) / 100).toFixed(2)} €</p>
              </div>
            ))}
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sous-total</span>
                <span>{(total / 100).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frais de livraison</span>
                <span>{(deliveryFee / 100).toFixed(2)} €</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{(totalWithDelivery / 100).toFixed(2)} €</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      {showCheckoutButton && items.length > 0 && (
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => navigate('/checkout')}
          >
            <Check className="mr-2 h-4 w-4" />
            Passer la commande
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default CartSummary;
