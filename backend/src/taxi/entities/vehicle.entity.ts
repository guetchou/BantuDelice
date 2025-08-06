import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Driver } from '../../tracking/entities/driver.entity';

export enum VehicleType {
  STANDARD = 'standard',
  COMFORT = 'comfort',
  PREMIUM = 'premium',
  VAN = 'van',
  MOTORCYCLE = 'motorcycle'
}

export enum VehicleStatus {
  ACTIVE = 'active',
  MAINTENANCE = 'maintenance',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  driverId: string;

  @Column({
    type: 'enum',
    enum: VehicleType,
    default: VehicleType.STANDARD
  })
  type: VehicleType;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  color: string;

  @Column()
  plateNumber: string;

  @Column('text', { nullable: true })
  vin: string; // Vehicle Identification Number

  @Column('text', { nullable: true })
  insuranceNumber: string;

  @Column({ nullable: true })
  insuranceExpiryDate: Date;

  @Column('text', { nullable: true })
  registrationNumber: string;

  @Column({ nullable: true })
  registrationExpiryDate: Date;

  @Column('text', { nullable: true })
  inspectionNumber: string;

  @Column({ nullable: true })
  inspectionExpiryDate: Date;

  @Column('int', { default: 4 })
  maxPassengers: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  trunkCapacity: number; // in liters

  @Column('json', { nullable: true })
  features: string[]; // ['air_conditioning', 'wifi', 'child_seat', etc.]

  @Column('json', { nullable: true })
  amenities: string[]; // ['water', 'tissues', 'phone_charger', etc.]

  @Column('text', { nullable: true })
  photoUrl: string;

  @Column('text', { nullable: true })
  documents: {
    registration?: string;
    insurance?: string;
    inspection?: string;
    permit?: string;
  };

  @Column({
    type: 'enum',
    enum: VehicleStatus,
    default: VehicleStatus.ACTIVE
  })
  status: VehicleStatus;

  @Column('boolean', { default: true })
  isAvailable: boolean;

  @Column('decimal', { precision: 10, scale: 8, nullable: true })
  currentLatitude: number;

  @Column('decimal', { precision: 11, scale: 8, nullable: true })
  currentLongitude: number;

  @Column({ nullable: true })
  lastLocationUpdate: Date;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  basePrice: number; // Base price per km

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  pricePerKm: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  pricePerMinute: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  minimumFare: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  cancellationFee: number;

  @Column('int', { default: 0 })
  totalRides: number;

  @Column('decimal', { precision: 3, scale: 2, default: 5.0 })
  averageRating: number;

  @Column('int', { default: 0 })
  totalRatings: number;

  @Column('text', { nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Driver, driver => driver.id)
  @JoinColumn({ name: 'driverId' })
  driver: Driver;
} 