
import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AnimatePresence, motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, Home, Info, Star, Search, ShoppingCart, Filter, ArrowUpDown } from "lucide-react";
import { useRestaurantMenu } from '@/hooks/useRestaurantMenu';
import { useCart } from '@/hooks/useCart';
import MenuList from '@/components/menu/MenuList';
import MenuGrid from '@/components/menu/MenuGrid';
import MenuFilters from '@/components/menu/MenuFilters';
import RestaurantHeader from '@/components/restaurant/RestaurantHeader';
import CartDrawer from '@/components/cart/CartDrawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import MenuItemDetail from '@/components/menu/MenuItemDetail';
import { MenuItem } from '@/types/menu';

const RestaurantMenu: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { items, categories, isLoading, error, popular } = useRestaurantMenu(id || '');
  const { addItem } = useCart();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showNutritionalInfo, setShowNutritionalInfo] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    sortBy: "" as "price_asc" | "price_desc" | "popularity" | ""
  });
  
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});
  
  useEffect(() => {
    // Initialize refs for each category
    categories.forEach(category => {
      categoryRefs.current[category] = null;
    });
  }, [categories]);
  
  // Handle filtering and sorting
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                          (item.description?.toLowerCase().includes(filters.search.toLowerCase()) || false);
    const matchesCategory = filters.category === "" || item.category === filters.category;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      case "popularity":
        return (b.popularity_score || 0) - (a.popularity_score || 0);
      default:
        return 0;
    }
  });
  
  const handleOpenItemDetail = (item: MenuItem) => {
    setSelectedItem(item);
  };
  
  const handleCloseItemDetail = () => {
    setSelectedItem(null);
  };
  
  const handleFilterChange = (newFilters: {
    search: string;
    category: string;
    sortBy: "price_asc" | "price_desc" | "popularity" | "";
  }) => {
    setFilters(newFilters);
  };
  
  const scrollToCategory = (category: string) => {
    setActiveCategory(category);
    
    if (category === "all") {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }
    
    const element = categoryRefs.current[category];
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: searchQuery }));
  };
  
  // Handle rating and favorite
  const handleRate = (itemId: string, rating: number) => {
    console.log(`Rating ${itemId} with ${rating} stars`);
    // In a real app, you would send this to your backend
  };
  
  const handleFavorite = (itemId: string) => {
    console.log(`Toggling favorite for ${itemId}`);
    // In a real app, you would send this to your backend
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Skeleton className="h-64 w-full rounded-xl mb-8" />
        <Skeleton className="h-10 w-48 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold text-red-500">Une erreur est survenue</h2>
        <p className="mt-2">{error.message}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Réessayer
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto pb-24">
      <RestaurantHeader restaurantId={id || ''} />
      
      {/* Mobile Search */}
      <div className="sticky top-0 z-30 bg-background p-4 border-b md:hidden">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <Input
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" variant="ghost">
            <Search className="h-4 w-4" />
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <div className="py-4">
                <h3 className="font-bold text-lg mb-4">Filtres</h3>
                <MenuFilters
                  categories={categories}
                  onFilterChange={handleFilterChange}
                />
              </div>
            </SheetContent>
          </Sheet>
          <Button 
            size="icon" 
            variant="outline"
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
          >
            {viewMode === 'list' ? (
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-1.5 h-1.5 bg-foreground rounded-sm"></div>
                <div className="w-1.5 h-1.5 bg-foreground rounded-sm"></div>
                <div className="w-1.5 h-1.5 bg-foreground rounded-sm"></div>
                <div className="w-1.5 h-1.5 bg-foreground rounded-sm"></div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="w-4 h-0.5 bg-foreground rounded-sm"></div>
                <div className="w-4 h-0.5 bg-foreground rounded-sm"></div>
                <div className="w-4 h-0.5 bg-foreground rounded-sm"></div>
              </div>
            )}
          </Button>
        </form>
      </div>
      
      <div className="flex flex-col md:flex-row">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 p-4 sticky top-0 h-screen">
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="relative">
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button className="absolute right-0 top-0 h-full" variant="ghost" type="submit">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
          
          <Button 
            variant="outline" 
            className="w-full justify-between mb-4"
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
          >
            <span>Affichage {viewMode === 'list' ? 'Liste' : 'Grille'}</span>
            <ArrowUpDown className="h-4 w-4 ml-2" />
          </Button>
          
          <div className="space-y-1 mb-4">
            <Button
              variant={activeCategory === "all" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => scrollToCategory("all")}
            >
              <Home className="mr-2 h-4 w-4" />
              Tous les plats
            </Button>
            
            <Button
              variant={activeCategory === "popular" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => scrollToCategory("popular")}
            >
              <Star className="mr-2 h-4 w-4" />
              Populaires
            </Button>
            
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => scrollToCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showNutritionalInfo}
                onChange={(e) => setShowNutritionalInfo(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span>Afficher valeurs nutritionnelles</span>
            </label>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-4">
          {/* Desktop Filters */}
          <div className="hidden md:block mb-6">
            <MenuFilters
              categories={categories}
              onFilterChange={handleFilterChange}
            />
          </div>
          
          {/* Popular Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            ref={(el) => (categoryRefs.current["popular"] = el)}
          >
            <h2 className="text-2xl font-bold mb-4">Plats populaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popular.slice(0, 3).map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-md transition-all cursor-pointer" onClick={() => handleOpenItemDetail(item)}>
                  {item.image_url && (
                    <div className="h-48 overflow-hidden">
                      <motion.img 
                        src={item.image_url} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex justify-between">
                      <h3 className="font-semibold">{item.name}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="text-sm font-medium">
                          {((item.popularity_score || 0) / 20).toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold">{(item.price / 100).toFixed(2)} FCFA </span>
                      {item.preparation_time && (
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{item.preparation_time}min</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <Separator className="my-8" />
          </motion.div>
          
          {/* Categories */}
          {categories.map((category) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              ref={(el) => (categoryRefs.current[category] = el)}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold mb-4">{category}</h2>
              
              {viewMode === 'list' ? (
                <MenuList
                  items={filteredItems.filter((item) => item.category === category)}
                  onAddToCart={addItem}
                  isLoading={false}
                  showNutritionalInfo={showNutritionalInfo}
                />
              ) : (
                <MenuGrid
                  items={filteredItems.filter((item) => item.category === category)}
                  onFavorite={handleFavorite}
                  onRate={handleRate}
                />
              )}
              
              <Separator className="my-8" />
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Floating Cart Button */}
      <Drawer open={showCartDrawer} onOpenChange={setShowCartDrawer}>
        <DrawerTrigger asChild>
          <Button className="fixed bottom-4 right-4 z-40 rounded-full w-16 h-16 shadow-lg">
            <ShoppingCart className="h-6 w-6" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[80vh]">
          <CartDrawer onClose={() => setShowCartDrawer(false)} />
        </DrawerContent>
      </Drawer>
      
      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <MenuItemDetail
            item={selectedItem}
            onClose={handleCloseItemDetail}
            onAddToCart={(item) => {
              addItem({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: 1,
                image_url: item.image_url,
                description: item.description,
                restaurant_id: item.restaurant_id
              });
              handleCloseItemDetail();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default RestaurantMenu;
