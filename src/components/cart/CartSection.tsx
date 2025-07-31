
import React from 'react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import CartSummary from './CartSummary';
import { useNavigate } from 'react-router-dom';

interface CartSectionProps {
  onOrder?: () => void;
  onPaymentComplete?: () => void;
  loading?: boolean;
  error?: string | null;
  currentStep?: number;
  showCheckoutButton?: boolean;
}

const CartSection: React.FC<CartSectionProps> = ({
  onOrder,
  onPaymentComplete,
  loading = false,
  error = null,
  currentStep = 0,
  showCheckoutButton = true
}) => {
  const { items, total, updateItemQuantity, removeItem, isEmpty } = useCart();
  const navigate = useNavigate();
  
  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      updateItemQuantity(id, newQuantity);
    }
  };
  
  const handleCheckout = () => {
    if (onOrder) {
      onOrder();
    } else {
      navigate('/checkout');
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          <span>Votre panier</span>
          {items.length > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {items.length} {items.length > 1 ? 'articles' : 'article'}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {isEmpty() ? (
          <div className="text-center py-8">
            <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">Votre panier est vide</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-start py-2">
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    {item.options && item.options.length > 0 && (
                      <div className="text-sm text-muted-foreground">
                        {item.options.map(opt => `${opt.name}`).join(', ')}
                      </div>
                    )}
                    <div className="text-sm">{(item.price / 100).toFixed(2)} FCFA </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    
                    <span className="w-6 text-center">{item.quantity}</span>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        
        {items.length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span>Sous-total</span>
                <span>{(total / 100).toFixed(2)} FCFA </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Frais de livraison</span>
                <span>2,99 FCFA </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{((total + 299) / 100).toFixed(2)} FCFA </span>
              </div>
            </div>
          </>
        )}
        
        {error && (
          <div className="mt-4 p-2 bg-destructive/10 text-destructive rounded text-sm">
            {error}
          </div>
        )}
      </CardContent>
      
      {items.length > 0 && (
        <CardFooter>
          {currentStep === 0 && showCheckoutButton && (
            <Button 
              className="w-full" 
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <span className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"></span>
                  Traitement...
                </span>
              ) : (
                <span className="flex items-center">
                  Passer la commande
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </Button>
          )}
          
          {currentStep > 0 && onPaymentComplete && (
            <CartSummary
              showCheckoutButton={false}
              title="Récapitulatif de commande"
            />
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default CartSection;
