
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Car, Truck, TrendingUp, Zap } from 'lucide-react';
import { VehicleType } from '@/types/taxi';

interface VehicleAndTimeSectionProps {
  vehicleType: VehicleType;
  onVehicleChange: (value: VehicleType) => void;
  pickupTime: 'now' | 'scheduled';
  onPickupTimeChange: (value: 'now' | 'scheduled') => void;
  scheduledTime?: string;
  onScheduledTimeChange?: (value: string) => void;
}

const VehicleAndTimeSection: React.FC<VehicleAndTimeSectionProps> = ({
  vehicleType,
  onVehicleChange,
  pickupTime,
  onPickupTimeChange,
  scheduledTime,
  onScheduledTimeChange
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Type de véhicule</h3>
        <RadioGroup 
          value={vehicleType} 
          onValueChange={(value) => onVehicleChange(value as VehicleType)}
          className="grid grid-cols-2 gap-4"
        >
          <div className="border p-4 rounded-lg hover:bg-muted/50 cursor-pointer">
            <RadioGroupItem value="standard" id="standard" className="sr-only" />
            <Label htmlFor="standard" className="cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <Car className="h-8 w-8 text-primary" />
                <span className="font-medium">Standard</span>
                <span className="text-sm text-muted-foreground">4 passagers max</span>
              </div>
            </Label>
          </div>
          
          <div className="border p-4 rounded-lg hover:bg-muted/50 cursor-pointer">
            <RadioGroupItem value="comfort" id="comfort" className="sr-only" />
            <Label htmlFor="comfort" className="cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <TrendingUp className="h-8 w-8 text-primary" />
                <span className="font-medium">Confort</span>
                <span className="text-sm text-muted-foreground">4 passagers max</span>
              </div>
            </Label>
          </div>
          
          <div className="border p-4 rounded-lg hover:bg-muted/50 cursor-pointer">
            <RadioGroupItem value="premium" id="premium" className="sr-only" />
            <Label htmlFor="premium" className="cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <Zap className="h-8 w-8 text-primary" />
                <span className="font-medium">Premium</span>
                <span className="text-sm text-muted-foreground">4 passagers max</span>
              </div>
            </Label>
          </div>
          
          <div className="border p-4 rounded-lg hover:bg-muted/50 cursor-pointer">
            <RadioGroupItem value="van" id="van" className="sr-only" />
            <Label htmlFor="van" className="cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <Truck className="h-8 w-8 text-primary" />
                <span className="font-medium">Van</span>
                <span className="text-sm text-muted-foreground">7 passagers max</span>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Heure de prise en charge</h3>
        <RadioGroup 
          value={pickupTime} 
          onValueChange={(value) => onPickupTimeChange(value as 'now' | 'scheduled')}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted/50 cursor-pointer">
            <RadioGroupItem value="now" id="now" />
            <Label htmlFor="now" className="font-medium cursor-pointer">Maintenant</Label>
          </div>
          
          <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted/50 cursor-pointer">
            <RadioGroupItem value="scheduled" id="scheduled" />
            <Label htmlFor="scheduled" className="font-medium cursor-pointer">Planifier</Label>
          </div>
        </RadioGroup>

        {pickupTime === 'scheduled' && onScheduledTimeChange && (
          <div className="mt-4">
            <Label htmlFor="scheduled-time">Heure planifiée</Label>
            <input
              id="scheduled-time"
              type="datetime-local"
              className="w-full mt-1 p-2 border rounded-md"
              value={scheduledTime}
              onChange={(e) => onScheduledTimeChange(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleAndTimeSection;
