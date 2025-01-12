import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
      <h2 className="text-xl font-bold mb-4">Votre commande</h2>
      {items.length === 0 ? (
        <p className="text-gray-600">Votre panier est vide</p>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>{item.name}</span>
                <span>{item.price.toLocaleString()} FC</span>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{getTotalAmount().toLocaleString()} FC</span>
              </div>
            </div>
          </div>
          <Button className="w-full" onClick={onCheckout}>
            Procéder au paiement
          </Button>
        </>
      )}
    </Card>
  );
};

export default CartSummary;