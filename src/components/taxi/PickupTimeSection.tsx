
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Clock } from "lucide-react";

interface PickupTimeSectionProps {
  pickupTime: string;
  setPickupTime: (time: string) => void;
}

const PickupTimeSection = ({ pickupTime, setPickupTime }: PickupTimeSectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="pickup-time">
        <Clock className="inline-block h-4 w-4 mr-2" />
        Heure de prise en charge
      </Label>
      <Input
        id="pickup-time"
        type="datetime-local"
        value={pickupTime}
        onChange={(e) => setPickupTime(e.target.value)}
        min={new Date().toISOString().slice(0, 16)}
      />
    </div>
  );
};

export default PickupTimeSection;
