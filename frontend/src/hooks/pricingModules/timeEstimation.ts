
/**
 * Estimates the time required for a taxi journey
 * @param distance Distance in kilometers
 * @param trafficLevel Traffic level ('light', 'moderate', 'heavy', 'severe')
 * @param vehicleType Vehicle type ('standard', 'comfort', 'premium', 'van')
 * @param timeOfDay Time of day (optional)
 * @param weatherCondition Weather conditions (optional)
 * @returns Estimated time in minutes
 */
export function estimateTime(
  distance: number, 
  trafficLevel: 'light' | 'moderate' | 'heavy' | 'severe' = 'moderate',
  vehicleType: 'standard' | 'comfort' | 'premium' | 'van' = 'standard',
  timeOfDay?: Date,
  weatherCondition?: 'clear' | 'rain' | 'snow' | 'fog'
): number {
  // Average speed in km/h based on traffic level
  const avgSpeedByTraffic = {
    light: 45,
    moderate: 30,
    heavy: 20,
    severe: 12
  };
  
  // Speed adjustment based on vehicle type
  const vehicleSpeedFactor = {
    standard: 1,
    comfort: 1.05,
    premium: 1.1,
    van: 0.95
  };
  
  // Calculate adjusted speed
  let adjustedSpeed = avgSpeedByTraffic[trafficLevel] * vehicleSpeedFactor[vehicleType];
  
  // Adjust based on time of day
  if (timeOfDay) {
    const hour = timeOfDay.getHours();
    
    // Rush hours: 7-9 AM and 5-7 PM
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      adjustedSpeed *= 0.85; // 15% reduction during rush hours
    }
    
    // Night: 10 PM - 6 AM
    if (hour >= 22 || hour <= 6) {
      adjustedSpeed *= 1.15; // 15% increase during night (less traffic)
    }
  }
  
  // Adjust based on weather conditions
  if (weatherCondition) {
    const weatherSpeedFactor: Record<string, number> = {
      clear: 1,
      rain: 0.9,
      fog: 0.8,
      snow: 0.7
    };
    
    adjustedSpeed *= weatherSpeedFactor[weatherCondition];
  }
  
  // Convert to minutes (speed in km/h -> minutes)
  const timeInMinutes = (distance / adjustedSpeed) * 60;
  
  // Round up to the nearest minute with a minimum of 5 minutes
  return Math.max(5, Math.ceil(timeInMinutes));
}

/**
 * Calculates the estimated arrival time based on current time and estimated time
 * @param estimatedTimeMinutes Estimated time in minutes
 * @param departureTime Departure time (default: now)
 * @returns Object containing arrival time and formatted representation
 */
export function calculateETA(
  estimatedTimeMinutes: number,
  departureTime: Date = new Date()
): { arrivalTime: Date; formattedETA: string } {
  const arrivalTime = new Date(departureTime.getTime() + estimatedTimeMinutes * 60 * 1000);
  
  // Formatting options
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit'
  };
  
  const formattedTime = arrivalTime.toLocaleTimeString('fr-FR', options);
  const formattedETA = `${estimatedTimeMinutes} min (arrivée à ${formattedTime})`;
  
  return {
    arrivalTime,
    formattedETA
  };
}

/**
 * Estimates traffic conditions based on time of day, day of week, and historical data
 * @param location Current location coordinates
 * @param timeOfDay Time of day (default: current time)
 * @returns Estimated traffic level
 */
export function estimateTrafficLevel(
  location: { latitude: number; longitude: number },
  timeOfDay: Date = new Date()
): 'light' | 'moderate' | 'heavy' | 'severe' {
  const hour = timeOfDay.getHours();
  const dayOfWeek = timeOfDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  // Rush hours - heavy traffic
  if (!isWeekend && ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19))) {
    return 'heavy';
  }
  
  // Mid-day - moderate traffic
  if (hour >= 10 && hour <= 16) {
    return isWeekend ? 'moderate' : 'moderate';
  }
  
  // Evening - varies
  if (hour >= 20 && hour <= 22) {
    return isWeekend ? 'moderate' : 'light';
  }
  
  // Late night - light traffic
  if (hour >= 23 || hour <= 5) {
    return 'light';
  }
  
  // Default
  return 'moderate';
}

/**
 * Dynamic ETA update based on real-time conditions
 * @param initialETA Initial ETA calculation
 * @param distanceRemaining Remaining distance in kilometers
 * @param currentTrafficLevel Current traffic level
 * @param weatherUpdate Updated weather conditions
 * @returns Updated ETA in minutes
 */
export function updateETADynamically(
  initialETA: number,
  distanceRemaining: number,
  currentTrafficLevel: 'light' | 'moderate' | 'heavy' | 'severe',
  weatherUpdate?: 'clear' | 'rain' | 'snow' | 'fog'
): number {
  // Calculate new ETA based on remaining distance and current conditions
  const updatedEstimate = estimateTime(
    distanceRemaining,
    currentTrafficLevel,
    'standard', // Assuming standard vehicle for recalculation
    new Date(),
    weatherUpdate
  );
  
  // If significant change (more than 15% difference), update the ETA
  const etaDifference = Math.abs(updatedEstimate - initialETA);
  if (etaDifference / initialETA > 0.15) {
    return updatedEstimate;
  }
  
  // Otherwise keep the initial estimate for consistency
  return initialETA;
}
