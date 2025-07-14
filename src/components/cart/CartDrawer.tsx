
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
    <div className="h-full flex flex-col bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 rounded-3xl shadow-2xl border border-orange-100">
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-orange-400/90 to-pink-400/90 rounded-t-3xl shadow-md">
        <div className="flex items-center">
          <ShoppingBag className="mr-2 h-7 w-7 text-white drop-shadow" />
          <h2 className="text-lg font-bold text-white drop-shadow">Votre panier</h2>
          <span className="ml-2 px-2 py-0.5 rounded-full bg-white/80 text-orange-600 text-xs font-semibold shadow">
            {state.totalItems}
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-orange-100">
          <X className="h-5 w-5 text-white" />
        </Button>
      </div>

      {state.items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <ShoppingBag className="h-24 w-24 text-orange-200 mb-6 animate-bounce" />
          <h3 className="text-2xl font-bold text-orange-500 mb-2">Votre panier est vide</h3>
          <p className="text-orange-400 mb-4">Ajoutez des articles à votre panier pour commencer votre commande</p>
          <Button className="mt-6 bg-gradient-to-r from-orange-400 to-pink-400 text-white font-bold shadow-lg hover:from-pink-400 hover:to-orange-400 transition" onClick={onClose}>
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
                  className="flex gap-4 mb-4 p-4 rounded-2xl bg-white/90 shadow hover:shadow-lg transition-all duration-200 border border-orange-100"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                >
                  {item.image_url && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-md border border-orange-100">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold truncate text-orange-700">{item.name}</h3>
                      <span className="font-bold ml-2 whitespace-nowrap text-orange-600">
                        {((item.price * item.quantity) / 100).toFixed(2)} €
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-orange-100"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          <MinusCircle className="h-4 w-4 text-orange-500" />
                        </Button>
                        <span className="mx-2 min-w-[1.5rem] text-center font-semibold text-orange-700 bg-orange-50 rounded px-2 py-1 shadow-inner">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-orange-100"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <PlusCircle className="h-4 w-4 text-orange-500" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-red-100 hover:text-red-600"
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
          <div className="p-6 border-t bg-gradient-to-r from-orange-100/80 to-pink-100/80 rounded-b-3xl shadow-inner">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-base font-medium text-orange-700">
                <span>Sous-total</span>
                <span>{(state.total / 100).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-base font-medium text-orange-700">
                <span>Frais de livraison</span>
                <span>3.99 €</span>
              </div>
              <Separator />
              <div className="flex justify-between text-xl font-extrabold text-pink-600 drop-shadow">
                <span>Total</span>
                <span>{((state.total / 100) + 3.99).toFixed(2)} €</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-6">
              <Button onClick={handleCheckout} className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-lg py-3 rounded-xl shadow-xl hover:from-pink-500 hover:to-orange-500 transition-all duration-200">
                Passer la commande
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-orange-300 text-orange-600 hover:bg-orange-50 rounded-xl"
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
