
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BusinessRateFormData } from '@/types/globalTypes';

interface BusinessRateFormProps {
  formData: BusinessRateFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSliderChange: (name: string, value: number[]) => void;
  handleVehicleTypeChange: (value: string) => void;
}

export const BusinessRateForm = ({ 
  formData, 
  handleInputChange, 
  handleSliderChange, 
  handleVehicleTypeChange 
}: BusinessRateFormProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Nom de l'entreprise</Label>
          <Input
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            placeholder="Nom de votre entreprise"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Email de contact</Label>
          <Input
            id="contactEmail"
            name="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={handleInputChange}
            placeholder="contact@entreprise.com"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Nombre de courses mensuelles estimées</Label>
          <div className="px-3">
            <Slider
              value={[formData.monthlyRides]}
              onValueChange={(value) => handleSliderChange('monthlyRides', value)}
              max={200}
              min={10}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>10</span>
              <span className="font-medium">{formData.monthlyRides} courses/mois</span>
              <span>200+</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="averageDistance">Distance moyenne par course (km)</Label>
          <Input
            id="averageDistance"
            name="averageDistance"
            type="number"
            value={formData.averageDistance}
            onChange={handleInputChange}
            placeholder="10"
          />
        </div>

        <div className="space-y-2">
          <Label>Type de véhicule préféré</Label>
          <Select
            value={formData.vehicleType}
            onValueChange={handleVehicleTypeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un type de véhicule" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="comfort">Confort</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="van">Van</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
