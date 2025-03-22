
import React from 'react';
import { MenuItem } from '@/types/menu';
import MenuItemCard from './MenuItemCard';

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
  return (
    <div className="space-y-4" id={`category-${category.toLowerCase().replace(/\s+/g, '-')}`}>
      <h2 className="text-xl font-semibold sticky top-24 bg-background/95 backdrop-blur-sm py-2 z-10">
        {category}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <MenuItemCard 
            key={item.id} 
            item={item} 
            onClick={onItemSelect ? () => onItemSelect(item) : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
