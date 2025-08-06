
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface CartSummaryProps {
  title?: string;
  showCheckoutButton?: boolean;
  onCheckout?: () => void;
}

const CartSummary = ({
  title = "Votre commande",
  showCheckoutButton = true,
  onCheckout
}: CartSummaryProps) => {
  const { items, total, isEmpty, calculateTotalWithDelivery } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const deliveryFee = 299; // 2.99FCFA  en centimes
  const totalWithDelivery = calculateTotalWithDelivery(deliveryFee);
  
  const handleCheckout = () => {
    setLoading(true);
    
    if (onCheckout) {
      onCheckout();
    } else {
      navigate('/checkout');
    }
    
    setTimeout(() => setLoading(false), 500);
  };
  
  // Formatter pour afficher les montants en euros
  const formatPrice = (price: number): string => {
    return (price / 100).toFixed(2) + ' FCFA ';
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            <span>{title}</span>
          </div>
          {items.length > 0 && (
            <Badge variant="secondary">
              {items.length} {items.length > 1 ? 'articles' : 'article'}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {isEmpty() ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">Votre panier est vide</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <div className="flex-1">
                  <span className="font-medium">
                    {item.quantity}x {item.name}
                  </span>
                  {item.options && item.options.length > 0 && (
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {item.options.map(opt => opt.name).join(', ')}
                    </div>
                  )}
                </div>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            
            <Separator className="my-2" />
            
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span>Sous-total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Frais de livraison</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
              
              <Separator className="my-2" />
              
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(totalWithDelivery)}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      {!isEmpty() && showCheckoutButton && (
        <CardFooter>
          <Button 
            onClick={handleCheckout}
            disabled={loading || isEmpty()}
            className="w-full"
          >
            {loading ? (
              <span className="flex items-center">
                <span className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"></span>
                Traitement...
              </span>
            ) : (
              <span className="flex items-center">
                Commander
                <ChevronRight className="ml-2 h-4 w-4" />
              </span>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default CartSummary;
