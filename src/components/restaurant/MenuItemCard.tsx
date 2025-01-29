import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { MenuItem } from "@/components/menu/types";

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

const MenuItemCard = ({ item, onAddToCart }: MenuItemCardProps) => {
  return (
    <Card className="p-4">
      <div className="flex flex-col gap-4">
        {item.image_url ? (
          <AspectRatio ratio={16 / 9} className="bg-muted">
            <img
              src={item.image_url}
              alt={item.name}
              className="rounded-md object-cover w-full h-full"
            />
          </AspectRatio>
        ) : (
          <AspectRatio ratio={16 / 9} className="bg-muted">
            <div className="flex items-center justify-center w-full h-full text-muted-foreground">
              Image non disponible
            </div>
          </AspectRatio>
        )}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-gray-600">{item.description}</p>
            <p className="mt-2 font-bold">{item.price.toLocaleString()} FCFA</p>
          </div>
          <Button onClick={() => onAddToCart(item)}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MenuItemCard;