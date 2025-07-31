
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp } from 'lucide-react';
import { MenuItem } from '@/types/menu';

interface RecommendedItemProps {
  item: MenuItem;
  badge?: {
    icon: React.ReactNode;
    text: string;
  };
  onAddToCart: (item: MenuItem) => void;
}

const RecommendedItem: React.FC<RecommendedItemProps> = ({ item, badge, onAddToCart }) => {
  return (
    <div className="flex items-center justify-between gap-3 p-2 rounded-md hover:bg-accent transition-colors">
      <div className="flex gap-3 flex-1 min-w-0">
        {item.image_url ? (
          <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
            <img 
              src={item.image_url} 
              alt={item.name} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
            <span className="text-xs text-muted-foreground">Image</span>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm truncate">{item.name}</h4>
            {badge && (
              <Badge variant="secondary" className="ml-1 flex items-center gap-1 text-xs">
                {badge.icon}
                <span>{badge.text}</span>
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {item.description || item.category}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium whitespace-nowrap">
          {item.price.toLocaleString('fr-FR')} FCFA
        </span>
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-8 w-8 p-0 rounded-full" 
          onClick={() => onAddToCart(item)}
        >
          <span className="sr-only">Ajouter au panier</span>
          <TrendingUp className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default RecommendedItem;
