
import React from 'react';
import { X, Trash2, MinusCircle, PlusCircle, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface CartDrawerProps {
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ onClose }) => {
  const { state, removeItem, updateQuantity, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRemoveItem = (id: string, name: string) => {
    removeItem(id);
    toast({
      title: 'Article retiré',
      description: `${name} a été retiré de votre panier`,
    });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      const item = state.items.find(item => item.id === id);
      if (item) handleRemoveItem(id, item.name);
      return;
    }
    updateQuantity(id, quantity);
  };

  const handleCheckout = () => {
    navigate('/checkout');
    onClose();
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    },
    exit: { 
      opacity: 0, 
      x: -100,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <ShoppingBag className="mr-2 h-5 w-5" />
          <h2 className="text-lg font-semibold">Votre panier</h2>
          <span className="ml-2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs">
            {state.totalItems}
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {state.items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Votre panier est vide</h3>
          <p className="text-muted-foreground mt-2">
            Ajoutez des articles à votre panier pour commencer votre commande
          </p>
          <Button className="mt-6" onClick={onClose}>
            Explorer le menu
          </Button>
        </div>
      ) : (
        <>
          <ScrollArea className="flex-1 p-4">
            <AnimatePresence>
              {state.items.map((item) => (
                <motion.div
                  key={item.id}
                  className="flex gap-4 mb-4 p-3 rounded-lg bg-card"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                >
                  {item.image_url && (
                    <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <h3 className="font-medium truncate">{item.name}</h3>
                      <span className="font-bold ml-2 whitespace-nowrap">
                        {((item.price * item.quantity) / 100).toFixed(2)} €
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                        <span className="mx-2 min-w-[1.5rem] text-center">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive/90"
                        onClick={() => handleRemoveItem(item.id, item.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>
          
          <div className="p-4 border-t">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Sous-total</span>
                <span>{(state.total / 100).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Frais de livraison</span>
                <span>3.99 €</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{((state.total / 100) + 3.99).toFixed(2)} €</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button onClick={handleCheckout} className="w-full">
                Passer la commande
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  clearCart();
                  toast({ title: 'Panier vidé', description: 'Tous les articles ont été supprimés' });
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Vider le panier
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartDrawer;
