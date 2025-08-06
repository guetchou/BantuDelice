import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { CallCenterTicket } from './call-center-ticket.entity';

export enum CallCenterOrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  DELIVERING = 'delivering',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum PaymentMethod {
  CASH = 'cash',
  MOBILE_MONEY = 'mobile_money',
  CARD = 'card',
  BANK_TRANSFER = 'bank_transfer'
}

@Entity('call_center_orders')
export class CallCenterOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderNumber: string;

  @ManyToOne(() => CallCenterTicket)
  ticket: CallCenterTicket;

  @Column()
  ticketId: string;

  @Column()
  customerName: string;

  @Column()
  customerPhone: string;

  @Column({ nullable: true })
  customerEmail?: string;

  @Column()
  deliveryAddress: string;

  @Column({ nullable: true })
  deliveryInstructions?: string;

  @Column('jsonb')
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    totalPrice: number;
    notes?: string;
  }>;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  deliveryFee: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  tax: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: CallCenterOrderStatus,
    default: CallCenterOrderStatus.PENDING
  })
  status: CallCenterOrderStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CASH
  })
  paymentMethod: PaymentMethod;

  @Column({ default: 'pending' })
  paymentStatus: string;

  @Column({ nullable: true })
  estimatedDeliveryTime?: Date;

  @Column({ nullable: true })
  actualDeliveryTime?: Date;

  @Column({ nullable: true })
  cancelledAt?: Date;

  @Column({ nullable: true })
  cancellationReason?: string;

  @Column({ type: 'jsonb', nullable: true })
  trackingUpdates?: Array<{
    status: string;
    timestamp: Date;
    location?: string;
    notes?: string;
  }>;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 