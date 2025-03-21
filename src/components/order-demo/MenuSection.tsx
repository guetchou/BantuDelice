
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  restaurant_id: string;
  available: boolean;
  category: string;
  image_url: string;
}

interface MenuSectionProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

const MenuSection: React.FC<MenuSectionProps> = ({ items, onAddToCart }) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Menu</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {items.map(item => (
          <Card key={item.id} className="p-4 flex flex-col">
            <div className="mb-2">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
            <div className="mt-auto flex justify-between items-center">
              <span className="font-bold">{item.price} FCFA</span>
              <Button 
                onClick={() => onAddToCart(item)}
                size="sm"
              >
                Ajouter
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};

export default MenuSection;
