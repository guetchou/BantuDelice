interface PricingFactors {
  basePrice: number;
  demand: number;
  timeOfDay: number;
  dayOfWeek: number;
  weather: number;
  specialEvents: boolean;
}

export const calculateDynamicPrice = (factors: PricingFactors): number => {
  let multiplier = 1.0;

  // Ajustement basé sur la demande (0-1)
  multiplier += factors.demand * 0.5;

  // Ajustement basé sur l'heure (0-24)
  const peakHours = [12, 13, 19, 20];
  if (peakHours.includes(factors.timeOfDay)) {
    multiplier += 0.2;
  }

  // Ajustement basé sur le jour (0-6, 0 = Dimanche)
  const weekendDays = [5, 6]; // Vendredi et Samedi
  if (weekendDays.includes(factors.dayOfWeek)) {
    multiplier += 0.1;
  }

  // Ajustement basé sur la météo (0-1)
  multiplier += factors.weather * 0.3;

  // Ajustement pour les événements spéciaux
  if (factors.specialEvents) {
    multiplier += 0.2;
  }

  // Calculer le prix final
  const finalPrice = Math.round(factors.basePrice * multiplier);

  // Limiter l'augmentation à 2x le prix de base
  return Math.min(finalPrice, factors.basePrice * 2);
};

export const getCurrentPricingFactors = (): PricingFactors => {
  const now = new Date();
  
  return {
    basePrice: 1000, // Prix de base en FCFA
    demand: Math.random(), // Simulé pour l'exemple
    timeOfDay: now.getHours(),
    dayOfWeek: now.getDay(),
    weather: Math.random(), // Simulé pour l'exemple
    specialEvents: false // À implémenter avec une vraie API d'événements
  };
};