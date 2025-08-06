import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Star, 
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  Clock
} from 'lucide-react';

const Shopping: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const products = [
    {
      id: 1,
      name: 'Smartphone Samsung Galaxy A54',
      price: '250,000 FCFA',
      originalPrice: '280,000 FCFA',
      rating: 4.5,
      reviews: 128,
      image: '/products/phone.jpg',
      category: 'Électronique',
      inStock: true,
      fastDelivery: true
    },
    {
      id: 2,
      name: 'Casque Bluetooth Sony WH-1000XM4',
      price: '180,000 FCFA',
      originalPrice: '200,000 FCFA',
      rating: 4.8,
      reviews: 89,
      image: '/products/headphones.jpg',
      category: 'Électronique',
      inStock: true,
      fastDelivery: false
    },
    {
      id: 3,
      name: 'Sneakers Nike Air Max 270',
      price: '85,000 FCFA',
      originalPrice: '95,000 FCFA',
      rating: 4.3,
      reviews: 156,
      image: '/products/shoes.jpg',
      category: 'Mode',
      inStock: true,
      fastDelivery: true
    },
    {
      id: 4,
      name: 'Sac à dos The North Face',
      price: '120,000 FCFA',
      originalPrice: '140,000 FCFA',
      rating: 4.6,
      reviews: 67,
      image: '/products/backpack.jpg',
      category: 'Mode',
      inStock: false,
      fastDelivery: true
    }
  ];

  const categories = [
    'Tous', 'Électronique', 'Mode', 'Maison', 'Sport', 'Livres', 'Beauté'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shopping BantuDelice</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez notre sélection de produits de qualité avec livraison rapide 
            et service client exceptionnel.
          </p>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Rechercher un produit..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button className="bg-purple-500 hover:bg-purple-600">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres
                </Button>
              </div>
              
              {/* Catégories */}
              <div className="flex flex-wrap gap-2 mt-4">
                {categories.map((category) => (
                  <Badge 
                    key={category} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-purple-50"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Produits */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-4">
                  {/* Image du produit */}
                  <div className="relative mb-4">
                    <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="h-12 w-12 text-gray-400" />
                    </div>
                    <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                      <Heart className="h-4 w-4 text-gray-400" />
                    </button>
                    {!product.inStock && (
                      <div className="absolute top-2 left-2">
                        <Badge variant="destructive">Rupture</Badge>
                      </div>
                    )}
                    {product.fastDelivery && (
                      <div className="absolute bottom-2 left-2">
                        <Badge className="bg-green-500 text-white text-xs">
                          <Truck className="h-3 w-3 mr-1" />
                          Livraison rapide
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Informations produit */}
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                    
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium ml-1">{product.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">({product.reviews})</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-purple-600">{product.price}</span>
                      <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                    </div>
                    
                    <Button 
                      className="w-full bg-purple-500 hover:bg-purple-600" 
                      disabled={!product.inStock}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {product.inStock ? 'Ajouter au panier' : 'Indisponible'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Avantages */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Pourquoi choisir BantuDelice Shopping ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Livraison rapide</h3>
                <p className="text-gray-600">
                  Livraison en 24-48h dans tout le Congo avec suivi en temps réel
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Garantie qualité</h3>
                <p className="text-gray-600">
                  Tous nos produits sont garantis et testés pour votre satisfaction
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Service client 24h/24</h3>
                <p className="text-gray-600">
                  Notre équipe est disponible pour vous accompagner à tout moment
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shopping; 