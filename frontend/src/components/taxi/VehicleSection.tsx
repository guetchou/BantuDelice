
import React from 'react';
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VehicleSectionProps {
  vehicleType: string;
  setVehicleType: (type: string) => void;
}

const VehicleSection = ({ vehicleType, setVehicleType }: VehicleSectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="vehicle-type">Type de véhicule</Label>
      <Select value={vehicleType} onValueChange={setVehicleType}>
        <SelectTrigger>
          <SelectValue placeholder="Choisir un type de véhicule" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="standard">Standard (4 places)</SelectItem>
          <SelectItem value="premium">Premium (4 places)</SelectItem>
          <SelectItem value="van">Van (7 places)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default VehicleSection;
