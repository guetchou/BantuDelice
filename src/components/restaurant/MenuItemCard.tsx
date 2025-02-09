
import { ShoppingCart, Star, Info, Clock, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import { MenuItem } from "@/components/menu/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

const MenuItemCard = ({ item, onAddToCart }: MenuItemCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300">
      <div className="relative">
        {item.image_url ? (
          <AspectRatio ratio={16 / 9}>
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </AspectRatio>
        ) : (
          <AspectRatio ratio={16 / 9}>
            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
              Image non disponible
            </div>
          </AspectRatio>
        )}
        
        {item.popularity_score && item.popularity_score > 80 && (
          <Badge 
            className="absolute top-2 left-2 bg-orange-500"
            variant="secondary"
          >
            Populaire
          </Badge>
        )}
      </div>

      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{item.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {item.description}
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Info className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{item.name}</DialogTitle>
                <DialogDescription>{item.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {item.ingredients && (
                  <div>
                    <h4 className="font-semibold mb-2">Ingrédients</h4>
                    <div className="flex flex-wrap gap-2">
                      {item.ingredients.map((ingredient) => (
                        <Badge key={ingredient} variant="outline">
                          {ingredient}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {item.allergens && (
                  <div>
                    <h4 className="font-semibold mb-2">Allergènes</h4>
                    <div className="flex flex-wrap gap-2">
                      {item.allergens.map((allergen) => (
                        <Badge key={allergen} variant="destructive">
                          {allergen}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {item.calories && (
                  <div>
                    <h4 className="font-semibold">Information nutritionnelle</h4>
                    <p>{item.calories} calories</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-4 text-sm">
          {item.preparation_time && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{item.preparation_time} min</span>
            </div>
          )}
          {item.rating && (
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <span>{item.rating}/5</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {item.dietary_preferences?.map((pref) => (
            <Tooltip key={pref}>
              <Badge variant="outline" className="flex items-center gap-1">
                <Leaf className="h-3 w-3" />
                {pref}
              </Badge>
            </Tooltip>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="font-bold text-lg">
            {formatPrice(item.price)}
          </span>
          <Button 
            onClick={() => onAddToCart(item)}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MenuItemCard;
