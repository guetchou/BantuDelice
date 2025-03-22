
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
      quantity: 1
    });
    
    toast.success(`${item.name} ajouté au panier`);
  };

  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div>
        <h3 className="font-medium">{item.name}</h3>
        <p className="text-sm text-gray-500">{item.description}</p>
        <p className="text-sm font-bold mt-1">{(item.price / 100).toFixed(2)} €</p>
      </div>
      <Button variant="ghost" size="icon" onClick={handleAddToCart}>
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default MenuItem;
