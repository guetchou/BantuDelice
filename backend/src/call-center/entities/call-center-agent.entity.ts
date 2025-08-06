import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { CallCenterTicket } from './call-center-ticket.entity';

export enum AgentStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  BUSY = 'busy',
  BREAK = 'break',
  TRAINING = 'training'
}

export enum AgentRole {
  AGENT = 'agent',
  SUPERVISOR = 'supervisor',
  MANAGER = 'manager',
  ADMIN = 'admin'
}

@Entity('call_center_agents')
export class CallCenterAgent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column({
    type: 'enum',
    enum: AgentRole,
    default: AgentRole.AGENT
  })
  role: AgentRole;

  @Column({
    type: 'enum',
    enum: AgentStatus,
    default: AgentStatus.OFFLINE
  })
  status: AgentStatus;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  skills: string[];

  @Column({ type: 'jsonb', nullable: true })
  languages: string[];

  @Column({ default: 0 })
  totalTicketsHandled: number;

  @Column({ default: 0 })
  averageResolutionTimeMinutes: number;

  @Column({ default: 0 })
  customerSatisfactionScore: number;

  @Column({ nullable: true })
  lastActiveAt?: Date;

  @Column({ type: 'jsonb', nullable: true })
  workingHours?: {
    monday: { start: string; end: string };
    tuesday: { start: string; end: string };
    wednesday: { start: string; end: string };
    thursday: { start: string; end: string };
    friday: { start: string; end: string };
    saturday: { start: string; end: string };
    sunday: { start: string; end: string };
  };

  @OneToMany(() => CallCenterTicket, ticket => ticket.assignedAgent)
  assignedTickets: CallCenterTicket[];

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 