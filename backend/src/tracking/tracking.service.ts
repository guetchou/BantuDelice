import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tracking } from './entities/tracking.entity';
import { Driver } from './entities/driver.entity';
import { Colis } from '../colis/entities/colis.entity';

export interface LocationUpdate {
  trackingNumber: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  speed: number;
  heading: number;
  timestamp: Date;
  driverId?: string;
}

export interface TrackingStatus {
  trackingNumber: string;
  status: string;
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  estimatedArrival: Date;
  driverInfo?: {
    id: string;
    name: string;
    phone: string;
    photo?: string;
  };
  route: {
    distance: number;
    duration: number;
    waypoints: Array<{ lat: number; lng: number }>;
  };
  lastUpdate: Date;
}

@Injectable()
export class TrackingService {
  private readonly logger = new Logger(TrackingService.name);
  private activeConnections = new Map<string, any>(); // Changed to any for simplicity
  private trackingSessions = new Map<string, {
    colisId: string;
    driverId?: string;
    lastLocation: LocationUpdate | null;
    subscribers: Set<string>;
  }>();

  constructor(
    @InjectRepository(Colis)
    private colisRepository: Repository<Colis>,
    @InjectRepository(Tracking)
    private trackingRepository: Repository<Tracking>,
    @InjectRepository(Driver)
    private driverRepository: Repository<Driver>,
  ) {}

  /**
   * Démarre le tracking pour un colis
   */
  async startTracking(trackingNumber: string, driverId?: string): Promise<boolean> {
    try {
      const colis = await this.colisRepository.findOne({
        where: { trackingNumber },
        relations: ['trackingHistory']
      });

      if (!colis) {
        this.logger.error(`Colis non trouvé: ${trackingNumber}`);
        return false;
      }

      // Créer une session de tracking
      this.trackingSessions.set(trackingNumber, {
        colisId: colis.id,
        driverId,
        lastLocation: null,
        subscribers: new Set()
      });

      this.logger.log(`Tracking démarré pour: ${trackingNumber}`);
      return true;
    } catch (error) {
      this.logger.error(`Erreur lors du démarrage du tracking: ${error.message}`);
      return false;
    }
  }

  /**
   * Met à jour la position GPS en temps réel
   */
  async handleLocationUpdate(
    data: LocationUpdate,
    client: any
  ) {
    try {
      const { trackingNumber, latitude, longitude, accuracy, speed, heading, timestamp } = data;

      // Valider les coordonnées
      if (!this.isValidCoordinates(latitude, longitude)) {
        client.emit('error', { message: 'Coordonnées GPS invalides' });
        return;
      }

      // Mettre à jour la session de tracking
      const session = this.trackingSessions.get(trackingNumber);
      if (!session) {
        client.emit('error', { message: 'Session de tracking non trouvée' });
        return;
      }

      const locationUpdate: LocationUpdate = {
        trackingNumber,
        latitude,
        longitude,
        accuracy,
        speed,
        heading,
        timestamp: new Date(timestamp),
        driverId: session.driverId
      };

      session.lastLocation = locationUpdate;

      // Sauvegarder en base de données
      await this.saveLocationUpdate(locationUpdate, trackingNumber);

      // Notifier tous les abonnés
      this.notifySubscribers(trackingNumber, locationUpdate);

      // Mettre à jour le statut du colis si nécessaire
      await this.updateColisStatus(trackingNumber, locationUpdate);

      client.emit('locationUpdated', { success: true });
    } catch (error) {
      this.logger.error(`Erreur mise à jour position: ${error.message}`);
      client.emit('error', { message: 'Erreur lors de la mise à jour de la position' });
    }
  }

  /**
   * S'abonne au tracking d'un colis
   */
  async handleSubscribeTracking(
    data: { trackingNumber: string; userId: string },
    client: any
  ) {
    try {
      const { trackingNumber, userId } = data;

      // Vérifier que le colis existe
      const colis = await this.colisRepository.findOne({
        where: { trackingNumber }
      });

      if (!colis) {
        client.emit('error', { message: 'Colis non trouvé' });
        return;
      }

      // Ajouter l'utilisateur aux abonnés
      const session = this.trackingSessions.get(trackingNumber);
      if (session) {
        session.subscribers.add(userId);
        this.activeConnections.set(userId, client);

        // Envoyer la position actuelle
        if (session.lastLocation) {
          client.emit('locationUpdate', session.lastLocation);
        }

        // Envoyer les informations complètes du tracking
        const trackingInfo = await this.getTrackingInfo(trackingNumber);
        client.emit('trackingInfo', trackingInfo);
      }

      client.emit('subscribed', { trackingNumber });
    } catch (error) {
      this.logger.error(`Erreur abonnement tracking: ${error.message}`);
      client.emit('error', { message: 'Erreur lors de l\'abonnement' });
    }
  }

  /**
   * Se désabonne du tracking
   */
  handleUnsubscribeTracking(
    data: { trackingNumber: string; userId: string },
    client: any
  ) {
    const { trackingNumber, userId } = data;
    const session = this.trackingSessions.get(trackingNumber);
    
    if (session) {
      session.subscribers.delete(userId);
    }
    
    this.activeConnections.delete(userId);
    client.emit('unsubscribed', { trackingNumber });
  }

  /**
   * Récupère les informations complètes de tracking
   */
  async getTrackingInfo(trackingNumber: string): Promise<TrackingStatus> {
    try {
      const colis = await this.colisRepository.findOne({
        where: { trackingNumber },
        relations: ['trackingHistory']
      });

      if (!colis) {
        throw new Error('Colis non trouvé');
      }

      const session = this.trackingSessions.get(trackingNumber);
      const currentLocation = session?.lastLocation;

      // Calculer l'arrivée estimée
      const estimatedArrival = currentLocation ? this.calculateEstimatedArrival(colis, currentLocation) : new Date(Date.now() + 24 * 60 * 60 * 1000);

      // Calculer l'itinéraire
      const route = currentLocation ? await this.calculateRoute(currentLocation, colis.recipientAddress || '') : {
        distance: 0,
        duration: 0,
        waypoints: []
      };

      return {
        trackingNumber,
        status: colis.status,
        currentLocation: currentLocation ? {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude
        } : { latitude: 0, longitude: 0 },
        estimatedArrival,
        driverInfo: undefined, // Pas de relation driver dans l'entité Colis
        route,
        lastUpdate: currentLocation?.timestamp || colis.updatedAt
      };
    } catch (error) {
      this.logger.error(`Erreur récupération tracking info: ${error.message}`);
      throw error;
    }
  }

  /**
   * Calcule l'arrivée estimée
   */
  private calculateEstimatedArrival(colis: Colis, currentLocation: LocationUpdate): Date {
    // Utiliser des coordonnées par défaut si les propriétés n'existent pas
    const destLat = (colis as any).recipientLatitude || -4.2634;
    const destLng = (colis as any).recipientLongitude || 15.2429;
    
    // Calculer la distance restante
    const distance = this.calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      destLat,
      destLng
    );

    // Vitesse moyenne estimée (km/h)
    const averageSpeed = 30; // 30 km/h en ville
    const timeInHours = distance / averageSpeed;
    const estimatedTime = Date.now() + (timeInHours * 60 * 60 * 1000);

    return new Date(estimatedTime);
  }

  /**
   * Calcule l'itinéraire optimisé
   */
  private async calculateRoute(
    currentLocation: LocationUpdate,
    destinationAddress: string
  ): Promise<{ distance: number; duration: number; waypoints: Array<{ lat: number; lng: number }> }> {
    // Simulation d'un calcul d'itinéraire
    // En production, utiliser Google Maps API ou OpenStreetMap
    return {
      distance: 5.2, // km
      duration: 12, // minutes
      waypoints: [
        { lat: currentLocation?.latitude || 0, lng: currentLocation?.longitude || 0 },
        { lat: -4.2634, lng: 15.2429 }, // Brazzaville
        { lat: -4.2634, lng: 15.2429 } // Destination
      ]
    };
  }

  /**
   * Calcule la distance entre deux points
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  /**
   * Valide les coordonnées GPS
   */
  private isValidCoordinates(latitude: number, longitude: number): boolean {
    return latitude >= -90 && latitude <= 90 && 
           longitude >= -180 && longitude <= 180;
  }

  /**
   * Sauvegarde la mise à jour de position
   */
  public async saveLocationUpdate(locationUpdate: LocationUpdate, trackingNumber: string): Promise<void> {
    try {
      // Récupérer le colis par trackingNumber
      const colis = await this.colisRepository.findOne({
        where: { trackingNumber }
      });

      if (!colis) {
        this.logger.error(`Colis non trouvé pour le tracking: ${trackingNumber}`);
        return;
      }

      const tracking = this.trackingRepository.create({
        colisId: colis.id,
        latitude: locationUpdate.latitude,
        longitude: locationUpdate.longitude,
        accuracy: locationUpdate.accuracy,
        speed: locationUpdate.speed,
        heading: locationUpdate.heading,
        timestamp: locationUpdate.timestamp,
        driverId: locationUpdate.driverId
      });

      await this.trackingRepository.save(tracking);
    } catch (error) {
      this.logger.error(`Erreur sauvegarde position: ${error.message}`);
    }
  }

  /**
   * Met à jour le statut du colis
   */
  private async updateColisStatus(trackingNumber: string, locationUpdate: LocationUpdate): Promise<void> {
    try {
      const colis = await this.colisRepository.findOne({
        where: { trackingNumber }
      });

      if (!colis) return;

      // Déterminer le nouveau statut basé sur la position
      const distanceToDestination = this.calculateDistance(
        locationUpdate.latitude,
        locationUpdate.longitude,
        (colis as any).recipientLatitude || 0,
        (colis as any).recipientLongitude || 0
      );

      let newStatus = colis.status;
      if (distanceToDestination < 0.5) { // Moins de 500m
        newStatus = 'out_for_delivery' as any;
      } else if (colis.status === 'pending') {
        newStatus = 'in_transit' as any;
      }

      if (newStatus !== colis.status) {
        colis.status = newStatus;
        await this.colisRepository.save(colis);
        
        // Notifier les abonnés du changement de statut
        this.notifyStatusChange(trackingNumber, newStatus);
      }
    } catch (error) {
      this.logger.error(`Erreur mise à jour statut: ${error.message}`);
    }
  }

  /**
   * Notifie les abonnés d'une mise à jour de position
   */
  private notifySubscribers(trackingNumber: string, locationUpdate: LocationUpdate): void {
    const session = this.trackingSessions.get(trackingNumber);
    if (!session) return;

    session.subscribers.forEach(userId => {
      const client = this.activeConnections.get(userId);
      if (client) {
        client.emit('locationUpdate', locationUpdate);
      }
    });
  }

  /**
   * Notifie les abonnés d'un changement de statut
   */
  private notifyStatusChange(trackingNumber: string, newStatus: string): void {
    const session = this.trackingSessions.get(trackingNumber);
    if (!session) return;

    session.subscribers.forEach(userId => {
      const client = this.activeConnections.get(userId);
      if (client) {
        client.emit('statusChange', { trackingNumber, status: newStatus });
      }
    });
  }

  /**
   * Arrête le tracking pour un colis
   */
  async stopTracking(trackingNumber: string): Promise<void> {
    const session = this.trackingSessions.get(trackingNumber);
    if (session) {
      // Notifier tous les abonnés
      session.subscribers.forEach(userId => {
        const client = this.activeConnections.get(userId);
        if (client) {
          client.emit('trackingStopped', { trackingNumber });
        }
      });

      // Nettoyer la session
      this.trackingSessions.delete(trackingNumber);
    }

    this.logger.log(`Tracking arrêté pour: ${trackingNumber}`);
  }

  /**
   * Gestion de la déconnexion
   */
  handleDisconnect(client: any): void {
    // Nettoyer les connexions
    for (const [userId, socket] of this.activeConnections.entries()) {
      if (socket === client) {
        this.activeConnections.delete(userId);
        break;
      }
    }
  }

  /**
   * Récupère l'historique des positions
   */
  async getTrackingHistory(trackingNumber: string, limit: number = 50, offset: number = 0) {
    try {
      const colis = await this.colisRepository.findOne({
        where: { trackingNumber }
      });

      if (!colis) {
        throw new Error('Colis non trouvé');
      }

      const history = await this.trackingRepository.find({
        where: { colisId: colis.id },
        order: { timestamp: 'DESC' },
        take: limit,
        skip: offset
      });

      return history.map(tracking => ({
        latitude: tracking.latitude,
        longitude: tracking.longitude,
        accuracy: tracking.accuracy,
        speed: tracking.speed,
        heading: tracking.heading,
        timestamp: tracking.timestamp,
        status: tracking.status
      }));
    } catch (error) {
      this.logger.error(`Erreur récupération historique: ${error.message}`);
      throw error;
    }
  }

  /**
   * Récupère les statistiques de tracking
   */
  async getTrackingStats(trackingNumber: string) {
    try {
      const colis = await this.colisRepository.findOne({
        where: { trackingNumber }
      });

      if (!colis) {
        throw new Error('Colis non trouvé');
      }

      const totalUpdates = await this.trackingRepository.count({
        where: { colisId: colis.id }
      });

      const lastUpdate = await this.trackingRepository.findOne({
        where: { colisId: colis.id },
        order: { timestamp: 'DESC' }
      });

      const firstUpdate = await this.trackingRepository.findOne({
        where: { colisId: colis.id },
        order: { timestamp: 'ASC' }
      });

      let totalDistance = 0;
      if (firstUpdate && lastUpdate) {
        totalDistance = this.calculateDistance(
          firstUpdate.latitude,
          firstUpdate.longitude,
          lastUpdate.latitude,
          lastUpdate.longitude
        );
      }

      return {
        totalUpdates,
        totalDistance: Math.round(totalDistance * 100) / 100,
        firstUpdate: firstUpdate?.timestamp,
        lastUpdate: lastUpdate?.timestamp,
        averageSpeed: lastUpdate?.speed || 0
      };
    } catch (error) {
      this.logger.error(`Erreur récupération stats: ${error.message}`);
      throw error;
    }
  }

  /**
   * Optimise l'itinéraire
   */
  async optimizeRoute(
    trackingNumber: string,
    destination: { latitude: number; longitude: number; address: string },
    preferences?: { avoidTolls?: boolean; avoidHighways?: boolean; preferFastest?: boolean }
  ) {
    try {
      const colis = await this.colisRepository.findOne({
        where: { trackingNumber }
      });

      if (!colis) {
        throw new Error('Colis non trouvé');
      }

      const session = this.trackingSessions.get(trackingNumber);
      const currentLocation = session?.lastLocation;

      if (!currentLocation) {
        throw new Error('Position actuelle non disponible');
      }

      // Simulation d'un calcul d'itinéraire optimisé
      const distance = this.calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        destination.latitude,
        destination.longitude
      );

      const duration = distance * 2; // 2 minutes par km en moyenne

      return {
        distance: Math.round(distance * 100) / 100,
        duration: Math.round(duration),
        waypoints: [
          { lat: currentLocation.latitude, lng: currentLocation.longitude },
          { lat: destination.latitude, lng: destination.longitude }
        ],
        preferences: preferences || {}
      };
    } catch (error) {
      this.logger.error(`Erreur optimisation itinéraire: ${error.message}`);
      throw error;
    }
  }

  /**
   * Récupère les chauffeurs disponibles
   */
  async getAvailableDrivers(latitude: number, longitude: number, radius: number = 10) {
    try {
      const drivers = await this.driverRepository.find({
        where: { isActive: true, isAvailable: true }
      });

      // Filtrer par distance
      const nearbyDrivers = drivers.filter(driver => {
        if (!driver.currentLatitude || !driver.currentLongitude) return false;
        
        const distance = this.calculateDistance(
          latitude,
          longitude,
          driver.currentLatitude,
          driver.currentLongitude
        );

        return distance <= radius;
      });

      return nearbyDrivers.map(driver => ({
        id: driver.id,
        name: driver.name,
        phone: driver.phone,
        photo: driver.photo,
        rating: driver.rating,
        distance: this.calculateDistance(
          latitude,
          longitude,
          driver.currentLatitude || 0,
          driver.currentLongitude || 0
        )
      }));
    } catch (error) {
      this.logger.error(`Erreur récupération chauffeurs: ${error.message}`);
      throw error;
    }
  }

  /**
   * Assigne un chauffeur à un colis
   */
  async assignDriver(trackingNumber: string, driverId: string): Promise<boolean> {
    try {
      const colis = await this.colisRepository.findOne({
        where: { trackingNumber }
      });

      if (!colis) {
        throw new Error('Colis non trouvé');
      }

      const driver = await this.driverRepository.findOne({
        where: { id: driverId, isActive: true, isAvailable: true }
      });

      if (!driver) {
        throw new Error('Chauffeur non trouvé ou non disponible');
      }

      // Mettre à jour le colis avec le chauffeur assigné
      (colis as any).driverId = driverId;
      await this.colisRepository.save(colis);

      // Mettre à jour la session de tracking
      const session = this.trackingSessions.get(trackingNumber);
      if (session) {
        session.driverId = driverId;
      }

      this.logger.log(`Chauffeur ${driverId} assigné au colis ${trackingNumber}`);
      return true;
    } catch (error) {
      this.logger.error(`Erreur assignation chauffeur: ${error.message}`);
      return false;
    }
  }
} 