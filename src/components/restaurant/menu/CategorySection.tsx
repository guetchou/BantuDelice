
import React from 'react';
import { MenuItem } from '@/types/menu';
import MenuItemCard from './MenuItemCard';

interface CategorySectionProps {
  category: string;
  items: MenuItem[];
}

const CategorySection: React.FC<CategorySectionProps> = ({ category, items }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{category}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
