import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Colis } from './colis.entity';

export enum TrackingEventType {
  PICKED_UP = 'picked_up',
  IN_TRANSIT = 'in_transit',
  ARRIVED_AT_FACILITY = 'arrived_at_facility',
  DEPARTED_FACILITY = 'departed_facility',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  EXCEPTION = 'exception',
  RETURNED = 'returned',
}

@Entity('tracking')
export class Tracking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  colisId: string;

  @Column({
    type: 'enum',
    enum: TrackingEventType,
  })
  eventType: TrackingEventType;

  @Column()
  description: string;

  @Column()
  location: string;

  @Column({ nullable: true })
  details: string;

  @Column({ nullable: true })
  latitude: number;

  @Column({ nullable: true })
  longitude: number;

  @Column({ nullable: true })
  estimatedMinutes: number;

  @Column({ nullable: true })
  estimatedArrival: Date;

  @CreateDateColumn()
  timestamp: Date;

  @ManyToOne(() => Colis, colis => colis.trackingHistory)
  @JoinColumn({ name: 'colisId' })
  colis: Colis;
} 