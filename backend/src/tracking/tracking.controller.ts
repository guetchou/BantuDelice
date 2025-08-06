import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, HttpStatus, HttpException } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  /**
   * Démarrer le tracking pour un colis
   */
  @Post('start/:trackingNumber')
  async startTracking(
    @Param('trackingNumber') trackingNumber: string,
    @Body() body: { driverId?: string }
  ) {
    try {
      const success = await this.trackingService.startTracking(trackingNumber, body.driverId);
      
      if (success) {
        return {
          success: true,
          message: 'Tracking démarré avec succès',
          data: { trackingNumber }
        };
      } else {
        throw new HttpException(
          'Impossible de démarrer le tracking',
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors du démarrage du tracking',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Arrêter le tracking pour un colis
   */
  @Post('stop/:trackingNumber')
  async stopTracking(@Param('trackingNumber') trackingNumber: string) {
    try {
      await this.trackingService.stopTracking(trackingNumber);
      
      return {
        success: true,
        message: 'Tracking arrêté avec succès',
        data: { trackingNumber }
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors de l\'arrêt du tracking',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Récupérer les informations de tracking
   */
  @Get(':trackingNumber')
  async getTrackingInfo(@Param('trackingNumber') trackingNumber: string) {
    try {
      const trackingInfo = await this.trackingService.getTrackingInfo(trackingNumber);
      
      return {
        success: true,
        message: 'Informations de tracking récupérées',
        data: trackingInfo
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors de la récupération des informations',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Récupérer l'historique des positions
   */
  @Get(':trackingNumber/history')
  async getTrackingHistory(
    @Param('trackingNumber') trackingNumber: string,
    @Query('limit') limit: string = '50',
    @Query('offset') offset: string = '0'
  ) {
    try {
      // Implémentation de la récupération de l'historique
      const history = await this.trackingService.getTrackingHistory(
        trackingNumber,
        parseInt(limit),
        parseInt(offset)
      );
      
      return {
        success: true,
        message: 'Historique de tracking récupéré',
        data: history
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors de la récupération de l\'historique',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Mettre à jour la position GPS (pour les applications mobiles)
   */
  @Post(':trackingNumber/location')
  async updateLocation(
    @Param('trackingNumber') trackingNumber: string,
    @Body() locationData: {
      latitude: number;
      longitude: number;
      accuracy?: number;
      speed?: number;
      heading?: number;
      altitude?: number;
      timestamp?: string;
    }
  ) {
    try {
      // Validation des données
      if (!locationData.latitude || !locationData.longitude) {
        throw new HttpException(
          'Latitude et longitude requises',
          HttpStatus.BAD_REQUEST
        );
      }

      const locationUpdate = {
        trackingNumber,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        accuracy: locationData.accuracy || 0,
        speed: locationData.speed || 0,
        heading: locationData.heading || 0,
        timestamp: locationData.timestamp ? new Date(locationData.timestamp) : new Date()
      };

      // Sauvegarder la position
      await this.trackingService.saveLocationUpdate(locationUpdate, trackingNumber);

      return {
        success: true,
        message: 'Position mise à jour avec succès',
        data: { timestamp: locationUpdate.timestamp }
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors de la mise à jour de la position',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Récupérer les statistiques de tracking
   */
  @Get(':trackingNumber/stats')
  async getTrackingStats(@Param('trackingNumber') trackingNumber: string) {
    try {
      const stats = await this.trackingService.getTrackingStats(trackingNumber);
      
      return {
        success: true,
        message: 'Statistiques de tracking récupérées',
        data: stats
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors de la récupération des statistiques',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Optimiser l'itinéraire
   */
  @Post(':trackingNumber/optimize-route')
  async optimizeRoute(
    @Param('trackingNumber') trackingNumber: string,
    @Body() routeData: {
      destination: {
        latitude: number;
        longitude: number;
        address: string;
      };
      preferences?: {
        avoidTolls?: boolean;
        avoidHighways?: boolean;
        preferFastest?: boolean;
      };
    }
  ) {
    try {
      const optimizedRoute = await this.trackingService.optimizeRoute(
        trackingNumber,
        routeData.destination,
        routeData.preferences
      );
      
      return {
        success: true,
        message: 'Itinéraire optimisé',
        data: optimizedRoute
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors de l\'optimisation de l\'itinéraire',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Récupérer les chauffeurs disponibles
   */
  @Get('drivers/available')
  async getAvailableDrivers(
    @Query('latitude') latitude: string,
    @Query('longitude') longitude: string,
    @Query('radius') radius: string = '10'
  ) {
    try {
      const drivers = await this.trackingService.getAvailableDrivers(
        parseFloat(latitude),
        parseFloat(longitude),
        parseFloat(radius)
      );
      
      return {
        success: true,
        message: 'Chauffeurs disponibles récupérés',
        data: drivers
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors de la récupération des chauffeurs',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Assigner un chauffeur à un colis
   */
  @Post(':trackingNumber/assign-driver')
  async assignDriver(
    @Param('trackingNumber') trackingNumber: string,
    @Body() body: { driverId: string }
  ) {
    try {
      const success = await this.trackingService.assignDriver(trackingNumber, body.driverId);
      
      if (success) {
        return {
          success: true,
          message: 'Chauffeur assigné avec succès',
          data: { trackingNumber, driverId: body.driverId }
        };
      } else {
        throw new HttpException(
          'Impossible d\'assigner le chauffeur',
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors de l\'assignation du chauffeur',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 