
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, X, Utensils, DollarSign, SlidersHorizontal, Leaf } from "lucide-react";

interface FilterProps {
  categories: string[];
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  maxPrice: number;
  minPrice: number;
  dietaryFilters: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
  };
  onDietaryChange: (type: 'vegetarian' | 'vegan' | 'glutenFree', value: boolean) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
}

const SmartFilters: React.FC<FilterProps> = ({
  categories,
  selectedCategories,
  onCategoriesChange,
  priceRange,
  onPriceRangeChange,
  maxPrice,
  minPrice,
  dietaryFilters,
  onDietaryChange,
  searchQuery,
  onSearchChange,
  onClearFilters,
  activeFiltersCount
}) => {
  const [showFilters, setShowFilters] = useState(false);
  
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };
  
  const handlePriceChange = (values: number[]) => {
    onPriceRangeChange([values[0], values[1]]);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
        <div className="relative w-full md:w-auto flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher un plat, un ingrédient..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtres
            {activeFiltersCount > 0 && (
              <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center">{activeFiltersCount}</Badge>
            )}
          </Button>
          
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="flex items-center gap-1 text-xs"
            >
              <X className="h-3.5 w-3.5" />
              Effacer
            </Button>
          )}
        </div>
      </div>
      
      {showFilters && (
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium">Catégories</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center gap-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <Label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium">Prix</h3>
                </div>
                
                <div className="px-3 pt-4">
                  <Slider
                    value={[priceRange[0], priceRange[1]]}
                    min={minPrice}
                    max={maxPrice}
                    step={500}
                    onValueChange={handlePriceChange}
                    className="py-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>{priceRange[0].toLocaleString('fr-FR')} FCFA</span>
                    <span>{priceRange[1].toLocaleString('fr-FR')} FCFA</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium">Préférences alimentaires</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="vegetarian"
                      checked={dietaryFilters.vegetarian}
                      onCheckedChange={(checked) => 
                        onDietaryChange('vegetarian', checked === true)
                      }
                    />
                    <Label htmlFor="vegetarian" className="text-sm cursor-pointer flex items-center gap-1">
                      <Leaf className="h-3.5 w-3.5 text-green-500" />
                      Végétarien
                    </Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="vegan"
                      checked={dietaryFilters.vegan}
                      onCheckedChange={(checked) => 
                        onDietaryChange('vegan', checked === true)
                      }
                    />
                    <Label htmlFor="vegan" className="text-sm cursor-pointer flex items-center gap-1">
                      <Leaf className="h-3.5 w-3.5 text-green-700" />
                      Vegan
                    </Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="gluten-free"
                      checked={dietaryFilters.glutenFree}
                      onCheckedChange={(checked) => 
                        onDietaryChange('glutenFree', checked === true)
                      }
                    />
                    <Label htmlFor="gluten-free" className="text-sm cursor-pointer">
                      Sans gluten
                    </Label>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-xs"
                      onClick={onClearFilters}
                    >
                      Réinitialiser les filtres
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Affichage des filtres actifs */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {selectedCategories.map(category => (
            <Badge 
              key={category} 
              variant="secondary" 
              className="flex items-center gap-1"
              onClick={() => toggleCategory(category)}
            >
              {category}
              <X className="h-3 w-3 ml-1 cursor-pointer" />
            </Badge>
          ))}
          
          {(priceRange[0] > minPrice || priceRange[1] < maxPrice) && (
            <Badge 
              variant="secondary" 
              className="flex items-center gap-1"
            >
              {priceRange[0].toLocaleString('fr-FR')} - {priceRange[1].toLocaleString('fr-FR')} FCFA
            </Badge>
          )}
          
          {dietaryFilters.vegetarian && (
            <Badge 
              variant="secondary" 
              className="flex items-center gap-1"
              onClick={() => onDietaryChange('vegetarian', false)}
            >
              Végétarien
              <X className="h-3 w-3 ml-1 cursor-pointer" />
            </Badge>
          )}
          
          {dietaryFilters.vegan && (
            <Badge 
              variant="secondary" 
              className="flex items-center gap-1"
              onClick={() => onDietaryChange('vegan', false)}
            >
              Vegan
              <X className="h-3 w-3 ml-1 cursor-pointer" />
            </Badge>
          )}
          
          {dietaryFilters.glutenFree && (
            <Badge 
              variant="secondary" 
              className="flex items-center gap-1"
              onClick={() => onDietaryChange('glutenFree', false)}
            >
              Sans gluten
              <X className="h-3 w-3 ml-1 cursor-pointer" />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartFilters;
