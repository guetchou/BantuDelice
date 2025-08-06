// Tarifs ajustés au contexte local congolais (03/08/2025)
// - Revenu moyen: 250,000 FCFA/mois
// - Positionnement: 20% moins cher que la concurrence
// - Objectif: Accessibilité pour le marché local
// Service tarifaire unifié basé sur la politique officielle BantuDelice
// Document de référence : docs/POLITIQUE_TARIFAIRE.md

export interface TarifZone {
  id: string;
  name: string;
  type: 'urbain' | 'axe-principal' | 'secondaire' | 'enclave' | 'international-afrique' | 'international-global';
  baseRate: number;
  fuelSurcharge: number;
  insuranceIncluded: number;
  standardDelay: string;
  expressDelay: string;
  premiumDelay: string;
  economyDelay: string;
}

export interface ServiceType {
  id: string;
  name: string;
  description: string;
  multiplier: number;
  delay: string;
  icon: string;
  color: string;
  popular?: boolean;
}

export interface WeightTier {
  minWeight: number;
  maxWeight: number;
  standardCharge: number;
  expressCharge: number;
  premiumCharge: number;
  economyCharge: number;
}

export interface TarifCalculation {
  baseRate: number;
  weightCharge: number;
  fuelSurcharge: number;
  insurance: number;
  serviceCharge: number;
  specialCharges: number;
  total: number;
  currency: string;
  estimatedDays: number;
  breakdown: {
    baseRate: number;
    weightCharge: number;
    fuelSurcharge: number;
    insurance: number;
    serviceCharge: number;
    specialCharges: number;
  };
  zone: TarifZone;
  service: ServiceType;
}

// Zones géographiques selon la politique tarifaire
export const TARIF_ZONES: TarifZone[] = [
  {
    id: 'urbain',
    name: 'Zone Urbaine',
    type: 'urbain',
    baseRate: 800,
    fuelSurcharge: 0.05,
    insuranceIncluded: 15000,
    standardDelay: '1 jour',
    expressDelay: '6h',
    premiumDelay: '3h',
    economyDelay: '2 jours'
  },
  {
    id: 'axe-principal',
    name: 'Axe Principal (Brazzaville-Pointe-Noire)',
    type: 'axe-principal',
    baseRate: 2500,
    fuelSurcharge: 0.08,
    insuranceIncluded: 30000,
    standardDelay: '2-3 jours',
    expressDelay: '1-2 jours',
    premiumDelay: '24h',
    economyDelay: '5-7 jours'
  },
  {
    id: 'secondaire',
    name: 'Villes Secondaires',
    type: 'secondaire',
    baseRate: 1800,
    fuelSurcharge: 0.10,
    insuranceIncluded: 25000,
    standardDelay: '3-4 jours',
    expressDelay: '2-3 jours',
    premiumDelay: '24h',
    economyDelay: '5-6 jours'
  },
  {
    id: 'enclave',
    name: 'Zones Enclavées',
    type: 'enclave',
    baseRate: 3500,
    fuelSurcharge: 0.15,
    insuranceIncluded: 40000,
    standardDelay: '5-7 jours',
    expressDelay: '3-5 jours',
    premiumDelay: '48h',
    economyDelay: '7-10 jours'
  },
  {
    id: 'international-afrique',
    name: 'International (Afrique Centrale)',
    type: 'international-afrique',
    baseRate: 25000,
    fuelSurcharge: 0.12,
    insuranceIncluded: 150000,
    standardDelay: '5-7 jours',
    expressDelay: '2-3 jours',
    premiumDelay: '24h',
    economyDelay: '7-10 jours'
  },
  {
    id: 'international-global',
    name: 'International Global',
    type: 'international-global',
    baseRate: 50000,
    fuelSurcharge: 0.15,
    insuranceIncluded: 300000,
    standardDelay: '7-10 jours',
    expressDelay: '3-5 jours',
    premiumDelay: '48h',
    economyDelay: '10-14 jours'
  }
];

// Types de service selon la politique tarifaire
export const SERVICE_TYPES: ServiceType[] = [
  {
    id: 'economy',
    name: 'Économique',
    description: 'Livraison groupée, délais plus longs',
    multiplier: 0.7,
    delay: '5-7 jours',
    icon: 'Ship',
    color: 'text-green-600'
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'Service classique, bon rapport qualité-prix',
    multiplier: 1,
    delay: '3-5 jours',
    icon: 'Truck',
    color: 'text-blue-600',
    popular: true
  },
  {
    id: 'express',
    name: 'Express',
    description: 'Livraison rapide, priorité haute',
    multiplier: 1.8,
    delay: '1-2 jours',
    icon: 'Plane',
    color: 'text-orange-600'
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Service haut de gamme, suivi dédié',
    multiplier: 1.3,
    delay: '24h',
    icon: 'Star',
    color: 'text-purple-600'
  }
];

// Tiers de poids selon la politique tarifaire
export const WEIGHT_TIERS: WeightTier[] = [
  {
    minWeight: 0,
    maxWeight: 1,
    standardCharge: 0,
    expressCharge: 0,
    premiumCharge: 0,
    economyCharge: 0
  },
  {
    minWeight: 1,
    maxWeight: 5,
    standardCharge: 500,
    expressCharge: 1000,
    premiumCharge: 750,
    economyCharge: 400
  },
  {
    minWeight: 5,
    maxWeight: 10,
    standardCharge: 800,
    expressCharge: 1500,
    premiumCharge: 1200,
    economyCharge: 640
  },
  {
    minWeight: 10,
    maxWeight: 20,
    standardCharge: 1200,
    expressCharge: 2000,
    premiumCharge: 1800,
    economyCharge: 960
  },
  {
    minWeight: 20,
    maxWeight: 30,
    standardCharge: 1500,
    expressCharge: 2500,
    premiumCharge: 2250,
    economyCharge: 1200
  }
];

// Villes et leurs zones
export const CITY_ZONES: Record<string, string> = {
  // Zone Urbaine
  'Brazzaville': 'urbain',
  'Pointe-Noire': 'urbain',
  
  // Axe Principal
  'Dolisie': 'axe-principal',
  'Nkayi': 'axe-principal',
  
  // Villes Secondaires
  'Ouesso': 'secondaire',
  'Gamboma': 'secondaire',
  'Madingou': 'secondaire',
  'Mossendjo': 'secondaire',
  'Kinkala': 'secondaire',
  'Loandjili': 'secondaire',
  'Djambala': 'secondaire',
  'Ewo': 'secondaire',
  'Sibiti': 'secondaire',
  'Impfondo': 'secondaire',
  'Makoua': 'secondaire'
};

// Pays et leurs zones internationales
export const COUNTRY_ZONES: Record<string, string> = {
  // Afrique Centrale
  'Congo': 'urbain',
  'Gabon': 'international-afrique',
  'Cameroun': 'international-afrique',
  'RCA': 'international-afrique',
  'Tchad': 'international-afrique',
  'RDC': 'international-afrique',
  'Angola': 'international-afrique',
  
  // International Global
  'France': 'international-global',
  'Belgique': 'international-global',
  'Suisse': 'international-global',
  'Allemagne': 'international-global',
  'Italie': 'international-global',
  'Espagne': 'international-global',
  'Pays-Bas': 'international-global',
  'Royaume-Uni': 'international-global',
  'États-Unis': 'international-global',
  'Canada': 'international-global',
  'Brésil': 'international-global',
  'Chine': 'international-global',
  'Japon': 'international-global',
  'Corée du Sud': 'international-global',
  'Inde': 'international-global',
  'Australie': 'international-global',
  'Afrique du Sud': 'international-global'
};

export class TarifService {
  /**
   * Détermine la zone tarifaire selon l'origine et la destination
   */
  static determineZone(from: string, to: string, isInternational: boolean = false): TarifZone {
    if (isInternational) {
      const countryZone = COUNTRY_ZONES[to] || 'international-global';
      return TARIF_ZONES.find(zone => zone.id === countryZone) || TARIF_ZONES[5]; // international-global par défaut
    }

    // National
    if (from === to) {
      return TARIF_ZONES[0]; // Zone urbaine
    }

    // Axe principal Brazzaville-Pointe-Noire
    if ((from === 'Brazzaville' && to === 'Pointe-Noire') ||
        (from === 'Pointe-Noire' && to === 'Brazzaville')) {
      return TARIF_ZONES[1]; // Axe principal
    }

    // Villes secondaires
    const fromZone = CITY_ZONES[from] || 'secondaire';
    const toZone = CITY_ZONES[to] || 'secondaire';
    
    if (fromZone === 'secondaire' || toZone === 'secondaire') {
      return TARIF_ZONES[2]; // Villes secondaires
    }

    // Zones enclavées (par défaut pour les villes non listées)
    return TARIF_ZONES[3]; // Zones enclavées
  }

  /**
   * Calcule la charge par poids selon la politique tarifaire
   */
  static calculateWeightCharge(weight: number, serviceId: string): number {
    const tier = WEIGHT_TIERS.find(t => weight >= t.minWeight && weight <= t.maxWeight);
    if (!tier) {
      // Pour les poids > 30kg, utiliser le dernier tier
      const lastTier = WEIGHT_TIERS[WEIGHT_TIERS.length - 1];
      const extraWeight = weight - lastTier.maxWeight;
      const baseCharge = lastTier[`${serviceId}Charge` as keyof WeightTier] as number;
      return baseCharge + (extraWeight * 100); // 100 FCFA par kg supplémentaire
    }

    return tier[`${serviceId}Charge` as keyof WeightTier] as number;
  }

  /**
   * Calcule le tarif complet selon la politique officielle
   */
  static calculateTarif(params: {
    from: string;
    to: string;
    weight: number;
    service: string;
    isInternational?: boolean;
    isFragile?: boolean;
    isUrgent?: boolean;
    insuranceValue?: number;
    deliveryType?: 'agence' | 'domicile';
  }): TarifCalculation {
    const {
      from,
      to,
      weight,
      service,
      isInternational = false,
      isFragile = false,
      isUrgent = false,
      insuranceValue = 0,
      deliveryType = 'agence'
    } = params;

    // Déterminer la zone
    const zone = this.determineZone(from, to, isInternational);
    
    // Trouver le service
    const serviceType = SERVICE_TYPES.find(s => s.id === service) || SERVICE_TYPES[1]; // standard par défaut

    // Calculs de base
    const baseRate = zone.baseRate * serviceType.multiplier;
    const weightCharge = this.calculateWeightCharge(weight, service) * serviceType.multiplier;
    const fuelSurcharge = (baseRate + weightCharge) * zone.fuelSurcharge;
    const serviceCharge = baseRate * 0.1; // 10% de frais de service

    // Assurance
    let insurance = 0;
    if (insuranceValue > 0) {
      insurance = insuranceValue * 0.02; // 2% de la valeur déclarée
    }

    // Surcharges spéciales
    let specialCharges = 0;
    if (isFragile) specialCharges += baseRate * 0.15; // +15% pour fragile
    if (isUrgent) specialCharges += baseRate * 0.20; // +20% pour urgent
    if (deliveryType === 'domicile') specialCharges += baseRate * 0.25; // +25% pour livraison à domicile

    // Total
    const total = baseRate + weightCharge + fuelSurcharge + insurance + serviceCharge + specialCharges;

    // Délai estimé
    const estimatedDays = this.getEstimatedDays(zone, service);

    return {
      baseRate,
      weightCharge,
      fuelSurcharge,
      insurance,
      serviceCharge,
      specialCharges,
      total,
      currency: 'FCFA',
      estimatedDays,
      breakdown: {
        baseRate,
        weightCharge,
        fuelSurcharge,
        insurance,
        serviceCharge,
        specialCharges
      },
      zone,
      service: serviceType
    };
  }

  /**
   * Obtient le délai estimé en jours
   */
  static getEstimatedDays(zone: TarifZone, service: string): number {
    const delayMap: Record<string, string> = {
      'economy': zone.economyDelay,
      'standard': zone.standardDelay,
      'express': zone.expressDelay,
      'premium': zone.premiumDelay
    };

    const delay = delayMap[service] || zone.standardDelay;
    
    // Extraire le nombre de jours (prendre le premier nombre trouvé)
    const match = delay.match(/(\d+)/);
    return match ? parseInt(match[1]) : 3;
  }

  /**
   * Compare avec la concurrence
   */
  static getCompetitionComparison(tarif: TarifCalculation): {
    bantuDelice: number;
    laPoste: number;
    accExpress: number;
    dhl: number;
  } {
    const { total } = tarif;
    
    return {
      bantuDelice: total,
      laPoste: Math.round(total * 0.7), // 30% moins cher que BantuDelice
      accExpress: Math.round(total * 0.9), // 10% moins cher que BantuDelice
      dhl: Math.round(total * 3) // 3x plus cher que BantuDelice
    };
  }

  /**
   * Valide les paramètres de calcul
   */
  static validateParams(params: {
    from: string;
    to: string;
    weight: number;
    service: string;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!params.from) errors.push('Ville d\'origine requise');
    if (!params.to) errors.push('Ville de destination requise');
    if (!params.weight || params.weight <= 0) errors.push('Poids valide requis');
    if (params.weight > 50) errors.push('Poids maximum 50kg');
    if (!SERVICE_TYPES.find(s => s.id === params.service)) errors.push('Type de service invalide');

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default TarifService; 