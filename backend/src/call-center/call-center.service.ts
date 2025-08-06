import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CallCenterTicket, TicketStatus, TicketPriority, TicketType } from './entities/call-center-ticket.entity';
import { CallCenterAgent, AgentStatus, AgentRole } from './entities/call-center-agent.entity';
import { CallCenterChannel, ChannelType, ChannelStatus } from './entities/call-center-channel.entity';
import { CallCenterOrder, CallCenterOrderStatus, PaymentMethod } from './entities/call-center-order.entity';
import { CallCenterNotification, NotificationType, NotificationStatus, NotificationTemplate } from './entities/call-center-notification.entity';

@Injectable()
export class CallCenterService {
  constructor(
    @InjectRepository(CallCenterTicket)
    private ticketRepository: Repository<CallCenterTicket>,
    @InjectRepository(CallCenterAgent)
    private agentRepository: Repository<CallCenterAgent>,
    @InjectRepository(CallCenterChannel)
    private channelRepository: Repository<CallCenterChannel>,
    @InjectRepository(CallCenterOrder)
    private orderRepository: Repository<CallCenterOrder>,
    @InjectRepository(CallCenterNotification)
    private notificationRepository: Repository<CallCenterNotification>,
  ) {}

  // ===== TICKETS =====
  async createTicket(ticketData: Partial<CallCenterTicket>): Promise<CallCenterTicket> {
    const ticket = this.ticketRepository.create(ticketData);
    return this.ticketRepository.save(ticket);
  }

  async getTickets(filters?: {
    status?: TicketStatus;
    priority?: TicketPriority;
    type?: TicketType;
    agentId?: string;
    channelId?: string;
  }): Promise<CallCenterTicket[]> {
    const query = this.ticketRepository.createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.assignedAgent', 'agent')
      .leftJoinAndSelect('ticket.channel', 'channel')
      .leftJoinAndSelect('ticket.orders', 'orders');

    if (filters?.status) {
      query.andWhere('ticket.status = :status', { status: filters.status });
    }
    if (filters?.priority) {
      query.andWhere('ticket.priority = :priority', { priority: filters.priority });
    }
    if (filters?.type) {
      query.andWhere('ticket.type = :type', { type: filters.type });
    }
    if (filters?.agentId) {
      query.andWhere('ticket.assignedAgentId = :agentId', { agentId: filters.agentId });
    }
    if (filters?.channelId) {
      query.andWhere('ticket.channelId = :channelId', { channelId: filters.channelId });
    }

    return query.orderBy('ticket.createdAt', 'DESC').getMany();
  }

  async getTicketById(id: string): Promise<CallCenterTicket> {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
      relations: ['assignedAgent', 'channel', 'orders'],
    });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    return ticket;
  }

  async updateTicketStatus(id: string, status: TicketStatus, notes?: string): Promise<CallCenterTicket> {
    const ticket = await this.getTicketById(id);
    ticket.status = status;
    if (notes) {
      ticket.notes = notes;
    }
    if (status === TicketStatus.RESOLVED) {
      ticket.resolvedAt = new Date();
    }
    return this.ticketRepository.save(ticket);
  }

  async assignTicketToAgent(ticketId: string, agentId: string): Promise<CallCenterTicket> {
    const ticket = await this.getTicketById(ticketId);
    const agent = await this.agentRepository.findOne({ where: { id: agentId } });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }
    ticket.assignedAgent = agent;
    ticket.assignedAgentId = agentId;
    ticket.status = TicketStatus.IN_PROGRESS;
    return this.ticketRepository.save(ticket);
  }

  // ===== AGENTS =====
  async createAgent(agentData: Partial<CallCenterAgent>): Promise<CallCenterAgent> {
    const agent = this.agentRepository.create(agentData);
    return this.agentRepository.save(agent);
  }

  async getAgents(filters?: {
    status?: AgentStatus;
    role?: AgentRole;
    isActive?: boolean;
  }): Promise<CallCenterAgent[]> {
    const query = this.agentRepository.createQueryBuilder('agent');

    if (filters?.status) {
      query.andWhere('agent.status = :status', { status: filters.status });
    }
    if (filters?.role) {
      query.andWhere('agent.role = :role', { role: filters.role });
    }
    if (filters?.isActive !== undefined) {
      query.andWhere('agent.isActive = :isActive', { isActive: filters.isActive });
    }

    return query.getMany();
  }

  async updateAgentStatus(agentId: string, status: AgentStatus): Promise<CallCenterAgent> {
    const agent = await this.agentRepository.findOne({ where: { id: agentId } });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }
    agent.status = status;
    agent.lastActiveAt = new Date();
    return this.agentRepository.save(agent);
  }

  // ===== CHANNELS =====
  async createChannel(channelData: Partial<CallCenterChannel>): Promise<CallCenterChannel> {
    const channel = this.channelRepository.create(channelData);
    return this.channelRepository.save(channel);
  }

  async getChannels(filters?: {
    type?: ChannelType;
    status?: ChannelStatus;
    isEnabled?: boolean;
  }): Promise<CallCenterChannel[]> {
    const query = this.channelRepository.createQueryBuilder('channel');

    if (filters?.type) {
      query.andWhere('channel.type = :type', { type: filters.type });
    }
    if (filters?.status) {
      query.andWhere('channel.status = :status', { status: filters.status });
    }
    if (filters?.isEnabled !== undefined) {
      query.andWhere('channel.isEnabled = :isEnabled', { isEnabled: filters.isEnabled });
    }

    return query.getMany();
  }

  // ===== ORDERS =====
  async createOrder(orderData: Partial<CallCenterOrder>): Promise<CallCenterOrder> {
    const order = this.orderRepository.create(orderData);
    order.orderNumber = this.generateOrderNumber();
    return this.orderRepository.save(order);
  }

  async getOrders(filters?: {
    status?: CallCenterOrderStatus;
    ticketId?: string;
    customerPhone?: string;
  }): Promise<CallCenterOrder[]> {
    const query = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.ticket', 'ticket');

    if (filters?.status) {
      query.andWhere('order.status = :status', { status: filters.status });
    }
    if (filters?.ticketId) {
      query.andWhere('order.ticketId = :ticketId', { ticketId: filters.ticketId });
    }
    if (filters?.customerPhone) {
      query.andWhere('order.customerPhone = :customerPhone', { customerPhone: filters.customerPhone });
    }

    return query.orderBy('order.createdAt', 'DESC').getMany();
  }

  async updateOrderStatus(orderId: string, status: CallCenterOrderStatus): Promise<CallCenterOrder> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    order.status = status;
    if (status === CallCenterOrderStatus.DELIVERED) {
      order.actualDeliveryTime = new Date();
    }
    return this.orderRepository.save(order);
  }

  // ===== NOTIFICATIONS =====
  async sendNotification(notificationData: {
    type: NotificationType;
    template: NotificationTemplate;
    recipientPhone: string;
    recipientEmail?: string;
    subject: string;
    message: string;
    language?: string;
    ticketId?: string;
    orderId?: string;
  }): Promise<CallCenterNotification> {
    const notification = this.notificationRepository.create({
      ...notificationData,
      language: notificationData.language || 'fr',
      status: NotificationStatus.PENDING,
    });

    const savedNotification = await this.notificationRepository.save(notification);

    // Simuler l'envoi de la notification
    await this.processNotification(savedNotification);

    return savedNotification;
  }

  async processNotification(notification: CallCenterNotification): Promise<void> {
    try {
      // Simulation de l'envoi selon le type
      switch (notification.type) {
        case NotificationType.SMS:
          await this.sendSMS(notification);
          break;
        case NotificationType.WHATSAPP:
          await this.sendWhatsApp(notification);
          break;
        case NotificationType.EMAIL:
          await this.sendEmail(notification);
          break;
        default:
          throw new BadRequestException(`Unsupported notification type: ${notification.type}`);
      }

      notification.status = NotificationStatus.SENT;
      notification.sentAt = new Date();
      await this.notificationRepository.save(notification);
    } catch (error) {
      notification.status = NotificationStatus.FAILED;
      notification.failedAt = new Date();
      notification.failureReason = error.message;
      await this.notificationRepository.save(notification);
      throw error;
    }
  }

  private async sendSMS(notification: CallCenterNotification): Promise<void> {
    // Simulation d'envoi SMS
    console.log(`[SMS] Envoi à ${notification.recipientPhone}: ${notification.message}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  private async sendWhatsApp(notification: CallCenterNotification): Promise<void> {
    // Simulation d'envoi WhatsApp
    console.log(`[WhatsApp] Envoi à ${notification.recipientPhone}: ${notification.message}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  private async sendEmail(notification: CallCenterNotification): Promise<void> {
    // Simulation d'envoi email
    console.log(`[Email] Envoi à ${notification.recipientEmail}: ${notification.message}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // ===== UTILITIES =====
  private generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `CC-${timestamp.slice(-6)}-${random}`;
  }

  async getDashboardStats(): Promise<{
    totalTickets: number;
    openTickets: number;
    resolvedTickets: number;
    totalOrders: number;
    pendingOrders: number;
    activeAgents: number;
    averageResponseTime: number;
  }> {
    const [
      totalTickets,
      openTickets,
      resolvedTickets,
      totalOrders,
      pendingOrders,
      activeAgents,
    ] = await Promise.all([
      this.ticketRepository.count(),
      this.ticketRepository.count({ where: { status: TicketStatus.OPEN } }),
      this.ticketRepository.count({ where: { status: TicketStatus.RESOLVED } }),
      this.orderRepository.count(),
      this.orderRepository.count({ where: { status: CallCenterOrderStatus.PENDING } }),
      this.agentRepository.count({ where: { status: AgentStatus.ONLINE } }),
    ]);

    const averageResponseTime = await this.ticketRepository
      .createQueryBuilder('ticket')
      .select('AVG(ticket.responseTimeMinutes)', 'avg')
      .getRawOne()
      .then(result => parseFloat(result.avg) || 0);

    return {
      totalTickets,
      openTickets,
      resolvedTickets,
      totalOrders,
      pendingOrders,
      activeAgents,
      averageResponseTime,
    };
  }
} 