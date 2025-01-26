interface PricingFactors {
  basePrice: number;
  demand: number; // 0-100
  timeOfDay: number; // 0-23
  dayOfWeek: number; // 0-6
  specialEvent?: boolean;
  competitorPrices?: number[];
  stockLevel?: number; // 0-100
}

export const calculateDynamicPrice = (factors: PricingFactors): number => {
  let finalPrice = factors.basePrice;
  
  // Ajustement basé sur la demande (±20%)
  const demandMultiplier = 0.8 + (factors.demand / 100) * 0.4;
  finalPrice *= demandMultiplier;
  
  // Ajustement selon l'heure (±10%)
  const peakHours = [11, 12, 13, 19, 20, 21];
  const ispeakHour = peakHours.includes(factors.timeOfDay);
  if (ispeakHour) {
    finalPrice *= 1.1;
  } else {
    finalPrice *= 0.9;
  }
  
  // Ajustement selon le jour (weekend +15%)
  const isWeekend = factors.dayOfWeek === 0 || factors.dayOfWeek === 6;
  if (isWeekend) {
    finalPrice *= 1.15;
  }
  
  // Ajustement événements spéciaux (+25%)
  if (factors.specialEvent) {
    finalPrice *= 1.25;
  }
  
  // Ajustement selon le stock (-20% si stock élevé)
  if (factors.stockLevel && factors.stockLevel > 80) {
    finalPrice *= 0.8;
  }
  
  // Ajustement selon la concurrence
  if (factors.competitorPrices && factors.competitorPrices.length > 0) {
    const avgCompetitorPrice = factors.competitorPrices.reduce((a, b) => a + b) / factors.competitorPrices.length;
    // Ajuster notre prix pour rester compétitif tout en maintenant une marge
    if (finalPrice > avgCompetitorPrice * 1.2) {
      finalPrice = avgCompetitorPrice * 1.15;
    }
  }
  
  // Arrondir au multiple de 50 FCFA le plus proche
  return Math.round(finalPrice / 50) * 50;
};

export const getPricingFactors = async (restaurantId: string, menuItemId: string): Promise<PricingFactors> => {
  // Récupérer les données nécessaires depuis la base de données
  const currentHour = new Date().getHours();
  const currentDay = new Date().getDay();
  
  // Simuler la demande basée sur les commandes récentes
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('created_at')
    .eq('restaurant_id', restaurantId)
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
    
  const demand = Math.min(100, (recentOrders?.length || 0) * 5);
  
  return {
    basePrice: 5000, // Prix de base exemple
    demand,
    timeOfDay: currentHour,
    dayOfWeek: currentDay,
    specialEvent: false, // À implémenter selon les événements
    stockLevel: 100, // À implémenter avec la gestion des stocks
  };
};