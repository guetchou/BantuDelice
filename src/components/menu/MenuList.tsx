
import { MenuItem, MenuListProps } from "./types";
import MenuItemCard from "@/components/restaurant/MenuItemCard";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { CartItem } from "@/types/cart";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const MenuList = ({ items, onAddToCart, onRemoveFromCart, getQuantity, isLoading, showNutritionalInfo }: MenuListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucun plat disponible dans cette catégorie</p>
      </div>
    );
  }

  const handleAddToCart = (item: MenuItem) => {
    const cartItem: CartItem = {
      id: item.id,
      menu_item_id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      total: item.price,
      description: item.description,
      image_url: item.image_url,
      restaurant_id: item.restaurant_id,
      category: item.category
    };
    
    onAddToCart(cartItem);
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {items.map((item) => (
        <motion.div
          key={item.id}
          variants={itemAnimation}
          layoutId={item.id}
        >
          <MenuItemCard
            item={item}
            onAddToCart={() => handleAddToCart(item)}
            onRemoveFromCart={onRemoveFromCart ? () => onRemoveFromCart(item.id) : undefined}
            quantity={getQuantity ? getQuantity(item.id) : 0}
            showNutritionalInfo={showNutritionalInfo}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default MenuList;
