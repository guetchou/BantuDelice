
import { MenuItem } from "./types";
import MenuItemCard from "@/components/restaurant/MenuItemCard";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface MenuListProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  isLoading?: boolean;
}

const MenuList = ({ items, onAddToCart, isLoading }: MenuListProps) => {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <MenuItemCard
            item={item}
            onAddToCart={onAddToCart}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default MenuList;
