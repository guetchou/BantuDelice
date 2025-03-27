
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Building2, Users, Car, CalendarDays } from "lucide-react";

interface BusinessRateFormProps {
  formData: {
    companyName: string;
    employeeCount: number;
    averageDistance: number;
    estimatedMonthlyRides: number;
    vehicleType: 'standard' | 'comfort' | 'premium' | 'van';
    contactPerson: string;
    contactEmail: string;
    contactPhone: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSliderChange: (name: string, value: number[]) => void;
  handleVehicleTypeChange: (value: string) => void;
}

export const BusinessRateForm: React.FC<BusinessRateFormProps> = ({
  formData,
  handleInputChange,
  handleSliderChange,
  handleVehicleTypeChange
}) => {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="companyName">Nom de l'entreprise *</Label>
        <Input 
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleInputChange}
          placeholder="Entrez le nom de votre entreprise"
          className="mt-1"
        />
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="employeeCount">Nombre d'employés</Label>
          <span className="text-sm text-gray-500">{formData.employeeCount}</span>
        </div>
        <div className="flex items-center gap-4">
          <Users className="text-gray-400 h-4 w-4" />
          <Slider
            id="employeeCount"
            value={[formData.employeeCount]}
            min={5}
            max={500}
            step={5}
            onValueChange={(value) => handleSliderChange('employeeCount', value)}
            className="flex-1"
          />
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="averageDistance">Distance moyenne par trajet (km)</Label>
          <span className="text-sm text-gray-500">{formData.averageDistance} km</span>
        </div>
        <div className="flex items-center gap-4">
          <Car className="text-gray-400 h-4 w-4" />
          <Slider
            id="averageDistance"
            value={[formData.averageDistance]}
            min={2}
            max={50}
            step={1}
            onValueChange={(value) => handleSliderChange('averageDistance', value)}
            className="flex-1"
          />
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="estimatedMonthlyRides">Nombre estimé de courses par mois</Label>
          <span className="text-sm text-gray-500">{formData.estimatedMonthlyRides}</span>
        </div>
        <div className="flex items-center gap-4">
          <CalendarDays className="text-gray-400 h-4 w-4" />
          <Slider
            id="estimatedMonthlyRides"
            value={[formData.estimatedMonthlyRides]}
            min={5}
            max={200}
            step={5}
            onValueChange={(value) => handleSliderChange('estimatedMonthlyRides', value)}
            className="flex-1"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Type de véhicule préféré</Label>
        <RadioGroup 
          value={formData.vehicleType}
          onValueChange={handleVehicleTypeChange}
          className="grid grid-cols-2 gap-4"
        >
          <div className="flex items-center space-x-2 border rounded-lg p-3">
            <RadioGroupItem value="standard" id="standard" />
            <Label htmlFor="standard" className="flex-1">Standard</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-lg p-3">
            <RadioGroupItem value="comfort" id="comfort" />
            <Label htmlFor="comfort" className="flex-1">Confort</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-lg p-3">
            <RadioGroupItem value="premium" id="premium" />
            <Label htmlFor="premium" className="flex-1">Premium</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-lg p-3">
            <RadioGroupItem value="van" id="van" />
            <Label htmlFor="van" className="flex-1">Van</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <div>
          <Label htmlFor="contactPerson">Personne à contacter *</Label>
          <Input 
            id="contactPerson"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleInputChange}
            placeholder="Nom et prénom"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="contactEmail">Email professionnel *</Label>
          <Input 
            id="contactEmail"
            name="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={handleInputChange}
            placeholder="email@entreprise.com"
            className="mt-1"
          />
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="contactPhone">Téléphone</Label>
          <Input 
            id="contactPhone"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleInputChange}
            placeholder="Numéro de téléphone"
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
};
