import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Données mockées pour le panier
const cartItems = [
  {
    id: 1,
    name: 'Poulet Moambé Traditionnel',
    restaurant: 'Restaurant Congo Authentique',
    price: 18.50,
    originalPrice: 22.00,
    quantity: 2,
    image: '/images/poulet-moambe.jpg',
    description: 'Poulet mijoté dans une sauce moambé traditionnelle avec accompagnements',
    deliveryTime: '25-35 min',
    rating: 4.8,
    reviews: 127,
    tags: ['Populaire', 'Traditionnel']
  },
  {
    id: 2,
    name: 'Taxi Premium - Centre-ville → Aéroport',
    service: 'Transport Premium',
    price: 35.00,
    originalPrice: 45.00,
    quantity: 1,
    image: '/images/taxi-brazzaville.png',
    description: 'Chauffeur professionnel, véhicule climatisé, trajet optimisé',
    pickupTime: '15 min',
    rating: 4.9,
    reviews: 89,
    tags: ['Premium', 'Express']
  },
  {
    id: 3,
    name: 'Livraison Colis Express',
    service: 'Logistique Express',
    price: 12.00,
    originalPrice: 15.00,
    quantity: 1,
    image: '/images/taxi-bzv.jpg',
    description: 'Livraison sécurisée avec suivi GPS en temps réel',
    deliveryTime: '2-3h',
    rating: 4.7,
    reviews: 203,
    tags: ['Express', 'Sécurisé']
  }
];

// Recommandations intelligentes
const recommendations = [
  {
    id: 4,
    name: 'Sauce Piment Traditionnelle',
    restaurant: 'Épices du Congo',
    price: 8.50,
    originalPrice: 12.00,
    image: '/images/poulet-moambe.jpg',
    description: 'Sauce piment authentique pour accompagner vos plats',
    rating: 4.6,
    reviews: 45
  },
  {
    id: 5,
    name: 'Covoiturage - Centre → Banlieue',
    service: 'Transport Partagé',
    price: 8.00,
    originalPrice: 12.00,
    image: '/images/taxi-brazzaville.png',
    description: 'Partagez votre trajet et économisez',
    rating: 4.5,
    reviews: 67
  },
  {
    id: 6,
    name: 'Pack Famille - 4 Repas',
    restaurant: 'Restaurant Congo Authentique',
    price: 65.00,
    originalPrice: 88.00,
    image: '/images/poulet-moambe.jpg',
    description: '4 repas traditionnels pour toute la famille',
    rating: 4.8,
    reviews: 156
  }
];

const CartPage = () => {
  const [quantities, setQuantities] = useState<{[key: number]: number}>({
    1: 2, 2: 1, 3: 1
  });
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<null | {code: string, discount: number}>(null);

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantities(prev => ({ ...prev, [itemId]: newQuantity }));
  };

  const removeItem = (itemId: number) => {
    setQuantities(prev => {
      const newQuantities = { ...prev };
      delete newQuantities[itemId];
      return newQuantities;
    });
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const quantity = quantities[item.id] || 0;
    return sum + (item.price * quantity);
  }, 0);

  const totalDiscount = cartItems.reduce((sum, item) => {
    const quantity = quantities[item.id] || 0;
    return sum + ((item.originalPrice - item.price) * quantity);
  }, 0);

  const couponDiscount = appliedCoupon ? (subtotal * appliedCoupon.discount / 100) : 0;
  const deliveryFee = subtotal > 50 ? 0 : 3.50;
  const total = subtotal - couponDiscount + deliveryFee;

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === 'welcome20') {
      setAppliedCoupon({ code: couponCode, discount: 20 });
    } else if (couponCode.toLowerCase() === 'premium10') {
      setAppliedCoupon({ code: couponCode, discount: 10 });
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/" className="text-orange-600 hover:text-orange-700">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Mon Panier</h1>
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
              {Object.keys(quantities).length} article(s)
            </span>
          </div>
          
          {/* Progress Bar - Style Amazon */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-orange-500 h-2 rounded-full transition-all duration-300" style={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }}></div>
          </div>
          <p className="text-sm text-gray-600">
            {subtotal < 50 ? `Ajoutez ${(50 - subtotal).toFixed(2)}FCFA pour la livraison gratuite` : 'Livraison gratuite !'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panier Principal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header du panier */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-pink-50">
                <h2 className="text-xl font-semibold text-gray-900">Articles dans votre panier</h2>
                <p className="text-sm text-gray-600 mt-1">Vous pouvez modifier les quantités ou supprimer des articles</p>
              </div>

              {/* Liste des articles */}
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => {
                  const quantity = quantities[item.id] || 0;
                  if (quantity === 0) return null;
                  
                  return (
                    <div key={item.id} className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Image */}
                        <div className="flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                          />
                        </div>

                        {/* Contenu */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {item.restaurant || item.service}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                              
                              {/* Tags */}
                              <div className="flex items-center gap-2 mt-2">
                                {item.tags.map((tag, index) => (
                                  <span key={index} className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                                    {tag}
                                  </span>
                                ))}
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <span className="text-yellow-500">★</span>
                                  <span>{item.rating}</span>
                                  <span>({item.reviews})</span>
                                </div>
                              </div>

                              {/* Temps de livraison */}
                              <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                  <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                                <span>{item.deliveryTime || item.pickupTime}</span>
                              </div>
                            </div>

                            {/* Prix et actions */}
                            <div className="flex flex-col items-end gap-3">
                              <div className="text-right">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg font-bold text-gray-900">
                                    {(item.price * quantity).toFixed(2)}FCFA
                                  </span>
                                  {item.originalPrice > item.price && (
                                    <span className="text-sm text-gray-500 line-through">
                                      {(item.originalPrice * quantity).toFixed(2)}FCFA
                                    </span>
                                  )}
                                </div>
                                {item.originalPrice > item.price && (
                                  <span className="text-sm text-green-600 font-medium">
                                    -{((item.originalPrice - item.price) * quantity).toFixed(2)}FCFA
                                  </span>
                                )}
                              </div>

                              {/* Contrôles quantité */}
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => updateQuantity(item.id, quantity - 1)}
                                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                >
                                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                                    <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                  </svg>
                                </button>
                                <span className="w-12 text-center font-medium">{quantity}</span>
                                <button 
                                  onClick={() => updateQuantity(item.id, quantity + 1)}
                                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                >
                                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                  </svg>
                                </button>
                              </div>

                              {/* Bouton supprimer */}
                              <button 
                                onClick={() => removeItem(item.id)}
                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                              >
                                Supprimer
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message panier vide */}
              {Object.keys(quantities).length === 0 && (
                <div className="p-12 text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-gray-400">
                      <path d="M6 6h15l-1.5 9h-13z" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <circle cx="9" cy="21" r="1" fill="currentColor"/>
                      <circle cx="18" cy="21" r="1" fill="currentColor"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Votre panier est vide</h3>
                  <p className="text-gray-600 mb-6">Découvrez nos services et commencez vos achats</p>
                  <Link 
                    to="/restaurants" 
                    className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                  >
                    Découvrir nos services
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>
              )}
            </div>

            {/* Recommandations - Style Amazon */}
            {Object.keys(quantities).length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Recommandations pour vous</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendations.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h4 className="font-medium text-gray-900 mb-1">{item.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{item.restaurant || item.service}</p>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span className="text-sm text-gray-600">{item.rating} ({item.reviews})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{item.price.toFixed(2)}FCFA</span>
                          {item.originalPrice > item.price && (
                            <span className="text-sm text-gray-500 line-through">{item.originalPrice.toFixed(2)}FCFA</span>
                          )}
                        </div>
                      </div>
                      <button className="w-full bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors">
                        Ajouter au panier
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Résumé de commande - Style Apple */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Résumé de commande</h3>

              {/* Code promo */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Code promo"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <button 
                    onClick={applyCoupon}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                  >
                    Appliquer
                  </button>
                </div>
                {appliedCoupon && (
                  <div className="mt-2 flex items-center justify-between p-2 bg-green-50 rounded-lg">
                    <span className="text-sm text-green-800">
                      Code {appliedCoupon.code} appliqué (-{appliedCoupon.discount}%)
                    </span>
                    <button 
                      onClick={removeCoupon}
                      className="text-green-600 hover:text-green-800"
                    >
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Détails des prix */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span>Sous-total</span>
                  <span>{subtotal.toFixed(2)}FCFA</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Réductions</span>
                    <span>-{totalDiscount.toFixed(2)}FCFA</span>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Code promo</span>
                    <span>-{couponDiscount.toFixed(2)}FCFA</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Livraison</span>
                  <span>{deliveryFee === 0 ? 'Gratuit' : `${deliveryFee.toFixed(2)}FCFA`}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{total.toFixed(2)}FCFA</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">TVA incluse</p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors transform hover:scale-105">
                  Passer la commande
                </button>
                <Link 
                  to="/restaurants" 
                  className="block w-full text-center text-orange-600 font-medium py-2 hover:text-orange-700 transition-colors"
                >
                  Continuer mes achats
                </Link>
              </div>

              {/* Garanties - Style Apple */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-green-500">
                      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Livraison sécurisée</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-green-500">
                      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Paiement sécurisé</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-green-500">
                      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Support 24h/24</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 