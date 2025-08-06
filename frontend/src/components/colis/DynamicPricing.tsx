import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Package, Calculator, TrendingUp, AlertTriangle } from 'lucide-react';

interface DynamicPricingProps {
  fromCity: string;
  toCity: string;
  weight: number;
  packageType: string;
  service: string;
  onPriceChange: (price: number) => void;
}

export const DynamicPricing: React.FC<DynamicPricingProps> = ({
  fromCity,
  toCity,
  weight,
  packageType,
  service,
  onPriceChange
}) => {
  const [pricing, setPricing] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Configuration des tarifs par ville
  const CITY_PRICING = {
  "Brazzaville": {
    "zone": "urbain",
    "baseRate": 800,
    "fuelSurcharge": 0.05,
    "insuranceIncluded": 15000
  },
  "Pointe-Noire": {
    "zone": "urbain",
    "baseRate": 800,
    "fuelSurcharge": 0.05,
    "insuranceIncluded": 15000
  },
  "Dolisie": {
    "zone": "secondaire",
    "baseRate": 1800,
    "fuelSurcharge": 0.1,
    "insuranceIncluded": 25000
  },
  "Nkayi": {
    "zone": "secondaire",
    "baseRate": 1800,
    "fuelSurcharge": 0.1,
    "insuranceIncluded": 25000
  },
  "Ouesso": {
    "zone": "enclave",
    "baseRate": 3500,
    "fuelSurcharge": 0.15,
    "insuranceIncluded": 40000
  },
  "Impfondo": {
    "zone": "enclave",
    "baseRate": 3500,
    "fuelSurcharge": 0.15,
    "insuranceIncluded": 40000
  },
  "Gamboma": {
    "zone": "secondaire",
    "baseRate": 1800,
    "fuelSurcharge": 0.1,
    "insuranceIncluded": 25000
  },
  "Madingou": {
    "zone": "secondaire",
    "baseRate": 1800,
    "fuelSurcharge": 0.1,
    "insuranceIncluded": 25000
  },
  "Mossendjo": {
    "zone": "secondaire",
    "baseRate": 1800,
    "fuelSurcharge": 0.1,
    "insuranceIncluded": 25000
  },
  "Kinkala": {
    "zone": "secondaire",
    "baseRate": 1800,
    "fuelSurcharge": 0.1,
    "insuranceIncluded": 25000
  }
};

  // Configuration des types de colis
  const PACKAGE_TYPE_CONFIG = {
  "document": {
    "name": "Document",
    "icon": "FileText",
    "description": "Lettres, papiers, contrats",
    "requiredFields": [
      "weight"
    ],
    "optionalFields": [
      "dimensions"
    ],
    "specialFields": [],
    "insuranceRequired": false,
    "maxWeight": 2,
    "baseMultiplier": 0.8
  },
  "package": {
    "name": "Colis Standard",
    "icon": "Package",
    "description": "Objets divers, vêtements",
    "requiredFields": [
      "weight",
      "dimensions"
    ],
    "optionalFields": [
      "specialInstructions"
    ],
    "specialFields": [],
    "insuranceRequired": false,
    "maxWeight": 30,
    "baseMultiplier": 1
  },
  "fragile": {
    "name": "Fragile",
    "icon": "AlertTriangle",
    "description": "Verre, céramique, électronique",
    "requiredFields": [
      "weight",
      "dimensions",
      "specialInstructions"
    ],
    "optionalFields": [
      "insuranceValue"
    ],
    "specialFields": [
      "fragileHandling",
      "protectivePackaging"
    ],
    "insuranceRequired": true,
    "maxWeight": 20,
    "baseMultiplier": 1.5
  },
  "heavy": {
    "name": "Lourd",
    "icon": "Scale",
    "description": "Plus de 10kg, équipements",
    "requiredFields": [
      "weight",
      "dimensions",
      "specialInstructions"
    ],
    "optionalFields": [
      "insuranceValue"
    ],
    "specialFields": [
      "heavyLifting",
      "specialEquipment"
    ],
    "insuranceRequired": true,
    "maxWeight": 100,
    "baseMultiplier": 2
  },
  "electronics": {
    "name": "Électronique",
    "icon": "Smartphone",
    "description": "Téléphones, ordinateurs",
    "requiredFields": [
      "weight",
      "dimensions",
      "specialInstructions"
    ],
    "optionalFields": [
      "insuranceValue"
    ],
    "specialFields": [
      "antiStaticPackaging",
      "temperatureControl",
      "originalBox"
    ],
    "insuranceRequired": true,
    "maxWeight": 25,
    "baseMultiplier": 1.8
  },
  "clothing": {
    "name": "Vêtements",
    "icon": "Gift",
    "description": "Textiles, chaussures",
    "requiredFields": [
      "weight"
    ],
    "optionalFields": [
      "dimensions",
      "specialInstructions"
    ],
    "specialFields": [
      "dryCleaning",
      "foldedPackaging"
    ],
    "insuranceRequired": false,
    "maxWeight": 15,
    "baseMultiplier": 0.9
  },
  "food": {
    "name": "Alimentaire",
    "icon": "Box",
    "description": "Produits alimentaires",
    "requiredFields": [
      "weight",
      "specialInstructions"
    ],
    "optionalFields": [
      "dimensions"
    ],
    "specialFields": [
      "temperatureControl",
      "expiryDate",
      "fragileHandling"
    ],
    "insuranceRequired": false,
    "maxWeight": 10,
    "baseMultiplier": 1.2
  }
};

  // Fonction de calcul du prix
  const calculatePrice = () => {
    if (!fromCity || !toCity || !weight || !packageType) return;

    setIsCalculating(true);

    const fromPricing = CITY_PRICING[fromCity] || CITY_PRICING['Brazzaville'];
    const toPricing = CITY_PRICING[toCity] || CITY_PRICING['Brazzaville'];
    
    const baseRate = Math.max(fromPricing.baseRate, toPricing.baseRate);
    const fuelSurcharge = Math.max(fromPricing.fuelSurcharge, toPricing.fuelSurcharge);
    const packageMultiplier = PACKAGE_TYPE_CONFIG[packageType]?.baseMultiplier || 1.0;
    
    const serviceMultipliers = {
      economy: 0.7,
      standard: 1.0,
      express: 1.8,
      premium: 1.3
    };
    const serviceMultiplier = serviceMultipliers[service] || 1.0;
    
    const basePrice = baseRate * packageMultiplier * serviceMultiplier;
    const weightPrice = weight * 300;
    const fuelPrice = (basePrice + weightPrice) * fuelSurcharge;
    const total = basePrice + weightPrice + fuelPrice;

    const result = {
      basePrice,
      weightPrice,
      fuelPrice,
      total,
      breakdown: {
        baseRate,
        packageMultiplier,
        serviceMultiplier,
        fuelSurcharge
      }
    };

    setPricing(result);
    onPriceChange(total);
    setIsCalculating(false);
  };

  useEffect(() => {
    calculatePrice();
  }, [fromCity, toCity, weight, packageType, service]);

  if (!pricing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Calcul du tarif
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            {isCalculating ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                <span>Calcul en cours...</span>
              </div>
            ) : (
              <span className="text-gray-500">Sélectionnez les informations pour calculer le tarif</span>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Tarif calculé
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Route */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{fromCity} → {toCity}</span>
          </div>

          {/* Type de colis */}
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="text-sm font-medium">
              {PACKAGE_TYPE_CONFIG[packageType]?.name}
            </span>
            <Badge variant="outline" className="text-xs">
              {weight}kg
            </Badge>
          </div>

          {/* Détail du prix */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Prix de base:</span>
              <span>{pricing.basePrice.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between">
              <span>Poids ({weight}kg):</span>
              <span>{pricing.weightPrice.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between">
              <span>Surcharge carburant:</span>
              <span>{pricing.fuelPrice.toLocaleString()} FCFA</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span className="text-orange-600">{pricing.total.toLocaleString()} FCFA</span>
            </div>
          </div>

          {/* Multiplicateurs */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-600 space-y-1">
              <div>Multiplicateur type: {pricing.breakdown.packageMultiplier}x</div>
              <div>Multiplicateur service: {pricing.breakdown.serviceMultiplier}x</div>
              <div>Surcharge carburant: {(pricing.breakdown.fuelSurcharge * 100).toFixed(1)}%</div>
            </div>
          </div>

          {/* Avertissements */}
          {PACKAGE_TYPE_CONFIG[packageType]?.insuranceRequired && (
            <div className="flex items-center gap-2 text-amber-600 text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>Assurance obligatoire pour ce type de colis</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
