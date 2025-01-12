import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  available: boolean;
}

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

const MenuItemCard = ({ item, onAddToCart }: MenuItemCardProps) => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-gray-600">{item.description}</p>
          <p className="mt-2 font-bold">{item.price.toLocaleString()} FC</p>
        </div>
        <Button onClick={() => onAddToCart(item)}>
          <ShoppingCart className="w-4 h-4 mr-2" />
          Ajouter
        </Button>
      </div>
    </Card>
  );
};

export default MenuItemCard;