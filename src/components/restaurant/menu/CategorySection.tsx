
import React, { useState } from 'react';
import { MenuItem } from '@/types/menu';
import MenuItemCard from './MenuItemCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp } from 'lucide-react';

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
          </div>
          {!isCollapsed && mostPopular && (
            <p className="text-sm text-muted-foreground mt-1">
              Populaire: {mostPopular.name}
            </p>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={toggleCollapsed}>
          {isCollapsed ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
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
