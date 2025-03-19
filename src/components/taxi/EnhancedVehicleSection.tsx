
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Car, Truck, CreditCard, Bike } from "lucide-react";

interface EnhancedVehicleSectionProps {
  selectedVehicleType: string;
  onVehicleSelect: (type: string) => void;
}

const EnhancedVehicleSection: React.FC<EnhancedVehicleSectionProps> = ({
  selectedVehicleType,
  onVehicleSelect
}) => {
  const vehicleTypes = [
    {
      id: 'standard',
      name: 'Standard',
      description: 'Véhicules confortables pour 1-4 personnes',
      icon: Car,
      basePrice: '~3000 FCFA',
      features: ['Climatisation', '4 places', '2 bagages']
    },
    {
      id: 'comfort',
      name: 'Confort',
      description: 'Véhicules spacieux avec équipements supplémentaires',
      icon: Car,
      basePrice: '~4000 FCFA',
      features: ['Climatisation', '4 places', '3 bagages', 'Bouteille d\'eau']
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Berlines et SUV haut de gamme',
      icon: CreditCard,
      basePrice: '~6000 FCFA',
      features: ['Climatisation', '4 places', '4 bagages', 'WiFi', 'Eau & Snacks']
    },
    {
      id: 'van',
      name: 'Van',
      description: 'Pour les groupes ou les bagages volumineux',
      icon: Truck,
      basePrice: '~7000 FCFA',
      features: ['Climatisation', '7 places', '7 bagages', 'WiFi']
    }
  ];

  return (
    <div className="space-y-4">
      <Label htmlFor="vehicle-type">Type de véhicule</Label>
      <RadioGroup 
        value={selectedVehicleType} 
        onValueChange={onVehicleSelect}
        className="space-y-3"
      >
        {vehicleTypes.map((vehicle) => {
          const VehicleIcon = vehicle.icon;
          return (
            <div
              key={vehicle.id}
              className={`relative flex items-center border rounded-lg p-4 transition-all cursor-pointer ${
                selectedVehicleType === vehicle.id
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onVehicleSelect(vehicle.id)}
            >
              <RadioGroupItem
                value={vehicle.id}
                id={vehicle.id}
                className="absolute top-4 left-4"
              />
              <div className="ml-8 flex-1">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium text-base">{vehicle.name}</h3>
                    <p className="text-sm text-gray-500">{vehicle.description}</p>
                  </div>
                  <div className="ml-2 text-right">
                    <VehicleIcon className="h-6 w-6 mb-2 text-gray-700 ml-auto" />
                    <span className="text-sm font-medium">{vehicle.basePrice}</span>
                  </div>
                </div>
                
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  {vehicle.features.map((feature, idx) => (
                    <span key={idx} className="text-xs text-gray-600 flex items-center">
                      <span className="mr-1">•</span> {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};

export default EnhancedVehicleSection;
