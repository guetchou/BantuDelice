import { Button } from "@/components/ui/button";
import { ChefHat, Utensils, Cylinder, Car, Calendar } from "lucide-react";

interface Category {
  id: string;
  label: string;
  icon: typeof ChefHat;
}

interface CategoryListProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const categories: Category[] = [
  { id: 'Tout', label: 'Tout', icon: ChefHat },
  { id: 'Congolais', label: 'Congolais', icon: Utensils },
  { id: 'Fast Food', label: 'Fast Food', icon: ChefHat },
  { id: 'Healthy', label: 'Healthy', icon: ChefHat },
  { id: 'Livraison', label: 'Livraison', icon: Car },
  { id: 'Gaz', label: 'Gaz', icon: Cylinder }
];

const CategoryList = ({ selectedCategory, onSelectCategory }: CategoryListProps) => {
  return (
    <div className="flex space-x-4 overflow-x-auto pb-4 mb-8 scrollbar-hide">
      {categories.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          variant={selectedCategory === id ? "default" : "outline"}
          onClick={() => onSelectCategory(id)}
          className="whitespace-nowrap flex items-center gap-2"
        >
          <Icon className="w-4 h-4" />
          {label}
        </Button>
      ))}
    </div>
  );
};

export default CategoryList;