import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Colis } from '../../colis/entities/colis.entity';
import { Driver } from './driver.entity';

@Entity('tracking_updates')
export class Tracking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'colis_id' })
  colisId: string;

  @ManyToOne(() => Colis, colis => colis.trackingHistory)
  @JoinColumn({ name: 'colis_id' })
  colis: Colis;

  @Column({ name: 'driver_id', nullable: true })
  driverId: string;

  @ManyToOne(() => Driver, { nullable: true })
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;

  @Column('decimal', { precision: 10, scale: 8 })
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8 })
  longitude: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  accuracy: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  speed: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  heading: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  altitude: number;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  status: string;

  @Column({ type: 'text', nullable: true })
  locationDescription: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 