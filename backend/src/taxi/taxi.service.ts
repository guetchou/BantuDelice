import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { TaxiRide, TaxiRideStatus, VehicleType, PaymentMethod } from './entities/taxi-ride.entity';
import { Vehicle, VehicleStatus } from './entities/vehicle.entity';
import { Pricing, PricingType } from './entities/pricing.entity';
import { Driver } from '../tracking/entities/driver.entity';

export interface CreateRideRequest {
  userId: string;
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

@Injectable()
export class TaxiService {
  constructor(
    @InjectRepository(TaxiRide)
    private taxiRideRepository: Repository<TaxiRide>,
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Pricing)
    private pricingRepository: Repository<Pricing>,
    @InjectRepository(Driver)
    private driverRepository: Repository<Driver>,
  ) {}

  async createRide(createRideRequest: CreateRideRequest): Promise<TaxiRide> {
    const estimate = await this.calculateRideEstimate(
      createRideRequest.pickupLatitude,
      createRideRequest.pickupLongitude,
      createRideRequest.destinationLatitude,
      createRideRequest.destinationLongitude,
      createRideRequest.vehicleType
    );

    const ride = this.taxiRideRepository.create({
      ...createRideRequest,
      status: TaxiRideStatus.REQUESTED,
      estimatedPrice: estimate.estimatedPrice,
      distance: estimate.distance,
      duration: estimate.duration,
      surgeMultiplier: estimate.surgeMultiplier,
      requestedAt: new Date(),
      paymentStatus: 'pending',
    });

    return this.taxiRideRepository.save(ride);
  }

  async getRideById(rideId: string): Promise<TaxiRide> {
    const ride = await this.taxiRideRepository.findOne({
      where: { id: rideId },
      relations: ['user', 'driver', 'driver.vehicle'],
    });

    if (!ride) {
      throw new NotFoundException('Course non trouvée');
    }

    return ride;
  }

  async getUserRides(userId: string, page: number = 1, limit: number = 10): Promise<{ rides: TaxiRide[]; total: number }> {
    const [rides, total] = await this.taxiRideRepository.findAndCount({
      where: { userId },
      relations: ['driver', 'driver.vehicle'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { rides, total };
  }

  async getDriverRides(driverId: string, page: number = 1, limit: number = 10): Promise<{ rides: TaxiRide[]; total: number }> {
    const [rides, total] = await this.taxiRideRepository.findAndCount({
      where: { driverId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { rides, total };
  }

  async updateRideStatus(rideId: string, status: TaxiRideStatus, driverId?: string): Promise<TaxiRide> {
    const ride = await this.getRideById(rideId);
    
    ride.status = status;
    
    // Update timestamps based on status
    switch (status) {
      case TaxiRideStatus.ACCEPTED:
        ride.acceptedAt = new Date();
        if (driverId) ride.driverId = driverId;
        break;
      case TaxiRideStatus.ARRIVED:
        ride.arrivedAt = new Date();
        break;
      case TaxiRideStatus.IN_PROGRESS:
        ride.startedAt = new Date();
        break;
      case TaxiRideStatus.COMPLETED:
        ride.completedAt = new Date();
        break;
      case TaxiRideStatus.CANCELLED:
        ride.cancelledAt = new Date();
        break;
    }

    return this.taxiRideRepository.save(ride);
  }

  async cancelRide(rideId: string, userId: string): Promise<TaxiRide> {
    const ride = await this.getRideById(rideId);
    
    if (ride.userId !== userId) {
      throw new BadRequestException('Vous ne pouvez annuler que vos propres courses');
    }

    if (ride.status !== TaxiRideStatus.REQUESTED && ride.status !== TaxiRideStatus.ACCEPTED) {
      throw new BadRequestException('Cette course ne peut plus être annulée');
    }

    return this.updateRideStatus(rideId, TaxiRideStatus.CANCELLED);
  }

  async rateRide(rideId: string, rating: number, comment?: string, categories?: any): Promise<TaxiRide> {
    const ride = await this.getRideById(rideId);
    
    if (ride.status !== TaxiRideStatus.COMPLETED) {
      throw new BadRequestException('Vous ne pouvez évaluer qu\'une course terminée');
    }

    if (rating < 1 || rating > 5) {
      throw new BadRequestException('La note doit être entre 1 et 5');
    }

    ride.rating = rating;
    if (comment) {
      ride.comment = comment;
    }
    if (categories) {
      ride.ratingCategories = categories;
    }

    return this.taxiRideRepository.save(ride);
  }

  async calculateRideEstimate(
    pickupLat: number,
    pickupLng: number,
    destLat: number,
    destLng: number,
    vehicleType: VehicleType
  ): Promise<RideEstimate> {
    // Calculate distance using Haversine formula
    const distance = this.calculateDistance(pickupLat, pickupLng, destLat, destLng);
    
    // Get pricing for vehicle type
    const pricing = await this.pricingRepository.findOne({
      where: { 
        vehicleType,
        type: PricingType.BASE,
        isActive: true,
        isDefault: true
      }
    });

    if (!pricing) {
      throw new NotFoundException('Tarification non trouvée pour ce type de véhicule');
    }

    // Calculate estimated duration (rough estimate: 30 km/h average)
    const duration = Math.max(5, Math.round(distance * 2)); // 2 minutes per km minimum

    // Calculate surge multiplier based on demand
    const surgeMultiplier = await this.calculateSurgeMultiplier(pickupLat, pickupLng);

    // Calculate total price
    const basePrice = pricing.basePrice;
    const distancePrice = distance * pricing.pricePerKm;
    const timePrice = duration * pricing.pricePerMinute;
    const totalPrice = (basePrice + distancePrice + timePrice) * surgeMultiplier;

    // Ensure minimum fare
    const estimatedPrice = Math.max(totalPrice, pricing.minimumFare);

    return {
      estimatedPrice: Math.round(estimatedPrice),
      distance: Math.round(distance * 100) / 100,
      duration,
      surgeMultiplier,
      currency: pricing.currency,
    };
  }

  async findNearbyDrivers(
    latitude: number,
    longitude: number,
    vehicleType: VehicleType,
    radius: number = 5 // km
  ): Promise<Vehicle[]> {
    // Find vehicles within radius that are available and match the requested type
    const vehicles = await this.vehicleRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.driver', 'driver')
      .where('vehicle.type = :vehicleType', { vehicleType })
      .andWhere('vehicle.isAvailable = :isAvailable', { isAvailable: true })
      .andWhere('vehicle.status = :status', { status: VehicleStatus.ACTIVE })
      .andWhere('driver.isOnline = :isOnline', { isOnline: true })
      .andWhere(
        `ST_DWithin(
          ST_MakePoint(vehicle.currentLongitude, vehicle.currentLatitude),
          ST_MakePoint(:longitude, :latitude),
          :radius * 1000
        )`,
        { longitude, latitude, radius }
      )
      .orderBy('ST_Distance(ST_MakePoint(vehicle.currentLongitude, vehicle.currentLatitude), ST_MakePoint(:longitude, :latitude))', 'ASC')
      .limit(10)
      .getMany();

    return vehicles;
  }

  async assignDriverToRide(rideId: string, driverId: string): Promise<TaxiRide> {
    const ride = await this.getRideById(rideId);
    const driver = await this.driverRepository.findOne({ where: { id: driverId } });

    if (!driver) {
      throw new NotFoundException('Chauffeur non trouvé');
    }

    if (ride.status !== TaxiRideStatus.REQUESTED) {
      throw new BadRequestException('Cette course ne peut plus recevoir de chauffeur');
    }

    ride.driverId = driverId;
    ride.status = TaxiRideStatus.ACCEPTED;
    ride.acceptedAt = new Date();

    return this.taxiRideRepository.save(ride);
  }

  async updateDriverLocation(driverId: string, latitude: number, longitude: number): Promise<void> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { driverId }
    });

    if (vehicle) {
      vehicle.currentLatitude = latitude;
      vehicle.currentLongitude = longitude;
      vehicle.lastLocationUpdate = new Date();
      await this.vehicleRepository.save(vehicle);
    }
  }

  async getRideStatistics(userId?: string, driverId?: string, dateFrom?: Date, dateTo?: Date) {
    const whereConditions: any = {};
    
    if (userId) whereConditions.userId = userId;
    if (driverId) whereConditions.driverId = driverId;
    if (dateFrom && dateTo) {
      whereConditions.createdAt = Between(dateFrom, dateTo);
    }

    const rides = await this.taxiRideRepository.find({ where: whereConditions });

    const stats = {
      total: rides.length,
      byStatus: {},
      byVehicleType: {},
      totalRevenue: 0,
      averageRating: 0,
      completedRides: 0,
    };

    let totalRating = 0;
    let ratedRides = 0;

    rides.forEach(ride => {
      // Count by status
      stats.byStatus[ride.status] = (stats.byStatus[ride.status] || 0) + 1;
      
      // Count by vehicle type
      stats.byVehicleType[ride.vehicleType] = (stats.byVehicleType[ride.vehicleType] || 0) + 1;
      
      // Calculate revenue
      if (ride.actualPrice) {
        stats.totalRevenue += ride.actualPrice;
      }
      
      // Calculate rating
      if (ride.rating) {
        totalRating += ride.rating;
        ratedRides++;
      }
      
      // Count completed rides
      if (ride.status === TaxiRideStatus.COMPLETED) {
        stats.completedRides++;
      }
    });

    stats.averageRating = ratedRides > 0 ? totalRating / ratedRides : 0;

    return stats;
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  private async calculateSurgeMultiplier(latitude: number, longitude: number): Promise<number> {
    // Get current demand in the area
    const nearbyRides = await this.taxiRideRepository.count({
      where: {
        status: In([TaxiRideStatus.REQUESTED, TaxiRideStatus.ACCEPTED]),
        createdAt: Between(new Date(Date.now() - 30 * 60 * 1000), new Date()), // Last 30 minutes
      }
    });

    const nearbyDrivers = await this.vehicleRepository.count({
      where: {
        isAvailable: true,
        status: VehicleStatus.ACTIVE,
      }
    });

    // Simple surge calculation
    if (nearbyDrivers === 0) return 2.0; // No drivers available
    if (nearbyRides > nearbyDrivers * 2) return 1.5; // High demand
    if (nearbyRides > nearbyDrivers) return 1.2; // Moderate demand
    
    return 1.0; // Normal demand
  }
} 