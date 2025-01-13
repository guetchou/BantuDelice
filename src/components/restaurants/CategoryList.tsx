import { Button } from "@/components/ui/button";
import { ChefHat } from "lucide-react";

interface Category {
  id: string;
  label: string;
  icon: typeof ChefHat;
}

interface CategoryListProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const CategoryList = ({ categories, selectedCategory, onSelectCategory }: CategoryListProps) => {
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