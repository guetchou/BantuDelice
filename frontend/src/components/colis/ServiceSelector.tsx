import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Truck, 
  Plane, 
  Clock, 
  Shield, 
  Star,
  CheckCircle,
  Zap
} from 'lucide-react';

interface ServiceOption {
  id: string;
  name: string;
  price: string;
  delay: string;
  features: string[];
  popular?: boolean;
  icon: React.ComponentType<unknown>;
  recommended?: boolean;
}

interface ServiceSelectorProps {
  options: ServiceOption[];
  selectedService?: string;
  onSelect: (serviceId: string) => void;
  weight?: number;
}

const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  options,
  selectedService,
  onSelect,
  weight = 0
}) => {
  const getRecommendation = (weight: number) => {
    if (weight <= 2) return 'standard';
    if (weight <= 10) return 'express';
    return 'pro';
  };

  const recommendedService = getRecommendation(weight);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choisissez votre service
        </h2>
        <p className="text-gray-600">
          Sélectionnez l'option qui correspond le mieux à vos besoins
        </p>
        {weight > 0 && (
          <div className="mt-4 inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
            <Star className="h-4 w-4" />
            <span className="text-sm font-medium">
              Recommandé pour {weight}kg : {options.find(o => o.id === recommendedService)?.name}
            </span>
          </div>
        )}
      </div>

      {/* Options de service */}
      <div className="grid md:grid-cols-3 gap-6">
        {options.map((option) => (
          <Card 
            key={option.id}
            className={`relative cursor-pointer transition-all hover:shadow-lg ${
              selectedService === option.id 
                ? 'ring-2 ring-orange-500 border-orange-200' 
                : 'hover:border-orange-300'
            } ${option.popular ? 'border-orange-300 shadow-lg' : ''}`}
            onClick={() => onSelect(option.id)}
          >
            {option.popular && (
              <Badge className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-orange-600 text-white">
                Le plus choisi
              </Badge>
            )}
            
            {option.recommended && weight > 0 && (
              <Badge className="absolute top-0 right-2 bg-blue-600 text-white">
                Recommandé
              </Badge>
            )}

            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-orange-100 rounded-full">
                  <option.icon className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <CardTitle className="text-xl">{option.name}</CardTitle>
              <div className="text-3xl font-bold text-orange-600">{option.price}</div>
              <p className="text-gray-600 flex items-center justify-center gap-1">
                <Clock className="h-4 w-4" />
                {option.delay}
              </p>
            </CardHeader>

            <CardContent className="pt-0">
              <ul className="space-y-2 mb-6">
                {option.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full ${
                  selectedService === option.id 
                    ? 'bg-orange-600 hover:bg-orange-700' 
                    : 'bg-gray-800 hover:bg-gray-900'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(option.id);
                }}
              >
                {selectedService === option.id ? 'Sélectionné' : 'Choisir'}
                {selectedService === option.id && <CheckCircle className="h-4 w-4 ml-2" />}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Informations supplémentaires */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-4 w-4 text-green-600" />
          <span className="font-medium text-gray-900">Tous nos services incluent :</span>
        </div>
        <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-3 w-3 text-green-500" />
            Assurance de base incluse
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-3 w-3 text-green-500" />
            Suivi en temps réel
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-3 w-3 text-green-500" />
            Support client 24/7
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-3 w-3 text-green-500" />
            Garantie de livraison
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceSelector; 