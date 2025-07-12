
import React from 'react';
import { TaxiVehicleType } from '@/types/taxi';
import { getVehicleDescription, formatPrice } from './booking-form/bookingFormUtils';
import { Card, CardContent } from "@/components/ui/card";
import { Car, Users, ThumbsUp, CircleDollarSign } from 'lucide-react';

// Images pour les véhicules
const vehicleImages = {
  standard: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGF4aXxlbnwwfHwwfHx8MA%3D%3D",
  comfort: "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGNhcnxlbnwwfHwwfHx8MA%3D%3D",
  premium: "https://images.unsplash.com/photo-1588618575327-fa8218b75ea2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dGF4aXxlbnwwfHwwfHx8MA%3D%3D",
  van: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHZhbnxlbnwwfHwwfHx8MA%3D%3D"
};

// Info des véhicules
const vehicleInfo = {
  standard: {
    name: "Standard",
    basePrice: 2000,
    features: [
      "Capacité: 1-4 personnes",
      "Climatisation",
      "Volume bagages: Standard"
    ],
    icon: Car
  },
  comfort: {
    name: "Confort",
    basePrice: 3000,
    features: [
      "Capacité: 1-4 personnes",
      "Climatisation premium",
      "Plus d'espace pour les jambes",
      "Eau offerte"
    ],
    icon: ThumbsUp
  },
  premium: {
    name: "Premium",
    basePrice: 5000,
    features: [
      "Capacité: 1-3 personnes",
      "Véhicule haut de gamme",
      "Intérieur cuir",
      "Service personnalisé",
      "WiFi à bord"
    ],
    icon: CircleDollarSign
  },
  van: {
    name: "Van",
    basePrice: 7000,
    features: [
      "Capacité: 4-7 personnes",
      "Idéal pour groupes",
      "Grand volume bagages",
      "Climatisation multi-zone"
    ],
    icon: Users
  }
};

interface EnhancedVehicleSectionProps {
  selectedVehicleType: TaxiVehicleType;
  onVehicleSelect: (vehicleType: TaxiVehicleType) => void;
}

const EnhancedVehicleSection: React.FC<EnhancedVehicleSectionProps> = ({
  selectedVehicleType,
  onVehicleSelect
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Choisissez votre véhicule</h3>
        <p className="text-sm text-gray-500 mb-4">
          Sélectionnez le type de véhicule qui correspond le mieux à vos besoins.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {(Object.keys(vehicleInfo) as TaxiVehicleType[]).map((type) => {
          const isSelected = type === selectedVehicleType;
          const info = vehicleInfo[type];
          const VehicleIcon = info.icon;
          
          return (
            <Card 
              key={type}
              className={`cursor-pointer transition-all overflow-hidden ${
                isSelected 
                  ? 'border-2 border-primary ring-2 ring-primary/10' 
                  : 'hover:bg-gray-50 border border-gray-200'
              }`}
              onClick={() => onVehicleSelect(type)}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 h-full">
                <div className="md:col-span-1 h-32 md:h-full overflow-hidden">
                  <img 
                    src={vehicleImages[type]} 
                    alt={`Véhicule ${info.name}`} 
                    className="h-full w-full object-cover"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-full ${isSelected ? 'bg-primary/10' : 'bg-gray-100'}`}>
                          <VehicleIcon className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-gray-500'}`} />
                        </div>
                        <h3 className="font-medium">{info.name}</h3>
                      </div>
                      
                      <div className="font-semibold text-lg">
                        À partir de {formatPrice(info.basePrice)}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {getVehicleDescription(type)}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                      {info.features.map((feature, index) => (
                        <div key={index} className="text-sm flex items-center gap-1.5">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default EnhancedVehicleSection;
