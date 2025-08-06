import apiService from '@/services/api';

// Types pour le call center
export interface CallCenterTicket {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  type: 'order' | 'support' | 'complaint' | 'feedback' | 'technical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  subject: string;
  description: string;
  notes?: string;
  resolution?: string;
  assignedAgentId?: string;
  channelId: string;
  estimatedResolutionTime?: string;
  resolvedAt?: string;
  closedAt?: string;
  responseTimeMinutes: number;
  resolutionTimeMinutes: number;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CallCenterOrder {
  id: string;
  orderNumber: string;
  ticketId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  deliveryInstructions?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    totalPrice: number;
    notes?: string;
  }>;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';
  paymentMethod: 'cash' | 'mobile_money' | 'card' | 'bank_transfer';
  paymentStatus: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  trackingUpdates?: Array<{
    status: string;
    timestamp: string;
    location?: string;
    notes?: string;
  }>;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CallCenterNotification {
  id: string;
  type: 'sms' | 'whatsapp' | 'email' | 'push' | 'voice';
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'read';
  template: 'order_confirmation' | 'order_status_update' | 'delivery_update' | 'payment_confirmation' | 'support_response' | 'reminder' | 'promotion';
  recipientPhone: string;
  recipientEmail?: string;
  subject: string;
  message: string;
  translatedMessage?: string;
  language: string;
  ticketId?: string;
  orderId?: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  failedAt?: string;
  failureReason?: string;
  deliveryReport?: {
    provider: string;
    messageId: string;
    status: string;
    cost?: number;
  };
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  totalOrders: number;
  pendingOrders: number;
  activeAgents: number;
  averageResponseTime: number;
}

// Service principal du call center
export const callCenterService = {
  // ===== TICKETS =====
  async createTicket(ticketData: Partial<CallCenterTicket>): Promise<CallCenterTicket> {
    try {
      const { data, error } = await supabase
        .from('call_center_tickets')
        .insert(ticketData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la création du ticket:', error);
      throw error;
    }
  },

  async getTickets(filters?: {
    status?: string;
    priority?: string;
    type?: string;
    agentId?: string;
    channelId?: string;
  }): Promise<CallCenterTicket[]> {
    try {
      let query = supabase
        .from('call_center_tickets')
        .select(`
          *,
          assignedAgent:call_center_agents(id, name),
          channel:call_center_channels(id, name, type),
          orders:call_center_orders(*)
        `)
        .order('createdAt', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.priority) {
        query = query.eq('priority', filters.priority);
      }
      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      if (filters?.agentId) {
        query = query.eq('assignedAgentId', filters.agentId);
      }
      if (filters?.channelId) {
        query = query.eq('channelId', filters.channelId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des tickets:', error);
      throw error;
    }
  },

  async getTicketById(id: string): Promise<CallCenterTicket> {
    try {
      const { data, error } = await supabase
        .from('call_center_tickets')
        .select(`
          *,
          assignedAgent:call_center_agents(id, name),
          channel:call_center_channels(id, name, type),
          orders:call_center_orders(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération du ticket:', error);
      throw error;
    }
  },

  async updateTicketStatus(id: string, status: string, notes?: string): Promise<CallCenterTicket> {
    try {
      const updateData: unknown = { status };
      if (notes) updateData.notes = notes;
      if (status === 'resolved') updateData.resolvedAt = new Date().toISOString();

      const { data, error } = await supabase
        .from('call_center_tickets')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du ticket:', error);
      throw error;
    }
  },

  // ===== ORDERS =====
  async createOrder(orderData: Partial<CallCenterOrder>): Promise<CallCenterOrder> {
    try {
      const { data, error } = await supabase
        .from('call_center_orders')
        .insert(orderData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      throw error;
    }
  },

  async getOrders(filters?: {
    status?: string;
    ticketId?: string;
    customerPhone?: string;
  }): Promise<CallCenterOrder[]> {
    try {
      let query = supabase
        .from('call_center_orders')
        .select(`
          *,
          ticket:call_center_tickets(*)
        `)
        .order('createdAt', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.ticketId) {
        query = query.eq('ticketId', filters.ticketId);
      }
      if (filters?.customerPhone) {
        query = query.eq('customerPhone', filters.customerPhone);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      throw error;
    }
  },

  async updateOrderStatus(orderId: string, status: string): Promise<CallCenterOrder> {
    try {
      const updateData: unknown = { status };
      if (status === 'delivered') updateData.actualDeliveryTime = new Date().toISOString();

      const { data, error } = await supabase
        .from('call_center_orders')
        .update(updateData)
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la commande:', error);
      throw error;
    }
  },

  // ===== NOTIFICATIONS =====
  async sendNotification(notificationData: {
    type: string;
    template: string;
    recipientPhone: string;
    recipientEmail?: string;
    subject: string;
    message: string;
    language?: string;
    ticketId?: string;
    orderId?: string;
  }): Promise<CallCenterNotification> {
    try {
      const { data, error } = await supabase
        .from('call_center_notifications')
        .insert({
          ...notificationData,
          language: notificationData.language || 'fr',
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification:', error);
      throw error;
    }
  },

  // ===== DASHBOARD =====
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Simulation des statistiques - à remplacer par des requêtes réelles
      const mockStats: DashboardStats = {
        totalTickets: 156,
        openTickets: 23,
        resolvedTickets: 133,
        totalOrders: 89,
        pendingOrders: 12,
        activeAgents: 8,
        averageResponseTime: 4.2
      };

      return mockStats;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  },

  // ===== PUBLIC ENDPOINTS =====
  async createPublicTicket(ticketData: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    subject: string;
    description: string;
    channelType: string;
  }): Promise<CallCenterTicket> {
    try {
      // Récupérer le canal par type
      const { data: channels } = await supabase
        .from('call_center_channels')
        .select('id')
        .eq('type', ticketData.channelType)
        .limit(1);

      if (!channels || channels.length === 0) {
        throw new Error(`Canal type ${ticketData.channelType} non trouvé`);
      }

      return this.createTicket({
        ...ticketData,
        channelId: channels[0].id,
        type: 'support',
        priority: 'medium',
        status: 'open',
      });
    } catch (error) {
      console.error('Erreur lors de la création du ticket public:', error);
      throw error;
    }
  },

  async createPublicOrder(orderData: {
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
    paymentMethod: string;
    channelType: string;
  }): Promise<CallCenterOrder> {
    try {
      // Récupérer le canal par type
      const { data: channels } = await supabase
        .from('call_center_channels')
        .select('id')
        .eq('type', orderData.channelType)
        .limit(1);

      if (!channels || channels.length === 0) {
        throw new Error(`Canal type ${orderData.channelType} non trouvé`);
      }

      // Créer d'abord un ticket pour la commande
      const ticket = await this.createTicket({
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        customerEmail: orderData.customerEmail,
        subject: 'Nouvelle commande',
        description: `Commande créée via ${orderData.channelType}`,
        channelId: channels[0].id,
        type: 'order',
        priority: 'high',
        status: 'open',
      });

      // Calculer les totaux
      const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const deliveryFee = 500; // 500 FCFA de frais de livraison
      const tax = subtotal * 0.18; // 18% de TVA
      const totalAmount = subtotal + deliveryFee + tax;

      // Créer la commande
      const order = await this.createOrder({
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
        paymentMethod: orderData.paymentMethod as any,
        status: 'pending',
      });

      // Envoyer une confirmation
      await this.sendNotification({
        type: 'sms',
        template: 'order_confirmation',
        recipientPhone: orderData.customerPhone,
        subject: 'Confirmation de commande',
        message: `Votre commande #${order.orderNumber} a été reçue. Total: ${totalAmount} FCFA. Nous vous contacterons bientôt.`,
        orderId: order.id,
      });

      return order;
    } catch (error) {
      console.error('Erreur lors de la création de la commande publique:', error);
      throw error;
    }
  },

  async getCustomerOrders(phone: string): Promise<CallCenterOrder[]> {
    return this.getOrders({ customerPhone: phone });
  },
}; 