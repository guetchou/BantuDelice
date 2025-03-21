
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import MobilePayment from '@/components/payment/MobilePayment';

interface CartItem {
  id: string;
  quantity: number;
  name: string;
  price: number;
  restaurant_id: string;
}

interface CartSectionProps {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  currentStep: number;
  onOrder: () => void;
  onPaymentComplete: () => void;
}

const CartSection: React.FC<CartSectionProps> = ({ 
  items, 
  loading, 
  error, 
  currentStep, 
  onOrder, 
  onPaymentComplete 
}) => {
  const [showPayment, setShowPayment] = useState(false);
  
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const handleOrder = () => {
    setShowPayment(true);
    onOrder();
  };
  
  const handlePaymentComplete = () => {
    setShowPayment(false);
    onPaymentComplete();
  };
  
  return (
    <Card className="p-6 sticky top-4">
      <h2 className="text-xl font-bold mb-4">Votre Panier</h2>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {items.length === 0 ? (
        <p className="text-center text-gray-500 my-8">Votre panier est vide</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.quantity}x {item.name}</span>
              <span>{item.price * item.quantity} FCFA</span>
            </div>
          ))}
          
          <div className="border-t pt-4">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{total} FCFA</span>
            </div>
          </div>

          <Button 
            className="w-full"
            onClick={handleOrder}
            disabled={loading || currentStep > 0}
          >
            Commander
          </Button>
        </div>
      )}
      
      {showPayment && (
        <div className="mt-4 border-t pt-4">
          <h3 className="font-semibold mb-2">Paiement</h3>
          <MobilePayment
            amount={total}
            onPaymentComplete={handlePaymentComplete}
          />
        </div>
      )}
    </Card>
  );
};

export default CartSection;
