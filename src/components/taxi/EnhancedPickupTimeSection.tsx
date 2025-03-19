
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Clock, Calendar } from "lucide-react";

interface EnhancedPickupTimeSectionProps {
  pickupTime: 'now' | 'scheduled';
  scheduledTime: string;
  onPickupTimeChange: (value: 'now' | 'scheduled') => void;
  onScheduledTimeChange: (value: string) => void;
}

const EnhancedPickupTimeSection: React.FC<EnhancedPickupTimeSectionProps> = ({
  pickupTime,
  scheduledTime,
  onPickupTimeChange,
  onScheduledTimeChange
}) => {
  // Calculate minimum date/time (current time + 30 minutes)
  const minDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="pickup-time">Quand souhaitez-vous partir?</Label>
      <RadioGroup 
        value={pickupTime} 
        onValueChange={(value) => onPickupTimeChange(value as 'now' | 'scheduled')}
        className="space-y-3"
      >
        <div 
          className={`relative flex items-center border rounded-lg p-4 transition-all cursor-pointer ${
            pickupTime === 'now'
              ? 'border-primary bg-primary/5'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onPickupTimeChange('now')}
        >
          <RadioGroupItem
            value="now"
            id="now"
            className="absolute top-4 left-4"
          />
          <div className="ml-8 flex items-center">
            <Clock className="h-5 w-5 text-primary mr-3" />
            <div>
              <h3 className="font-medium">Dès que possible</h3>
              <p className="text-sm text-gray-500">Un chauffeur vous prendra en charge dans les plus brefs délais</p>
            </div>
          </div>
        </div>

        <div 
          className={`relative flex items-start border rounded-lg p-4 transition-all cursor-pointer ${
            pickupTime === 'scheduled'
              ? 'border-primary bg-primary/5'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onPickupTimeChange('scheduled')}
        >
          <RadioGroupItem
            value="scheduled"
            id="scheduled"
            className="absolute top-4 left-4"
          />
          <div className="ml-8 w-full">
            <div className="flex items-center mb-2">
              <Calendar className="h-5 w-5 text-primary mr-3" />
              <h3 className="font-medium">Programmer un départ</h3>
            </div>
            <p className="text-sm text-gray-500 mb-3">Réservez votre trajet à l'avance</p>
            
            <Input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => onScheduledTimeChange(e.target.value)}
              min={minDateTime()}
              disabled={pickupTime !== 'scheduled'}
              className={pickupTime === 'scheduled' ? 'border-primary' : ''}
            />
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

export default EnhancedPickupTimeSection;
