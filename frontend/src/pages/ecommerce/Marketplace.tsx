import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart, 
  Package, 
  Star, 
  Heart, 
  Search, 
  Filter,
  Grid3X3,
  List,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Truck,
  CheckCircle,
  Eye,
  Share2
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  stock: number;
  isNew?: boolean;
  isFeatured?: boolean;
  discount?: number;
  tags: string[];
}

interface CartItem {
  product: Product;
  quantity: number;
}

const Marketplace: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  // Mock products data
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Poulet Braisé Premium',
      description: 'Poulet braisé traditionnel congolais, mariné aux épices locales',
      price: 3500,
      originalPrice: 4000,
      image: '/images/products/poulet-braise.jpg',
      category: 'viandes',
      rating: 4.8,
      reviews: 124,
      stock: 50,
      isNew: true,
      isFeatured: true,
      discount: 12,
      tags: ['viande', 'traditionnel', 'épicé']
    },
    {
      id: '2',
      name: 'Poisson Braisé Tilapia',
      description: 'Tilapia frais braisé avec accompagnements',
      price: 2800,
      image: '/images/products/poisson-braise.jpg',
      category: 'poissons',
      rating: 4.6,
      reviews: 89,
      stock: 30,
      isFeatured: true,
      tags: ['poisson', 'frais', 'sain']
    },
    {
      id: '3',
      name: 'Maboké de Manioc',
      description: 'Manioc cuit à la vapeur, spécialité congolaise',
      price: 1200,
      image: '/images/products/maboke.jpg',
      category: 'accompagnements',
      rating: 4.7,
      reviews: 156,
      stock: 100,
      tags: ['manioc', 'traditionnel', 'végétarien']
    },
    {
      id: '4',
      name: 'Saka-Saka aux Épinards',
      description: 'Épinards locaux préparés à la manière traditionnelle',
      price: 1500,
      image: '/images/products/saka-saka.jpg',
      category: 'légumes',
      rating: 4.5,
      reviews: 67,
      stock: 45,
      tags: ['légumes', 'sain', 'traditionnel']
    },
    {
      id: '5',
      name: 'Foufou de Banane',
      description: 'Purée de banane plantain, accompagnement parfait',
      price: 1000,
      image: '/images/products/foufou.jpg',
      category: 'accompagnements',
      rating: 4.4,
      reviews: 92,
      stock: 60,
      tags: ['banane', 'purée', 'accompagnement']
    },
    {
      id: '6',
      name: 'Boisson Gingembre',
      description: 'Boisson rafraîchissante au gingembre naturel',
      price: 800,
      image: '/images/products/gingembre.jpg',
      category: 'boissons',
      rating: 4.3,
      reviews: 78,
      stock: 80,
      isNew: true,
      tags: ['boisson', 'gingembre', 'rafraîchissant']
    }
  ];

  useEffect(() => {
    setProducts(mockProducts);
  }, []);

  const categories = [
    { id: 'all', name: 'Tous les produits' },
    { id: 'viandes', name: 'Viandes' },
    { id: 'poissons', name: 'Poissons' },
    { id: 'légumes', name: 'Légumes' },
    { id: 'accompagnements', name: 'Accompagnements' },
    { id: 'boissons', name: 'Boissons' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.isNew ? 1 : -1;
      default:
        return b.isFeatured ? 1 : -1;
    }
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marketplace BantuDelice</h1>
          <p className="text-muted-foreground">
            Découvrez nos produits frais et traditionnels
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
          </Button>
          <Button>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Panier ({getCartItemCount()})
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher des produits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">En vedette</SelectItem>
                <SelectItem value="price-low">Prix croissant</SelectItem>
                <SelectItem value="price-high">Prix décroissant</SelectItem>
                <SelectItem value="rating">Meilleures notes</SelectItem>
                <SelectItem value="newest">Nouveautés</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {sortedProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              {product.isNew && (
                <Badge className="absolute top-2 left-2 bg-green-500">
                  Nouveau
                </Badge>
              )}
              {product.discount && (
                <Badge className="absolute top-2 right-2 bg-red-500">
                  -{product.discount}%
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>
            
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <div className="text-right">
                  <div className="font-bold text-lg">{formatCurrency(product.price)}</div>
                  {product.originalPrice && (
                    <div className="text-sm text-gray-500 line-through">
                      {formatCurrency(product.originalPrice)}
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{product.description}</p>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-1">
                  {renderStars(product.rating)}
                  <span className="text-sm text-gray-600">({product.reviews})</span>
                </div>
                <Badge variant="outline">
                  {product.stock} en stock
                </Badge>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => addToCart(product)}
                  className="flex-1"
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Ajouter au panier
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cart Sidebar */}
      {cart.length > 0 && (
        <Card className="fixed bottom-4 right-4 w-80 z-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span>Panier ({getCartItemCount()})</span>
              <Button variant="ghost" size="sm" onClick={() => setCart([])}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {cart.map((item) => (
              <div key={item.product.id} className="flex items-center space-x-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">{item.product.name}</div>
                  <div className="text-sm text-gray-600">
                    {formatCurrency(item.product.price)} x {item.quantity}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="border-t pt-3">
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>{formatCurrency(getCartTotal())}</span>
              </div>
              <Button className="w-full mt-3">
                <CreditCard className="w-4 h-4 mr-2" />
                Commander
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Marketplace; 