
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { RestaurantFilters } from '@/types/restaurant';

const CUISINE_TYPES = [
  "Tout",
  "Africain",
  "Congolais",
  "Européen", 
  "Italien",
  "Asiatique",
  "Fast Food",
  "Végétarien",
  "Fruits de mer"
];

interface SortingControlsProps {
  filters: RestaurantFilters;
  onFilterChange: (filters: Partial<RestaurantFilters>) => void;
}

export default function SortingControls({
  filters,
  onFilterChange
}: SortingControlsProps) {
  return (
    <div className="mb-4 flex flex-wrap gap-4">
      <Select
        value={filters.sortBy}
        onValueChange={(value) => onFilterChange({ sortBy: value })}
      >
        <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
          <SelectValue placeholder="Trier par" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700 text-white">
          <SelectItem value="distance">Distance</SelectItem>
          <SelectItem value="rating">Évaluation</SelectItem>
          <SelectItem value="price">Prix</SelectItem>
          <SelectItem value="trending">Popularité</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.cuisine_type?.length ? filters.cuisine_type[0] : "all"}
        onValueChange={(value) => onFilterChange({ cuisine_type: value === "all" ? [] : [value] })}
      >
        <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
          <SelectValue placeholder="Type de cuisine" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700 text-white">
          <SelectItem value="all">Toutes les cuisines</SelectItem>
          {CUISINE_TYPES.map(type => (
            <SelectItem key={type} value={type === "Tout" ? "all" : type}>{type}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
