import { 
  type ColisApiData, 
  type CreateColisRequest, 
  type UpdateColisRequest, 
  type TrackingResponse, 
  type PricingRequest, 
  type PricingResponse, 
  type NotificationApiData, 
  type StatsApiData,
  type ApiResponse 
} from './colisApi';

// Données de mock
const mockColisData: ColisApiData[] = [
  {
    id: '1',
    trackingNumber: 'BD12345678',
    status: 'En cours de livraison',
    sender: {
      name: 'Jean Dupont',
      phone: '061234567',
      email: 'jean@example.com',
      address: '123 Rue de la Paix, Brazzaville',
      city: 'Brazzaville'
    },
    recipient: {
      name: 'Marie Martin',
      phone: '062345678',
      email: 'marie@example.com',
      address: '456 Avenue des Fleurs, Pointe-Noire',
      city: 'Pointe-Noire'
    },
    package: {
      type: 'document',
      weight: 1.5,
      dimensions: '30x20x5',
      description: 'Documents importants',
      value: 50000
    },
    service: {
      type: 'standard',
      insurance: true,
      fragile: false,
      express: false
    },
    pricing: {
      basePrice: 2000,
      insuranceFee: 500,
      expressFee: 0,
      totalPrice: 2500
    },
    tracking: {
      events: [
        {
          id: '1',
          status: 'Colis créé',
          location: 'Brazzaville',
          timestamp: '2024-07-18T09:00:00Z',
          description: 'Votre colis a été enregistré',
          icon: 'package'
        },
        {
          id: '2',
          status: 'En transit',
          location: 'Brazzaville',
          timestamp: '2024-07-18T14:30:00Z',
          description: 'Votre colis est en route vers Pointe-Noire',
          icon: 'truck'
        }
      ],
      estimatedDelivery: '2024-07-20T10:00:00Z',
      currentLocation: 'Brazzaville'
    },
    createdAt: '2024-07-18T09:00:00Z',
    updatedAt: '2024-07-18T14:30:00Z'
  },
  {
    id: '2',
    trackingNumber: 'BD87654321',
    status: 'Livré',
    sender: {
      name: 'Pierre Durand',
      phone: '063456789',
      email: 'pierre@example.com',
      address: '789 Boulevard Central, Dolisie',
      city: 'Dolisie'
    },
    recipient: {
      name: 'Sophie Bernard',
      phone: '064567890',
      email: 'sophie@example.com',
      address: '321 Rue du Commerce, Brazzaville',
      city: 'Brazzaville'
    },
    package: {
      type: 'vêtement',
      weight: 3.2,
      dimensions: '40x30x15',
      description: 'Vêtements et accessoires',
      value: 75000
    },
    service: {
      type: 'express',
      insurance: true,
      fragile: false,
      express: true
    },
    pricing: {
      basePrice: 3000,
      insuranceFee: 750,
      expressFee: 2000,
      totalPrice: 5750
    },
    tracking: {
      events: [
        {
          id: '1',
          status: 'Colis créé',
          location: 'Dolisie',
          timestamp: '2024-07-15T10:00:00Z',
          description: 'Votre colis a été enregistré',
          icon: 'package'
        },
        {
          id: '2',
          status: 'En transit',
          location: 'Dolisie',
          timestamp: '2024-07-15T16:00:00Z',
          description: 'Votre colis est en route vers Brazzaville',
          icon: 'truck'
        },
        {
          id: '3',
          status: 'Livré',
          location: 'Brazzaville',
          timestamp: '2024-07-16T14:00:00Z',
          description: 'Votre colis a été livré avec succès',
          icon: 'check'
        }
      ],
      estimatedDelivery: '2024-07-16T14:00:00Z',
      currentLocation: 'Brazzaville'
    },
    createdAt: '2024-07-15T10:00:00Z',
    updatedAt: '2024-07-16T14:00:00Z'
  }
];

const mockNotifications: NotificationApiData[] = [
  {
    id: '1',
    type: 'delivery',
    title: 'Colis livré avec succès',
    message: 'Votre colis BD87654321 a été livré à Sophie Bernard',
    timestamp: '2024-07-16T14:00:00Z',
    read: false,
    priority: 'high',
    colisId: 'BD87654321',
    action: {
      label: 'Voir les détails',
      url: '/colis/tracking/BD87654321'
    }
  },
  {
    id: '2',
    type: 'update',
    title: 'Mise à jour du statut',
    message: 'Le colis BD12345678 est maintenant en transit',
    timestamp: '2024-07-18T14:30:00Z',
    read: false,
    priority: 'medium',
    colisId: 'BD12345678',
    action: {
      label: 'Suivre le colis',
      url: '/colis/tracking/BD12345678'
    }
  },
  {
    id: '3',
    type: 'info',
    title: 'Nouveau service disponible',
    message: 'Livraison express maintenant disponible dans votre région',
    timestamp: '2024-07-17T09:00:00Z',
    read: true,
    priority: 'low'
  }
];

const mockStats: StatsApiData = {
  totalShipments: 1247,
  delivered: 1156,
  inTransit: 89,
  pending: 2,
  totalRevenue: 2847500,
  thisMonth: 156,
  national: 892,
  international: 355,
  growthRate: 15.2,
  averageDeliveryTime: 2.3,
  customerSatisfaction: 4.8
};

// Fonction utilitaire pour simuler un délai
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fonction utilitaire pour générer un ID unique
const generateId = () => Math.random().toString(36).substr(2, 9);

// Fonction utilitaire pour simuler une erreur aléatoire
const simulateError = (probability: number = 0.05) => {
  if (Math.random() < probability) {
    throw new Error('Erreur simulée du serveur');
  }
};

class ColisApiMockService {
  private colisData: ColisApiData[] = [...mockColisData];
  private notifications: NotificationApiData[] = [...mockNotifications];
  private stats: StatsApiData = { ...mockStats };

  // Méthodes pour les colis
  async createColis(data: CreateColisRequest): Promise<ApiResponse<ColisApiData>> {
    await delay(1000);
    simulateError(0.1);

    const newColis: ColisApiData = {
      id: generateId(),
      trackingNumber: `BD${Math.random().toString().substr(2, 8)}`,
      status: 'En attente',
      sender: data.sender,
      recipient: data.recipient,
      package: data.package,
      service: data.service,
      pricing: {
        basePrice: 2000,
        insuranceFee: data.service.insurance ? 500 : 0,
        expressFee: data.service.express ? 2000 : 0,
        totalPrice: 2000 + (data.service.insurance ? 500 : 0) + (data.service.express ? 2000 : 0)
      },
      tracking: {
        events: [
          {
            id: generateId(),
            status: 'Colis créé',
            location: data.sender.city,
            timestamp: new Date().toISOString(),
            description: 'Votre colis a été enregistré',
            icon: 'package'
          }
        ],
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        currentLocation: data.sender.city
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.colisData.push(newColis);

    return {
      success: true,
      data: newColis,
      message: 'Colis créé avec succès'
    };
  }

  async getColis(id: string): Promise<ApiResponse<ColisApiData>> {
    await delay(500);
    simulateError(0.05);

    const colis = this.colisData.find(c => c.id === id || c.trackingNumber === id);
    
    if (!colis) {
      throw new Error('Colis non trouvé');
    }

    return {
      success: true,
      data: colis
    };
  }

  async updateColis(id: string, data: UpdateColisRequest): Promise<ApiResponse<ColisApiData>> {
    await delay(800);
    simulateError(0.08);

    const colisIndex = this.colisData.findIndex(c => c.id === id);
    
    if (colisIndex === -1) {
      throw new Error('Colis non trouvé');
    }

    const updatedColis = {
      ...this.colisData[colisIndex],
      ...data,
      updatedAt: new Date().toISOString()
    };

    if (data.events) {
      updatedColis.tracking.events = [...updatedColis.tracking.events, ...data.events];
    }

    this.colisData[colisIndex] = updatedColis;

    return {
      success: true,
      data: updatedColis,
      message: 'Colis mis à jour avec succès'
    };
  }

  async deleteColis(id: string): Promise<ApiResponse<void>> {
    await delay(600);
    simulateError(0.1);

    const colisIndex = this.colisData.findIndex(c => c.id === id);
    
    if (colisIndex === -1) {
      throw new Error('Colis non trouvé');
    }

    this.colisData.splice(colisIndex, 1);

    return {
      success: true,
      data: undefined,
      message: 'Colis supprimé avec succès'
    };
  }

  async listColis(params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    search?: string;
  }): Promise<ApiResponse<{ colis: ColisApiData[]; total: number; page: number; limit: number }>> {
    await delay(700);
    simulateError(0.05);

    let filteredColis = [...this.colisData];

    // Filtrage par statut
    if (params?.status && params.status !== 'all') {
      filteredColis = filteredColis.filter(c => c.status.toLowerCase().includes(params.status!.toLowerCase()));
    }

    // Filtrage par type
    if (params?.type && params.type !== 'all') {
      filteredColis = filteredColis.filter(c => c.package.type.toLowerCase().includes(params.type!.toLowerCase()));
    }

    // Recherche
    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      filteredColis = filteredColis.filter(c => 
        c.trackingNumber.toLowerCase().includes(searchTerm) ||
        c.sender.name.toLowerCase().includes(searchTerm) ||
        c.recipient.name.toLowerCase().includes(searchTerm)
      );
    }

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedColis = filteredColis.slice(startIndex, endIndex);

    return {
      success: true,
      data: {
        colis: paginatedColis,
        total: filteredColis.length,
        page,
        limit
      }
    };
  }

  // Méthodes pour le suivi
  async trackColis(trackingNumber: string): Promise<ApiResponse<TrackingResponse>> {
    await delay(600);
    simulateError(0.05);

    const colis = this.colisData.find(c => c.trackingNumber === trackingNumber);
    
    if (!colis) {
      throw new Error('Colis non trouvé');
    }

    return {
      success: true,
      data: {
        colis,
        events: colis.tracking.events,
        estimatedDelivery: colis.tracking.estimatedDelivery
      }
    };
  }

  async updateTracking(id: string, event: any): Promise<ApiResponse<any>> {
    await delay(500);
    simulateError(0.08);

    const newEvent = {
      id: generateId(),
      ...event,
      timestamp: new Date().toISOString()
    };

    return {
      success: true,
      data: newEvent,
      message: 'Événement de suivi ajouté'
    };
  }

  // Méthodes pour les tarifs
  async calculatePricing(data: PricingRequest): Promise<ApiResponse<PricingResponse>> {
    await delay(400);
    simulateError(0.03);

    const basePrice = data.weight * 500;
    const insuranceFee = data.insurance ? 1000 : 0;
    const expressFee = data.express ? 3000 : 0;
    const totalPrice = basePrice + insuranceFee + expressFee;
    const estimatedDays = data.express ? 1 : data.from === data.to ? 2 : 5;

    return {
      success: true,
      data: {
        basePrice,
        insuranceFee,
        expressFee,
        totalPrice,
        estimatedDays
      }
    };
  }

  async getPricingList(): Promise<ApiResponse<Record<string, number>>> {
    await delay(300);
    simulateError(0.02);

    return {
      success: true,
      data: {
        'document': 500,
        'vêtement': 800,
        'électronique': 1200,
        'alimentaire': 600,
        'autre': 1000
      }
    };
  }

  // Méthodes pour les notifications
  async getNotifications(params?: {
    page?: number;
    limit?: number;
    read?: boolean;
    type?: string;
  }): Promise<ApiResponse<{ notifications: NotificationApiData[]; total: number; unread: number }>> {
    await delay(500);
    simulateError(0.05);

    let filteredNotifications = [...this.notifications];

    if (params?.read !== undefined) {
      filteredNotifications = filteredNotifications.filter(n => n.read === params.read);
    }

    if (params?.type && params.type !== 'all') {
      filteredNotifications = filteredNotifications.filter(n => n.type === params.type);
    }

    const unreadCount = this.notifications.filter(n => !n.read).length;

    return {
      success: true,
      data: {
        notifications: filteredNotifications,
        total: filteredNotifications.length,
        unread: unreadCount
      }
    };
  }

  async markNotificationAsRead(id: string): Promise<ApiResponse<void>> {
    await delay(300);
    simulateError(0.05);

    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
    }

    return {
      success: true,
      data: undefined,
      message: 'Notification marquée comme lue'
    };
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse<void>> {
    await delay(400);
    simulateError(0.05);

    this.notifications.forEach(n => n.read = true);

    return {
      success: true,
      data: undefined,
      message: 'Toutes les notifications marquées comme lues'
    };
  }

  async deleteNotification(id: string): Promise<ApiResponse<void>> {
    await delay(300);
    simulateError(0.05);

    const index = this.notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      this.notifications.splice(index, 1);
    }

    return {
      success: true,
      data: undefined,
      message: 'Notification supprimée'
    };
  }

  // Méthodes pour les statistiques
  async getStats(period?: string): Promise<ApiResponse<StatsApiData>> {
    await delay(600);
    simulateError(0.03);

    // Simuler des variations selon la période
    const variation = period === '7d' ? 0.1 : period === '30d' ? 0.05 : 0;
    const stats = { ...this.stats };
    
    if (variation > 0) {
      stats.totalShipments = Math.floor(stats.totalShipments * (1 + Math.random() * variation));
      stats.totalRevenue = Math.floor(stats.totalRevenue * (1 + Math.random() * variation));
    }

    return {
      success: true,
      data: stats
    };
  }

  async getAnalytics(params?: {
    period?: string;
    type?: string;
    city?: string;
  }): Promise<ApiResponse<any>> {
    await delay(800);
    simulateError(0.05);

    const analytics = {
      revenueByMonth: [
        { month: 'Jan', revenue: 2100000 },
        { month: 'Fév', revenue: 1950000 },
        { month: 'Mar', revenue: 2200000 },
        { month: 'Avr', revenue: 2400000 },
        { month: 'Mai', revenue: 2600000 },
        { month: 'Juin', revenue: 2847500 }
      ],
      topCities: [
        { city: 'Brazzaville', shipments: 456, revenue: 1200000 },
        { city: 'Pointe-Noire', shipments: 389, revenue: 980000 },
        { city: 'Dolisie', shipments: 234, revenue: 520000 },
        { city: 'N\'kayi', shipments: 168, revenue: 380000 }
      ],
      shipmentTypes: [
        { type: 'National', count: 892, percentage: 71.5 },
        { type: 'International', count: 355, percentage: 28.5 }
      ]
    };

    return {
      success: true,
      data: analytics
    };
  }

  // Méthodes pour les paiements
  async initiatePayment(colisId: string, paymentData: {
    method: 'momo' | 'airtel' | 'card' | 'cash';
    amount: number;
    phoneNumber?: string;
  }): Promise<ApiResponse<{ paymentId: string; status: string; redirectUrl?: string }>> {
    await delay(1000);
    simulateError(0.15);

    const paymentId = `PAY${generateId().toUpperCase()}`;
    const status = paymentData.method === 'cash' ? 'pending' : 'processing';

    return {
      success: true,
      data: {
        paymentId,
        status,
        redirectUrl: paymentData.method !== 'cash' ? `https://payment.example.com/${paymentId}` : undefined
      },
      message: 'Paiement initié avec succès'
    };
  }

  async checkPaymentStatus(paymentId: string): Promise<ApiResponse<{ status: string; amount: number; method: string }>> {
    await delay(500);
    simulateError(0.08);

    // Simuler différents statuts
    const statuses = ['pending', 'processing', 'completed', 'failed'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      success: true,
      data: {
        status: randomStatus,
        amount: 2500,
        method: 'momo'
      }
    };
  }

  // Méthodes utilitaires
  async uploadImage(colisId: string, file: File): Promise<ApiResponse<{ imageUrl: string }>> {
    await delay(1500);
    simulateError(0.1);

    const imageUrl = `https://storage.example.com/colis/${colisId}/${file.name}`;

    return {
      success: true,
      data: { imageUrl },
      message: 'Image uploadée avec succès'
    };
  }

  async downloadLabel(colisId: string): Promise<Blob> {
    await delay(800);
    simulateError(0.05);

    // Simuler un blob PDF
    const pdfContent = `PDF content for colis ${colisId}`;
    return new Blob([pdfContent], { type: 'application/pdf' });
  }

  // Méthodes de simulation
  async simulateApiCall<T>(data: T, delayMs: number = 1000): Promise<ApiResponse<T>> {
    await delay(delayMs);
    simulateError(0.05);

    return {
      success: true,
      data,
      message: 'Simulation réussie'
    };
  }

  // Méthodes de gestion des données de mock
  resetMockData() {
    this.colisData = [...mockColisData];
    this.notifications = [...mockNotifications];
    this.stats = { ...mockStats };
  }

  addMockColis(colis: ColisApiData) {
    this.colisData.push(colis);
  }

  addMockNotification(notification: NotificationApiData) {
    this.notifications.unshift(notification);
  }

  updateMockStats(newStats: Partial<StatsApiData>) {
    this.stats = { ...this.stats, ...newStats };
  }
}

// Instance singleton
export const colisApiMock = new ColisApiMockService();

// Export pour utilisation
export default colisApiMock; 