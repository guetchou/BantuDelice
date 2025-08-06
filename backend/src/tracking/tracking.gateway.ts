import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { TrackingService, LocationUpdate } from './tracking.service';

// Types pour les événements WebSocket
export interface WebSocketLocationUpdate {
  trackingNumber: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  altitude?: number;
  timestamp?: string;
  driverId?: string;
}

export interface TrackingSubscription {
  trackingNumber: string;
  userId: string;
}

export interface TrackingUnsubscription {
  trackingNumber: string;
  userId: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:9595",
    methods: ["GET", "POST"],
    credentials: true
  },
  namespace: '/tracking'
})
export class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(TrackingGateway.name);
  private connectedClients = new Map<string, Socket>();

  constructor(private readonly trackingService: TrackingService) {}

  /**
   * Gestion de la connexion d'un client
   */
  handleConnection(client: Socket) {
    this.logger.log(`Client connecté: ${client.id}`);
    this.connectedClients.set(client.id, client);
    
    // Envoyer un message de bienvenue
    client.emit('connected', {
      message: 'Connecté au service de tracking',
      clientId: client.id,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Gestion de la déconnexion d'un client
   */
  handleDisconnect(client: Socket) {
    this.logger.log(`Client déconnecté: ${client.id}`);
    this.connectedClients.delete(client.id);
    
    // Nettoyer les souscriptions du client
    this.trackingService.handleDisconnect(client);
  }

  /**
   * S'abonner au tracking d'un colis
   */
  @SubscribeMessage('subscribeToTracking')
  async handleSubscribeTracking(
    @MessageBody() data: TrackingSubscription,
    @ConnectedSocket() client: Socket
  ) {
    try {
      this.logger.log(`Souscription au tracking: ${data.trackingNumber} par ${data.userId}`);
      
      // Rejoindre la room pour ce colis
      await client.join(`tracking_${data.trackingNumber}`);
      
      // Enregistrer la souscription dans le service
      this.trackingService.handleSubscribeTracking(data, client);
      
      // Récupérer les informations actuelles du tracking
      const trackingInfo = await this.trackingService.getTrackingInfo(data.trackingNumber);
      
      // Envoyer les informations actuelles
      client.emit('trackingInfo', trackingInfo);
      
      // Confirmer la souscription
      client.emit('subscriptionConfirmed', {
        trackingNumber: data.trackingNumber,
        message: 'Abonné au tracking avec succès',
        timestamp: new Date().toISOString()
      });
      
      this.logger.log(`Souscription confirmée pour ${data.trackingNumber}`);
      
    } catch (error) {
      this.logger.error(`Erreur lors de la souscription: ${error.message}`);
      client.emit('subscriptionError', {
        trackingNumber: data.trackingNumber,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Se désabonner du tracking d'un colis
   */
  @SubscribeMessage('unsubscribeFromTracking')
  handleUnsubscribeTracking(
    @MessageBody() data: TrackingUnsubscription,
    @ConnectedSocket() client: Socket
  ) {
    try {
      this.logger.log(`Désabonnement du tracking: ${data.trackingNumber} par ${data.userId}`);
      
      // Quitter la room
      client.leave(`tracking_${data.trackingNumber}`);
      
      // Nettoyer la souscription
      this.trackingService.handleUnsubscribeTracking(data, client);
      
      // Confirmer le désabonnement
      client.emit('unsubscriptionConfirmed', {
        trackingNumber: data.trackingNumber,
        message: 'Désabonné du tracking avec succès',
        timestamp: new Date().toISOString()
      });
      
      this.logger.log(`Désabonnement confirmé pour ${data.trackingNumber}`);
      
    } catch (error) {
      this.logger.error(`Erreur lors du désabonnement: ${error.message}`);
      client.emit('unsubscriptionError', {
        trackingNumber: data.trackingNumber,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Mise à jour de la position (pour les drivers)
   */
  @SubscribeMessage('updateLocation')
  async handleLocationUpdate(
    @MessageBody() data: WebSocketLocationUpdate,
    @ConnectedSocket() client: Socket
  ) {
    try {
      this.logger.log(`Mise à jour position pour ${data.trackingNumber}: ${data.latitude}, ${data.longitude}`);
      
      // Convertir en format LocationUpdate du service
      const locationData: LocationUpdate = {
        trackingNumber: data.trackingNumber,
        latitude: data.latitude,
        longitude: data.longitude,
        accuracy: data.accuracy || 10,
        speed: data.speed || 0,
        heading: data.heading || 0,
        timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
        driverId: data.driverId
      };
      
      await this.trackingService.saveLocationUpdate(locationData, data.trackingNumber);
      
      // Notifier tous les clients abonnés à ce tracking
      this.server.to(`tracking_${data.trackingNumber}`).emit('locationUpdate', {
        ...data,
        timestamp: data.timestamp || new Date().toISOString()
      });
      
      // Confirmer la mise à jour
      client.emit('locationUpdateConfirmed', {
        trackingNumber: data.trackingNumber,
        message: 'Position mise à jour avec succès',
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      this.logger.error(`Erreur lors de la mise à jour de position: ${error.message}`);
      client.emit('locationUpdateError', {
        trackingNumber: data.trackingNumber,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Démarrer le tracking d'un colis
   */
  @SubscribeMessage('startTracking')
  async handleStartTracking(
    @MessageBody() data: { trackingNumber: string; driverId?: string },
    @ConnectedSocket() client: Socket
  ) {
    try {
      this.logger.log(`Démarrage du tracking pour ${data.trackingNumber}`);
      
      const success = await this.trackingService.startTracking(data.trackingNumber, data.driverId);
      
      if (success) {
        // Notifier tous les clients abonnés
        this.server.to(`tracking_${data.trackingNumber}`).emit('trackingStarted', {
          trackingNumber: data.trackingNumber,
          message: 'Tracking démarré',
          timestamp: new Date().toISOString()
        });
        
        client.emit('trackingStartConfirmed', {
          trackingNumber: data.trackingNumber,
          message: 'Tracking démarré avec succès',
          timestamp: new Date().toISOString()
        });
      } else {
        throw new Error('Impossible de démarrer le tracking');
      }
      
    } catch (error) {
      this.logger.error(`Erreur lors du démarrage du tracking: ${error.message}`);
      client.emit('trackingStartError', {
        trackingNumber: data.trackingNumber,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Arrêter le tracking d'un colis
   */
  @SubscribeMessage('stopTracking')
  async handleStopTracking(
    @MessageBody() data: { trackingNumber: string },
    @ConnectedSocket() client: Socket
  ) {
    try {
      this.logger.log(`Arrêt du tracking pour ${data.trackingNumber}`);
      
      await this.trackingService.stopTracking(data.trackingNumber);
      
      // Notifier tous les clients abonnés
      this.server.to(`tracking_${data.trackingNumber}`).emit('trackingStopped', {
        trackingNumber: data.trackingNumber,
        message: 'Tracking arrêté',
        timestamp: new Date().toISOString()
      });
      
      client.emit('trackingStopConfirmed', {
        trackingNumber: data.trackingNumber,
        message: 'Tracking arrêté avec succès',
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      this.logger.error(`Erreur lors de l'arrêt du tracking: ${error.message}`);
      client.emit('trackingStopError', {
        trackingNumber: data.trackingNumber,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Demander les informations de tracking
   */
  @SubscribeMessage('getTrackingInfo')
  async handleGetTrackingInfo(
    @MessageBody() data: { trackingNumber: string },
    @ConnectedSocket() client: Socket
  ) {
    try {
      this.logger.log(`Demande d'informations de tracking pour ${data.trackingNumber}`);
      
      const trackingInfo = await this.trackingService.getTrackingInfo(data.trackingNumber);
      
      client.emit('trackingInfo', trackingInfo);
      
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération des informations: ${error.message}`);
      client.emit('trackingInfoError', {
        trackingNumber: data.trackingNumber,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Demander l'historique de tracking
   */
  @SubscribeMessage('getTrackingHistory')
  async handleGetTrackingHistory(
    @MessageBody() data: { trackingNumber: string; limit?: number; offset?: number },
    @ConnectedSocket() client: Socket
  ) {
    try {
      this.logger.log(`Demande d'historique de tracking pour ${data.trackingNumber}`);
      
      const history = await this.trackingService.getTrackingHistory(
        data.trackingNumber,
        data.limit || 50,
        data.offset || 0
      );
      
      client.emit('trackingHistory', {
        trackingNumber: data.trackingNumber,
        history,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération de l'historique: ${error.message}`);
      client.emit('trackingHistoryError', {
        trackingNumber: data.trackingNumber,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Ping/Pong pour maintenir la connexion
   */
  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket) {
    client.emit('pong', {
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Méthode utilitaire pour envoyer des notifications
   */
  sendNotification(trackingNumber: string, event: string, data: any) {
    this.server.to(`tracking_${trackingNumber}`).emit(event, {
      ...data,
      trackingNumber,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Méthode utilitaire pour obtenir le nombre de clients connectés
   */
  getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }
} 