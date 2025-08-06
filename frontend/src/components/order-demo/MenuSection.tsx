
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CartItem } from "@/types/cart";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  restaurant_id: string;
  description?: string;
}

interface MenuSectionProps {
  items: MenuItem[];
  onAddToCart: (item: CartItem) => void;
}

const MenuSection: React.FC<MenuSectionProps> = ({ items, onAddToCart }) => {
  const handleAddToCart = (item: MenuItem) => {
    onAddToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      restaurant_id: item.restaurant_id,
      menu_item_id: item.id,
      total: item.price * 1,
      description: item.description,
      options: []
    });
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Menu du restaurant</CardTitle>
        <CardDescription>Choisissez vos plats préférés</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{item.name}</CardTitle>
                <CardDescription>{item.price.toFixed(2)} FCFA </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between pt-2">
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => handleAddToCart(item)}
                >
                  <Plus className="h-4 w-4 mr-2" /> Ajouter
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuSection;
