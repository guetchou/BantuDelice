
import { Slider } from '@/components/ui/slider';
import type { RestaurantFilters } from '@/types/restaurant';

interface DistanceSliderProps {
  distance: number;
  onDistanceChange: (distance: number) => void;
}

export default function DistanceSlider({
  distance,
  onDistanceChange
}: DistanceSliderProps) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <p className="text-sm text-gray-300 min-w-[120px]">Distance maximum:</p>
      <Slider
        value={[distance]}
        min={1}
        max={20}
        step={1}
        onValueChange={([value]) => onDistanceChange(value)}
        className="flex-1"
      />
      <span className="min-w-[60px] text-sm text-gray-300">{distance} km</span>
    </div>
  );
}
