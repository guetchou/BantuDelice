interface DeliveryPoint {
  id: string;
  latitude: number;
  longitude: number;
  priority: number;
  timeWindow?: {
    start: Date;
    end: Date;
  };
}

interface Driver {
  id: string;
  location: {
    latitude: number;
    longitude: number;
  };
  maxOrders: number;
  currentOrders: number;
}

export const optimizeDeliveryRoutes = (
  deliveryPoints: DeliveryPoint[],
  availableDrivers: Driver[]
): Map<string, DeliveryPoint[]> => {
  const routes = new Map<string, DeliveryPoint[]>();
  
  // Sort delivery points by priority
  const sortedPoints = [...deliveryPoints].sort((a, b) => b.priority - a.priority);
  
  // Sort drivers by current load
  const sortedDrivers = [...availableDrivers].sort(
    (a, b) => (a.currentOrders / a.maxOrders) - (b.currentOrders / b.maxOrders)
  );

  for (const driver of sortedDrivers) {
    routes.set(driver.id, []);
  }

  // Assign points to nearest available driver
  for (const point of sortedPoints) {
    let bestDriver = null;
    let shortestDistance = Infinity;

    for (const driver of sortedDrivers) {
      if (routes.get(driver.id)!.length >= driver.maxOrders) continue;

      const distance = calculateDistance(
        driver.location.latitude,
        driver.location.longitude,
        point.latitude,
        point.longitude
      );

      if (distance < shortestDistance) {
        shortestDistance = distance;
        bestDriver = driver;
      }
    }

    if (bestDriver) {
      routes.get(bestDriver.id)!.push(point);
    }
  }

  // Optimize each driver's route using nearest neighbor
  for (const [driverId, driverPoints] of routes) {
    if (driverPoints.length > 1) {
      routes.set(driverId, optimizeRouteOrder(driverPoints));
    }
  }

  return routes;
};

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const toRad = (value: number): number => {
  return value * Math.PI / 180;
};

const optimizeRouteOrder = (points: DeliveryPoint[]): DeliveryPoint[] => {
  const optimizedRoute: DeliveryPoint[] = [points[0]];
  const remaining = points.slice(1);

  while (remaining.length > 0) {
    const current = optimizedRoute[optimizedRoute.length - 1];
    let nearestIndex = 0;
    let nearestDistance = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const distance = calculateDistance(
        current.latitude,
        current.longitude,
        remaining[i].latitude,
        remaining[i].longitude
      );

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    }

    optimizedRoute.push(remaining[nearestIndex]);
    remaining.splice(nearestIndex, 1);
  }

  return optimizedRoute;
};