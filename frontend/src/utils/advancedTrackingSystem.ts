// Système de tracking avancé basé sur les meilleures pratiques de l'industrie
// Inspiré de DHL, UPS, FedEx et autres transporteurs internationaux

export interface AdvancedTrackingInfo {
  trackingNumber: string;
  status: TrackingStatus;
  type: 'national' | 'international';
  carrier: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  weight: number;
  dimensions: string;
  service: string;
  sender: AddressInfo;
  recipient: AddressInfo;
  timeline: TrackingEvent[];
  currentLocation?: LocationInfo;
  deliveryInstructions?: string;
  signatureRequired: boolean;
  insurance: InsuranceInfo;
  customs?: CustomsInfo;
  notifications: NotificationPreference[];
}

export interface TrackingStatus {
  code: string;
  description: string;
  category: 'pending' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception' | 'returned';
  timestamp: string;
  location?: string;
}

export interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  timestamp: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  icon: string;
  details?: string;
}

export interface AddressInfo {
  name: string;
  company?: string;
  address: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone: string;
  email?: string;
}

export interface LocationInfo {
  name: string;
  address: string;
  city: string;
  country: string;
  coordinates?: { lat: number; lng: number };
  type: 'origin' | 'destination' | 'transit' | 'delivery';
}

export interface InsuranceInfo {
  amount: number;
  currency: string;
  type: 'basic' | 'premium' | 'custom';
  description: string;
}

export interface CustomsInfo {
  declaredValue: number;
  currency: string;
  contents: string;
  purpose: 'personal' | 'commercial' | 'gift' | 'sample';
  documents?: string[];
}

export interface NotificationPreference {
  type: 'email' | 'sms' | 'push' | 'webhook';
  enabled: boolean;
  events: string[];
}

export class AdvancedTrackingSystem {
  private static readonly CARRIER_PATTERNS = {
    // DHL
    DHL: {
      pattern: /^DHL\d{9,10}$/i,
      name: 'DHL Express',
      type: 'international'
    },
    // UPS
    UPS: {
      pattern: /^1Z[A-Z0-9]{16}$/i,
      name: 'UPS',
      type: 'international'
    },
    // FedEx
    FEDEX: {
      pattern: /^\d{12}$/i,
      name: 'FedEx',
      type: 'international'
    },
    // National (BantuDelice)
    NATIONAL: {
      pattern: /^BD\d{6}$/i,
      name: 'BantuDelice',
      type: 'national'
    }
  };

  private static readonly STATUS_MAPPING = {
    // Pending
    'PENDING': { code: 'PENDING', description: 'En attente de prise en charge', category: 'pending' },
    'PICKUP_SCHEDULED': { code: 'PICKUP_SCHEDULED', description: 'Ramassage programmé', category: 'pending' },
    
    // In Transit
    'PICKED_UP': { code: 'PICKED_UP', description: 'Pris en charge', category: 'in_transit' },
    'IN_TRANSIT': { code: 'IN_TRANSIT', description: 'En transit', category: 'in_transit' },
    'ARRIVED_AT_FACILITY': { code: 'ARRIVED_AT_FACILITY', description: 'Arrivé au centre de tri', category: 'in_transit' },
    'DEPARTED_FACILITY': { code: 'DEPARTED_FACILITY', description: 'Départ du centre de tri', category: 'in_transit' },
    'CUSTOMS_CLEARANCE': { code: 'CUSTOMS_CLEARANCE', description: 'En dédouanement', category: 'in_transit' },
    'CUSTOMS_CLEARED': { code: 'CUSTOMS_CLEARED', description: 'Dédouanement terminé', category: 'in_transit' },
    
    // Out for Delivery
    'OUT_FOR_DELIVERY': { code: 'OUT_FOR_DELIVERY', description: 'En cours de livraison', category: 'out_for_delivery' },
    'DELIVERY_ATTEMPTED': { code: 'DELIVERY_ATTEMPTED', description: 'Tentative de livraison', category: 'out_for_delivery' },
    
    // Delivered
    'DELIVERED': { code: 'DELIVERED', description: 'Livré', category: 'delivered' },
    'SIGNED_FOR': { code: 'SIGNED_FOR', description: 'Signé par le destinataire', category: 'delivered' },
    
    // Exception
    'EXCEPTION': { code: 'EXCEPTION', description: 'Exception', category: 'exception' },
    'DELAYED': { code: 'DELAYED', description: 'Retardé', category: 'exception' },
    'DAMAGED': { code: 'DAMAGED', description: 'Endommagé', category: 'exception' },
    'LOST': { code: 'LOST', description: 'Perdu', category: 'exception' },
    
    // Returned
    'RETURNED': { code: 'RETURNED', description: 'Retourné', category: 'returned' },
    'RETURN_TO_SENDER': { code: 'RETURN_TO_SENDER', description: 'Retour à l\'expéditeur', category: 'returned' }
  };

  /**
   * Détecte automatiquement le transporteur basé sur le numéro de tracking
   */
  static detectCarrier(trackingNumber: string): { carrier: string; name: string; type: string } | null {
    for (const [key, config] of Object.entries(this.CARRIER_PATTERNS)) {
      if (config.pattern.test(trackingNumber)) {
        return {
          carrier: key,
          name: config.name,
          type: config.type
        };
      }
    }
    return null;
  }

  /**
   * Valide le format du numéro de tracking
   */
  static validateTrackingNumber(trackingNumber: string): boolean {
    return this.detectCarrier(trackingNumber) !== null;
  }

  /**
   * Génère un numéro de tracking unique
   */
  static generateTrackingNumber(type: 'national' | 'international'): string {
    if (type === 'national') {
      // Format BD + 6 chiffres
      const random = Math.floor(Math.random() * 900000) + 100000;
      return `BD${random}`;
    } else {
      // Format DHL + 9 chiffres
      const random = Math.floor(Math.random() * 900000000) + 100000000;
      return `DHL${random}`;
    }
  }

  /**
   * Simule le tracking d'un colis avec des données réalistes
   */
  static async trackParcel(trackingNumber: string): Promise<AdvancedTrackingInfo> {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const carrier = this.detectCarrier(trackingNumber);
    if (!carrier) {
      throw new Error('Numéro de tracking invalide');
    }

    // Simuler des erreurs pour certains numéros
    if (trackingNumber.toUpperCase() === 'BD999999') {
      throw new Error('NOT_FOUND');
    }
    
    if (trackingNumber.toUpperCase() === 'DHL999999999') {
      throw new Error('NETWORK_ERROR');
    }

    // Générer des données de tracking réalistes
    const now = new Date();
    const timeline = this.generateRealisticTimeline(trackingNumber, carrier, now);
    const currentStatus = timeline[timeline.length - 1];

    return {
      trackingNumber: trackingNumber.toUpperCase(),
      status: {
        code: currentStatus.status,
        description: this.STATUS_MAPPING[currentStatus.status]?.description || currentStatus.status,
        category: this.STATUS_MAPPING[currentStatus.status]?.category || 'in_transit',
        timestamp: currentStatus.timestamp,
        location: currentStatus.location
      },
      type: carrier.type as 'national' | 'international',
      carrier: carrier.name,
      estimatedDelivery: this.calculateEstimatedDelivery(timeline, carrier.type),
      weight: 2.5,
      dimensions: '30x20x15 cm',
      service: carrier.type === 'national' ? 'Standard' : 'Express',
      sender: {
        name: 'Jean Dupont',
        company: 'Entreprise ABC',
        address: '123 Avenue de la Paix',
        city: 'Brazzaville',
        postalCode: 'BZV',
        country: 'Congo',
        phone: '+242 06 123 456',
        email: 'jean.dupont@email.com'
      },
      recipient: {
        name: 'Marie Martin',
        company: 'Société XYZ',
        address: '456 Boulevard du Commerce',
        city: 'Pointe-Noire',
        postalCode: 'PNR',
        country: 'Congo',
        phone: '+242 06 789 012',
        email: 'marie.martin@email.com'
      },
      timeline,
      currentLocation: this.getCurrentLocation(timeline),
      deliveryInstructions: 'Livrer entre 9h et 17h. Appeler avant livraison.',
      signatureRequired: true,
      insurance: {
        amount: carrier.type === 'national' ? 500000 : 1000000,
        currency: 'FCFA',
        type: 'basic',
        description: 'Assurance incluse'
      },
      customs: carrier.type === 'international' ? {
        declaredValue: 150000,
        currency: 'FCFA',
        contents: 'Documents et échantillons',
        purpose: 'commercial'
      } : undefined,
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
   * Génère une timeline réaliste basée sur le type de transport
   */
  private static generateRealisticTimeline(
    trackingNumber: string, 
    carrier: { carrier: string; name: string; type: string },
    currentTime: Date
  ): TrackingEvent[] {
    const timeline: TrackingEvent[] = [];
    const baseTime = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000); // 24h en arrière

    if (carrier.type === 'national') {
      // Timeline nationale (plus rapide)
      timeline.push(
        {
          id: '1',
          status: 'PICKED_UP',
          description: 'Colis pris en charge par notre équipe',
          timestamp: new Date(baseTime.getTime() + 2 * 60 * 60 * 1000).toISOString(),
          location: 'Brazzaville, Congo',
          icon: '📦'
        },
        {
          id: '2',
          status: 'ARRIVED_AT_FACILITY',
          description: 'Arrivé au centre de tri de Brazzaville',
          timestamp: new Date(baseTime.getTime() + 4 * 60 * 60 * 1000).toISOString(),
          location: 'Centre de tri Brazzaville',
          icon: '🏢'
        },
        {
          id: '3',
          status: 'DEPARTED_FACILITY',
          description: 'Départ vers Pointe-Noire',
          timestamp: new Date(baseTime.getTime() + 6 * 60 * 60 * 1000).toISOString(),
          location: 'Brazzaville, Congo',
          icon: '🚚'
        },
        {
          id: '4',
          status: 'ARRIVED_AT_FACILITY',
          description: 'Arrivé au centre de tri de Pointe-Noire',
          timestamp: new Date(baseTime.getTime() + 12 * 60 * 60 * 1000).toISOString(),
          location: 'Centre de tri Pointe-Noire',
          icon: '🏢'
        },
        {
          id: '5',
          status: 'OUT_FOR_DELIVERY',
          description: 'En cours de livraison',
          timestamp: new Date(baseTime.getTime() + 14 * 60 * 60 * 1000).toISOString(),
          location: 'Pointe-Noire, Congo',
          icon: '🚚'
        }
      );
    } else {
      // Timeline internationale (plus longue)
      timeline.push(
        {
          id: '1',
          status: 'PICKED_UP',
          description: 'Colis pris en charge par DHL',
          timestamp: new Date(baseTime.getTime() + 2 * 60 * 60 * 1000).toISOString(),
          location: 'Berlin, Allemagne',
          icon: '📦'
        },
        {
          id: '2',
          status: 'ARRIVED_AT_FACILITY',
          description: 'Arrivé au centre de tri DHL',
          timestamp: new Date(baseTime.getTime() + 4 * 60 * 60 * 1000).toISOString(),
          location: 'Centre de tri DHL Berlin',
          icon: '🏢'
        },
        {
          id: '3',
          status: 'DEPARTED_FACILITY',
          description: 'Départ vers l\'aéroport',
          timestamp: new Date(baseTime.getTime() + 8 * 60 * 60 * 1000).toISOString(),
          location: 'Aéroport Berlin Brandenburg',
          icon: '✈️'
        },
        {
          id: '4',
          status: 'IN_TRANSIT',
          description: 'En transit aérien',
          timestamp: new Date(baseTime.getTime() + 12 * 60 * 60 * 1000).toISOString(),
          location: 'En vol',
          icon: '✈️'
        },
        {
          id: '5',
          status: 'ARRIVED_AT_FACILITY',
          description: 'Arrivé au centre de tri de destination',
          timestamp: new Date(baseTime.getTime() + 18 * 60 * 60 * 1000).toISOString(),
          location: 'Centre de tri Brazzaville',
          icon: '🏢'
        },
        {
          id: '6',
          status: 'CUSTOMS_CLEARANCE',
          description: 'En dédouanement',
          timestamp: new Date(baseTime.getTime() + 20 * 60 * 60 * 1000).toISOString(),
          location: 'Douane Brazzaville',
          icon: '🏛️'
        },
        {
          id: '7',
          status: 'CUSTOMS_CLEARED',
          description: 'Dédouanement terminé',
          timestamp: new Date(baseTime.getTime() + 22 * 60 * 60 * 1000).toISOString(),
          location: 'Brazzaville, Congo',
          icon: '✅'
        },
        {
          id: '8',
          status: 'OUT_FOR_DELIVERY',
          description: 'En cours de livraison',
          timestamp: new Date(baseTime.getTime() + 23 * 60 * 60 * 1000).toISOString(),
          location: 'Brazzaville, Congo',
          icon: '🚚'
        }
      );
    }

    return timeline;
  }

  /**
   * Calcule la date de livraison estimée
   */
  private static calculateEstimatedDelivery(timeline: TrackingEvent[], type: string): string {
    const lastEvent = timeline[timeline.length - 1];
    const lastEventTime = new Date(lastEvent.timestamp);
    
    if (type === 'national') {
      // Livraison nationale : 1-2 jours après le dernier événement
      const estimated = new Date(lastEventTime.getTime() + 24 * 60 * 60 * 1000);
      return estimated.toISOString();
    } else {
      // Livraison internationale : 2-3 jours après le dernier événement
      const estimated = new Date(lastEventTime.getTime() + 2 * 24 * 60 * 60 * 1000);
      return estimated.toISOString();
    }
  }

  /**
   * Obtient la localisation actuelle basée sur la timeline
   */
  private static getCurrentLocation(timeline: TrackingEvent[]): LocationInfo | undefined {
    const lastEvent = timeline[timeline.length - 1];
    if (!lastEvent) return undefined;

    return {
      name: lastEvent.location,
      address: lastEvent.location,
      city: lastEvent.location.split(',')[0]?.trim() || lastEvent.location,
      country: lastEvent.location.split(',')[1]?.trim() || 'Congo',
      type: 'transit'
    };
  }

  /**
   * Envoie une notification
   */
  static async sendNotification(
    trackingNumber: string, 
    event: string, 
    recipient: string, 
    type: 'email' | 'sms' | 'push'
  ): Promise<boolean> {
    // Simulation d'envoi de notification
    console.log(`Notification ${type} envoyée pour ${trackingNumber}: ${event} à ${recipient}`);
    return true;
  }

  /**
   * Génère un rapport de tracking
   */
  static generateTrackingReport(trackingInfo: AdvancedTrackingInfo): string {
    return `
RAPPORT DE TRACKING - ${trackingInfo.trackingNumber}
================================================

TRANSPORTEUR: ${trackingInfo.carrier}
TYPE: ${trackingInfo.type.toUpperCase()}
STATUT: ${trackingInfo.status.description}
LIVRAISON ESTIMÉE: ${new Date(trackingInfo.estimatedDelivery).toLocaleDateString('fr-FR')}

EXPÉDITEUR:
${trackingInfo.sender.name}
${trackingInfo.sender.address}
${trackingInfo.sender.city}, ${trackingInfo.sender.country}

DESTINATAIRE:
${trackingInfo.recipient.name}
${trackingInfo.recipient.address}
${trackingInfo.recipient.city}, ${trackingInfo.recipient.country}

DÉTAILS:
- Poids: ${trackingInfo.weight} kg
- Dimensions: ${trackingInfo.dimensions}
- Service: ${trackingInfo.service}
- Assurance: ${trackingInfo.insurance.amount.toLocaleString()} ${trackingInfo.insurance.currency}

HISTORIQUE:
${trackingInfo.timeline.map(event => 
  `${new Date(event.timestamp).toLocaleString('fr-FR')} - ${event.description} (${event.location})`
).join('\n')}

${trackingInfo.deliveryInstructions ? `INSTRUCTIONS: ${trackingInfo.deliveryInstructions}` : ''}
    `.trim();
  }
} 