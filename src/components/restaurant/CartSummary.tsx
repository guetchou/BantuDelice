import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  price: number;
}

interface CartSummaryProps {
  items: MenuItem[];
  onCheckout: () => void;
}

const CartSummary = ({ items, onCheckout }: CartSummaryProps) => {
  const getTotalAmount = () => items.reduce((total, item) => total + item.price, 0);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Votre commande</h2>
        <ShoppingBag className="w-6 h-6 text-gray-400" />
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Votre panier est vide</p>
          <p className="text-sm text-gray-400 mt-2">Ajoutez des plats pour commencer</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{item.name}</span>
                </div>
                <span>{item.price.toLocaleString()} FC</span>
              </div>
            ))}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{getTotalAmount().toLocaleString()} FC</span>
              </div>
            </div>
          </div>
          <Button 
            className="w-full"
            size="lg"
            onClick={onCheckout}
          >
            Procéder au paiement
          </Button>
        </>
      )}
    </Card>
  );
};

export default CartSummary;