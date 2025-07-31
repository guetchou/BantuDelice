// Service de production pour la gestion des colis
// Remplace les données mockées par de vraies données de la base de données

import { AdvancedTrackingInfo, TrackingEvent, AddressInfo, LocationInfo, InsuranceInfo, CustomsInfo } from '@/utils/advancedTrackingSystem';

export interface ColisData {
  id: string;
  trackingNumber: string;
  type: 'national' | 'international';
  status: string;
  weight: number;
  dimensions: string;
  service: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  sender: AddressInfo;
  recipient: AddressInfo;
  insurance: InsuranceInfo;
  customs?: CustomsInfo;
  deliveryInstructions?: string;
  signatureRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TrackingEventData {
  id: string;
  colisId: string;
  status: string;
  description: string;
  location: string;
  timestamp: string;
  coordinates?: { lat: number; lng: number };
  icon: string;
  details?: string;
}

export interface TarifData {
  baseRate: number;
  weightCharge: number;
  fuelSurcharge: number;
  insurance: number;
  total: number;
  currency: string;
  estimatedDays: number;
}

export interface ExpeditionData {
  trackingNumber: string;
  type: 'national' | 'international';
  service: string;
  sender: AddressInfo;
  recipient: AddressInfo;
  package: {
    weight: number;
    dimensions: string;
    contents: string;
    declaredValue: number;
  };
  insurance: InsuranceInfo;
  deliveryInstructions?: string;
  signatureRequired: boolean;
}

class ColisProductionService {
  private baseUrl = import.meta.env?.VITE_API_URL || 'http://localhost:3001';

  /**
   * Récupère les vraies données de tracking depuis la base de données
   */
  async trackParcel(trackingNumber: string): Promise<AdvancedTrackingInfo> {
    try {
      const response = await fetch(`${this.baseUrl}/colis/${trackingNumber}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('NOT_FOUND');
        }
        throw new Error('NETWORK_ERROR');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Erreur de tracking');
      }

      return this.transformColisDataToTrackingInfo(data.data);
    } catch (error) {
      console.error('Erreur lors du tracking:', error);
      throw error;
    }
  }

  /**
   * Récupère les événements de tracking depuis la base de données
   */
  async getTrackingEvents(trackingNumber: string): Promise<TrackingEvent[]> {
    try {
      const response = await fetch(`${this.baseUrl}/colis/${trackingNumber}/events`);
      
      if (!response.ok) {
        throw new Error('Impossible de récupérer les événements de tracking');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Erreur lors de la récupération des événements');
      }

      return data.data.map((event: TrackingEventData) => ({
        id: event.id,
        status: event.status,
        description: event.description,
        timestamp: event.timestamp,
        location: event.location,
        coordinates: event.coordinates,
        icon: event.icon,
        details: event.details
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error);
      throw error;
    }
  }

  /**
   * Calcule les tarifs avec de vraies données
   */
  async calculateTarif(params: {
    from: string;
    to: string;
    weight: number;
    service: string;
    type: 'national' | 'international';
  }): Promise<TarifData> {
    try {
      const response = await fetch(`${this.baseUrl}/colis/tarifs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        throw new Error('Erreur lors du calcul des tarifs');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Erreur lors du calcul des tarifs');
      }

      return data.data;
    } catch (error) {
      console.error('Erreur lors du calcul des tarifs:', error);
      throw error;
    }
  }

  /**
   * Crée une nouvelle expédition
   */
  async createExpedition(expeditionData: ExpeditionData): Promise<{ trackingNumber: string; success: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/colis/expedier`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expeditionData)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de l\'expédition');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Erreur lors de la création de l\'expédition');
      }

      return {
        trackingNumber: data.data.trackingNumber,
        success: true
      };
    } catch (error) {
      console.error('Erreur lors de la création de l\'expédition:', error);
      throw error;
    }
  }

  /**
   * Ajoute un événement de tracking
   */
  async addTrackingEvent(trackingNumber: string, event: Omit<TrackingEvent, 'id'>): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/colis/${trackingNumber}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout de l\'événement');
      }

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'événement:', error);
      throw error;
    }
  }

  /**
   * Récupère l'historique des colis d'un utilisateur
   */
  async getUserColisHistory(userId: string): Promise<ColisData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/colis/user/${userId}/history`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de l\'historique');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Erreur lors de la récupération de l\'historique');
      }

      return data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques des colis
   */
  async getColisStatistics(): Promise<{
    totalColis: number;
    deliveredColis: number;
    inTransitColis: number;
    pendingColis: number;
    revenue: number;
    averageDeliveryTime: number;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/colis/statistics`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des statistiques');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Erreur lors de la récupération des statistiques');
      }

      return data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }

  /**
   * Transforme les données de la base en format AdvancedTrackingInfo
   */
  private transformColisDataToTrackingInfo(colisData: ColisData): AdvancedTrackingInfo {
    return {
      trackingNumber: colisData.trackingNumber,
      status: {
        code: colisData.status,
        description: this.getStatusDescription(colisData.status),
        category: this.getStatusCategory(colisData.status),
        timestamp: colisData.updatedAt,
        location: colisData.recipient.city
      },
      type: colisData.type,
      carrier: colisData.type === 'national' ? 'BantuDelice' : 'DHL Express',
      estimatedDelivery: colisData.estimatedDelivery,
      actualDelivery: colisData.actualDelivery,
      weight: colisData.weight,
      dimensions: colisData.dimensions,
      service: colisData.service,
      sender: colisData.sender,
      recipient: colisData.recipient,
      timeline: [], // Sera rempli par getTrackingEvents
      currentLocation: {
        name: colisData.recipient.city,
        address: colisData.recipient.address,
        city: colisData.recipient.city,
        country: colisData.recipient.country,
        type: 'transit'
      },
      deliveryInstructions: colisData.deliveryInstructions,
      signatureRequired: colisData.signatureRequired,
      insurance: colisData.insurance,
      customs: colisData.customs,
      notifications: [
        {
          type: 'email',
          enabled: true,
          events: ['status_changed', 'delivered', 'exception']
        },
        {
          type: 'sms',
          enabled: true,
          events: ['out_for_delivery', 'delivered']
        }
      ]
    };
  }

  /**
   * Obtient la description du statut
   */
  private getStatusDescription(status: string): string {
    const statusMap: Record<string, string> = {
      'PENDING': 'En attente de prise en charge',
      'PICKED_UP': 'Pris en charge',
      'IN_TRANSIT': 'En transit',
      'OUT_FOR_DELIVERY': 'En cours de livraison',
      'DELIVERED': 'Livré',
      'EXCEPTION': 'Exception',
      'RETURNED': 'Retourné'
    };
    return statusMap[status] || status;
  }

  /**
   * Obtient la catégorie du statut
   */
  private getStatusCategory(status: string): 'pending' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception' | 'returned' {
    const categoryMap: Record<string, 'pending' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception' | 'returned'> = {
      'PENDING': 'pending',
      'PICKED_UP': 'in_transit',
      'IN_TRANSIT': 'in_transit',
      'OUT_FOR_DELIVERY': 'out_for_delivery',
      'DELIVERED': 'delivered',
      'EXCEPTION': 'exception',
      'RETURNED': 'returned'
    };
    return categoryMap[status] || 'pending';
  }

  /**
   * Valide un numéro de tracking
   */
  validateTrackingNumber(trackingNumber: string): boolean {
    // Validation basée sur les formats réels
    const nationalPattern = /^BD\d{6}$/i;
    const internationalPattern = /^(DHL|UPS|FEDEX)\d{9,10}$/i;
    
    return nationalPattern.test(trackingNumber) || internationalPattern.test(trackingNumber);
  }

  /**
   * Génère un numéro de tracking unique
   */
  generateTrackingNumber(type: 'national' | 'international'): string {
    if (type === 'national') {
      const random = Math.floor(Math.random() * 900000) + 100000;
      return `BD${random}`;
    } else {
      const random = Math.floor(Math.random() * 900000000) + 100000000;
      return `DHL${random}`;
    }
  }
}

// Instance singleton du service
export const colisProductionService = new ColisProductionService(); 