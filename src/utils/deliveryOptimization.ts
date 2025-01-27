interface DeliveryDriver {
  id: string;
  location: {
    latitude: number;
    longitude: number;
  };
  current_latitude: number;  // Added
  current_longitude: number; // Added
  rating: number;
  currentOrders: number;
  experience: number;
  vehicleType: string;
  isAvailable: boolean;
}

interface DeliveryRequest {
  pickupLocation: {
    latitude: number;
    longitude: number;
  };
  deliveryLocation: {
    latitude: number;
    longitude: number;
  };
  orderSize: number;
  isUrgent: boolean;
  weatherConditions: string;
}

export const findOptimalDriver = (
  order: {
    id: string;
    delivery_address: string;
    latitude: number;
    longitude: number;
    total_amount: number;
  }
): Promise<DeliveryDriver | null> => {
  // Simulated driver data
  const mockDriver: DeliveryDriver = {
    id: "driver-1",
    location: {
      latitude: 0,
      longitude: 0
    },
    current_latitude: 0,
    current_longitude: 0,
    rating: 4.5,
    currentOrders: 0,
    experience: 12,
    vehicleType: "motorcycle",
    isAvailable: true
  };

  return Promise.resolve(mockDriver);
};

// Helper function to calculate distance between two points
function calculateDistance(point1: { latitude: number; longitude: number }, 
                         point2: { latitude: number; longitude: number }): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(point2.latitude - point1.latitude);
  const dLon = toRad(point2.longitude - point1.longitude);
  const lat1 = toRad(point1.latitude);
  const lat2 = toRad(point2.latitude);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRad(value: number): number {
  return value * Math.PI / 180;
}

// Optimize delivery routes for multiple orders
export const optimizeDeliveryRoute = (
  currentLocation: { latitude: number; longitude: number },
  deliveries: Array<{
    location: { latitude: number; longitude: number };
    priority: number;
    timeWindow?: { start: Date; end: Date };
  }>
): Array<number> => {
  // Implementation of a modified nearest neighbor algorithm with constraints
  const route: number[] = [];
  const unvisited = [...deliveries.keys()];
  let currentPoint = currentLocation;

  while (unvisited.length > 0) {
    let bestNextIndex = -1;
    let bestScore = -Infinity;

    unvisited.forEach(index => {
      const delivery = deliveries[index];
      let score = 0;

      // Distance score (negative as we want to minimize it)
      const distance = calculateDistance(currentPoint, delivery.location);
      score -= distance * 10;

      // Priority score
      score += delivery.priority * 50;

      // Time window score
      if (delivery.timeWindow) {
        const now = new Date();
        const minutesToDeadline = (delivery.timeWindow.end.getTime() - now.getTime()) / 60000;
        if (minutesToDeadline < 30) {
          score += 100; // Urgent delivery
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestNextIndex = index;
      }
    });

    if (bestNextIndex !== -1) {
      route.push(bestNextIndex);
      currentPoint = deliveries[bestNextIndex].location;
      unvisited.splice(unvisited.indexOf(bestNextIndex), 1);
    }
  }

  return route;
};
