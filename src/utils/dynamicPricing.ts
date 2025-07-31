interface PricingFactors {
  basePrice: number;
  demandMultiplier: number;
  timeOfDay: string;
  seasonality: number;
  competitionPrice?: number;
  stockLevel?: number;
}

export const calculateDynamicPrice = (factors: PricingFactors): number => {
  let finalPrice = factors.basePrice;

  // Demand-based adjustment
  finalPrice *= factors.demandMultiplier;

  // Time of day pricing
  switch (factors.timeOfDay) {
    case 'morning':
      finalPrice *= 1.1; // Breakfast premium
      break;
    case 'lunch':
      finalPrice *= 1.2; // Lunch rush
      break;
    case 'evening':
      finalPrice *= 1.3; // Dinner premium
      break;
    case 'night':
      finalPrice *= 0.9; // Night discount
      break;
  }

  // Seasonal adjustment
  finalPrice *= factors.seasonality;

  // Competition-based pricing
  if (factors.competitionPrice) {
    const competitiveFactor = factors.basePrice / factors.competitionPrice;
    if (competitiveFactor > 1.2) {
      finalPrice *= 0.95; // Reduce price if we're too expensive
    }
  }

  // Stock-level based pricing
  if (factors.stockLevel !== undefined) {
    if (factors.stockLevel < 10) {
      finalPrice *= 1.1; // Low stock premium
    } else if (factors.stockLevel > 100) {
      finalPrice *= 0.9; // High stock discount
    }
  }

  // Round to nearest 100 FCFA
  return Math.round(finalPrice / 100) * 100;
};

export const getDemandMultiplier = (
  historicalOrders: any[],
  currentHour: number,
  dayOfWeek: number
): number => {
  // Analyze historical orders for the same time period
  const relevantOrders = historicalOrders.filter(order => {
    const orderDate = new Date(order.created_at);
    return orderDate.getHours() === currentHour && 
           orderDate.getDay() === dayOfWeek;
  });

  // Calculate average orders for this time period
  const averageOrders = relevantOrders.length / 4; // Past 4 weeks
  
  // Define demand levels
  if (averageOrders > 20) return 1.3; // High demand
  if (averageOrders > 10) return 1.1; // Medium demand
  return 0.9; // Low demand
};