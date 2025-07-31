import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotifications } from "@/context/NotificationContext";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function Cart() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Pizza Margherita",
      price: 12.99,
      quantity: 2,
      image: "🍕",
    },
    {
      id: 2,
      name: "Burger Deluxe",
      price: 15.50,
      quantity: 1,
      image: "🍔",
    },
    {
      id: 3,
      name: "Salade César",
      price: 8.99,
      quantity: 1,
      image: "🥗",
    },
  ]);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );

    addNotification({
      type: 'info',
      title: 'Quantité mise à jour',
      message: 'Votre panier a été modifié',
      duration: 2000,
    });
  };

  const removeItem = (id: number) => {
    const item = cartItems.find(item => item.id === id);
    setCartItems(prev => prev.filter(item => item.id !== id));
    
    addNotification({
      type: 'warning',
      title: 'Article supprimé',
      message: `${item?.name} a été retiré du panier`,
      duration: 3000,
      action: {
        label: 'Annuler',
        onClick: () => {
          if (item) {
            setCartItems(prev => [...prev, item]);
            addNotification({
              type: 'success',
              title: 'Article restauré',
              message: `${item.name} a été remis dans le panier`,
              duration: 2000,
            });
          }
        },
      },
    });
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      addNotification({
        type: 'error',
        title: 'Panier vide',
        message: 'Ajoutez des articles avant de passer commande',
        duration: 4000,
      });
      return;
    }

    addNotification({
      type: 'success',
      title: 'Commande en cours',
      message: 'Redirection vers le paiement...',
      duration: 2000,
    });

    setTimeout(() => {
      navigate('/checkout');
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Mon Panier</h1>
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-white hover:text-orange-200"
          >
            ← Continuer les achats
          </Button>
        </div>

        {cartItems.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-semibold mb-2">Votre panier est vide</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Découvrez nos services et ajoutez des articles
              </p>
              <Button onClick={() => navigate('/delivery')}>
                Découvrir nos services
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Liste des articles */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="flex items-center p-4">
                  <CardContent className="flex items-center w-full gap-4">
                    <div className="text-4xl">{item.image}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {item.price.toFixed(2)} FCFA 
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 p-0"
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 p-0"
                      >
                        +
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {(item.price * item.quantity).toFixed(2)} FCFA 
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Supprimer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Résumé */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Résumé de la commande</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{getTotal().toFixed(2)} FCFA </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span className="text-green-600">Gratuite</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{getTotal().toFixed(2)} FCFA </span>
                  </div>
                  <Button
                    onClick={handleCheckout}
                    className="w-full"
                    size="lg"
                  >
                    Passer la commande
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 