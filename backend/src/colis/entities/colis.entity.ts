import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Tracking } from './tracking.entity';

export enum PackageType {
  DOCUMENTS = 'documents',
  PACKAGE = 'package',
  FRAGILE = 'fragile',
  HEAVY = 'heavy',
  EXPRESS = 'express',
}

export enum DeliverySpeed {
  STANDARD = 'standard',
  EXPRESS = 'express',
  ECONOMY = 'economy',
  PREMIUM = 'premium',
}

export enum ColisStatus {
  PENDING = 'pending',
  PICKED_UP = 'picked_up',
  IN_TRANSIT = 'in_transit',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  EXCEPTION = 'exception',
  RETURNED = 'returned',
}

@Entity('colis')
export class Colis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  trackingNumber: string;

  @Column({ nullable: true })
  userId: string;

  @Column()
  senderName: string;

  @Column()
  senderPhone: string;

  @Column()
  senderAddress: string;

  @Column()
  senderCity: string;

  @Column()
  senderCountry: string;

  @Column()
  recipientName: string;

  @Column()
  recipientPhone: string;

  @Column()
  recipientAddress: string;

  @Column()
  recipientCity: string;

  @Column()
  recipientCountry: string;

  @Column({
    type: 'enum',
    enum: PackageType,
    default: PackageType.PACKAGE,
  })
  packageType: PackageType;

  @Column()
  packageDescription: string;

  @Column('decimal', { precision: 10, scale: 2 })
  weightKg: number;

  @Column('decimal', { precision: 10, scale: 2 })
  lengthCm: number;

  @Column('decimal', { precision: 10, scale: 2 })
  widthCm: number;

  @Column('decimal', { precision: 10, scale: 2 })
  heightCm: number;

  @Column({
    type: 'enum',
    enum: DeliverySpeed,
    default: DeliverySpeed.STANDARD,
  })
  deliverySpeed: DeliverySpeed;

  @Column({
    type: 'enum',
    enum: ColisStatus,
    default: ColisStatus.PENDING,
  })
  status: ColisStatus;

  @Column('decimal', { precision: 10, scale: 2 })
  basePrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ nullable: true })
  estimatedDeliveryDate: Date;

  @Column({ nullable: true })
  actualDeliveryDate: Date;

  @Column({ nullable: true })
  deliveryInstructions: string;

  @Column({ nullable: true })
  insuranceAmount: number;

  @Column({ default: false })
  isInternational: boolean;

  @Column({ nullable: true })
  carrier: string;

  @Column({ nullable: true })
  service: string;

  @Column({ nullable: true })
  driverId: string;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 8 })
  recipientLatitude: number;

  @Column({ nullable: true, type: 'decimal', precision: 11, scale: 8 })
  recipientLongitude: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Tracking, tracking => tracking.colis)
  trackingHistory: Tracking[];
} 