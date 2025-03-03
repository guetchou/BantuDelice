
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CartItem } from "@/types/cart";

interface CartSummaryProps {
  items: CartItem[];
  onCheckout: () => void;
  onRemoveItem?: (itemId: string) => void;
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
}

const CartSummary = ({ items, onCheckout, onRemoveItem, onUpdateQuantity }: CartSummaryProps) => {
  const getTotalAmount = () => items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);

  return (
    <Card className="p-6 bg-white/5 backdrop-blur-sm border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Votre commande</h2>
        <ShoppingBag className="w-6 h-6 text-gray-400" />
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-300">Votre panier est vide</p>
          <p className="text-sm text-gray-400 mt-2">Ajoutez des plats pour commencer</p>
        </div>
      ) : (
        <>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b border-gray-700 pb-3">
                  <div className="flex-1">
                    <span className="font-medium text-white">{item.name}</span>
                    <div className="flex items-center gap-2 mt-1">
                      {onUpdateQuantity && (
                        <div className="flex items-center gap-2 text-white">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 border-gray-700"
                            onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) - 1)}
                            disabled={(item.quantity || 1) <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span>{item.quantity || 1}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 border-gray-700"
                            onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      {onRemoveItem && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemoveItem(item.id)}
                          className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-transparent"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <span className="ml-4 text-white">{(item.price * (item.quantity || 1)).toLocaleString()} XAF</span>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="border-t border-gray-700 pt-4 mt-4">
            <div className="flex justify-between font-bold text-lg text-white">
              <span>Total</span>
              <span>{getTotalAmount().toLocaleString()} XAF</span>
            </div>
          </div>
          <Button 
            className="w-full mt-4 bg-orange-500 hover:bg-orange-600"
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
