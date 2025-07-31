import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Package, 
  Calculator, 
  Ruler, 
  Weight, 
  Cube,
  TrendingUp,
  Clock,
  MapPin,
  Zap,
  Eye,
  RotateCcw,
  Info
} from 'lucide-react';

interface PackageDimensions {
  length: number;
  width: number;
  height: number;
  weight: number;
}

interface CalculatorData {
  origin: string;
  destination: string;
  packageType: string;
  dimensions: PackageDimensions;
  declaredValue: number;
  service: string;
  options: {
    insurance: boolean;
    fragile: boolean;
    signature: boolean;
    express: boolean;
  };
}

interface PriceBreakdown {
  basePrice: number;
  weightPrice: number;
  distancePrice: number;
  servicePrice: number;
  optionsPrice: number;
  total: number;
}

const IntelligentCalculator: React.FC = () => {
  const [data, setData] = useState<CalculatorData>({
    origin: '',
    destination: '',
    packageType: 'standard',
    dimensions: { length: 0, width: 0, height: 0, weight: 0 },
    declaredValue: 0,
    service: 'standard',
    options: {
      insurance: false,
      fragile: false,
      signature: false,
      express: false
    }
  });

  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [show3D, setShow3D] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const packageTypes = [
    { id: 'document', name: 'Document', icon: '📄', maxWeight: 2, basePrice: 1500 },
    { id: 'small', name: 'Petit colis', icon: '📦', maxWeight: 5, basePrice: 2500 },
    { id: 'medium', name: 'Colis moyen', icon: '📦', maxWeight: 15, basePrice: 3500 },
    { id: 'large', name: 'Gros colis', icon: '📦', maxWeight: 30, basePrice: 5000 },
    { id: 'fragile', name: 'Fragile', icon: '⚠️', maxWeight: 10, basePrice: 4000 },
    { id: 'electronics', name: 'Électronique', icon: '💻', maxWeight: 20, basePrice: 4500 }
  ];

  const cities = [
    'Brazzaville', 'Pointe-Noire', 'Dolisie', 'Nkayi', 'Ouesso', 'Gamboma', 
    'Madingou', 'Mossendjo', 'Kinkala', 'Loandjili', 'Djambala', 'Ewo',
    'Sibiti', 'Impfondo', 'Makoua'
  ];

  const services = [
    { id: 'economy', name: 'Économique', multiplier: 1, delay: '5-7 jours' },
    { id: 'standard', name: 'Standard', multiplier: 1.2, delay: '3-5 jours' },
    { id: 'express', name: 'Express', multiplier: 1.8, delay: '24-48h' },
    { id: 'premium', name: 'Premium', multiplier: 2.5, delay: 'Avant 12h' }
  ];

  // Calcul intelligent du prix
  const calculatePrice = async () => {
    setIsCalculating(true);
    
    // Simuler un délai de calcul
    await new Promise(resolve => setTimeout(resolve, 1000));

    const selectedPackage = packageTypes.find(p => p.id === data.packageType);
    const selectedService = services.find(s => s.id === data.service);
    
    if (!selectedPackage || !selectedService) return;

    // Calcul de la distance (simulation)
    const distance = calculateDistance(data.origin, data.destination);
    
    // Calcul du volume
    const volume = data.dimensions.length * data.dimensions.width * data.dimensions.height;
    const volumeWeight = volume / 6000; // Poids volumétrique
    const chargeableWeight = Math.max(data.dimensions.weight, volumeWeight);

    // Prix de base
    const basePrice = selectedPackage.basePrice;
    
    // Prix selon le poids
    const weightPrice = chargeableWeight * 500;
    
    // Prix selon la distance
    const distancePrice = distance * 100;
    
    // Prix du service
    const servicePrice = (basePrice + weightPrice + distancePrice) * (selectedService.multiplier - 1);
    
    // Options supplémentaires
    let optionsPrice = 0;
    if (data.options.insurance) optionsPrice += 2000;
    if (data.options.fragile) optionsPrice += 1000;
    if (data.options.signature) optionsPrice += 1500;
    if (data.options.express) optionsPrice += 3000;

    const total = basePrice + weightPrice + distancePrice + servicePrice + optionsPrice;

    setPriceBreakdown({
      basePrice,
      weightPrice,
      distancePrice,
      servicePrice,
      optionsPrice,
      total
    });

    setIsCalculating(false);
  };

  // Calcul de distance simulé
  const calculateDistance = (origin: string, destination: string): number => {
    if (!origin || !destination) return 0;
    
    // Simulation basée sur les indices des villes
    const originIndex = cities.indexOf(origin);
    const destIndex = cities.indexOf(destination);
    
    if (originIndex === -1 || destIndex === -1) return 100;
    
    return Math.abs(originIndex - destIndex) * 50 + 50;
  };

  // Validation intelligente
  const validatePackage = () => {
    const selectedPackage = packageTypes.find(p => p.id === data.packageType);
    if (!selectedPackage) return { valid: false, message: 'Type de colis invalide' };

    if (data.dimensions.weight > selectedPackage.maxWeight) {
      return { 
        valid: false, 
        message: `Poids maximum dépassé pour ${selectedPackage.name} (${selectedPackage.maxWeight}kg max)` 
      };
    }

    if (data.dimensions.length <= 0 || data.dimensions.width <= 0 || data.dimensions.height <= 0) {
      return { valid: false, message: 'Dimensions invalides' };
    }

    return { valid: true, message: 'Colis valide' };
  };

  // Visualisation 3D
  const render3DPreview = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner le colis en 3D simple
    const { length, width, height } = data.dimensions;
    const scale = 2;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Face avant
    ctx.fillStyle = '#f97316';
    ctx.fillRect(centerX - (width * scale) / 2, centerY - (height * scale) / 2, width * scale, height * scale);

    // Face latérale
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(centerX + (width * scale) / 2, centerY - (height * scale) / 2, length * scale, height * scale);

    // Face supérieure
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(centerX - (width * scale) / 2, centerY - (height * scale) / 2 - (length * scale), width * scale, length * scale);

    // Dimensions
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.fillText(`${length}cm`, centerX, centerY + (height * scale) / 2 + 20);
    ctx.fillText(`${width}cm`, centerX - (width * scale) / 2 - 30, centerY);
    ctx.fillText(`${height}cm`, centerX, centerY - (height * scale) / 2 - 10);
  };

  useEffect(() => {
    if (show3D) {
      render3DPreview();
    }
  }, [show3D, data.dimensions]);

  useEffect(() => {
    if (data.origin && data.destination && data.dimensions.weight > 0) {
      calculatePrice();
    }
  }, [data]);

  const validation = validatePackage();

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Calculateur Intelligent
        </h2>
        <p className="text-gray-600">
          Estimation précise avec visualisation 3D et recommandations
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Formulaire */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Informations du colis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Origine et destination */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="origin">Origine</Label>
                <Select value={data.origin} onValueChange={(value) => setData({...data, origin: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner l'origine" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="destination">Destination</Label>
                <Select value={data.destination} onValueChange={(value) => setData({...data, destination: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner la destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Type de colis */}
            <div>
              <Label>Type de colis</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {packageTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant={data.packageType === type.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setData({...data, packageType: type.id})}
                    className="justify-start"
                  >
                    <span className="mr-2">{type.icon}</span>
                    {type.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Dimensions */}
            <div>
              <Label className="flex items-center gap-2">
                <Ruler className="h-4 w-4" />
                Dimensions (cm)
              </Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Input
                  type="number"
                  placeholder="Longueur"
                  value={data.dimensions.length || ''}
                  onChange={(e) => setData({
                    ...data, 
                    dimensions: {...data.dimensions, length: parseFloat(e.target.value) || 0}
                  })}
                />
                <Input
                  type="number"
                  placeholder="Largeur"
                  value={data.dimensions.width || ''}
                  onChange={(e) => setData({
                    ...data, 
                    dimensions: {...data.dimensions, width: parseFloat(e.target.value) || 0}
                  })}
                />
                <Input
                  type="number"
                  placeholder="Hauteur"
                  value={data.dimensions.height || ''}
                  onChange={(e) => setData({
                    ...data, 
                    dimensions: {...data.dimensions, height: parseFloat(e.target.value) || 0}
                  })}
                />
              </div>
            </div>

            {/* Poids */}
            <div>
              <Label className="flex items-center gap-2">
                <Weight className="h-4 w-4" />
                Poids (kg)
              </Label>
              <Input
                type="number"
                step="0.1"
                placeholder="Poids en kg"
                value={data.dimensions.weight || ''}
                onChange={(e) => setData({
                  ...data, 
                  dimensions: {...data.dimensions, weight: parseFloat(e.target.value) || 0}
                })}
              />
            </div>

            {/* Service */}
            <div>
              <Label>Service</Label>
              <Select value={data.service} onValueChange={(value) => setData({...data, service: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{service.name}</span>
                        <Badge variant="secondary">{service.delay}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Options */}
            <div>
              <Label>Options supplémentaires</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  { key: 'insurance', label: 'Assurance', price: '+2 000 FCFA' },
                  { key: 'fragile', label: 'Fragile', price: '+1 000 FCFA' },
                  { key: 'signature', label: 'Signature', price: '+1 500 FCFA' },
                  { key: 'express', label: 'Express', price: '+3 000 FCFA' }
                ].map((option) => (
                  <Button
                    key={option.key}
                    variant={data.options[option.key as keyof typeof data.options] ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setData({
                      ...data, 
                      options: {
                        ...data.options,
                        [option.key]: !data.options[option.key as keyof typeof data.options]
                      }
                    })}
                    className="justify-between"
                  >
                    <span>{option.label}</span>
                    <Badge variant="secondary">{option.price}</Badge>
                  </Button>
                ))}
              </div>
            </div>

            {/* Validation */}
            {!validation.valid && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-red-700">
                  <Info className="h-4 w-4" />
                  <span className="text-sm">{validation.message}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Résultats et visualisation */}
        <div className="space-y-6">
          {/* Visualisation 3D */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cube className="h-5 w-5" />
                Visualisation 3D
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShow3D(!show3D)}
                  className="ml-auto"
                >
                  {show3D ? <Eye className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {show3D ? 'Masquer' : 'Afficher'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {show3D ? (
                <div className="flex justify-center">
                  <canvas
                    ref={canvasRef}
                    width={300}
                    height={300}
                    className="border rounded-lg bg-gray-50"
                  />
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Cube className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>Cliquez pour voir la visualisation 3D</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Calcul du prix */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Estimation du prix
                {isCalculating && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {priceBreakdown ? (
                <div className="space-y-4">
                  <div className="text-3xl font-bold text-orange-600 text-center">
                    {priceBreakdown.total.toLocaleString()} FCFA
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Prix de base:</span>
                      <span>{priceBreakdown.basePrice.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Poids ({data.dimensions.weight}kg):</span>
                      <span>{priceBreakdown.weightPrice.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Distance:</span>
                      <span>{priceBreakdown.distancePrice.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service:</span>
                      <span>{priceBreakdown.servicePrice.toLocaleString()} FCFA</span>
                    </div>
                    {priceBreakdown.optionsPrice > 0 && (
                      <div className="flex justify-between">
                        <span>Options:</span>
                        <span>{priceBreakdown.optionsPrice.toLocaleString()} FCFA</span>
                      </div>
                    )}
                    <hr className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>{priceBreakdown.total.toLocaleString()} FCFA</span>
                    </div>
                  </div>

                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    <Zap className="h-4 w-4 mr-2" />
                    Procéder à l'expédition
                  </Button>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Calculator className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>Remplissez les informations pour calculer le prix</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommandations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Recommandations intelligentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.dimensions.weight > 10 && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <Info className="h-4 w-4" />
                    <span className="text-sm">Considérez l'option "Fragile" pour ce poids</span>
                  </div>
                )}
                {data.declaredValue > 100000 && (
                  <div className="flex items-center gap-2 text-green-600">
                    <Info className="h-4 w-4" />
                    <span className="text-sm">Assurance recommandée pour cette valeur</span>
                  </div>
                )}
                {calculateDistance(data.origin, data.destination) > 200 && (
                  <div className="flex items-center gap-2 text-orange-600">
                    <Info className="h-4 w-4" />
                    <span className="text-sm">Service Express recommandé pour cette distance</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IntelligentCalculator; 