import { MenuItem } from "./types";
import MenuItemCard from "@/components/restaurant/MenuItemCard";

interface MenuListProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

const MenuList = ({ items, onAddToCart }: MenuListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <MenuItemCard
          key={item.id}
          item={item}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default MenuList;