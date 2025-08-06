import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../common/entities/user.entity';
import { Driver } from '../../tracking/entities/driver.entity';

export enum TaxiRideStatus {
  REQUESTED = 'requested',
  ACCEPTED = 'accepted',
  ARRIVING = 'arriving',
  ARRIVED = 'arrived',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FAILED = 'failed'
}

export enum VehicleType {
  STANDARD = 'standard',
  COMFORT = 'comfort',
  PREMIUM = 'premium',
  VAN = 'van',
  MOTORCYCLE = 'motorcycle'
}

export enum PaymentMethod {
  CARD = 'card',
  CASH = 'cash',
  MOBILE_MONEY = 'mobile_money',
  WALLET = 'wallet'
}

@Entity('taxi_rides')
export class TaxiRide {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  driverId: string;

  @Column({
    type: 'enum',
    enum: TaxiRideStatus,
    default: TaxiRideStatus.REQUESTED
  })
  status: TaxiRideStatus;

  // Pickup location
  @Column()
  pickupAddress: string;

  @Column('decimal', { precision: 10, scale: 8 })
  pickupLatitude: number;

  @Column('decimal', { precision: 11, scale: 8 })
  pickupLongitude: number;

  // Destination
  @Column()
  destinationAddress: string;

  @Column('decimal', { precision: 10, scale: 8 })
  destinationLatitude: number;

  @Column('decimal', { precision: 11, scale: 8 })
  destinationLongitude: number;

  // Vehicle and pricing
  @Column({
    type: 'enum',
    enum: VehicleType,
    default: VehicleType.STANDARD
  })
  vehicleType: VehicleType;

  @Column('decimal', { precision: 10, scale: 2 })
  estimatedPrice: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  actualPrice: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  distance: number; // in km

  @Column('int', { nullable: true })
  duration: number; // in minutes

  // Payment
  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CASH
  })
  paymentMethod: PaymentMethod;

  @Column({
    type: 'enum',
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  })
  paymentStatus: string;

  @Column({ nullable: true })
  transactionId: string;

  // Route information
  @Column('text', { nullable: true })
  routePolyline: string;

  @Column('json', { nullable: true })
  waypoints: any;

  // Timing
  @Column({ nullable: true })
  requestedAt: Date;

  @Column({ nullable: true })
  acceptedAt: Date;

  @Column({ nullable: true })
  arrivedAt: Date;

  @Column({ nullable: true })
  startedAt: Date;

  @Column({ nullable: true })
  completedAt: Date;

  @Column({ nullable: true })
  cancelledAt: Date;

  // Rating and feedback
  @Column('int', { nullable: true })
  rating: number;

  @Column('text', { nullable: true })
  comment: string;

  @Column('json', { nullable: true })
  ratingCategories: {
    cleanliness?: number;
    punctuality?: number;
    service?: number;
    safety?: number;
  };

  // Additional information
  @Column('text', { nullable: true })
  specialInstructions: string;

  @Column('int', { default: 1 })
  passengerCount: number;

  @Column('boolean', { default: false })
  isScheduled: boolean;

  @Column({ nullable: true })
  scheduledTime: Date;

  @Column('decimal', { precision: 3, scale: 2, nullable: true })
  surgeMultiplier: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Driver, driver => driver.id)
  @JoinColumn({ name: 'driverId' })
  driver: Driver;
} 