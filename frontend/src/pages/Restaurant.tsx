import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  MapPin, 
  Clock, 
  Filter, 
  ArrowUpDown, 
  Star,
  ChevronDown,
  X,
  ShoppingCart
} from 'lucide-react';
import ImprovedRestaurantCard from '@/components/restaurants/ImprovedRestaurantCard';
import { useRestaurantSearch } from '@/hooks/useRestaurantSearch';
import { useRestaurantCart } from '@/hooks/useRestaurantCart';
import ShoppingCartComponent from '@/components/restaurants/ShoppingCart';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function Restaurant() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const { 
    searchQuery, 
    selectedCategory, 
    selectedPriceRange,
    selectedSortBy,
    cuisineTypes,
    isLoading,
    setIsLoading,
    handleSearchChange,
    handleCategoryChange,
    handlePriceRangeChange,
    handleSortByChange,
    resetFilters
  } = useRestaurantSearch();

  const {
    items: cartItems,
    addItem,
    removeItem,
    updateQuantity,
    getTotalItems,
    getTotal,
    isEmpty: isCartEmpty
  } = useRestaurantCart();
  
  // Obtenir les restaurants lors du changement des filtres
  useEffect(() => {
    fetchRestaurants();
  }, [selectedCategory, selectedPriceRange, selectedSortBy, searchQuery]);
  
  const fetchRestaurants = async () => {
    try {
      setIsLoading(true);
      
      // Simuler des données de restaurants pour la démo
      const mockRestaurants = [
        {
          id: '1',
          name: 'Le Gourmet Congolais',
          address: '123 Avenue de la Paix, Brazzaville',
          cuisine_type: 'Congolaise',
          rating: 4.7,
          estimated_preparation_time: 25,
          image_url: 'images/restaurant_images/congolais/Congo_restaurant1.jpg',
          banner_image_url: 'images/restaurant_images/congolais/Congo_restaurant1.jpg',
          logo_url: 'images/restaurant_images/congolais/Congo_restaurant1.jpg',
          trending: true,
          featured: true,
          min_order_amount: 5000
        },
        {
          id: '2',
          name: 'Saveurs d\'Afrique',
          address: '456 Boulevard du Congo, Brazzaville',
          cuisine_type: 'Panafricaine',
          rating: 4.5,
          estimated_preparation_time: 30,
          image_url: 'images/restaurant_images/congolais/Congo_plat2.png',
          banner_image_url: 'images/restaurant_images/congolais/Congo_plat2.png',
          logo_url: 'images/restaurant_images/congolais/Congo_plat2.png',
          trending: false,
          featured: true,
          min_order_amount: 3500
        },
        {
          id: '3',
          name: 'Chez Matou',
          address: '789 Rue de la Gastronomie, Brazzaville',
          cuisine_type: 'Congolaise',
          rating: 4.2,
          estimated_preparation_time: 15,
          image_url: 'images/restaurant_images/congolais/Congo_restaurant2.jpg',
          banner_image_url: 'images/restaurant_images/congolais/Congo_restaurant2.jpg',
          logo_url: 'images/restaurant_images/congolais/Congo_restaurant2.jpg',
          trending: true,
          featured: false,
          min_order_amount: 2000
        },
        {
          id: '4',
          name: 'La Terrasse',
          address: '321 Quai du Fleuve, Brazzaville',
          cuisine_type: 'Congolaise',
          rating: 4.8,
          estimated_preparation_time: 35,
          image_url: 'images/restaurant_images/congolais/Congo_plat2.png',
          banner_image_url: 'images/restaurant_images/congolais/Congo_plat2.png',
          logo_url: 'images/restaurant_images/congolais/Congo_plat2.png',
          trending: false,
          featured: true,
          min_order_amount: 8000
        },
        {
          id: '5',
          name: 'La congolaise',
          address: '654 Avenue de la Paix, Brazzaville',
          cuisine_type: 'Congolaise',
          rating: 4.3,
          estimated_preparation_time: 20,
          image_url: 'images/restaurant_images/congolais/Congo_plat3.jpg',
          banner_image_url: 'images/restaurant_images/congolais/Congo_plat3.jpg',
          logo_url: 'images/restaurant_images/congolais/Congo_plat3.jpg',
          trending: true,
          featured: false,
          min_order_amount: 3000
        }
      ];

      // Appliquer les filtres
      let filteredData = mockRestaurants;
      
      if (searchQuery) {
        filteredData = filteredData.filter(restaurant => 
          restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          restaurant.cuisine_type.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (selectedCategory && selectedCategory !== 'Tout') {
        filteredData = filteredData.filter(restaurant => 
          restaurant.cuisine_type === selectedCategory
        );
      }
      
      // Filtrer par fourchette de prix
      if (selectedPriceRange !== 'all') {
        filteredData = filteredData.filter(restaurant => {
          const avgPrice = restaurant.min_order_amount || 5000;
          switch (selectedPriceRange) {
            case 'low': return avgPrice < 5000;
            case 'medium': return avgPrice >= 5000 && avgPrice <= 15000;
            case 'high': return avgPrice > 15000;
            default: return true;
          }
        });
      }
      
      // Trier les résultats
      filteredData = filteredData.sort((a, b) => {
        switch (selectedSortBy) {
          case 'popularity':
            return (b.trending ? 1 : 0) - (a.trending ? 1 : 0) || 
                   (b.rating || 0) - (a.rating || 0);
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          case 'price_asc':
            return (a.min_order_amount || 0) - (b.min_order_amount || 0);
          case 'price_desc':
            return (b.min_order_amount || 0) - (a.min_order_amount || 0);
          case 'nearest':
            return 0; // Simuler la proximité pour cette démo
          default:
            return 0;
        }
      });
      
      setRestaurants(filteredData);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRestaurantClick = (id: string) => {
    navigate(`/restaurants/${id}`);
  };
  
  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCategory !== 'Tout') count++;
    if (selectedPriceRange !== 'all') count++;
    if (selectedSortBy !== 'popularity') count++;
    return count;
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600">
      {/* Header avec panier */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Button variant="ghost" onClick={() => navigate('/')} className="text-white hover:text-orange-200 transition">
              ← Retour à l'accueil
            </Button>
            <h1 className="text-2xl font-bold text-white">Restaurants</h1>
            <Button 
              variant="ghost" 
              onClick={() => setIsCartOpen(true)}
              className="text-white hover:text-orange-200 transition relative"
            >
              <ShoppingCart className="h-6 w-6" />
              {!isCartEmpty && (
                <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs">
                  {getTotalItems()}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Découvrez les meilleurs restaurants</h1>
        <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
          Commandez vos plats préférés en quelques clics. Livraison rapide et sécurisée.
        </p>
      </section>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        {/* Barre de recherche */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher un restaurant, une cuisine..."
              className="pl-10 py-6 text-lg"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </div>
        
        {/* Filtres */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filtres
                  {getActiveFiltersCount() > 0 && (
                    <Badge className="ml-1 bg-primary/90 hover:bg-primary">{getActiveFiltersCount()}</Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Catégorie</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {cuisineTypes.map(cuisine => (
                  <DropdownMenuCheckboxItem
                    key={cuisine}
                    checked={selectedCategory === cuisine}
                    onCheckedChange={() => handleCategoryChange(cuisine)}
                  >
                    {cuisine}
                  </DropdownMenuCheckboxItem>
                ))}
                
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Fourchette de prix</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={selectedPriceRange === 'all'}
                  onCheckedChange={() => handlePriceRangeChange('all')}
                >
                  Tous les prix
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedPriceRange === 'low'}
                  onCheckedChange={() => handlePriceRangeChange('low')}
                >
                  Économique
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedPriceRange === 'medium'}
                  onCheckedChange={() => handlePriceRangeChange('medium')}
                >
                  Moyen
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedPriceRange === 'high'}
                  onCheckedChange={() => handlePriceRangeChange('high')}
                >
                  Élevé
                </DropdownMenuCheckboxItem>
                
                <DropdownMenuSeparator />
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                  onClick={resetFilters}
                >
                  <X className="mr-2 h-4 w-4" />
                  Réinitialiser
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  Trier par
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuCheckboxItem
                  checked={selectedSortBy === 'popularity'}
                  onCheckedChange={() => handleSortByChange('popularity')}
                >
                  Popularité
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedSortBy === 'rating'}
                  onCheckedChange={() => handleSortByChange('rating')}
                >
                  <Star className="mr-2 h-4 w-4" />
                  Note
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedSortBy === 'price_asc'}
                  onCheckedChange={() => handleSortByChange('price_asc')}
                >
                  Prix croissant
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedSortBy === 'price_desc'}
                  onCheckedChange={() => handleSortByChange('price_desc')}
                >
                  Prix décroissant
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedSortBy === 'nearest'}
                  onCheckedChange={() => handleSortByChange('nearest')}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Distance
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedSortBy === 'fastest'}
                  onCheckedChange={() => handleSortByChange('fastest')}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Temps de livraison
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Filtres actifs */}
            {selectedCategory !== 'Tout' && (
              <Badge variant="secondary" className="gap-1 pl-2 h-9">
                {selectedCategory}
                                 <Button 
                   variant="ghost" 
                   size="sm" 
                   className="h-5 w-5 ml-1 p-0 text-gray-500 hover:text-gray-700 hover:bg-transparent"
                   onClick={() => handleCategoryChange('Tout')}
                 >
                   <X className="h-3 w-3" />
                 </Button>
              </Badge>
            )}
            
            {selectedPriceRange !== 'all' && (
              <Badge variant="secondary" className="gap-1 pl-2 h-9">
                Prix: {selectedPriceRange === 'low' ? 'Économique' : selectedPriceRange === 'medium' ? 'Moyen' : 'Élevé'}
                                 <Button 
                   variant="ghost" 
                   size="sm" 
                   className="h-5 w-5 ml-1 p-0 text-gray-500 hover:text-gray-700 hover:bg-transparent"
                   onClick={() => handlePriceRangeChange('all')}
                 >
                   <X className="h-3 w-3" />
                 </Button>
              </Badge>
            )}
          </div>
          
          <div className="text-sm text-white/80">
            {restaurants.length} résultat{restaurants.length > 1 ? 's' : ''} trouvé{restaurants.length > 1 ? 's' : ''}
          </div>
        </div>
        
        {/* Affichage des restaurants */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-white/20 h-48 rounded-t-lg"></div>
                <div className="border border-white/20 border-t-0 p-4 rounded-b-lg">
                  <div className="h-6 bg-white/20 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-white/20 rounded w-1/2 mb-3"></div>
                  <div className="h-4 bg-white/20 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {restaurants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.map((restaurant) => (
                  <ImprovedRestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    onClick={handleRestaurantClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex rounded-full bg-yellow-100 p-4 mb-4">
                  <Search className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-medium mb-2 text-white">Aucun restaurant trouvé</h3>
                <p className="text-white/80 mb-6">
                  Aucun restaurant ne correspond à vos critères de recherche.
                </p>
                <Button onClick={resetFilters} className="bg-white text-orange-600 hover:bg-orange-100">
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Panier */}
      <ShoppingCartComponent
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={handleCheckout}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-md border-t border-white/20 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white/80">
            <p>&copy; 2024 Bantudelice. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 