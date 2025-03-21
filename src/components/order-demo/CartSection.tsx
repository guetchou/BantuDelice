
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { CartItem } from "@/types/cart";

interface CartSectionProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveFromCart: (itemId: string) => void;
  onPlaceOrder: () => void;
  totalPrice: number;
}

const CartSection: React.FC<CartSectionProps> = ({
  items,
  onUpdateQuantity,
  onRemoveFromCart,
  onPlaceOrder,
  totalPrice
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShoppingCart className="mr-2 h-5 w-5" />
          Votre panier
        </CardTitle>
        <CardDescription>
          {items.length === 0
            ? "Votre panier est vide"
            : `${items.length} article${items.length > 1 ? "s" : ""}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Ajoutez des articles du menu pour commencer
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.price.toFixed(2)} €
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-4 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600"
                    onClick={() => onRemoveFromCart(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-stretch">
        <div className="flex justify-between py-2 font-medium">
          <span>Total</span>
          <span>{totalPrice.toFixed(2)} €</span>
        </div>
        <Button
          className="w-full mt-2"
          disabled={items.length === 0}
          onClick={onPlaceOrder}
        >
          Commander
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CartSection;
