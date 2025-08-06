import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ShoppingCart as ShoppingCartIcon, 
  Plus, 
  Minus, 
  Trash2, 
  Clock, 
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  restaurantId: string;
  restaurantName: string;
  options?: {
    name: string;
    price: number;
  }[];
}

interface ShoppingCartProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  isOpen,
  onClose
}) => {
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mobile_money' | 'card' | 'cash'>('mobile_money');

  // Calculer le total
  const subtotal = items.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity;
    const optionsTotal = item.options?.reduce((optSum, opt) => optSum + opt.price, 0) || 0;
    return sum + itemTotal + (optionsTotal * item.quantity);
  }, 0);

  const deliveryFee = subtotal > 0 ? 1000 : 0; // 1000 FCFA de frais de livraison
  const total = subtotal + deliveryFee;

  // Vérifier si le panier est vide
  const isEmpty = items.length === 0;

  // Gérer l'ajout de quantité
  const handleAddQuantity = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      onUpdateQuantity(itemId, item.quantity + 1);
    }
  };

  // Gérer la suppression de quantité
  const handleRemoveQuantity = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (item && item.quantity > 1) {
      onUpdateQuantity(itemId, item.quantity - 1);
    } else if (item && item.quantity === 1) {
      onRemoveItem(itemId);
    }
  };

  // Gérer la commande
  const handleOrder = () => {
    if (isEmpty) {
      toast.error('Votre panier est vide');
      return;
    }

    if (!deliveryAddress.trim()) {
      toast.error('Veuillez saisir votre adresse de livraison');
      return;
    }

    // Simuler le processus de commande
    toast.success('Commande en cours de traitement...');
    onCheckout();
  };

  // Formater le prix en FCFA
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCartIcon className="h-5 w-5" />
              Mon Panier
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              ×
            </Button>
          </div>
          <p className="text-sm opacity-90">
            {items.length} article{items.length > 1 ? 's' : ''} dans votre panier
          </p>
        </CardHeader>

        <div className="overflow-y-auto max-h-[60vh]">
          <CardContent className="p-4">
            {isEmpty ? (
              <div className="text-center py-8">
                <ShoppingCartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Votre panier est vide
                </h3>
                <p className="text-gray-500 mb-4">
                  Ajoutez des plats délicieux à votre panier pour commencer
                </p>
                <Button onClick={onClose} className="bg-orange-500 hover:bg-orange-600">
                  Parcourir les restaurants
                </Button>
              </div>
            ) : (
              <>
                {/* Articles du panier */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.image || '/images/placeholder-food.jpg'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                            <p className="text-sm text-gray-500">{item.restaurantName}</p>
                            {item.options && item.options.length > 0 && (
                              <div className="mt-1">
                                {item.options.map((option, index) => (
                                  <Badge key={index} variant="outline" className="text-xs mr-1">
                                    {option.name} (+{formatPrice(option.price)})
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveQuantity(item.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-medium w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddQuantity(item.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <span className="font-medium text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Adresse de livraison */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Adresse de livraison
                  </label>
                  <Input
                    placeholder="Entrez votre adresse complète"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Instructions de livraison */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructions spéciales (optionnel)
                  </label>
                  <Input
                    placeholder="Code, étage, instructions..."
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Méthode de paiement */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Méthode de paiement
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="mobile_money"
                        checked={paymentMethod === 'mobile_money'}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                        className="text-orange-500"
                      />
                      <CreditCard className="h-4 w-4" />
                      Mobile Money (Airtel Money, M-Pesa)
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                        className="text-orange-500"
                      />
                      <CreditCard className="h-4 w-4" />
                      Carte bancaire
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                        className="text-orange-500"
                      />
                      <CreditCard className="h-4 w-4" />
                      Paiement à la livraison
                    </label>
                  </div>
                </div>

                {/* Résumé des coûts */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sous-total</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Frais de livraison</span>
                    <span>{formatPrice(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg border-t pt-2">
                    <span>Total</span>
                    <span className="text-orange-600">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Informations de livraison */}
                <div className="bg-blue-50 p-3 rounded-lg mt-4">
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <Clock className="h-4 w-4" />
                    <span>Temps de livraison estimé : 30-45 minutes</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </div>

        {/* Footer avec bouton de commande */}
        {!isEmpty && (
          <div className="p-4 border-t bg-gray-50">
            <Button
              onClick={handleOrder}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3"
              disabled={!deliveryAddress.trim()}
            >
              <Truck className="h-4 w-4 mr-2" />
              Commander maintenant - {formatPrice(total)}
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">
              En passant votre commande, vous acceptez nos conditions générales
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart; 