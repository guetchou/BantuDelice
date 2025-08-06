import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum PricingType {
  BASE = 'base',
  SURGE = 'surge',
  ZONE = 'zone',
  TIME_BASED = 'time_based',
  WEATHER = 'weather'
}

export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday'
}

@Entity('pricing')
export class Pricing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: PricingType,
    default: PricingType.BASE
  })
  type: PricingType;

  @Column()
  vehicleType: string;

  @Column('decimal', { precision: 10, scale: 2 })
  basePrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  pricePerKm: number;

  @Column('decimal', { precision: 10, scale: 2 })
  pricePerMinute: number;

  @Column('decimal', { precision: 10, scale: 2 })
  minimumFare: number;

  @Column('decimal', { precision: 10, scale: 2 })
  cancellationFee: number;

  @Column('decimal', { precision: 3, scale: 2, default: 1.0 })
  multiplier: number;

  // Zone-based pricing
  @Column('text', { nullable: true })
  zoneId: string;

  @Column('text', { nullable: true })
  zoneName: string;

  // Time-based pricing
  @Column({
    type: 'enum',
    enum: DayOfWeek,
    nullable: true
  })
  dayOfWeek: DayOfWeek;

  @Column('time', { nullable: true })
  startTime: string;

  @Column('time', { nullable: true })
  endTime: string;

  // Surge pricing
  @Column('decimal', { precision: 3, scale: 2, nullable: true })
  surgeMultiplier: number;

  @Column('int', { nullable: true })
  demandThreshold: number;

  @Column('int', { nullable: true })
  supplyThreshold: number;

  // Weather conditions
  @Column('text', { nullable: true })
  weatherCondition: string;

  @Column('decimal', { precision: 3, scale: 2, nullable: true })
  weatherMultiplier: number;

  // Special events
  @Column('text', { nullable: true })
  eventName: string;

  @Column({ nullable: true })
  eventStartDate: Date;

  @Column({ nullable: true })
  eventEndDate: Date;

  @Column('decimal', { precision: 3, scale: 2, nullable: true })
  eventMultiplier: number;

  // Geographic boundaries
  @Column('json', { nullable: true })
  boundaries: {
    north: number;
    south: number;
    east: number;
    west: number;
  };

  @Column('json', { nullable: true })
  centerPoint: {
    latitude: number;
    longitude: number;
  };

  // Currency
  @Column({ default: 'XAF' })
  currency: string;

  // Status
  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('boolean', { default: false })
  isDefault: boolean;

  @Column('int', { default: 0 })
  priority: number; // Higher priority rules override lower ones

  @Column('text', { nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 