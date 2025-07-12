import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Truck, 
  Star, 
  Clock, 
  Shield, 
  MapPin, 
  Package,
  Zap,
  Globe,
  CheckCircle,
  Info
} from 'lucide-react';

interface DeliveryService {
  id: string;
  name: string;
  logo: string;
  price: number;
  estimatedTime: string;
  features: string[];
  rating: number;
  coverage: string[];
  tracking: boolean;
  insurance: boolean;
  popular?: boolean;
  recommended?: boolean;
}

interface DeliveryServicesProps {
  services: DeliveryService[];
  selectedService?: string;
  onServiceSelect: (serviceId: string) => void;
  showComparison?: boolean;
}

const serviceIcons = {
  'buntudelice-express': <Zap className="w-6 h-6" />,
  'buntudelice-standard': <Package className="w-6 h-6" />,
  'buntudelice-economy': <Truck className="w-6 h-6" />,
  'buntudelice-international': <Globe className="w-6 h-6" />
};

const featureIcons = {
  'Livraison express': <Zap className="w-4 h-4" />,
  'Suivi GPS': <MapPin className="w-4 h-4" />,
  'Assurance incluse': <Shield className="w-4 h-4" />,
  'Service client 24/7': <Clock className="w-4 h-4" />,
  'Livraison standard': <Package className="w-4 h-4" />,
  'Suivi en ligne': <MapPin className="w-4 h-4" />,
  'Assurance optionnelle': <Shield className="w-4 h-4" />,
  'Prix économique': <Truck className="w-4 h-4" />,
  'Livraison groupée': <Package className="w-4 h-4" />,
  'Livraison internationale': <Globe className="w-4 h-4" />,
  'Dédouanement': <Shield className="w-4 h-4" />,
  'Suivi avancé': <MapPin className="w-4 h-4" />,
  'Assurance complète': <Shield className="w-4 h-4" />
};

export default function DeliveryServices({ 
  services, 
  selectedService, 
  onServiceSelect,
  showComparison = false 
}: DeliveryServicesProps) {
  const getFeatureIcon = (feature: string) => {
    return featureIcons[feature as keyof typeof featureIcons] || <CheckCircle className="w-4 h-4" />;
  };

  if (showComparison) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Comparaison des services</h2>
          <p className="text-gray-600">Choisissez le service qui convient le mieux à vos besoins</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service) => (
            <Card 
              key={service.id} 
              className={`relative transition-all duration-200 hover:shadow-lg ${
                selectedService === service.id 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:border-gray-300'
              }`}
            >
              {service.popular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white text-xs">
                    Populaire
                  </Badge>
                </div>
              )}
              
              {service.recommended && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-green-500 text-white text-xs">
                    Recommandé
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-2">
                  <span className="text-3xl">{service.logo}</span>
                </div>
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{service.rating}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {service.price.toLocaleString()} FCFA
                  </div>
                  <div className="text-sm text-gray-600">{service.estimatedTime}</div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Fonctionnalités :</h4>
                  <ul className="space-y-1 text-xs">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        {getFeatureIcon(feature)}
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Couverture :</h4>
                  <div className="flex flex-wrap gap-1">
                    {service.coverage.map((area, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span>Suivi :</span>
                  <Badge variant={service.tracking ? "default" : "secondary"}>
                    {service.tracking ? "Oui" : "Non"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span>Assurance :</span>
                  <Badge variant={service.insurance ? "default" : "secondary"}>
                    {service.insurance ? "Incluse" : "Optionnelle"}
                  </Badge>
                </div>
              </CardContent>

              <CardFooter>
                <Button 
                  onClick={() => onServiceSelect(service.id)}
                  className={`w-full ${
                    selectedService === service.id 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : ''
                  }`}
                  variant={selectedService === service.id ? "default" : "outline"}
                >
                  {selectedService === service.id ? 'Sélectionné' : 'Sélectionner'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Nos services de livraison</h2>
        <p className="text-gray-600">Choisissez le service qui correspond à vos besoins</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {services.map((service) => (
          <Card 
            key={service.id} 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedService === service.id 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:border-gray-300'
            }`}
            onClick={() => onServiceSelect(service.id)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{service.logo}</span>
                  <div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{service.rating}</span>
                      <span>•</span>
                      <span>{service.estimatedTime}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xl text-blue-600">
                    {service.price.toLocaleString()} FCFA
                  </div>
                  <div className="text-sm text-gray-600">base</div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {service.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>

              <div className="text-sm text-gray-600">
                <strong>Couverture :</strong> {service.coverage.join(', ')}
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{service.tracking ? 'Suivi inclus' : 'Pas de suivi'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    <span>{service.insurance ? 'Assurance incluse' : 'Assurance optionnelle'}</span>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button 
                className={`w-full ${
                  selectedService === service.id 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : ''
                }`}
                variant={selectedService === service.id ? "default" : "outline"}
              >
                {selectedService === service.id ? 'Sélectionné' : 'Sélectionner ce service'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Service Comparison Table */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Comparaison détaillée
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Fonctionnalité</th>
                  {services.map(service => (
                    <th key={service.id} className="text-center py-2">{service.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-medium">Prix de base</td>
                  {services.map(service => (
                    <td key={service.id} className="text-center py-2">
                      {service.price.toLocaleString()} FCFA
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Délai de livraison</td>
                  {services.map(service => (
                    <td key={service.id} className="text-center py-2">
                      {service.estimatedTime}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Suivi en temps réel</td>
                  {services.map(service => (
                    <td key={service.id} className="text-center py-2">
                      {service.tracking ? '✅' : '❌'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Assurance incluse</td>
                  {services.map(service => (
                    <td key={service.id} className="text-center py-2">
                      {service.insurance ? '✅' : '❌'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Note client</td>
                  {services.map(service => (
                    <td key={service.id} className="text-center py-2">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{service.rating}</span>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 