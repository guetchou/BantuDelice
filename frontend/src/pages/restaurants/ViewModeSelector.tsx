
import { Grid3X3, Map, List } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { RestaurantViewMode } from '@/types/restaurant';

interface ViewModeSelectorProps {
  viewMode: RestaurantViewMode;
  setViewMode: (mode: RestaurantViewMode) => void;
}

export default function ViewModeSelector({
  viewMode,
  setViewMode
}: ViewModeSelectorProps) {
  return (
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
  );
}
