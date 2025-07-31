
import React, { useState } from 'react';
import { MenuItem } from '@/types/menu';
import MenuItemCard from './MenuItemCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CategorySectionProps {
  category: string;
  items: MenuItem[];
  onItemSelect?: (item: MenuItem) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ 
  category, 
  items,
  onItemSelect
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Données d'analytique de catégorie
  const avgPrice = items.reduce((sum, item) => sum + item.price, 0) / items.length;
  const mostPopular = items.sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0))[0];
  
  // Calculate additional analytics
  const highestPrice = Math.max(...items.map(item => item.price));
  const lowestPrice = Math.min(...items.map(item => item.price));
  const priceRange = highestPrice - lowestPrice;
  const vegetarianCount = items.filter(item => item.is_vegetarian).length;
  const veganCount = items.filter(item => item.is_vegan).length;
  const availableCount = items.filter(item => item.available).length;
  
  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="space-y-4 border border-border rounded-lg p-5 shadow-sm" id={`category-${category.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex justify-between items-center sticky top-24 bg-background/95 backdrop-blur-sm py-2 z-10 border-b">
        <div className="flex flex-col">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold">
              {category}
            </h2>
            <Badge variant="outline" className="ml-2 text-xs">
              {items.length} items
            </Badge>
            {avgPrice > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                Moy. {Math.round(avgPrice).toLocaleString('fr-FR')} FCFA
              </Badge>
            )}
            {availableCount < items.length && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {availableCount}/{items.length} disponibles
              </Badge>
            )}
          </div>
          {!isCollapsed && mostPopular && (
            <div className="flex items-center mt-1 text-sm text-muted-foreground">
              <span>Populaire: {mostPopular.name}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                      <Info className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-1 text-xs">
                      <p>Prix: {lowestPrice.toLocaleString('fr-FR')} - {highestPrice.toLocaleString('fr-FR')} FCFA</p>
                      <p>Écart de prix: {priceRange.toLocaleString('fr-FR')} FCFA</p>
                      <p>Options végétariennes: {vegetarianCount}</p>
                      <p>Options véganes: {veganCount}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={toggleCollapsed} className="ml-2 flex items-center">
          {isCollapsed ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronUp className="h-4 w-4 mr-1" />}
          {isCollapsed ? "Développer" : "Réduire"}
        </Button>
      </div>
      
      {!isCollapsed && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-300 ease-in-out">
          {items.map(item => (
            <MenuItemCard 
              key={item.id} 
              item={item} 
              onClick={onItemSelect ? () => onItemSelect(item) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySection;
