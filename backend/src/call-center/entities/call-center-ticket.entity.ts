import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { CallCenterAgent } from './call-center-agent.entity';
import { CallCenterChannel } from './call-center-channel.entity';
import { CallCenterOrder } from './call-center-order.entity';

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  ESCALATED = 'escalated'
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum TicketType {
  ORDER = 'order',
  SUPPORT = 'support',
  COMPLAINT = 'complaint',
  FEEDBACK = 'feedback',
  TECHNICAL = 'technical'
}

@Entity('call_center_tickets')
export class CallCenterTicket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customerName: string;

  @Column()
  customerPhone: string;

  @Column({ nullable: true })
  customerEmail?: string;

  @Column({
    type: 'enum',
    enum: TicketType,
    default: TicketType.SUPPORT
  })
  type: TicketType;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.OPEN
  })
  status: TicketStatus;

  @Column({
    type: 'enum',
    enum: TicketPriority,
    default: TicketPriority.MEDIUM
  })
  priority: TicketPriority;

  @Column()
  subject: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  notes?: string;

  @Column({ nullable: true })
  resolution?: string;

  @ManyToOne(() => CallCenterAgent, { nullable: true })
  assignedAgent?: CallCenterAgent;

  @Column({ nullable: true })
  assignedAgentId?: string;

  @ManyToOne(() => CallCenterChannel)
  channel: CallCenterChannel;

  @Column()
  channelId: string;

  @OneToMany(() => CallCenterOrder, order => order.ticket)
  orders: CallCenterOrder[];

  @Column({ nullable: true })
  estimatedResolutionTime?: Date;

  @Column({ nullable: true })
  resolvedAt?: Date;

  @Column({ nullable: true })
  closedAt?: Date;

  @Column({ default: 0 })
  responseTimeMinutes: number;

  @Column({ default: 0 })
  resolutionTimeMinutes: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 