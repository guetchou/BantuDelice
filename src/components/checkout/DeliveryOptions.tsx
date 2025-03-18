
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Bike, TruckIcon, Clock, Shop, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface DeliveryService {
  id: string;
  name: string;
  logo_url?: string;
  base_fee: number;
  estimated_time: number;
  is_external: boolean;
}

export interface DeliveryOption {
  type: 'restaurant' | 'external' | 'pickup';
  fee: number;
  estimated_time: number;
  service?: DeliveryService;
}

interface DeliveryOptionsProps {
  restaurantDeliveryAvailable: boolean;
  restaurantDeliveryFee: number;
  restaurantDeliveryTime: number;
  externalServices?: DeliveryService[];
  distance?: number;
  onChange: (option: DeliveryOption) => void;
  selectedOption?: DeliveryOption;
}

const DeliveryOptions = ({
  restaurantDeliveryAvailable,
  restaurantDeliveryFee,
  restaurantDeliveryTime,
  externalServices = [],
  distance = 0,
  onChange,
  selectedOption
}: DeliveryOptionsProps) => {
  const [selectedType, setSelectedType] = useState<'restaurant' | 'external' | 'pickup'>(
    selectedOption?.type || (restaurantDeliveryAvailable ? 'restaurant' : externalServices.length > 0 ? 'external' : 'pickup')
  );
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    selectedOption?.service?.id || (externalServices.length > 0 ? externalServices[0].id : null)
  );

  const handleOptionChange = (type: 'restaurant' | 'external' | 'pickup') => {
    setSelectedType(type);
    
    let option: DeliveryOption;
    
    if (type === 'restaurant') {
      option = {
        type,
        fee: restaurantDeliveryFee,
        estimated_time: restaurantDeliveryTime
      };
    } else if (type === 'external' && externalServices.length > 0) {
      const service = externalServices.find(s => s.id === selectedServiceId) || externalServices[0];
      setSelectedServiceId(service.id);
      
      option = {
        type,
        fee: service.base_fee,
        estimated_time: service.estimated_time,
        service
      };
    } else {
      // pickup
      option = {
        type,
        fee: 0,
        estimated_time: 15 // Default preparation time
      };
    }
    
    onChange(option);
  };

  const handleServiceChange = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    
    const service = externalServices.find(s => s.id === serviceId);
    if (service) {
      const option: DeliveryOption = {
        type: 'external',
        fee: service.base_fee,
        estimated_time: service.estimated_time,
        service
      };
      
      onChange(option);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Options de livraison</h3>
      
      <RadioGroup
        value={selectedType}
        onValueChange={(value) => handleOptionChange(value as any)}
        className="space-y-4"
      >
        {restaurantDeliveryAvailable && (
          <div className={`flex items-center space-x-3 rounded-lg border p-4 ${selectedType === 'restaurant' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
            <RadioGroupItem value="restaurant" id="restaurant" />
            <Label htmlFor="restaurant" className="flex-1 cursor-pointer">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Bike className="h-5 w-5 mr-2 text-orange-500" />
                  <div>
                    <span className="font-medium">Livraison par le restaurant</span>
                    <p className="text-sm text-gray-500">{restaurantDeliveryTime} min</p>
                  </div>
                </div>
                <Badge variant={restaurantDeliveryFee === 0 ? "outline" : "secondary"}>
                  {restaurantDeliveryFee === 0 ? 'Gratuit' : `${restaurantDeliveryFee.toLocaleString()} XAF`}
                </Badge>
              </div>
            </Label>
          </div>
        )}

        {externalServices.length > 0 && (
          <div className={`rounded-lg border p-4 ${selectedType === 'external' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
            <div className="flex items-center space-x-3 mb-3">
              <RadioGroupItem value="external" id="external" />
              <Label htmlFor="external" className="flex-1 cursor-pointer">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <TruckIcon className="h-5 w-5 mr-2 text-blue-500" />
                    <span className="font-medium">Service de livraison externe</span>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Info className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm">Services de livraison partenaires</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </Label>
            </div>

            {selectedType === 'external' && (
              <div className="pl-8 space-y-3">
                {externalServices.map((service) => (
                  <div 
                    key={service.id}
                    className={`flex items-center justify-between p-3 rounded border ${selectedServiceId === service.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    onClick={() => handleServiceChange(service.id)}
                  >
                    <div className="flex items-center">
                      {service.logo_url ? (
                        <img src={service.logo_url} alt={service.name} className="h-6 w-6 mr-2" />
                      ) : (
                        <Bike className="h-5 w-5 mr-2 text-gray-500" />
                      )}
                      <div>
                        <span className="font-medium">{service.name}</span>
                        <p className="text-sm text-gray-500">
                          <Clock className="inline h-3 w-3 mr-1" />
                          {service.estimated_time} min
                        </p>
                      </div>
                    </div>
                    <Badge>
                      {service.base_fee.toLocaleString()} XAF
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className={`flex items-center space-x-3 rounded-lg border p-4 ${selectedType === 'pickup' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
          <RadioGroupItem value="pickup" id="pickup" />
          <Label htmlFor="pickup" className="flex-1 cursor-pointer">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Shop className="h-5 w-5 mr-2 text-green-500" />
                <div>
                  <span className="font-medium">Récupérer sur place</span>
                  <p className="text-sm text-gray-500">15-20 min de préparation</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-50">Gratuit</Badge>
            </div>
          </Label>
        </div>
      </RadioGroup>
      
      {distance > 0 && (
        <div className="text-sm text-gray-500 mt-4">
          Distance approximative: {distance.toFixed(1)} km
        </div>
      )}
    </Card>
  );
};

export default DeliveryOptions;
