import { supabase } from '@/lib/supabase';

export class EdgeFunctionsService {
  private static async callFunction<T>(
    functionName: string,
    body: any
  ): Promise<T> {
    try {
      const { data, error } = await supabase.functions.invoke(functionName, {
        body
      });

      if (error) {
        throw new Error(error.message);
      }

      return data as T;
    } catch (error) {
      console.error(`Error calling ${functionName}:`, error);
      throw error;
    }
  }

  // Delivery estimation
  static async getDeliveryEstimate(
    pickupCoordinates: [number, number],
    deliveryCoordinates: [number, number],
    packageType: string = 'standard',
    weight: number = 1,
    serviceType: string = 'standard'
  ) {
    return this.callFunction<{
      distance: number;
      duration: number;
      additionalCost: number;
      route: any;
      estimatedDeliveryTime: string;
      serviceRecommendations: string[];
    }>('delivery-estimate', {
      pickupCoordinates,
      deliveryCoordinates,
      packageType,
      weight,
      serviceType
    });
  }

  // Track delivery
  static async trackDelivery(trackingNumber: string) {
    return this.callFunction<{
      trackingNumber: string;
      status: string;
      location: string;
      lastUpdate: string;
      estimatedDelivery: string;
      currentLocation?: [number, number];
      route?: any;
      driver?: {
        name: string;
        phone: string;
        vehicle: string;
      };
      history: Array<{
        timestamp: string;
        status: string;
        location: string;
        description: string;
      }>;
    }>('track-delivery', {
      trackingNumber
    });
  }

  // Create delivery request
  static async createDelivery(deliveryData: {
    pickupAddress: string;
    deliveryAddress: string;
    packageType: string;
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    serviceId: string;
    insurance: boolean;
    tracking: boolean;
    specialInstructions: string;
    contactInfo: {
      name: string;
      phone: string;
      email: string;
    };
    estimatedCost: number;
    estimatedDistance: number;
    estimatedTime: number;
    userId?: string;
  }) {
    return this.callFunction<{
      success: boolean;
      trackingNumber: string;
      deliveryId: string;
      message: string;
    }>('create-delivery', deliveryData);
  }

  // Geolocation services
  static async getGeolocationData(coordinates: [number, number]) {
    return this.callFunction<{
      address: string;
      city: string;
      country: string;
      postalCode: string;
      formattedAddress: string;
    }>('geolocation-reverse', {
      coordinates
    });
  }

  // Taxi services
  static async getTaxiEstimate(
    pickupCoordinates: [number, number],
    deliveryCoordinates: [number, number]
  ) {
    return this.callFunction<{
      distance: number;
      duration: number;
      estimatedCost: number;
      availableTaxis: number;
    }>('taxi-estimate', {
      pickupCoordinates,
      deliveryCoordinates
    });
  }

  // Ridesharing services
  static async getRidesharingEstimate(
    pickupCoordinates: [number, number],
    deliveryCoordinates: [number, number]
  ) {
    return this.callFunction<{
      distance: number;
      duration: number;
      estimatedCost: number;
      availableDrivers: number;
    }>('ridesharing-estimate', {
      pickupCoordinates,
      deliveryCoordinates
    });
  }

  // Delivery services
  static async getDeliveryServices(location: [number, number]) {
    return this.callFunction<Array<{
      id: string;
      name: string;
      logo: string;
      price: number;
      estimatedTime: string;
      features: string[];
      rating: number;
      coverage: string[];
      tracking: boolean;
      insurance: boolean;
    }>>('delivery-services', {
      location
    });
  }

  // Weather information for delivery
  static async getWeatherForDelivery(coordinates: [number, number]) {
    return this.callFunction<{
      temperature: number;
      condition: string;
      humidity: number;
      windSpeed: number;
      visibility: number;
      deliveryImpact: string;
    }>('weather-delivery', {
      coordinates
    });
  }

  // Traffic information
  static async getTrafficInfo(
    pickupCoordinates: [number, number],
    deliveryCoordinates: [number, number]
  ) {
    return this.callFunction<{
      trafficLevel: string;
      estimatedDelay: number;
      alternativeRoutes: Array<{
        distance: number;
        duration: number;
        trafficLevel: string;
      }>;
    }>('traffic-info', {
      pickupCoordinates,
      deliveryCoordinates
    });
  }

  // Package insurance calculation
  static async calculateInsurance(
    packageType: string,
    weight: number,
    value: number,
    distance: number
  ) {
    return this.callFunction<{
      insuranceCost: number;
      coverage: string;
      terms: string[];
      recommended: boolean;
    }>('insurance-calculate', {
      packageType,
      weight,
      value,
      distance
    });
  }

  // Driver assignment
  static async assignDriver(
    deliveryId: string,
    pickupCoordinates: [number, number],
    deliveryCoordinates: [number, number],
    serviceType: string
  ) {
    return this.callFunction<{
      driverId: string;
      driverName: string;
      driverPhone: string;
      vehicleType: string;
      estimatedPickupTime: string;
      estimatedDeliveryTime: string;
    }>('assign-driver', {
      deliveryId,
      pickupCoordinates,
      deliveryCoordinates,
      serviceType
    });
  }

  // Real-time tracking update
  static async updateTrackingLocation(
    trackingNumber: string,
    coordinates: [number, number],
    status: string
  ) {
    return this.callFunction<{
      success: boolean;
      updatedAt: string;
      newStatus: string;
    }>('update-tracking', {
      trackingNumber,
      coordinates,
      status
    });
  }

  // Delivery confirmation
  static async confirmDelivery(
    trackingNumber: string,
    signature?: string,
    photo?: string
  ) {
    return this.callFunction<{
      success: boolean;
      confirmationCode: string;
      deliveryTime: string;
    }>('confirm-delivery', {
      trackingNumber,
      signature,
      photo
    });
  }

  // Customer feedback
  static async submitFeedback(
    trackingNumber: string,
    rating: number,
    comment: string,
    categories: string[]
  ) {
    return this.callFunction<{
      success: boolean;
      feedbackId: string;
      thankYouMessage: string;
    }>('submit-feedback', {
      trackingNumber,
      rating,
      comment,
      categories
    });
  }
} 