import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterBarProps {
  onFilterChange: (filters: {
    search: string;
    cuisineType: string;
    dietaryPreference: string;
    priceRange: string;
  }) => void;
}

const FilterBar = ({ onFilterChange }: FilterBarProps) => {
  const [filters, setFilters] = useState({
    search: "",
    cuisineType: "all",
    dietaryPreference: "all",
    priceRange: "all",
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-lg shadow-sm">
      <Input
        placeholder="Rechercher un restaurant..."
        value={filters.search}
        onChange={(e) => handleFilterChange("search", e.target.value)}
        className="md:w-1/3"
      />
      
      <Select
        value={filters.cuisineType}
        onValueChange={(value) => handleFilterChange("cuisineType", value)}
      >
        <SelectTrigger className="md:w-1/4">
          <SelectValue placeholder="Type de cuisine" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les types</SelectItem>
          <SelectItem value="congolais">Congolais</SelectItem>
          <SelectItem value="italien">Italien</SelectItem>
          <SelectItem value="japonais">Japonais</SelectItem>
          <SelectItem value="indien">Indien</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.dietaryPreference}
        onValueChange={(value) => handleFilterChange("dietaryPreference", value)}
      >
        <SelectTrigger className="md:w-1/4">
          <SelectValue placeholder="Préférences alimentaires" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les préférences</SelectItem>
          <SelectItem value="vegetarien">Végétarien</SelectItem>
          <SelectItem value="vegan">Vegan</SelectItem>
          <SelectItem value="sans_gluten">Sans gluten</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.priceRange}
        onValueChange={(value) => handleFilterChange("priceRange", value)}
      >
        <SelectTrigger className="md:w-1/4">
          <SelectValue placeholder="Gamme de prix" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les prix</SelectItem>
          <SelectItem value="low">$ Économique</SelectItem>
          <SelectItem value="medium">$$ Moyen</SelectItem>
          <SelectItem value="high">$$$ Élevé</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterBar;