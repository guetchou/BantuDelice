import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { CallCenterTicket } from './call-center-ticket.entity';

export enum ChannelType {
  PHONE = 'phone',
  SMS = 'sms',
  WHATSAPP = 'whatsapp',
  EMAIL = 'email',
  WEB_CHAT = 'web_chat',
  SOCIAL_MEDIA = 'social_media'
}

export enum ChannelStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance'
}

@Entity('call_center_channels')
export class CallCenterChannel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ChannelType
  })
  type: ChannelType;

  @Column({
    type: 'enum',
    enum: ChannelStatus,
    default: ChannelStatus.ACTIVE
  })
  status: ChannelStatus;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  whatsappNumber?: string;

  @Column({ nullable: true })
  emailAddress?: string;

  @Column({ nullable: true })
  webhookUrl?: string;

  @Column({ default: true })
  isEnabled: boolean;

  @Column({ default: 0 })
  maxConcurrentTickets: number;

  @Column({ default: 0 })
  averageResponseTimeMinutes: number;

  @Column({ type: 'jsonb', nullable: true })
  operatingHours?: {
    monday: { start: string; end: string; enabled: boolean };
    tuesday: { start: string; end: string; enabled: boolean };
    wednesday: { start: string; end: string; enabled: boolean };
    thursday: { start: string; end: string; enabled: boolean };
    friday: { start: string; end: string; enabled: boolean };
    saturday: { start: string; end: string; enabled: boolean };
    sunday: { start: string; end: string; enabled: boolean };
  };

  @Column({ type: 'jsonb', nullable: true })
  autoResponse?: {
    enabled: boolean;
    message: string;
    language: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  routingRules?: {
    priority: string;
    skills: string[];
    languages: string[];
  };

  @OneToMany(() => CallCenterTicket, ticket => ticket.channel)
  tickets: CallCenterTicket[];

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 