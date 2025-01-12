import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingBag, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  quantity?: number;
}

interface CartSummaryProps {
  items: MenuItem[];
  onCheckout: () => void;
  onRemoveItem?: (itemId: string) => void;
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
}

const CartSummary = ({ items, onCheckout, onRemoveItem, onUpdateQuantity }: CartSummaryProps) => {
  const getTotalAmount = () => items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);

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
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex-1">
                    <span className="font-medium">{item.name}</span>
                    <div className="flex items-center gap-2 mt-1">
                      {onUpdateQuantity && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) - 1)}
                            disabled={(item.quantity || 1) <= 1}
                          >
                            -
                          </Button>
                          <span>{item.quantity || 1}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                          >
                            +
                          </Button>
                        </div>
                      )}
                      {onRemoveItem && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <span className="ml-4">{(item.price * (item.quantity || 1)).toLocaleString()} FCFA</span>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{getTotalAmount().toLocaleString()} FCFA</span>
            </div>
          </div>
          <Button 
            className="w-full mt-4"
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