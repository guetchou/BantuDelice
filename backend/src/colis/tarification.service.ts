import { Injectable } from '@nestjs/common';

export interface TarifZone {
  id: string;
  name: string;
  type: 'urbain' | 'interurbain' | 'national' | 'international';
  baseRate: number;
  expressMultiplier: number;
  weightIncrements: WeightIncrement[];
  fuelSurcharge: number;
  insuranceIncluded: number;
}

export interface WeightIncrement {
  minWeight: number;
  maxWeight: number;
  standardRate: number;
  expressRate: number;
}

export interface ServiceType {
  id: string;
  name: string;
  description: string;
  deliveryTime: string;
  multiplier: number;
}

export interface TarifCalculation {
  baseRate: number;
  weightCharge: number;
  fuelSurcharge: number;
  insurance: number;
  serviceCharge: number;
  total: number;
  currency: string;
  estimatedDays: number;
  breakdown: {
    baseRate: number;
    weightCharge: number;
    fuelSurcharge: number;
    insurance: number;
    serviceCharge: number;
  };
}

@Injectable()
export class TarificationService {
  private readonly zones: TarifZone[] = [
    // Zone urbaine (même ville)
    {
      id: 'urbain',
      name: 'Zone Urbaine',
      type: 'urbain',
      baseRate: 1500,
      expressMultiplier: 2.5,
      fuelSurcharge: 0.05, // 5%
      insuranceIncluded: 25000,
      weightIncrements: [
        { minWeight: 0, maxWeight: 1, standardRate: 0, expressRate: 0 },
        { minWeight: 1, maxWeight: 5, standardRate: 500, expressRate: 1000 },
        { minWeight: 5, maxWeight: 10, standardRate: 800, expressRate: 1500 },
        { minWeight: 10, maxWeight: 20, standardRate: 1200, expressRate: 2000 },
        { minWeight: 20, maxWeight: 30, standardRate: 1500, expressRate: 2500 }
      ]
    },
    // Zone interurbaine principale (Brazzaville-Pointe-Noire)
    {
      id: 'interurbain_principal',
      name: 'Axe Principal (Brazzaville-Pointe-Noire)',
      type: 'interurbain',
      baseRate: 5000,
      expressMultiplier: 2.0,
      fuelSurcharge: 0.08, // 8%
      insuranceIncluded: 50000,
      weightIncrements: [
        { minWeight: 0, maxWeight: 1, standardRate: 0, expressRate: 0 },
        { minWeight: 1, maxWeight: 5, standardRate: 1000, expressRate: 3000 },
        { minWeight: 5, maxWeight: 10, standardRate: 1500, expressRate: 4000 },
        { minWeight: 10, maxWeight: 20, standardRate: 2000, expressRate: 5000 },
        { minWeight: 20, maxWeight: 30, standardRate: 2500, expressRate: 6000 }
      ]
    },
    // Zone interurbaine secondaire (autres villes principales)
    {
      id: 'interurbain_secondaire',
      name: 'Villes Secondaires (Dolisie, Nkayi, etc.)',
      type: 'interurbain',
      baseRate: 3500,
      expressMultiplier: 2.2,
      fuelSurcharge: 0.10, // 10%
      insuranceIncluded: 40000,
      weightIncrements: [
        { minWeight: 0, maxWeight: 1, standardRate: 0, expressRate: 0 },
        { minWeight: 1, maxWeight: 5, standardRate: 800, expressRate: 2500 },
        { minWeight: 5, maxWeight: 10, standardRate: 1200, expressRate: 3500 },
        { minWeight: 10, maxWeight: 20, standardRate: 1600, expressRate: 4500 },
        { minWeight: 20, maxWeight: 30, standardRate: 2000, expressRate: 5500 }
      ]
    },
    // Zone nationale étendue (zones enclavées)
    {
      id: 'national_etendu',
      name: 'Zones Enclavées',
      type: 'national',
      baseRate: 8000,
      expressMultiplier: 1.8,
      fuelSurcharge: 0.15, // 15%
      insuranceIncluded: 75000,
      weightIncrements: [
        { minWeight: 0, maxWeight: 1, standardRate: 0, expressRate: 0 },
        { minWeight: 1, maxWeight: 5, standardRate: 1500, expressRate: 4000 },
        { minWeight: 5, maxWeight: 10, standardRate: 2000, expressRate: 5000 },
        { minWeight: 10, maxWeight: 20, standardRate: 2500, expressRate: 6000 },
        { minWeight: 20, maxWeight: 30, standardRate: 3000, expressRate: 7000 }
      ]
    },
    // Zone internationale (Afrique Centrale)
    {
      id: 'international_afrique',
      name: 'Afrique Centrale',
      type: 'international',
      baseRate: 25000,
      expressMultiplier: 1.5,
      fuelSurcharge: 0.12, // 12%
      insuranceIncluded: 150000,
      weightIncrements: [
        { minWeight: 0, maxWeight: 1, standardRate: 0, expressRate: 0 },
        { minWeight: 1, maxWeight: 5, standardRate: 5000, expressRate: 15000 },
        { minWeight: 5, maxWeight: 10, standardRate: 8000, expressRate: 20000 },
        { minWeight: 10, maxWeight: 20, standardRate: 12000, expressRate: 25000 },
        { minWeight: 20, maxWeight: 30, standardRate: 15000, expressRate: 30000 }
      ]
    },
    // Zone internationale (Europe/Amérique)
    {
      id: 'international_global',
      name: 'International Global',
      type: 'international',
      baseRate: 50000,
      expressMultiplier: 1.3,
      fuelSurcharge: 0.15, // 15%
      insuranceIncluded: 300000,
      weightIncrements: [
        { minWeight: 0, maxWeight: 1, standardRate: 0, expressRate: 0 },
        { minWeight: 1, maxWeight: 5, standardRate: 10000, expressRate: 30000 },
        { minWeight: 5, maxWeight: 10, standardRate: 15000, expressRate: 40000 },
        { minWeight: 10, maxWeight: 20, standardRate: 20000, expressRate: 50000 },
        { minWeight: 20, maxWeight: 30, standardRate: 25000, expressRate: 60000 }
      ]
    }
  ];

  private readonly serviceTypes: ServiceType[] = [
    {
      id: 'standard',
      name: 'Standard',
      description: 'Livraison économique par transport terrestre',
      deliveryTime: '3-5 jours',
      multiplier: 1.0
    },
    {
      id: 'express',
      name: 'Express',
      description: 'Livraison rapide par transport aérien ou dédié',
      deliveryTime: '1-2 jours',
      multiplier: 1.0 // Sera calculé selon la zone
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Service haut de gamme avec suivi en temps réel',
      deliveryTime: '24h',
      multiplier: 1.5
    },
    {
      id: 'economy',
      name: 'Économique',
      description: 'Service groupé pour envois non urgents',
      deliveryTime: '5-7 jours',
      multiplier: 0.8
    }
  ];

  /**
   * Détermine la zone tarifaire basée sur les villes de départ et d'arrivée
   */
  private determineZone(from: string, to: string): TarifZone {
    const fromLower = from.toLowerCase();
    const toLower = to.toLowerCase();

    // Même ville = zone urbaine
    if (fromLower === toLower) {
      return this.zones.find(z => z.id === 'urbain')!;
    }

    // Axe principal Brazzaville-Pointe-Noire
    if ((fromLower === 'brazzaville' && toLower === 'pointe-noire') ||
        (fromLower === 'pointe-noire' && toLower === 'brazzaville')) {
      return this.zones.find(z => z.id === 'interurbain_principal')!;
    }

    // Villes secondaires principales
    const secondaryCities = ['dolisie', 'nkayi', 'ouesso', 'impfondo', 'djambala'];
    if (secondaryCities.includes(fromLower) || secondaryCities.includes(toLower)) {
      return this.zones.find(z => z.id === 'interurbain_secondaire')!;
    }

    // Zones enclavées
    const remoteCities = ['sibiti', 'madingou', 'kinkala', 'gamboma', 'etoumbi'];
    if (remoteCities.includes(fromLower) || remoteCities.includes(toLower)) {
      return this.zones.find(z => z.id === 'national_etendu')!;
    }

    // Par défaut, zone interurbaine secondaire
    return this.zones.find(z => z.id === 'interurbain_secondaire')!;
  }

  /**
   * Calcule le tarif de base selon le poids
   */
  private calculateWeightCharge(zone: TarifZone, weight: number, isExpress: boolean): number {
    const increment = zone.weightIncrements.find(w => 
      weight >= w.minWeight && weight <= w.maxWeight
    );

    if (!increment) {
      // Poids supérieur à 30kg, utiliser le dernier palier
      const lastIncrement = zone.weightIncrements[zone.weightIncrements.length - 1];
      const extraWeight = weight - lastIncrement.maxWeight;
      const baseCharge = isExpress ? lastIncrement.expressRate : lastIncrement.standardRate;
      return baseCharge + (extraWeight * (isExpress ? 1000 : 500));
    }

    return isExpress ? increment.expressRate : increment.standardRate;
  }

  /**
   * Calcule les jours de livraison estimés
   */
  private calculateDeliveryDays(zone: TarifZone, serviceType: string): number {
    const baseDays = {
      'urbain': 1,
      'interurbain': 3,
      'national': 5,
      'international': 7
    };

    const serviceMultiplier = {
      'standard': 1.0,
      'express': 0.4,
      'premium': 0.2,
      'economy': 1.5
    };

    const baseDay = baseDays[zone.type];
    const multiplier = serviceMultiplier[serviceType] || 1.0;

    return Math.max(1, Math.round(baseDay * multiplier));
  }

  /**
   * Calcule le tarif complet
   */
  calculateTarif(params: {
    from: string;
    to: string;
    weight: number;
    service: string;
    declaredValue?: number;
    isFragile?: boolean;
    isUrgent?: boolean;
  }): TarifCalculation {
    const { from, to, weight, service, declaredValue = 0, isFragile = false, isUrgent = false } = params;

    // Déterminer la zone
    const zone = this.determineZone(from, to);
    
    // Déterminer le type de service
    const serviceType = this.serviceTypes.find(s => s.id === service) || this.serviceTypes[0];
    const isExpress = service === 'express' || service === 'premium';

    // Calculer le tarif de base
    const baseRate = zone.baseRate;
    
    // Calculer la charge pour le poids
    const weightCharge = this.calculateWeightCharge(zone, weight, isExpress);
    
    // Appliquer le multiplicateur de service
    let serviceMultiplier = serviceType.multiplier;
    if (isExpress) {
      serviceMultiplier *= zone.expressMultiplier;
    }
    
    // Calculer la surcharge carburant
    const fuelSurcharge = Math.round((baseRate + weightCharge) * zone.fuelSurcharge);
    
    // Calculer l'assurance
    let insurance = 0;
    if (declaredValue > zone.insuranceIncluded) {
      insurance = Math.round((declaredValue - zone.insuranceIncluded) * 0.02); // 2% de la valeur excédentaire
    }
    
    // Surcharges spéciales
    let specialCharges = 0;
    if (isFragile) {
      specialCharges += Math.round((baseRate + weightCharge) * 0.15); // 15% pour fragile
    }
    if (isUrgent) {
      specialCharges += Math.round((baseRate + weightCharge) * 0.20); // 20% pour urgent
    }
    
    // Calculer le total
    const subtotal = (baseRate + weightCharge) * serviceMultiplier;
    const total = subtotal + fuelSurcharge + insurance + specialCharges;
    
    // Calculer les jours de livraison
    const estimatedDays = this.calculateDeliveryDays(zone, service);

    return {
      baseRate: Math.round(baseRate),
      weightCharge: Math.round(weightCharge),
      fuelSurcharge: Math.round(fuelSurcharge),
      insurance: Math.round(insurance),
      serviceCharge: Math.round(specialCharges),
      total: Math.round(total),
      currency: 'FCFA',
      estimatedDays,
      breakdown: {
        baseRate: Math.round(baseRate),
        weightCharge: Math.round(weightCharge),
        fuelSurcharge: Math.round(fuelSurcharge),
        insurance: Math.round(insurance),
        serviceCharge: Math.round(specialCharges)
      }
    };
  }

  /**
   * Obtient toutes les zones tarifaires
   */
  getZones(): TarifZone[] {
    return this.zones;
  }

  /**
   * Obtient tous les types de service
   */
  getServiceTypes(): ServiceType[] {
    return this.serviceTypes;
  }

  /**
   * Compare avec les tarifs de la concurrence
   */
  compareWithCompetition(params: {
    from: string;
    to: string;
    weight: number;
    service: string;
  }): {
    bantudelice: TarifCalculation;
    competition: {
      sopeco: { standard: number; express: number };
      accExpress: { standard: number; express: number };
      dhl: { express: number };
    };
  } {
    const bantudelice = this.calculateTarif(params);
    
    // Tarifs estimés de la concurrence (basés sur l'analyse)
    const competition = {
      sopeco: {
        standard: Math.round(bantudelice.total * 0.7), // 30% moins cher
        express: Math.round(bantudelice.total * 0.8)   // 20% moins cher
      },
      accExpress: {
        standard: Math.round(bantudelice.total * 0.9), // 10% moins cher
        express: Math.round(bantudelice.total * 1.1)   // 10% plus cher
      },
      dhl: {
        express: Math.round(bantudelice.total * 3.0)   // 3x plus cher
      }
    };

    return { bantudelice, competition };
  }

  /**
   * Génère une grille tarifaire complète
   */
  generateTarifGrid(): {
    zones: TarifZone[];
    services: ServiceType[];
    examples: Array<{
      from: string;
      to: string;
      weight: number;
      service: string;
      tarif: TarifCalculation;
    }>;
  } {
    const examples = [
      { from: 'Brazzaville', to: 'Brazzaville', weight: 2, service: 'standard' },
      { from: 'Brazzaville', to: 'Pointe-Noire', weight: 5, service: 'standard' },
      { from: 'Brazzaville', to: 'Pointe-Noire', weight: 5, service: 'express' },
      { from: 'Brazzaville', to: 'Dolisie', weight: 3, service: 'standard' },
      { from: 'Brazzaville', to: 'Ouesso', weight: 8, service: 'standard' },
      { from: 'Brazzaville', to: 'Kinshasa', weight: 2, service: 'express' },
      { from: 'Brazzaville', to: 'Paris', weight: 5, service: 'express' }
    ];

    const calculatedExamples = examples.map(example => ({
      ...example,
      tarif: this.calculateTarif(example)
    }));

    return {
      zones: this.zones,
      services: this.serviceTypes,
      examples: calculatedExamples
    };
  }
} 