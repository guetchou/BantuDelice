
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Search,
  Filter,
  Utensils,
  Clock,
  Star,
  Heart,
  Tag,
  Leaf,
  Plus,
  AlertCircle,
  TrendingUp,
  BarChart4
} from "lucide-react";
import { useMenuEnhanced } from '@/hooks/useMenuEnhanced';
import { MenuItem } from '@/types/menu';
import { toast } from 'sonner';

interface EnhancedMenuViewProps {
  restaurantId: string;
  onItemSelect?: (item: MenuItem) => void;
  mode?: 'customer' | 'manager';
}

const EnhancedMenuView: React.FC<EnhancedMenuViewProps> = ({ 
  restaurantId, 
  onItemSelect,
  mode = 'customer'
}) => {
  const [activeView, setActiveView] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 20000]);
  
  const {
    allItems,
    filteredItems,
    isLoading,
    error,
    filters,
    updateFilters,
    clearFilters,
    selectedItem,
    selectItem,
    recommendedItems,
    menuAnalysis,
    menuSuggestions,
    getAvailableCategories
  } = useMenuEnhanced(restaurantId);
  
  // Gestion des catégories disponibles
  const categories = getAvailableCategories;
  
  if (isLoading) {
    return (
      <div className="w-full py-12">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Chargement du menu...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-xl font-medium mb-2">Erreur de chargement</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Impossible de charger le menu du restaurant. Veuillez réessayer ultérieurement.
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  const handleUpdateFilter = (key, value) => {
    updateFilters({ [key]: value });
  };
  
  const handleUpdateDietaryFilter = (key, value) => {
    updateFilters({
      dietary: {
        ...filters.dietary,
        [key]: value
      }
    });
  };
  
  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange(values);
    updateFilters({
      priceRange: {
        min: values[0],
        max: values[1]
      }
    });
  };
  
  const handleSelectItem = (item: MenuItem) => {
    selectItem(item);
    if (onItemSelect) {
      onItemSelect(item);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Barre de recherche et filtres */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher un plat, un ingrédient..."
            className="pl-10"
            value={filters.keyword}
            onChange={(e) => handleUpdateFilter('keyword', e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Button
              variant={activeView === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveView('grid')}
              className="h-9 w-9 p-0"
            >
              <BarChart4 className="h-4 w-4" />
            </Button>
            <Button
              variant={activeView === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveView('list')}
              className="h-9 w-9 p-0"
            >
              <Utensils className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtres
          </Button>
          
          {filters.categories.length > 0 || 
           filters.dietary.vegetarian || 
           filters.dietary.vegan || 
           filters.dietary.glutenFree || 
           filters.priceRange.min !== undefined || 
           filters.priceRange.max !== undefined ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs"
            >
              Effacer les filtres
            </Button>
          ) : null}
        </div>
      </div>
      
      {/* Zone de filtres */}
      {showFilters && (
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h3 className="font-medium mb-2">Catégories</h3>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center gap-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={filters.categories.includes(category)}
                        onCheckedChange={(checked) => {
                          const newCategories = checked 
                            ? [...filters.categories, category]
                            : filters.categories.filter(c => c !== category);
                          handleUpdateFilter('categories', newCategories);
                        }}
                      />
                      <Label htmlFor={`category-${category}`} className="text-sm">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium mb-2">Options diététiques</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="vegetarian"
                      checked={filters.dietary.vegetarian}
                      onCheckedChange={(checked) => 
                        handleUpdateDietaryFilter('vegetarian', !!checked)
                      }
                    />
                    <Label htmlFor="vegetarian" className="text-sm flex items-center gap-1">
                      <Leaf className="h-3 w-3 text-green-500" />
                      Végétarien
                    </Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="vegan"
                      checked={filters.dietary.vegan}
                      onCheckedChange={(checked) => 
                        handleUpdateDietaryFilter('vegan', !!checked)
                      }
                    />
                    <Label htmlFor="vegan" className="text-sm flex items-center gap-1">
                      <Leaf className="h-3 w-3 text-green-700" />
                      Vegan
                    </Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="gluten-free"
                      checked={filters.dietary.glutenFree}
                      onCheckedChange={(checked) => 
                        handleUpdateDietaryFilter('glutenFree', !!checked)
                      }
                    />
                    <Label htmlFor="gluten-free" className="text-sm">
                      Sans gluten
                    </Label>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2">
                    <Checkbox
                      id="show-unavailable"
                      checked={filters.includeUnavailable}
                      onCheckedChange={(checked) => 
                        handleUpdateFilter('includeUnavailable', !!checked)
                      }
                    />
                    <Label htmlFor="show-unavailable" className="text-sm">
                      Afficher les plats indisponibles
                    </Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium mb-2">Plage de prix (FCFA)</h3>
                <div className="px-3">
                  <Slider
                    value={priceRange}
                    min={0}
                    max={20000}
                    step={500}
                    onValueChange={handlePriceRangeChange}
                    className="py-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>{priceRange[0].toLocaleString('fr-FR')} FCFA</span>
                    <span>{priceRange[1].toLocaleString('fr-FR')} FCFA</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Statistiques du menu (pour les managers) */}
      {mode === 'manager' && menuAnalysis && (
        <Card className="bg-primary/5">
          <CardContent className="pt-6">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analyse du menu ({menuAnalysis.totalItems} plats)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-card p-3 rounded-md">
                <div className="text-sm text-muted-foreground">Prix moyen</div>
                <div className="text-xl font-medium mt-1">
                  {menuAnalysis.priceStats.average.toLocaleString('fr-FR')} FCFA
                </div>
              </div>
              
              <div className="bg-card p-3 rounded-md">
                <div className="text-sm text-muted-foreground">Catégorie principale</div>
                <div className="text-xl font-medium mt-1">
                  {menuAnalysis.mostPopularCategory}
                </div>
              </div>
              
              <div className="bg-card p-3 rounded-md">
                <div className="text-sm text-muted-foreground">Plats végétariens</div>
                <div className="text-xl font-medium mt-1">
                  {menuAnalysis.dietaryOptions.vegetarianPercentage.toFixed(1)}%
                </div>
              </div>
              
              <div className="bg-card p-3 rounded-md">
                <div className="text-sm text-muted-foreground">Plage de prix</div>
                <div className="text-xl font-medium mt-1">
                  {menuAnalysis.priceStats.min.toLocaleString('fr-FR')} - {menuAnalysis.priceStats.max.toLocaleString('fr-FR')} FCFA
                </div>
              </div>
            </div>
            
            {menuSuggestions.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Suggestions d'amélioration:</h4>
                <ul className="space-y-1">
                  {menuSuggestions.map((suggestion, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                      <span>{suggestion.message}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Affichage des plats */}
      <div>
        {filteredItems.length === 0 ? (
          <Card className="w-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Aucun plat trouvé</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Aucun plat ne correspond à vos critères de recherche. Essayez d'ajuster vos filtres.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={clearFilters}
              >
                Effacer tous les filtres
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {activeView === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <MenuItemCard 
                    key={item.id} 
                    item={item} 
                    mode={mode}
                    onClick={() => handleSelectItem(item)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredItems.map((item) => (
                  <MenuItemRow 
                    key={item.id} 
                    item={item} 
                    mode={mode}
                    onClick={() => handleSelectItem(item)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Plats recommandés si un article est sélectionné */}
      {selectedItem && recommendedItems.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Accompagnements recommandés pour <span className="italic">{selectedItem.name}</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedItems.map((item) => (
              <MenuItemCard 
                key={item.id} 
                item={item} 
                mode={mode}
                onClick={() => handleSelectItem(item)}
                compact
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface MenuItemCardProps {
  item: MenuItem;
  onClick: () => void;
  mode?: 'customer' | 'manager';
  compact?: boolean;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ 
  item, 
  onClick, 
  mode = 'customer',
  compact = false
}) => {
  return (
    <Card 
      className={`overflow-hidden cursor-pointer transition-transform hover:shadow-md ${
        !item.available ? 'opacity-60' : ''
      } ${compact ? 'h-[280px]' : ''}`}
      onClick={onClick}
    >
      <div className="relative">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className={`w-full object-cover ${compact ? 'h-32' : 'h-48'}`}
          />
        ) : (
          <div className={`w-full bg-primary/10 flex items-center justify-center ${compact ? 'h-32' : 'h-48'}`}>
            <Utensils className="text-primary/30 h-12 w-12" />
          </div>
        )}
        
        {!item.available && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Badge variant="destructive">Non disponible</Badge>
          </div>
        )}
        
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {item.is_vegetarian && (
            <Badge className="bg-green-500">Végétarien</Badge>
          )}
          {item.is_vegan && (
            <Badge className="bg-green-700">Vegan</Badge>
          )}
          {item.is_gluten_free && (
            <Badge variant="outline" className="bg-white/80">Sans gluten</Badge>
          )}
          {mode === 'manager' && item.featured && (
            <Badge className="bg-amber-500">Mis en avant</Badge>
          )}
        </div>
      </div>
      
      <CardContent className={`p-4 ${compact ? 'space-y-1' : 'space-y-2'}`}>
        <div className="flex justify-between items-start">
          <h3 className={`font-medium ${compact ? 'text-sm' : ''}`}>{item.name}</h3>
          <span className="font-bold text-primary">
            {item.price.toLocaleString('fr-FR')} FCFA
          </span>
        </div>
        
        {!compact && (
          <p className="text-muted-foreground text-sm line-clamp-2">
            {item.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>{item.preparation_time || '15-20'} min</span>
            
            {mode === 'manager' && item.popularity_score !== undefined && (
              <div className="flex items-center ml-3">
                <Star className={`h-3 w-3 mr-1 ${
                  item.popularity_score > 0.7 ? 'text-yellow-500' : 'text-muted-foreground'
                }`} />
                <span>{(item.popularity_score * 100).toFixed(0)}%</span>
              </div>
            )}
          </div>
          
          {mode === 'customer' && (
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {mode === 'manager' && item.profit_margin !== undefined && (
          <div className="flex items-center text-xs text-muted-foreground">
            <TrendingUp className={`h-3 w-3 mr-1 ${
              item.profit_margin > 0.4 ? 'text-green-500' : 'text-muted-foreground'
            }`} />
            <span>Marge: {(item.profit_margin * 100).toFixed(0)}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface MenuItemRowProps {
  item: MenuItem;
  onClick: () => void;
  mode?: 'customer' | 'manager';
}

const MenuItemRow: React.FC<MenuItemRowProps> = ({ 
  item, 
  onClick, 
  mode = 'customer'
}) => {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        !item.available ? 'opacity-60' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex">
        <div className="relative w-24 h-24 shrink-0">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
              <Utensils className="text-primary/30 h-6 w-6" />
            </div>
          )}
          
          {!item.available && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Badge variant="destructive" className="text-[10px] px-1 py-0">Non disponible</Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-4 flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{item.name}</h3>
                <div className="flex gap-1">
                  {item.is_vegetarian && (
                    <Leaf className="h-4 w-4 text-green-500" />
                  )}
                  {item.is_vegan && (
                    <Leaf className="h-4 w-4 text-green-700" />
                  )}
                </div>
              </div>
              
              <p className="text-muted-foreground text-sm line-clamp-1 mt-1">
                {item.description}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {mode === 'manager' && (
                <div className="flex flex-col items-end">
                  {item.popularity_score !== undefined && (
                    <div className="flex items-center">
                      <Star className={`h-3 w-3 mr-1 ${
                        item.popularity_score > 0.7 ? 'text-yellow-500' : 'text-muted-foreground'
                      }`} />
                      <span className="text-xs">{(item.popularity_score * 100).toFixed(0)}%</span>
                    </div>
                  )}
                  
                  {item.profit_margin !== undefined && (
                    <div className="flex items-center">
                      <TrendingUp className={`h-3 w-3 mr-1 ${
                        item.profit_margin > 0.4 ? 'text-green-500' : 'text-muted-foreground'
                      }`} />
                      <span className="text-xs">Marge: {(item.profit_margin * 100).toFixed(0)}%</span>
                    </div>
                  )}
                </div>
              )}
              
              <div className="text-right">
                <span className="font-bold text-primary block">
                  {item.price.toLocaleString('fr-FR')} FCFA
                </span>
                <div className="flex items-center text-xs text-muted-foreground mt-1 justify-end">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{item.preparation_time || '15-20'} min</span>
                </div>
              </div>
              
              {mode === 'customer' && (
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default EnhancedMenuView;
