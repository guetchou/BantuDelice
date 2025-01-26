interface PricingFactors {
  basePrice: number;
  demand: number; // 0-1
  timeOfDay: number; // 0-23
  dayOfWeek: number; // 0-6
  specialEvent?: boolean;
  weatherCondition?: 'sunny' | 'rainy' | 'cold' | 'hot';
  competitorPrices?: number[];
}

export const calculateDynamicPrice = (factors: PricingFactors): number => {
  let finalPrice = factors.basePrice;
  
  // Facteur de demande (±20%)
  const demandMultiplier = 0.8 + (factors.demand * 0.4);
  finalPrice *= demandMultiplier;
  
  // Facteur horaire
  const timeMultiplier = (() => {
    // Heures de pointe (11-14h et 18-21h)
    if ((factors.timeOfDay >= 11 && factors.timeOfDay <= 14) || 
        (factors.timeOfDay >= 18 && factors.timeOfDay <= 21)) {
      return 1.15; // +15%
    }
    // Heures creuses (avant 11h et après 21h)
    return 0.9; // -10%
  })();
  finalPrice *= timeMultiplier;
  
  // Facteur jour de la semaine
  const weekendMultiplier = factors.dayOfWeek >= 5 ? 1.1 : 1.0;
  finalPrice *= weekendMultiplier;
  
  // Événements spéciaux
  if (factors.specialEvent) {
    finalPrice *= 1.2; // +20%
  }
  
  // Conditions météorologiques
  if (factors.weatherCondition) {
    const weatherMultiplier = {
      'sunny': 1.0,
      'rainy': 0.95,
      'cold': 0.9,
      'hot': 1.1
    }[factors.weatherCondition];
    finalPrice *= weatherMultiplier;
  }
  
  // Ajustement basé sur les prix des concurrents
  if (factors.competitorPrices && factors.competitorPrices.length > 0) {
    const avgCompetitorPrice = factors.competitorPrices.reduce((a, b) => a + b) / 
                              factors.competitorPrices.length;
    const competitivenessMultiplier = Math.min(
      Math.max(avgCompetitorPrice / factors.basePrice, 0.8),
      1.2
    );
    finalPrice *= competitivenessMultiplier;
  }
  
  // Arrondir au multiple de 50 FCFA le plus proche
  return Math.round(finalPrice / 50) * 50;
};

export const getPriceRange = (basePrice: number): { min: number; max: number } => {
  const minFactors: PricingFactors = {
    basePrice,
    demand: 0,
    timeOfDay: 14,
    dayOfWeek: 2,
    weatherCondition: 'rainy'
  };
  
  const maxFactors: PricingFactors = {
    basePrice,
    demand: 1,
    timeOfDay: 19,
    dayOfWeek: 6,
    specialEvent: true,
    weatherCondition: 'hot'
  };
  
  return {
    min: calculateDynamicPrice(minFactors),
    max: calculateDynamicPrice(maxFactors)
  };
};