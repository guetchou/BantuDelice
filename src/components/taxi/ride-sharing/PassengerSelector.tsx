
import React from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface PassengerSelectorProps {
  maxPassengers: number;
  onChange: (value: number) => void;
}

export const PassengerSelector: React.FC<PassengerSelectorProps> = ({
  maxPassengers,
  onChange
}) => {
  const handleMaxPassengersChange = (value: number[]) => {
    onChange(value[0]);
  };
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <Label>Nombre de passagers max (en plus de vous)</Label>
        <span className="font-medium">{maxPassengers}</span>
      </div>
      <Slider
        value={[maxPassengers]}
        min={1}
        max={4}
        step={1}
        onValueChange={handleMaxPassengersChange}
      />
    </div>
  );
};
