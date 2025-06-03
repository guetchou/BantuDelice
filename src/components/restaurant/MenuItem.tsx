
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { MenuItem as MenuItemType } from '@/types/menu';
import { useCart } from '@/hooks/useCart';

interface MenuItemComponentProps {
  item: MenuItemType;
}

const MenuItem: React.FC<MenuItemComponentProps> = ({ item }) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image_url: item.image_url,
      description: item.description,
      restaurant_id: item.restaurant_id,
      quantity: 1,
      menu_item_id: item.id,
      total: item.price,
      options: []
    });
    
    toast.success(`${item.name} ajouté au panier`);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-b hover:bg-gray-50 transition-colors rounded-lg">
      <div className="flex flex-col space-y-1">
        <h3 className="font-medium text-lg">{item.name}</h3>
        <p className="text-sm text-gray-500">{item.description}</p>
        <p className="text-sm font-bold mt-1 text-orange-500">{(item.price / 100).toFixed(2)} €</p>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleAddToCart}
        className="mt-2 md:mt-0 hover:bg-orange-50 hover:text-orange-600 transition-colors"
      >
        <Plus className="h-4 w-4 mr-1" />
        <span>Ajouter</span>
      </Button>
    </div>
  );
};

export default MenuItem;
