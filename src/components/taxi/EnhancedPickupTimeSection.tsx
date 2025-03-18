
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Clock } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface EnhancedPickupTimeSectionProps {
  pickupTime: 'now' | 'scheduled';
  scheduledTime: string;
  onPickupTimeChange: (time: 'now' | 'scheduled') => void;
  onScheduledTimeChange: (time: string) => void;
}

const EnhancedPickupTimeSection = ({
  pickupTime,
  scheduledTime,
  onPickupTimeChange,
  onScheduledTimeChange
}: EnhancedPickupTimeSectionProps) => {
  return (
    <div className="space-y-4">
      <Label>
        <Clock className="inline-block h-4 w-4 mr-2" />
        Heure de prise en charge
      </Label>
      
      <RadioGroup value={pickupTime} onValueChange={(value) => onPickupTimeChange(value as 'now' | 'scheduled')} className="space-y-2">
        <div className="flex items-center space-x-2 border rounded-lg p-3">
          <RadioGroupItem value="now" id="now" />
          <Label htmlFor="now" className="flex-1">Maintenant</Label>
        </div>
        <div className="flex items-center space-x-2 border rounded-lg p-3">
          <RadioGroupItem value="scheduled" id="scheduled" />
          <Label htmlFor="scheduled" className="flex-1">Programmer</Label>
        </div>
      </RadioGroup>
      
      {pickupTime === 'scheduled' && (
        <div className="mt-2">
          <Input
            type="datetime-local"
            value={scheduledTime}
            onChange={(e) => onScheduledTimeChange(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>
      )}
    </div>
  );
};

export default EnhancedPickupTimeSection;
