import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Star } from "lucide-react";
import { MenuItem } from "./types";

interface MenuGridProps {
  items: MenuItem[];
  onFavorite: (itemId: string) => void;
  onRate: (itemId: string, rating: number) => void;
}

const MenuGrid = ({ items, onFavorite, onRate }: MenuGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          {item.image_url && (
            <div className="relative">
              <img 
                src={item.image_url} 
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                onClick={() => onFavorite(item.id)}
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          )}
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <div className="flex items-center gap-1 text-yellow-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-4 w-4 cursor-pointer"
                      onClick={() => onRate(item.id, star)}
                      fill={star <= (item.popularity_score || 0) / 20 ? "currentColor" : "none"}
                    />
                  ))}
                </div>
              </div>
              <span className="text-lg font-bold">{item.price / 100}€</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">{item.description}</p>
            <div className="flex flex-wrap gap-2">
              {item.dietary_preferences?.map((pref) => (
                <Badge key={pref} variant="outline">{pref}</Badge>
              ))}
              {item.category && (
                <Badge variant="secondary">{item.category}</Badge>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MenuGrid;