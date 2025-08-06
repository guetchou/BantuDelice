import { apiClient } from './apiClient';
import { TaxiRide, VehicleType, PaymentMethod, RideStatus } from '@/types/taxi';

export interface CreateRideRequest {
  pickupAddress: string;
  pickupLatitude: number;
  pickupLongitude: number;
  destinationAddress: string;
  destinationLatitude: number;
  destinationLongitude: number;
  vehicleType: VehicleType;
  paymentMethod: PaymentMethod;
  passengerCount?: number;
  specialInstructions?: string;
  isScheduled?: boolean;
  scheduledTime?: Date;
}

export interface RideEstimate {
  estimatedPrice: number;
  distance: number;
  duration: number;
  surgeMultiplier: number;
  currency: string;
}

export interface RatingData {
  rating: number;
  comment?: string;
  categories?: {
    cleanliness?: number;
    punctuality?: number;
    service?: number;
    safety?: number;
  };
}

class TaxiService {
  private baseUrl = '/taxi';

  // Create a new ride
  async createRide(rideData: CreateRideRequest): Promise<TaxiRide> {
    const response = await apiClient.post(`${this.baseUrl}/rides`, rideData);
    return response.data;
  }

  // Get ride by ID
  async getRide(rideId: string): Promise<TaxiRide> {
    const response = await apiClient.get(`${this.baseUrl}/rides/${rideId}`);
    return response.data;
  }

  // Get user rides
  async getUserRides(page: number = 1, limit: number = 10): Promise<{ rides: TaxiRide[]; total: number }> {
    const response = await apiClient.get(`${this.baseUrl}/rides`, {
      params: { page, limit }
    });
    return response.data;
  }

  // Get driver rides
  async getDriverRides(page: number = 1, limit: number = 10): Promise<{ rides: TaxiRide[]; total: number }> {
    const response = await apiClient.get(`${this.baseUrl}/driver/rides`, {
      params: { page, limit }
    });
    return response.data;
  }

  // Update ride status
  async updateRideStatus(rideId: string, status: RideStatus, driverId?: string): Promise<TaxiRide> {
    const response = await apiClient.put(`${this.baseUrl}/rides/${rideId}/status`, {
      status,
      driverId
    });
    return response.data;
  }

  // Cancel ride
  async cancelRide(rideId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/rides/${rideId}`);
  }

  // Rate ride
  async rateRide(rideId: string, ratingData: RatingData): Promise<TaxiRide> {
    const response = await apiClient.post(`${this.baseUrl}/rides/${rideId}/rate`, ratingData);
    return response.data;
  }

  // Calculate ride estimate
  async calculateEstimate(
    pickupLat: number,
    pickupLng: number,
    destLat: number,
    destLng: number,
    vehicleType: VehicleType
  ): Promise<RideEstimate> {
    const response = await apiClient.post(`${this.baseUrl}/estimate`, {
      pickupLatitude: pickupLat,
      pickupLongitude: pickupLng,
      destinationLatitude: destLat,
      destinationLongitude: destLng,
      vehicleType
    });
    return response.data;
  }

  // Find nearby drivers
  async findNearbyDrivers(
    latitude: number,
    longitude: number,
    vehicleType: VehicleType,
    radius: number = 5
  ) {
    const response = await apiClient.get(`${this.baseUrl}/drivers/nearby`, {
      params: { latitude, longitude, vehicleType, radius }
    });
    return response.data;
  }

  // Assign driver to ride (admin only)
  async assignDriver(rideId: string, driverId: string): Promise<TaxiRide> {
    const response = await apiClient.post(`${this.baseUrl}/drivers/${driverId}/assign`, {
      rideId
    });
    return response.data;
  }

  // Update driver location
  async updateDriverLocation(latitude: number, longitude: number): Promise<void> {
    await apiClient.post(`${this.baseUrl}/drivers/location`, {
      latitude,
      longitude
    });
  }

  // Get ride statistics
  async getStatistics(params?: {
    userId?: string;
    driverId?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const response = await apiClient.get(`${this.baseUrl}/statistics`, {
      params
    });
    return response.data;
  }

  // Get pricing information
  async getPricing(vehicleType?: VehicleType) {
    const response = await apiClient.get(`${this.baseUrl}/pricing`, {
      params: { vehicleType }
    });
    return response.data;
  }

  // WebSocket methods for real-time updates
  connectWebSocket(token: string) {
    const socket = new WebSocket(`ws://localhost:3000`, {
      auth: { token }
    });

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return socket;
  }

  // Join user room for real-time updates
  joinUserRoom(socket: WebSocket, userId: string) {
    socket.send(JSON.stringify({
      event: 'join_user_room',
      data: { userId }
    }));
  }

  // Join driver room for real-time updates
  joinDriverRoom(socket: WebSocket, driverId: string) {
    socket.send(JSON.stringify({
      event: 'join_driver_room',
      data: { driverId }
    }));
  }

  // Update driver location via WebSocket
  updateDriverLocationWS(socket: WebSocket, data: {
    driverId: string;
    latitude: number;
    longitude: number;
    rideId?: string;
  }) {
    socket.send(JSON.stringify({
      event: 'update_driver_location',
      data
    }));
  }

  // Request ride via WebSocket
  requestRideWS(socket: WebSocket, rideData: CreateRideRequest & { userId: string }) {
    socket.send(JSON.stringify({
      event: 'request_ride',
      data: rideData
    }));
  }

  // Accept ride as driver via WebSocket
  acceptRideWS(socket: WebSocket, rideId: string, driverId: string) {
    socket.send(JSON.stringify({
      event: 'driver_accept_ride',
      data: { rideId, driverId }
    }));
  }

  // Cancel ride via WebSocket
  cancelRideWS(socket: WebSocket, rideId: string, userId: string) {
    socket.send(JSON.stringify({
      event: 'cancel_ride',
      data: { rideId, userId }
    }));
  }

  // Update ride status via WebSocket
  updateRideStatusWS(socket: WebSocket, data: {
    rideId: string;
    status: RideStatus;
    driverId?: string;
  }) {
    socket.send(JSON.stringify({
      event: 'ride_status_update',
      data
    }));
  }
}

export const taxiService = new TaxiService(); 