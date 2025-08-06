import { DataSource } from 'typeorm';
import { TaxiRide, TaxiRideStatus, VehicleType, PaymentMethod } from './entities/taxi-ride.entity';
import { Vehicle, VehicleStatus } from './entities/vehicle.entity';
import { Pricing, PricingType } from './entities/pricing.entity';
import { Driver } from '../tracking/entities/driver.entity';

export async function seedTaxiData(dataSource: DataSource) {
  console.log('🌱 Seeding taxi data...');

  const driverRepository = dataSource.getRepository(Driver);
  const vehicleRepository = dataSource.getRepository(Vehicle);
  const pricingRepository = dataSource.getRepository(Pricing);

  // Create sample drivers
  const drivers = await driverRepository.save([
    {
      id: 'driver-1',
      name: 'Jean Dupont',
      phone: '+242 06 123 4567',
      email: 'jean.dupont@example.com',
      isOnline: true,
      currentLatitude: 15.2429,
      currentLongitude: -4.2634,
    },
    {
      id: 'driver-2',
      name: 'Marie Martin',
      phone: '+242 06 234 5678',
      email: 'marie.martin@example.com',
      isOnline: true,
      currentLatitude: 15.245,
      currentLongitude: -4.26,
    },
    {
      id: 'driver-3',
      name: 'Pierre Durand',
      phone: '+242 06 345 6789',
      email: 'pierre.durand@example.com',
      isOnline: false,
      currentLatitude: 15.24,
      currentLongitude: -4.265,
    },
  ]);

  // Create sample vehicles
  const vehicles = await vehicleRepository.save([
    {
      id: 'vehicle-1',
      driverId: 'driver-1',
      type: VehicleType.STANDARD,
      brand: 'Toyota',
      model: 'Corolla',
      year: 2020,
      color: 'Blanc',
      plateNumber: 'BZ 1234 AB',
      maxPassengers: 4,
      features: ['air_conditioning', 'wifi'],
      amenities: ['water', 'tissues'],
      status: VehicleStatus.ACTIVE,
      isAvailable: true,
      currentLatitude: 15.2429,
      currentLongitude: -4.2634,
      basePrice: 500,
      pricePerKm: 150,
      pricePerMinute: 10,
      minimumFare: 1000,
      cancellationFee: 500,
    },
    {
      id: 'vehicle-2',
      driverId: 'driver-2',
      type: VehicleType.PREMIUM,
      brand: 'Mercedes',
      model: 'C-Class',
      year: 2021,
      color: 'Noir',
      plateNumber: 'BZ 5678 CD',
      maxPassengers: 4,
      features: ['air_conditioning', 'wifi', 'leather_seats'],
      amenities: ['water', 'tissues', 'phone_charger'],
      status: VehicleStatus.ACTIVE,
      isAvailable: true,
      currentLatitude: 15.245,
      currentLongitude: -4.26,
      basePrice: 800,
      pricePerKm: 200,
      pricePerMinute: 15,
      minimumFare: 1500,
      cancellationFee: 800,
    },
    {
      id: 'vehicle-3',
      driverId: 'driver-3',
      type: VehicleType.VAN,
      brand: 'Toyota',
      model: 'Hiace',
      year: 2019,
      color: 'Gris',
      plateNumber: 'BZ 9012 EF',
      maxPassengers: 8,
      features: ['air_conditioning', 'spacious'],
      amenities: ['water'],
      status: VehicleStatus.ACTIVE,
      isAvailable: false,
      currentLatitude: 15.24,
      currentLongitude: -4.265,
      basePrice: 1500,
      pricePerKm: 250,
      pricePerMinute: 18,
      minimumFare: 2500,
      cancellationFee: 1000,
    },
  ]);

  // Create pricing rules
  const pricingData = [
    {
      id: 'pricing-standard',
      type: PricingType.BASE,
      vehicleType: VehicleType.STANDARD,
      basePrice: 500,
      pricePerKm: 150,
      pricePerMinute: 10,
      minimumFare: 1000,
      cancellationFee: 500,
      multiplier: 1.0,
      currency: 'XAF',
      isActive: true,
      isDefault: true,
      priority: 0,
      description: 'Tarif standard pour taxi ordinaire',
    },
    {
      id: 'pricing-comfort',
      type: PricingType.BASE,
      vehicleType: VehicleType.COMFORT,
      basePrice: 700,
      pricePerKm: 180,
      pricePerMinute: 12,
      minimumFare: 1200,
      cancellationFee: 600,
      multiplier: 1.0,
      currency: 'XAF',
      isActive: true,
      isDefault: true,
      priority: 0,
      description: 'Tarif confort pour véhicule premium',
    },
    {
      id: 'pricing-premium',
      type: PricingType.BASE,
      vehicleType: VehicleType.PREMIUM,
      basePrice: 1200,
      pricePerKm: 300,
      pricePerMinute: 20,
      minimumFare: 2000,
      cancellationFee: 1000,
      multiplier: 1.0,
      currency: 'XAF',
      isActive: true,
      isDefault: true,
      priority: 0,
      description: 'Tarif premium pour véhicule luxueux',
    },
    {
      id: 'pricing-van',
      type: PricingType.BASE,
      vehicleType: VehicleType.VAN,
      basePrice: 1500,
      pricePerKm: 250,
      pricePerMinute: 18,
      minimumFare: 2500,
      cancellationFee: 1000,
      multiplier: 1.0,
      currency: 'XAF',
      isActive: true,
      isDefault: true,
      priority: 0,
      description: 'Tarif van pour véhicule spacieux',
    },
    {
      id: 'pricing-motorcycle',
      type: PricingType.BASE,
      vehicleType: VehicleType.MOTORCYCLE,
      basePrice: 300,
      pricePerKm: 100,
      pricePerMinute: 8,
      minimumFare: 800,
      cancellationFee: 300,
      multiplier: 1.0,
      currency: 'XAF',
      isActive: true,
      isDefault: true,
      priority: 0,
      description: 'Tarif moto pour livraison rapide',
    },
    // Surge pricing rules
    {
      id: 'surge-peak-hours',
      type: PricingType.TIME_BASED,
      vehicleType: VehicleType.STANDARD,
      basePrice: 500,
      pricePerKm: 150,
      pricePerMinute: 10,
      minimumFare: 1000,
      cancellationFee: 500,
      multiplier: 1.3,
      dayOfWeek: 'friday',
      startTime: '17:00',
      endTime: '20:00',
      currency: 'XAF',
      isActive: true,
      isDefault: false,
      priority: 1,
      description: 'Tarif majoré pendant les heures de pointe',
    },
    {
      id: 'surge-weekend',
      type: PricingType.TIME_BASED,
      vehicleType: VehicleType.STANDARD,
      basePrice: 500,
      pricePerKm: 150,
      pricePerMinute: 10,
      minimumFare: 1000,
      cancellationFee: 500,
      multiplier: 1.2,
      dayOfWeek: 'saturday',
      currency: 'XAF',
      isActive: true,
      isDefault: false,
      priority: 1,
      description: 'Tarif majoré le weekend',
    },
  ];

  const pricingRules: any[] = [];
  for (const data of pricingData) {
    const pricing = pricingRepository.create(data as any);
    const savedPricing = await pricingRepository.save(pricing);
    pricingRules.push(savedPricing);
  }

  console.log(`✅ Seeded ${drivers.length} drivers`);
  console.log(`✅ Seeded ${vehicles.length} vehicles`);
  console.log(`✅ Seeded ${pricingRules.length} pricing rules`);

  return { drivers, vehicles, pricingRules };
} 