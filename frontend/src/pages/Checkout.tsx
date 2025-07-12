
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft } from 'lucide-react';
import { OrderCheckout } from '@/components/payment/OrderCheckout';

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  
  // In a real application, you'd fetch the order details from an API
  // This is just a mock-up for demonstration purposes
  const mockOrderDetails = {
    id: id || 'order-12345',
    restaurantId: 'rest-123',
    items: [
      {
        name: 'Burger Deluxe',
        quantity: 2,
        price: 8.99
      },
      {
        name: 'Frites',
        quantity: 1,
        price: 3.50
      },
      {
        name: 'Soda',
        quantity: 2,
        price: 2.00
      }
    ],
    subtotal: 25.48,
    deliveryFee: 2.99,
    tax: 1.70,
    total: 30.17
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button 
        variant="ghost" 
        className="mb-6 flex items-center gap-2" 
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="h-4 w-4" /> Retour
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Finaliser votre commande</h1>
            
            {/* Order Checkout Component */}
            <OrderCheckout 
              orderId={mockOrderDetails.id}
              amount={mockOrderDetails.total * 100} // Amount in cents
              restaurantId={mockOrderDetails.restaurantId}
            />
          </div>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Résumé de la commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Items */}
              <div className="space-y-2">
                {mockOrderDetails.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{item.quantity} × {item.name}</span>
                    <span>{(item.quantity * item.price).toFixed(2)} €</span>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              {/* Summary */}
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{mockOrderDetails.subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Frais de livraison</span>
                  <span>{mockOrderDetails.deliveryFee.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>{mockOrderDetails.tax.toFixed(2)} €</span>
                </div>
              </div>
              
              <Separator />
              
              {/* Total */}
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{mockOrderDetails.total.toFixed(2)} €</span>
              </div>
              
              {/* Loyalty points info */}
              <div className="text-xs text-muted-foreground mt-4">
                <p>Vous recevrez des points de fidélité pour cette commande.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
