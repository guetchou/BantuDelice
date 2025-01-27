interface PricingFactors {
  basePrice: number;
  demand: number; // 0-1
  timeOfDay: string;
  weather: string;
  specialEvent?: boolean;
  userLoyalty?: number; // 0-1
}

export const calculateDynamicPrice = ({
  basePrice,
  demand,
  timeOfDay,
  weather,
  specialEvent = false,
  userLoyalty = 0
}: PricingFactors): number => {
  let multiplier = 1.0;

  // Demand-based adjustment (0.8-1.5x)
  multiplier *= 0.8 + (demand * 0.7);

  // Time-based adjustment
  const timeMultipliers: Record<string, number> = {
    'early-morning': 0.9,
    'morning': 1.0,
    'lunch': 1.2,
    'afternoon': 0.95,
    'dinner': 1.3,
    'late-night': 1.1
  };
  multiplier *= timeMultipliers[timeOfDay] || 1;

  // Weather-based adjustment
  const weatherMultipliers: Record<string, number> = {
    'rainy': 1.2,
    'sunny': 1.0,
    'cloudy': 1.0,
    'stormy': 1.3
  };
  multiplier *= weatherMultipliers[weather] || 1;

  // Special event adjustment
  if (specialEvent) {
    multiplier *= 1.25;
  }

  // Loyalty discount (up to 20% off)
  const loyaltyDiscount = userLoyalty * 0.2;
  multiplier *= (1 - loyaltyDiscount);

  // Calculate final price
  let finalPrice = Math.round(basePrice * multiplier);

  // Ensure minimum price
  finalPrice = Math.max(finalPrice, basePrice * 0.8);

  // Ensure maximum price
  finalPrice = Math.min(finalPrice, basePrice * 2);

  return finalPrice;
};

export const calculateDeliveryFee = (
  distance: number,
  weather: string,
  traffic: number, // 0-1
  time: string
): number => {
  const baseRate = 500; // Base delivery fee in FCFA
  let multiplier = 1.0;

  // Distance-based calculation (per km)
  multiplier += (distance * 0.1);

  // Weather impact
  const weatherMultipliers: Record<string, number> = {
    'rainy': 1.3,
    'stormy': 1.5,
    'sunny': 1.0,
    'cloudy': 1.0
  };
  multiplier *= weatherMultipliers[weather] || 1;

  // Traffic impact
  multiplier *= (1 + (traffic * 0.5));

  // Time-based adjustment
  const timeMultipliers: Record<string, number> = {
    'peak': 1.2,
    'normal': 1.0,
    'off-peak': 0.9
  };
  multiplier *= timeMultipliers[time] || 1;

  const fee = Math.round(baseRate * multiplier);

  // Ensure minimum and maximum fees
  return Math.min(Math.max(fee, 500), 3000);
};