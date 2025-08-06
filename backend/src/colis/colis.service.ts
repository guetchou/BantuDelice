import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Colis, ColisStatus, PackageType, DeliverySpeed } from './entities/colis.entity';
import { Tracking, TrackingEventType } from './entities/tracking.entity';
import { CreateColisDto } from './dto/create-colis.dto';

export interface TrackingInfo {
  trackingNumber: string;
  status: {
    code: string;
    description: string;
    category: string;
  };
  type: 'national' | 'international';
  carrier: string;
  service: string;
  weight: number;
  dimensions: string;
  estimatedDelivery: string;
  sender: {
    name: string;
    address: string;
    city: string;
    country: string;
  };
  recipient: {
    name: string;
    address: string;
    city: string;
    country: string;
  };
  currentLocation: {
    name: string;
    latitude: number;
    longitude: number;
  };
  timeline: Array<{
    id: string;
    description: string;
    location: string;
    timestamp: string;
    icon: string;
  }>;
  insurance: {
    amount: number;
    currency: string;
  };
  deliveryInstructions: string;
}

export interface TarifCalculation {
  baseRate: number;
  weightCharge: number;
  fuelSurcharge: number;
  insurance: number;
  total: number;
  currency: string;
}

export interface ExpeditionData {
  trackingNumber: string;
  type: 'national' | 'international';
  service: string;
  sender: {
    name: string;
    address: string;
    city: string;
    country: string;
    phone: string;
    email?: string;
  };
  recipient: {
    name: string;
    address: string;
    city: string;
    country: string;
    phone: string;
    email?: string;
  };
  package: {
    weight: number;
    dimensions: string;
    contents: string;
    declaredValue: number;
  };
  insurance: {
    amount: number;
    currency: string;
  };
  deliveryInstructions?: string;
  signatureRequired: boolean;
}

@Injectable()
export class ColisService {
  constructor(
    @InjectRepository(Colis)
    private colisRepository: Repository<Colis>,
    @InjectRepository(Tracking)
    private trackingRepository: Repository<Tracking>,
  ) {
    this.initializeTestData();
  }

  /**
   * Créer un nouveau colis
   */
  async createColis(createColisDto: CreateColisDto): Promise<Colis> {
    try {
      // Générer un numéro de tracking unique
      const trackingNumber = this.generateTrackingNumber(
        createColisDto.isInternational ? 'international' : 'national'
      );

      // Créer le colis avec les types corrects et valeurs par défaut
      const colis = this.colisRepository.create({
        ...createColisDto,
        trackingNumber,
        status: ColisStatus.PENDING,
        packageType: createColisDto.packageType as PackageType,
        deliverySpeed: createColisDto.deliverySpeed as DeliverySpeed,
        basePrice: 5000,
        totalPrice: 5000,
        lengthCm: createColisDto.lengthCm || 30,
        widthCm: createColisDto.widthCm || 20,
        heightCm: createColisDto.heightCm || 15,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Sauvegarder en base
      const savedColis = await this.colisRepository.save(colis);

      // Créer l'événement de tracking initial
      await this.addTrackingEvent(trackingNumber, {
        status: 'pending',
        description: 'Colis créé et en attente de prise en charge',
        location: createColisDto.senderCity,
        icon: 'package'
      });

      return savedColis;
    } catch (error) {
      throw new BadRequestException(`Erreur lors de la création du colis: ${error.message}`);
    }
  }

  /**
   * Initialise des données de test dans la base de données
   */
  private async initializeTestData(): Promise<void> {
    try {
      // Vérifier si des données existent déjà
      const existingColis = await this.colisRepository.count();
      if (existingColis > 0) {
        console.log('Données de test déjà présentes dans la base de données');
        return;
      }

      console.log('Initialisation des données de test pour les colis...');

      // Créer des colis de test
      const testColis = [
        {
          trackingNumber: 'BD123456',
          senderName: 'Jean Dupont',
          senderPhone: '+242 06 123 456',
          senderAddress: '123 Avenue de la Paix',
          senderCity: 'Brazzaville',
          senderCountry: 'Congo',
          recipientName: 'Marie Martin',
          recipientPhone: '+242 06 789 012',
          recipientAddress: '456 Boulevard du Commerce',
          recipientCity: 'Pointe-Noire',
          recipientCountry: 'Congo',
          packageType: PackageType.PACKAGE,
          packageDescription: 'Documents et échantillons',
          weightKg: 2.5,
          lengthCm: 30,
          widthCm: 20,
          heightCm: 15,
          deliverySpeed: DeliverySpeed.STANDARD,
          status: ColisStatus.IN_TRANSIT,
          basePrice: 5000,
          totalPrice: 7500,
          estimatedDeliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          deliveryInstructions: 'Livrer entre 9h et 17h. Appeler avant livraison.',
          insuranceAmount: 50000,
          isInternational: false,
          carrier: 'BantuDelice',
          service: 'Standard',
        },
        {
          trackingNumber: 'BD789012',
          senderName: 'Pierre Durand',
          senderPhone: '+242 06 234 567',
          senderAddress: '789 Rue de la République',
          senderCity: 'Brazzaville',
          senderCountry: 'Congo',
          recipientName: 'Sophie Bernard',
          recipientPhone: '+242 06 345 678',
          recipientAddress: '321 Avenue des Palmiers',
          recipientCity: 'Dolisie',
          recipientCountry: 'Congo',
          packageType: PackageType.FRAGILE,
          packageDescription: 'Objets fragiles',
          weightKg: 1.8,
          lengthCm: 25,
          widthCm: 15,
          heightCm: 10,
          deliverySpeed: DeliverySpeed.EXPRESS,
          status: ColisStatus.OUT_FOR_DELIVERY,
          basePrice: 3500,
          totalPrice: 6000,
          estimatedDeliveryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          deliveryInstructions: 'Manipuler avec précaution. Objets fragiles.',
          insuranceAmount: 75000,
          isInternational: false,
          carrier: 'BantuDelice',
          service: 'Express',
        },
        {
          trackingNumber: 'DHL123456789',
          senderName: 'Hans Mueller',
          senderPhone: '+49 30 123 456',
          senderAddress: '123 Hauptstraße',
          senderCity: 'Berlin',
          senderCountry: 'Allemagne',
          recipientName: 'Jean Dupont',
          recipientPhone: '+242 06 123 456',
          recipientAddress: '123 Avenue de la Paix',
          recipientCity: 'Brazzaville',
          recipientCountry: 'Congo',
          packageType: PackageType.PACKAGE,
          packageDescription: 'Échantillons commerciaux',
          weightKg: 3.2,
          lengthCm: 40,
          widthCm: 25,
          heightCm: 20,
          deliverySpeed: DeliverySpeed.PREMIUM,
          status: ColisStatus.IN_TRANSIT,
          basePrice: 25000,
          totalPrice: 45000,
          estimatedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          deliveryInstructions: 'Documents de douane joints. Contenu commercial.',
          insuranceAmount: 150000,
          isInternational: true,
          carrier: 'DHL Express',
          service: 'Premium',
        },
        {
          trackingNumber: 'UPS987654321',
          senderName: 'John Smith',
          senderPhone: '+1 555 123 456',
          senderAddress: '456 Main Street',
          senderCity: 'New York',
          senderCountry: 'États-Unis',
          recipientName: 'Marie Martin',
          recipientPhone: '+242 06 789 012',
          recipientAddress: '456 Boulevard du Commerce',
          recipientCity: 'Pointe-Noire',
          recipientCountry: 'Congo',
          packageType: PackageType.HEAVY,
          packageDescription: 'Équipements industriels',
          weightKg: 15.5,
          lengthCm: 80,
          widthCm: 60,
          heightCm: 50,
          deliverySpeed: DeliverySpeed.STANDARD,
          status: ColisStatus.IN_TRANSIT,
          basePrice: 50000,
          totalPrice: 85000,
          estimatedDeliveryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          deliveryInstructions: 'Équipements lourds. Livraison sur palette.',
          insuranceAmount: 500000,
          isInternational: true,
          carrier: 'UPS',
          service: 'Standard',
        },
      ];

      // Sauvegarder les colis
      const savedColis = await this.colisRepository.save(testColis);

      // Créer les événements de tracking pour chaque colis
      for (const colis of savedColis) {
        const trackingEvents = this.generateTrackingEvents(colis);
        await this.trackingRepository.save(trackingEvents);
      }

      console.log(`${savedColis.length} colis de test créés avec succès`);
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des données de test:', error);
    }
  }

  /**
   * Génère des événements de tracking pour un colis
   */
  private generateTrackingEvents(colis: Colis): Partial<Tracking>[] {
    const events: Partial<Tracking>[] = [];
    const now = new Date();
    const baseTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24h en arrière

    if (colis.isInternational) {
      // Timeline internationale
      events.push(
        {
          colisId: colis.id,
          eventType: TrackingEventType.PICKED_UP,
          description: 'Colis pris en charge par ' + colis.carrier,
          location: colis.senderCity + ', ' + colis.senderCountry,
          timestamp: new Date(baseTime.getTime() + 2 * 60 * 60 * 1000),
        },
        {
          colisId: colis.id,
          eventType: TrackingEventType.ARRIVED_AT_FACILITY,
          description: 'Arrivé au centre de tri ' + colis.carrier,
          location: 'Centre de tri ' + colis.senderCity,
          timestamp: new Date(baseTime.getTime() + 4 * 60 * 60 * 1000),
        },
        {
          colisId: colis.id,
          eventType: TrackingEventType.DEPARTED_FACILITY,
          description: 'Départ vers l\'aéroport',
          location: 'Aéroport ' + colis.senderCity,
          timestamp: new Date(baseTime.getTime() + 8 * 60 * 60 * 1000),
        },
        {
          colisId: colis.id,
          eventType: TrackingEventType.IN_TRANSIT,
          description: 'En transit aérien',
          location: 'En vol',
          timestamp: new Date(baseTime.getTime() + 12 * 60 * 60 * 1000),
        },
        {
          colisId: colis.id,
          eventType: TrackingEventType.ARRIVED_AT_FACILITY,
          description: 'Arrivé au centre de tri de destination',
          location: 'Centre de tri Brazzaville',
          timestamp: new Date(baseTime.getTime() + 18 * 60 * 60 * 1000),
        },
        {
          colisId: colis.id,
          eventType: TrackingEventType.IN_TRANSIT,
          description: 'En dédouanement',
          location: 'Douane Brazzaville',
          timestamp: new Date(baseTime.getTime() + 20 * 60 * 60 * 1000),
        },
      );
    } else {
      // Timeline nationale
      events.push(
        {
          colisId: colis.id,
          eventType: TrackingEventType.PICKED_UP,
          description: 'Colis pris en charge par notre équipe',
          location: colis.senderCity + ', Congo',
          timestamp: new Date(baseTime.getTime() + 2 * 60 * 60 * 1000),
        },
        {
          colisId: colis.id,
          eventType: TrackingEventType.ARRIVED_AT_FACILITY,
          description: 'Arrivé au centre de tri de ' + colis.senderCity,
          location: 'Centre de tri ' + colis.senderCity,
          timestamp: new Date(baseTime.getTime() + 4 * 60 * 60 * 1000),
        },
        {
          colisId: colis.id,
          eventType: TrackingEventType.DEPARTED_FACILITY,
          description: 'Départ vers ' + colis.recipientCity,
          location: colis.senderCity + ', Congo',
          timestamp: new Date(baseTime.getTime() + 6 * 60 * 60 * 1000),
        },
        {
          colisId: colis.id,
          eventType: TrackingEventType.ARRIVED_AT_FACILITY,
          description: 'Arrivé au centre de tri de ' + colis.recipientCity,
          location: 'Centre de tri ' + colis.recipientCity,
          timestamp: new Date(baseTime.getTime() + 12 * 60 * 60 * 1000),
        },
      );
    }

    // Ajouter l'événement final selon le statut
    if (colis.status === ColisStatus.OUT_FOR_DELIVERY) {
      events.push({
        colisId: colis.id,
        eventType: TrackingEventType.OUT_FOR_DELIVERY,
        description: 'En cours de livraison',
        location: colis.recipientCity + ', Congo',
        timestamp: new Date(baseTime.getTime() + 14 * 60 * 60 * 1000),
      });
    } else if (colis.status === ColisStatus.DELIVERED) {
      events.push({
        colisId: colis.id,
        eventType: TrackingEventType.DELIVERED,
        description: 'Livré avec succès',
        location: colis.recipientCity + ', Congo',
        timestamp: new Date(baseTime.getTime() + 16 * 60 * 60 * 1000),
      });
    }

    return events;
  }

  /**
   * Récupère les informations de tracking d'un colis
   */
  async trackParcel(trackingNumber: string): Promise<TrackingInfo> {
    // Rechercher le colis dans la base de données
    const colis = await this.colisRepository.findOne({
      where: { trackingNumber: trackingNumber.toUpperCase() },
      relations: ['trackingHistory'],
    });

    if (!colis) {
      throw new NotFoundException('Colis non trouvé');
    }

    // Récupérer l'historique de tracking
    const trackingHistory = await this.trackingRepository.find({
      where: { colisId: colis.id },
      order: { timestamp: 'ASC' },
    });

    // Transformer les données de la base en format TrackingInfo
    return this.transformColisToTrackingInfo(colis, trackingHistory);
  }

  /**
   * Récupère les informations de tracking national
   */
  async trackNationalParcel(trackingNumber: string): Promise<TrackingInfo> {
    if (!trackingNumber.match(/^BD\d{6}$/i)) {
      throw new BadRequestException('Format de numéro de tracking national invalide. Utilisez BD123456');
    }

    return this.trackParcel(trackingNumber);
  }

  /**
   * Récupère les informations de tracking international
   */
  async trackInternationalParcel(trackingNumber: string): Promise<TrackingInfo> {
    if (!trackingNumber.match(/^(DHL|UPS|FEDEX)\d{9,10}$/i)) {
      throw new BadRequestException('Format de numéro de tracking international invalide. Utilisez DHL123456789');
    }

    return this.trackParcel(trackingNumber);
  }

  /**
   * Calcule les tarifs de livraison
   */
  async calculateTarifs(data: {
    from: string;
    to: string;
    weight: number;
    service: string;
  }): Promise<TarifCalculation> {
    const { from, to, weight, service } = data;

    // Tarifs de base selon la destination
    const baseRates = {
      'Brazzaville': {
        'Pointe-Noire': 5000,
        'Dolisie': 3500,
        'Nkayi': 4000,
        'Ouesso': 8000,
      },
      'Pointe-Noire': {
        'Brazzaville': 5000,
        'Dolisie': 3000,
        'Nkayi': 3500,
        'Ouesso': 7500,
      },
    };

    // Tarif de base
    const baseRate = baseRates[from]?.[to] || 5000;

    // Surcharge pour le poids (500 FCFA par kg)
    const weightCharge = weight * 500;

    // Surcharge carburant (8% du tarif de base)
    const fuelSurcharge = Math.round(baseRate * 0.08);

    // Assurance (2% de la valeur déclarée, minimum 1000 FCFA)
    const insurance = Math.max(1000, Math.round((baseRate + weightCharge) * 0.02));

    // Total
    const total = baseRate + weightCharge + fuelSurcharge + insurance;

    return {
      baseRate,
      weightCharge,
      fuelSurcharge,
      insurance,
      total,
      currency: 'FCFA',
    };
  }

  /**
   * Crée une nouvelle expédition
   */
  async createExpedition(expeditionData: ExpeditionData, userId?: string): Promise<{ trackingNumber: string; success: boolean }> {
    try {
      console.log('🔍 Début création expédition avec données:', JSON.stringify(expeditionData, null, 2));
      
      // Générer un numéro de tracking unique
      const trackingNumber = this.generateTrackingNumber(expeditionData.type);
      console.log('📦 Numéro de tracking généré:', trackingNumber);
      
      // Créer le colis
      const colis = this.colisRepository.create({
        trackingNumber: trackingNumber,
        userId: userId, // Lier l'utilisateur au colis
        senderName: expeditionData.sender.name,
        senderPhone: expeditionData.sender.phone,
        senderAddress: expeditionData.sender.address,
        senderCity: expeditionData.sender.city,
        senderCountry: expeditionData.sender.country,
        recipientName: expeditionData.recipient.name,
        recipientPhone: expeditionData.recipient.phone,
        recipientAddress: expeditionData.recipient.address,
        recipientCity: expeditionData.recipient.city,
        recipientCountry: expeditionData.recipient.country,
        packageType: PackageType.PACKAGE,
        packageDescription: expeditionData.package.contents,
        weightKg: expeditionData.package.weight,
        lengthCm: 30,
        widthCm: 20,
        heightCm: 15,
        deliverySpeed: DeliverySpeed.STANDARD,
        status: ColisStatus.PENDING,
        basePrice: expeditionData.insurance.amount * 0.02,
        totalPrice: expeditionData.insurance.amount,
        estimatedDeliveryDate: this.calculateEstimatedDelivery(expeditionData.type),
        deliveryInstructions: expeditionData.deliveryInstructions,
        insuranceAmount: expeditionData.insurance.amount,
        isInternational: expeditionData.type === 'international',
        carrier: expeditionData.type === 'national' ? 'BantuDelice' : 'DHL Express',
        service: expeditionData.service,
      });

      console.log('💾 Sauvegarde du colis en base...');
      const savedColis = await this.colisRepository.save(colis);
      console.log('✅ Colis sauvegardé avec ID:', savedColis.id);

      // Créer le premier événement de tracking
      const trackingEvent = this.trackingRepository.create({
        colisId: savedColis.id,
        eventType: TrackingEventType.PICKED_UP,
        description: 'Colis créé',
        location: expeditionData.sender.city,
        timestamp: new Date(),
      });

      console.log('📊 Sauvegarde de l\'événement de tracking...');
      await this.trackingRepository.save(trackingEvent);
      console.log('✅ Événement de tracking sauvegardé');

      // Générer le reçu et envoyer les notifications
      console.log('📧 Génération du reçu et envoi des notifications...');
      await this.generateReceiptAndNotifications(savedColis, expeditionData);
      console.log('✅ Reçu et notifications traités');

      return {
        trackingNumber: savedColis.trackingNumber,
        success: true,
      };
    } catch (error) {
      console.error('❌ Erreur détaillée lors de la création de l\'expédition:', error);
      console.error('❌ Stack trace:', error.stack);
      console.error('❌ Message d\'erreur:', error.message);
      
      // Si c'est une erreur de validation TypeORM, afficher plus de détails
      if (error.code) {
        console.error('❌ Code d\'erreur:', error.code);
      }
      if (error.detail) {
        console.error('❌ Détail d\'erreur:', error.detail);
      }
      
      throw new BadRequestException(`Erreur lors de la création de l'expédition: ${error.message}`);
    }
  }

  /**
   * Ajoute un événement de tracking
   */
  async addTrackingEvent(trackingNumber: string, eventData: {
    status: string;
    description: string;
    location: string;
    icon: string;
    details?: string;
  }): Promise<boolean> {
    try {
      const colis = await this.colisRepository.findOne({
        where: { trackingNumber: trackingNumber.toUpperCase() },
      });

      if (!colis) {
        throw new NotFoundException('Colis non trouvé');
      }

      // Mapper le statut vers l'eventType
      const eventType = this.mapStatusToEventType(eventData.status);

      // Créer l'événement de tracking
      const trackingEvent = this.trackingRepository.create({
        colisId: colis.id,
        eventType,
        description: eventData.description,
        location: eventData.location,
        details: eventData.details,
        timestamp: new Date(),
      });

      await this.trackingRepository.save(trackingEvent);

      // Mettre à jour le statut du colis
      colis.status = this.mapStatusToColisStatus(eventData.status);
      await this.colisRepository.save(colis);

      return true;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'événement:', error);
      throw new BadRequestException('Erreur lors de l\'ajout de l\'événement');
    }
  }

  /**
   * Récupère l'historique des colis d'un utilisateur
   */
  async getUserColisHistory(userId: string): Promise<any[]> {
    const colisList = await this.colisRepository.find({
      where: { userId },
      relations: ['trackingHistory'],
      order: { createdAt: 'DESC' },
    });

    // Transformer les données pour correspondre à l'interface attendue par le frontend
    return colisList.map(colis => ({
      id: colis.id,
      trackingNumber: colis.trackingNumber,
      status: colis.status,
      sender: {
        name: colis.senderName,
        phone: colis.senderPhone,
      },
      recipient: {
        name: colis.recipientName,
        phone: colis.recipientPhone,
        address: colis.recipientAddress,
      },
      package: {
        weight: colis.weightKg,
        description: colis.packageDescription,
        declaredValue: colis.insuranceAmount || 0,
      },
      totalPrice: parseFloat(colis.totalPrice?.toString() || '0'),
      createdAt: colis.createdAt.toISOString(),
      estimatedDelivery: colis.estimatedDeliveryDate?.toISOString(),
    }));
  }

  /**
   * Récupérer toutes les expéditions (pour le dashboard)
   */
  async getAllExpeditions(): Promise<any[]> {
    const colisList = await this.colisRepository.find({
      relations: ['trackingHistory'],
      order: { createdAt: 'DESC' },
    });

    // Transformer les données pour correspondre à l'interface attendue par le frontend
    return colisList.map(colis => ({
      id: colis.id,
      trackingNumber: colis.trackingNumber,
      status: colis.status,
      sender: {
        name: colis.senderName,
        phone: colis.senderPhone,
      },
      recipient: {
        name: colis.recipientName,
        phone: colis.recipientPhone,
        address: colis.recipientAddress,
      },
      package: {
        weight: colis.weightKg,
        description: colis.packageDescription,
        declaredValue: colis.insuranceAmount || 0,
      },
      totalPrice: parseFloat(colis.totalPrice?.toString() || '0'),
      createdAt: colis.createdAt.toISOString(),
      estimatedDelivery: colis.estimatedDeliveryDate?.toISOString(),
    }));
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
    const [totalColis, deliveredColis, inTransitColis, pendingColis] = await Promise.all([
      this.colisRepository.count(),
      this.colisRepository.count({ where: { status: ColisStatus.DELIVERED } }),
      this.colisRepository.count({ where: { status: ColisStatus.IN_TRANSIT } }),
      this.colisRepository.count({ where: { status: ColisStatus.PENDING } }),
    ]);

    // Calculer le revenu total (simulation)
    const revenue = totalColis * 5000; // 5000 FCFA par colis en moyenne

    // Calculer le temps de livraison moyen (simulation)
    const averageDeliveryTime = 2.5; // 2.5 jours en moyenne

    return {
      totalColis,
      deliveredColis,
      inTransitColis,
      pendingColis,
      revenue,
      averageDeliveryTime,
    };
  }

  /**
   * Transforme les données de la base en format TrackingInfo
   */
  private transformColisToTrackingInfo(colis: Colis, trackingHistory: Tracking[]): TrackingInfo {
    const currentStatus = trackingHistory[trackingHistory.length - 1] || { eventType: TrackingEventType.PICKED_UP };

    return {
      trackingNumber: colis.trackingNumber,
      status: {
        code: currentStatus.eventType,
        description: this.getStatusDescription(currentStatus.eventType),
        category: this.getStatusCategory(currentStatus.eventType),
      },
      type: colis.isInternational ? 'international' : 'national',
      carrier: colis.carrier || 'BantuDelice',
      service: colis.service || 'Standard',
      weight: colis.weightKg,
      dimensions: `${colis.lengthCm}x${colis.widthCm}x${colis.heightCm} cm`,
      estimatedDelivery: colis.estimatedDeliveryDate?.toISOString() || new Date().toISOString(),
      sender: {
        name: colis.senderName,
        address: colis.senderAddress,
        city: colis.senderCity,
        country: colis.senderCountry,
      },
      recipient: {
        name: colis.recipientName,
        address: colis.recipientAddress,
        city: colis.recipientCity,
        country: colis.recipientCountry,
      },
      currentLocation: {
        name: colis.recipientCity,
        latitude: -4.2634,
        longitude: 15.2429,
      },
      timeline: trackingHistory.map((event, index) => ({
        id: (index + 1).toString(),
        description: event.description,
        location: event.location,
        timestamp: event.timestamp.toISOString(),
        icon: this.getEventIcon(event.eventType),
      })),
      insurance: {
        amount: colis.insuranceAmount || 50000,
        currency: 'FCFA',
      },
      deliveryInstructions: colis.deliveryInstructions,
    };
  }

  /**
   * Obtient la description du statut
   */
  private getStatusDescription(eventType: TrackingEventType): string {
    const statusMap: Record<TrackingEventType, string> = {
      [TrackingEventType.PICKED_UP]: 'Pris en charge',
      [TrackingEventType.IN_TRANSIT]: 'En transit',
      [TrackingEventType.ARRIVED_AT_FACILITY]: 'Arrivé au centre de tri',
      [TrackingEventType.DEPARTED_FACILITY]: 'Départ du centre de tri',
      [TrackingEventType.OUT_FOR_DELIVERY]: 'En cours de livraison',
      [TrackingEventType.DELIVERED]: 'Livré',
      [TrackingEventType.EXCEPTION]: 'Exception',
      [TrackingEventType.RETURNED]: 'Retourné',
    };
    return statusMap[eventType] || 'Statut inconnu';
  }

  /**
   * Obtient la catégorie du statut
   */
  private getStatusCategory(eventType: TrackingEventType): string {
    const categoryMap: Record<TrackingEventType, string> = {
      [TrackingEventType.PICKED_UP]: 'in_transit',
      [TrackingEventType.IN_TRANSIT]: 'in_transit',
      [TrackingEventType.ARRIVED_AT_FACILITY]: 'in_transit',
      [TrackingEventType.DEPARTED_FACILITY]: 'in_transit',
      [TrackingEventType.OUT_FOR_DELIVERY]: 'out_for_delivery',
      [TrackingEventType.DELIVERED]: 'delivered',
      [TrackingEventType.EXCEPTION]: 'exception',
      [TrackingEventType.RETURNED]: 'returned',
    };
    return categoryMap[eventType] || 'pending';
  }

  /**
   * Obtient l'icône de l'événement
   */
  private getEventIcon(eventType: TrackingEventType): string {
    const iconMap: Record<TrackingEventType, string> = {
      [TrackingEventType.PICKED_UP]: '📦',
      [TrackingEventType.IN_TRANSIT]: '🚚',
      [TrackingEventType.ARRIVED_AT_FACILITY]: '🏢',
      [TrackingEventType.DEPARTED_FACILITY]: '🚛',
      [TrackingEventType.OUT_FOR_DELIVERY]: '🛵',
      [TrackingEventType.DELIVERED]: '✅',
      [TrackingEventType.EXCEPTION]: '⚠️',
      [TrackingEventType.RETURNED]: '↩️',
    };
    return iconMap[eventType] || '📋';
  }

  /**
   * Mappe un statut vers un eventType
   */
  private mapStatusToEventType(status: string): TrackingEventType {
    const statusMap: Record<string, TrackingEventType> = {
      'PENDING': TrackingEventType.PICKED_UP,
      'PICKED_UP': TrackingEventType.PICKED_UP,
      'IN_TRANSIT': TrackingEventType.IN_TRANSIT,
      'OUT_FOR_DELIVERY': TrackingEventType.OUT_FOR_DELIVERY,
      'DELIVERED': TrackingEventType.DELIVERED,
      'EXCEPTION': TrackingEventType.EXCEPTION,
      'RETURNED': TrackingEventType.RETURNED,
    };
    return statusMap[status] || TrackingEventType.PICKED_UP;
  }

  /**
   * Mappe un statut vers un ColisStatus
   */
  private mapStatusToColisStatus(status: string): ColisStatus {
    const statusMap: Record<string, ColisStatus> = {
      'PENDING': ColisStatus.PENDING,
      'PICKED_UP': ColisStatus.PICKED_UP,
      'IN_TRANSIT': ColisStatus.IN_TRANSIT,
      'OUT_FOR_DELIVERY': ColisStatus.OUT_FOR_DELIVERY,
      'DELIVERED': ColisStatus.DELIVERED,
      'EXCEPTION': ColisStatus.EXCEPTION,
      'RETURNED': ColisStatus.RETURNED,
    };
    return statusMap[status] || ColisStatus.PENDING;
  }

  /**
   * Calcule la date de livraison estimée
   */
  private calculateEstimatedDelivery(type: 'national' | 'international'): Date {
    const now = new Date();
    if (type === 'national') {
      // Livraison nationale : 1-2 jours
      return new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    } else {
      // Livraison internationale : 5-10 jours
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    }
  }

  /**
   * Génère un numéro de tracking unique
   */
  private generateTrackingNumber(type: 'national' | 'international'): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    if (type === 'national') {
      return `BD${timestamp}`;
    } else {
      // Format international: DHL + 9 chiffres
      const internationalTimestamp = Date.now().toString().slice(-9);
      return `DHL${internationalTimestamp}`;
    }
  }

  /**
   * Génère le reçu et envoie les notifications (SMS/Email)
   */
  private async generateReceiptAndNotifications(colis: Colis, expeditionData: ExpeditionData): Promise<void> {
    try {
      // Générer le reçu
      const receipt = this.generateReceipt(colis, expeditionData);
      console.log('📄 Reçu généré:', receipt);

      // Envoyer SMS au destinataire
      await this.sendSMSNotification(
        expeditionData.recipient.phone,
        `Votre colis ${colis.trackingNumber} a été expédié par ${expeditionData.sender.name}. Suivez-le sur bantudelice.com`
      );

      // Envoyer email au destinataire si disponible
      if (expeditionData.recipient.email) {
        await this.sendEmailNotification(
          expeditionData.recipient.email,
          `Colis expédié - ${colis.trackingNumber}`,
          `Bonjour ${expeditionData.recipient.name},\n\nVotre colis ${colis.trackingNumber} a été expédié par ${expeditionData.sender.name}.\n\nDétails:\n- Poids: ${colis.weightKg}kg\n- Service: ${colis.service}\n- Livraison estimée: ${colis.estimatedDeliveryDate.toLocaleDateString()}\n\nSuivez votre colis: bantudelice.com/tracking/${colis.trackingNumber}\n\nCordialement,\nL'équipe BantuDelice`
        );
      }

      // Envoyer SMS à l'expéditeur
      await this.sendSMSNotification(
        expeditionData.sender.phone,
        `Votre colis ${colis.trackingNumber} a été créé avec succès. Montant: ${colis.totalPrice} FCFA`
      );

      console.log('✅ Notifications envoyées avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi des notifications:', error);
      // Ne pas faire échouer la création du colis si les notifications échouent
    }
  }

  /**
   * Génère un reçu au format texte
   */
  private generateReceipt(colis: Colis, expeditionData: ExpeditionData): string {
    const receipt = `
╔══════════════════════════════════════════════════════════════╗
║                    BANTUDELICE - REÇU                       ║
╠══════════════════════════════════════════════════════════════╣
║ Numéro de tracking: ${colis.trackingNumber.padEnd(40)} ║
║ Date: ${new Date().toLocaleDateString().padEnd(45)} ║
║ Heure: ${new Date().toLocaleTimeString().padEnd(44)} ║
╠══════════════════════════════════════════════════════════════╣
║ EXPÉDITEUR:                                                 ║
║ ${expeditionData.sender.name.padEnd(50)} ║
║ ${expeditionData.sender.address.padEnd(50)} ║
║ ${expeditionData.sender.city}, ${expeditionData.sender.country.padEnd(30)} ║
║ Tél: ${expeditionData.sender.phone.padEnd(45)} ║
╠══════════════════════════════════════════════════════════════╣
║ DESTINATAIRE:                                               ║
║ ${expeditionData.recipient.name.padEnd(50)} ║
║ ${expeditionData.recipient.address.padEnd(50)} ║
║ ${expeditionData.recipient.city}, ${expeditionData.recipient.country.padEnd(30)} ║
║ Tél: ${expeditionData.recipient.phone.padEnd(45)} ║
╠══════════════════════════════════════════════════════════════╣
║ COLIS:                                                      ║
║ Contenu: ${expeditionData.package.contents.padEnd(45)} ║
║ Poids: ${colis.weightKg}kg${' '.repeat(45)} ║
║ Service: ${colis.service.padEnd(45)} ║
║ Assurance: ${colis.insuranceAmount.toLocaleString()} FCFA${' '.repeat(25)} ║
╠══════════════════════════════════════════════════════════════╣
║ TARIFICATION:                                               ║
║ Prix de base: ${colis.basePrice.toLocaleString()} FCFA${' '.repeat(25)} ║
║ TOTAL: ${colis.totalPrice.toLocaleString()} FCFA${' '.repeat(30)} ║
╠══════════════════════════════════════════════════════════════╣
║ Instructions: ${expeditionData.deliveryInstructions?.padEnd(40) || 'Aucune'.padEnd(40)} ║
╚══════════════════════════════════════════════════════════════╝
    `;
    return receipt;
  }

  /**
   * Envoie une notification SMS (simulation)
   */
  private async sendSMSNotification(phone: string, message: string): Promise<void> {
    // Simulation d'envoi SMS - en production, utiliser un service SMS réel
    console.log(`📱 SMS envoyé à ${phone}: ${message}`);
    // Ici on pourrait intégrer Twilio, AfricasTalking, ou autre service SMS
  }

  /**
   * Envoie une notification email (simulation)
   */
  private async sendEmailNotification(email: string, subject: string, body: string): Promise<void> {
    // Simulation d'envoi email - en production, utiliser un service email réel
    console.log(`📧 Email envoyé à ${email}:`);
    console.log(`   Sujet: ${subject}`);
    console.log(`   Contenu: ${body}`);
    // Ici on pourrait intégrer SendGrid, AWS SES, ou autre service email
  }

  /**
   * Envoie les notifications (SMS/Email) pour une expédition
   */
  async sendNotifications(notificationData: {
    trackingNumber: string;
    senderPhone: string;
    senderEmail?: string;
    recipientPhone: string;
    recipientEmail?: string;
    fromCity: string;
    toCity: string;
    amount: number;
  }): Promise<void> {
    try {
      console.log('📧 Données de notification reçues:', JSON.stringify(notificationData, null, 2));
      
      // Protection contre les valeurs undefined
      const amount = notificationData.amount || 0;
      const fromCity = notificationData.fromCity || 'Ville inconnue';
      const toCity = notificationData.toCity || 'Ville inconnue';
      const trackingNumber = notificationData.trackingNumber || 'N/A';
      
      // SMS à l'expéditeur
      const senderSMS = `BantuDelice: Votre colis ${trackingNumber} a été créé avec succès. Montant: ${amount.toLocaleString()} FCFA. De ${fromCity} vers ${toCity}`;
      await this.sendSMSNotification(notificationData.senderPhone, senderSMS);

      // SMS au destinataire
      const recipientSMS = `BantuDelice: Un colis ${trackingNumber} vous attend. Expéditeur: ${fromCity}. Montant: ${amount.toLocaleString()} FCFA`;
      await this.sendSMSNotification(notificationData.recipientPhone, recipientSMS);

      // Email à l'expéditeur si disponible
      if (notificationData.senderEmail) {
        const senderEmailSubject = `Confirmation d'expédition - Colis ${trackingNumber}`;
        const senderEmailBody = `
          Bonjour,
          
          Votre expédition a été créée avec succès !
          
          Numéro de tracking: ${trackingNumber}
          De: ${fromCity}
          Vers: ${toCity}
          Montant: ${amount.toLocaleString()} FCFA
          
          Vous recevrez des mises à jour par SMS.
          
          Merci de votre confiance,
          L'équipe BantuDelice
        `;
        await this.sendEmailNotification(notificationData.senderEmail, senderEmailSubject, senderEmailBody);
      }

      // Email au destinataire si disponible
      if (notificationData.recipientEmail) {
        const recipientEmailSubject = `Colis en attente - ${trackingNumber}`;
        const recipientEmailBody = `
          Bonjour,
          
          Un colis vous attend !
          
          Numéro de tracking: ${trackingNumber}
          Expéditeur: ${fromCity}
          Montant: ${amount.toLocaleString()} FCFA
          
          Vous recevrez des mises à jour par SMS.
          
          Cordialement,
          L'équipe BantuDelice
        `;
        await this.sendEmailNotification(notificationData.recipientEmail, recipientEmailSubject, recipientEmailBody);
      }

      console.log('✅ Toutes les notifications ont été envoyées avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi des notifications:', error);
      throw error;
    }
  }

  /**
   * Récupérer un colis par numéro de tracking
   */
  async getColisByTrackingNumber(trackingNumber: string): Promise<Colis | null> {
    try {
      const colis = await this.colisRepository.findOne({
        where: { trackingNumber },
        select: [
          'id',
          'trackingNumber',
          'senderName',
          'recipientName',
          'packageType',
          'weightKg',
          'recipientAddress',
          'status',
          'createdAt'
        ]
      });
      
      return colis;
    } catch (error) {
      console.error('Erreur lors de la récupération du colis:', error);
      return null;
    }
  }
} 