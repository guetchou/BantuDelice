
import type { RestaurantViewMode, RestaurantFilters } from '@/types/restaurant';
import ViewModeSelector from './ViewModeSelector';
import SortingControls from './SortingControls';
import DistanceSlider from './DistanceSlider';

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
  const handleDistanceChange = (distance: number) => {
    onFilterChange({ distance });
  };

  return (
    <div className="flex-grow">
      <ViewModeSelector viewMode={viewMode} setViewMode={setViewMode} />
      <SortingControls filters={filters} onFilterChange={onFilterChange} />
      <DistanceSlider 
        distance={filters.distance || 10} 
        onDistanceChange={handleDistanceChange} 
      />
    </div>
  );
}
