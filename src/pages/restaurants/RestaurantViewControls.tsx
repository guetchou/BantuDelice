
import { Grid3X3, Map, List } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import type { RestaurantViewMode, RestaurantFilters } from '@/types/restaurant';

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

interface RestaurantViewControlsProps {
  viewMode: RestaurantViewMode;
  setViewMode: (mode: RestaurantViewMode) => void;
  filters: RestaurantFilters;
  onFilterChange: (filters: Partial<RestaurantFilters>) => void;
}

export default function RestaurantViewControls({
  viewMode,
  setViewMode,
  filters,
  onFilterChange,
}: RestaurantViewControlsProps) {
  return (
    <div className="flex-grow">
      <Tabs 
        defaultValue="grid" 
        value={viewMode} 
        onValueChange={(value) => setViewMode(value as RestaurantViewMode)}
        className="mb-6"
      >
        <TabsList className="grid grid-cols-3 w-[240px] bg-gray-800">
          <TabsTrigger value="grid" className="flex items-center gap-2">
            <Grid3X3 size={16} />
            Grille
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List size={16} />
            Liste
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <Map size={16} />
            Carte
          </TabsTrigger>
        </TabsList>
      </Tabs>

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
          onValueChange={(value) => onFilterChange({ cuisine_type: value ? [value] : [] })}
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

      <div className="flex items-center gap-2 mb-6">
        <p className="text-sm text-gray-300 min-w-[120px]">Distance maximum:</p>
        <Slider
          value={[filters.distance || 10]}
          min={1}
          max={20}
          step={1}
          onValueChange={([value]) => onFilterChange({ distance: value })}
          className="flex-1"
        />
        <span className="min-w-[60px] text-sm text-gray-300">{filters.distance || 10} km</span>
      </div>
    </div>
  );
}
