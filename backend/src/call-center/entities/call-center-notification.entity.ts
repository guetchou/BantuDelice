import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { CallCenterTicket } from './call-center-ticket.entity';
import { CallCenterOrder } from './call-center-order.entity';

export enum NotificationType {
  SMS = 'sms',
  WHATSAPP = 'whatsapp',
  EMAIL = 'email',
  PUSH = 'push',
  VOICE = 'voice'
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  READ = 'read'
}

export enum NotificationTemplate {
  ORDER_CONFIRMATION = 'order_confirmation',
  ORDER_STATUS_UPDATE = 'order_status_update',
  DELIVERY_UPDATE = 'delivery_update',
  PAYMENT_CONFIRMATION = 'payment_confirmation',
  SUPPORT_RESPONSE = 'support_response',
  REMINDER = 'reminder',
  PROMOTION = 'promotion'
}

@Entity('call_center_notifications')
export class CallCenterNotification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: NotificationType
  })
  type: NotificationType;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.PENDING
  })
  status: NotificationStatus;

  @Column({
    type: 'enum',
    enum: NotificationTemplate
  })
  template: NotificationTemplate;

  @Column()
  recipientPhone: string;

  @Column({ nullable: true })
  recipientEmail?: string;

  @Column()
  subject: string;

  @Column('text')
  message: string;

  @Column({ nullable: true })
  translatedMessage?: string;

  @Column({ default: 'fr' })
  language: string;

  @ManyToOne(() => CallCenterTicket, { nullable: true })
  ticket?: CallCenterTicket;

  @Column({ nullable: true })
  ticketId?: string;

  @ManyToOne(() => CallCenterOrder, { nullable: true })
  order?: CallCenterOrder;

  @Column({ nullable: true })
  orderId?: string;

  @Column({ nullable: true })
  sentAt?: Date;

  @Column({ nullable: true })
  deliveredAt?: Date;

  @Column({ nullable: true })
  readAt?: Date;

  @Column({ nullable: true })
  failedAt?: Date;

  @Column({ nullable: true })
  failureReason?: string;

  @Column({ type: 'jsonb', nullable: true })
  deliveryReport?: {
    provider: string;
    messageId: string;
    status: string;
    cost?: number;
  };

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 