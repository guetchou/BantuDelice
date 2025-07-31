
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import RestaurantFilters from '@/components/restaurants/RestaurantFilters';
import type { RestaurantFilters as Filters } from '@/types/restaurant';

interface FiltersPanelProps {
  filters: Filters;
  onFilterChange: (newFilters: Partial<Filters>) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onFindNearMe: () => void;
}

export default function FiltersPanel({
  filters,
  onFilterChange,
  searchQuery,
  setSearchQuery,
  onFindNearMe
}: FiltersPanelProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6 mb-6">
      <RestaurantFilters
        filters={filters}
        onChange={onFilterChange}
      />
    </div>
  );
}
