import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SortAsc, SortDesc } from "lucide-react";

interface MenuFiltersProps {
  categories: string[];
  onFilterChange: (filters: {
    search: string;
    category: string;
    sortBy: "price_asc" | "price_desc" | "popularity" | "";
  }) => void;
}

const MenuFilters = ({ categories, onFilterChange }: MenuFiltersProps) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState<"price_asc" | "price_desc" | "popularity" | "">("");

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFilterChange({ search: value, category, sortBy });
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    onFilterChange({ search, category: value, sortBy });
  };

  const handleSortChange = (value: "price_asc" | "price_desc" | "popularity" | "") => {
    setSortBy(value);
    onFilterChange({ search, category, sortBy: value });
  };

  return (
    <div className="flex flex-col gap-4 mb-6 p-4 bg-white rounded-lg shadow">
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un plat..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes les catégories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button
          variant={sortBy === "price_asc" ? "default" : "outline"}
          size="sm"
          onClick={() => handleSortChange(sortBy === "price_asc" ? "" : "price_asc")}
        >
          <SortAsc className="h-4 w-4 mr-2" />
          Prix croissant
        </Button>
        <Button
          variant={sortBy === "price_desc" ? "default" : "outline"}
          size="sm"
          onClick={() => handleSortChange(sortBy === "price_desc" ? "" : "price_desc")}
        >
          <SortDesc className="h-4 w-4 mr-2" />
          Prix décroissant
        </Button>
        <Button
          variant={sortBy === "popularity" ? "default" : "outline"}
          size="sm"
          onClick={() => handleSortChange(sortBy === "popularity" ? "" : "popularity")}
        >
          🔥 Popularité
        </Button>
      </div>
    </div>
  );
};

export default MenuFilters;