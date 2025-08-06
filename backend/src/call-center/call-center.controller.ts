import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CallCenterService } from './call-center.service';
import { CallCenterTicket, TicketStatus, TicketPriority, TicketType } from './entities/call-center-ticket.entity';
import { CallCenterAgent, AgentStatus, AgentRole } from './entities/call-center-agent.entity';
import { CallCenterChannel, ChannelType, ChannelStatus } from './entities/call-center-channel.entity';
import { CallCenterOrder, CallCenterOrderStatus, PaymentMethod } from './entities/call-center-order.entity';
import { CallCenterNotification, NotificationType, NotificationTemplate } from './entities/call-center-notification.entity';

@Controller('call-center')
export class CallCenterController {
  constructor(private readonly callCenterService: CallCenterService) {}

  // ===== DASHBOARD =====
  @Get('dashboard/stats')
  async getDashboardStats() {
    return this.callCenterService.getDashboardStats();
  }

  // ===== TICKETS =====
  @Post('tickets')
  async createTicket(@Body() ticketData: Partial<CallCenterTicket>) {
    return this.callCenterService.createTicket(ticketData);
  }

  @Get('tickets')
  async getTickets(
    @Query('status') status?: TicketStatus,
    @Query('priority') priority?: TicketPriority,
    @Query('type') type?: TicketType,
    @Query('agentId') agentId?: string,
    @Query('channelId') channelId?: string,
  ) {
    return this.callCenterService.getTickets({
      status,
      priority,
      type,
      agentId,
      channelId,
    });
  }

  @Get('tickets/:id')
  async getTicketById(@Param('id') id: string) {
    return this.callCenterService.getTicketById(id);
  }

  @Put('tickets/:id/status')
  async updateTicketStatus(
    @Param('id') id: string,
    @Body() body: { status: TicketStatus; notes?: string },
  ) {
    return this.callCenterService.updateTicketStatus(id, body.status, body.notes);
  }

  @Put('tickets/:id/assign')
  async assignTicketToAgent(
    @Param('id') ticketId: string,
    @Body() body: { agentId: string },
  ) {
    return this.callCenterService.assignTicketToAgent(ticketId, body.agentId);
  }

  // ===== AGENTS =====
  @Post('agents')
  async createAgent(@Body() agentData: Partial<CallCenterAgent>) {
    return this.callCenterService.createAgent(agentData);
  }

  @Get('agents')
  async getAgents(
    @Query('status') status?: AgentStatus,
    @Query('role') role?: AgentRole,
    @Query('isActive') isActive?: boolean,
  ) {
    return this.callCenterService.getAgents({ status, role, isActive });
  }

  @Put('agents/:id/status')
  async updateAgentStatus(
    @Param('id') agentId: string,
    @Body() body: { status: AgentStatus },
  ) {
    return this.callCenterService.updateAgentStatus(agentId, body.status);
  }

  // ===== CHANNELS =====
  @Post('channels')
  async createChannel(@Body() channelData: Partial<CallCenterChannel>) {
    return this.callCenterService.createChannel(channelData);
  }

  @Get('channels')
  async getChannels(
    @Query('type') type?: ChannelType,
    @Query('status') status?: ChannelStatus,
    @Query('isEnabled') isEnabled?: boolean,
  ) {
    return this.callCenterService.getChannels({ type, status, isEnabled });
  }

  // ===== ORDERS =====
  @Post('orders')
  async createOrder(@Body() orderData: Partial<CallCenterOrder>) {
    return this.callCenterService.createOrder(orderData);
  }

  @Get('orders')
  async getOrders(
    @Query('status') status?: CallCenterOrderStatus,
    @Query('ticketId') ticketId?: string,
    @Query('customerPhone') customerPhone?: string,
  ) {
    return this.callCenterService.getOrders({ status, ticketId, customerPhone });
  }

  @Put('orders/:id/status')
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body() body: { status: CallCenterOrderStatus },
  ) {
    return this.callCenterService.updateOrderStatus(orderId, body.status);
  }

  // ===== NOTIFICATIONS =====
  @Post('notifications/send')
  async sendNotification(@Body() notificationData: {
    type: NotificationType;
    template: NotificationTemplate;
    recipientPhone: string;
    recipientEmail?: string;
    subject: string;
    message: string;
    language?: string;
    ticketId?: string;
    orderId?: string;
  }) {
    return this.callCenterService.sendNotification(notificationData);
  }

  // ===== PUBLIC ENDPOINTS (pour les clients) =====
  @Post('public/tickets')
  async createPublicTicket(@Body() ticketData: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    subject: string;
    description: string;
    channelType: ChannelType;
  }) {
    // Créer un ticket public avec canal automatique
    const channel = await this.callCenterService.getChannels({ type: ticketData.channelType });
    if (!channel.length) {
      throw new Error(`Channel type ${ticketData.channelType} not found`);
    }

    return this.callCenterService.createTicket({
      ...ticketData,
      channelId: channel[0].id,
      type: TicketType.SUPPORT,
      priority: TicketPriority.MEDIUM,
    });
  }

  @Post('public/orders')
  async createPublicOrder(@Body() orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    deliveryAddress: string;
    deliveryInstructions?: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      notes?: string;
    }>;
    paymentMethod: PaymentMethod;
    channelType: ChannelType;
  }) {
    // Créer une commande publique
    const channel = await this.callCenterService.getChannels({ type: orderData.channelType });
    if (!channel.length) {
      throw new Error(`Channel type ${orderData.channelType} not found`);
    }

    // Créer d'abord un ticket pour la commande
    const ticket = await this.callCenterService.createTicket({
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail,
      subject: 'Nouvelle commande',
      description: `Commande créée via ${orderData.channelType}`,
      channelId: channel[0].id,
      type: TicketType.ORDER,
      priority: TicketPriority.HIGH,
    });

    // Calculer les totaux
    const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 500; // 500 FCFA de frais de livraison
    const tax = subtotal * 0.18; // 18% de TVA
    const totalAmount = subtotal + deliveryFee + tax;

    // Créer la commande
    const order = await this.callCenterService.createOrder({
      ticketId: ticket.id,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail,
      deliveryAddress: orderData.deliveryAddress,
      deliveryInstructions: orderData.deliveryInstructions,
      items: orderData.items.map(item => ({
        ...item,
        totalPrice: item.price * item.quantity,
      })),
      subtotal,
      deliveryFee,
      tax,
      totalAmount,
      paymentMethod: orderData.paymentMethod,
    });

    // Envoyer une confirmation
    await this.callCenterService.sendNotification({
      type: NotificationType.SMS,
      template: NotificationTemplate.ORDER_CONFIRMATION,
      recipientPhone: orderData.customerPhone,
      subject: 'Confirmation de commande',
      message: `Votre commande #${order.orderNumber} a été reçue. Total: ${totalAmount} FCFA. Nous vous contacterons bientôt.`,
      orderId: order.id,
    });

    return order;
  }

  @Get('public/orders/:phone')
  async getCustomerOrders(@Param('phone') phone: string) {
    return this.callCenterService.getOrders({ customerPhone: phone });
  }
} 