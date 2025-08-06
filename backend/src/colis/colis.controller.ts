import { Controller, Get, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ColisService, TrackingInfo, TarifCalculation, ExpeditionData } from './colis.service';
import { CreateColisDto } from './dto/create-colis.dto';

@Controller('colis')
export class ColisController {
  constructor(private readonly colisService: ColisService) {}

  /**
   * Endpoint notifications (stub)
   */
  @Get('notifications')
  async getColisNotifications(): Promise<{ success: boolean; data: any[]; message: string }> {
    return {
      success: true,
      data: [],
      message: 'Notifications (stub)'
    };
  }

  /**
   * Endpoint /stats (alias de /statistics)
   */
  @Get('stats')
  async getColisStats(): Promise<{
    success: boolean;
    data: {
      totalColis: number;
      deliveredColis: number;
      inTransitColis: number;
      pendingColis: number;
      revenue: number;
      averageDeliveryTime: number;
    };
    message: string;
  }> {
    return this.getColisStatistics();
  }

  /**
   * Endpoint de santé pour vérifier que le service fonctionne
   */
  @Get('health')
  async healthCheck(): Promise<{
    success: boolean;
    message: string;
    timestamp: string;
  }> {
    return {
      success: true,
      message: 'Service Colis opérationnel',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Récupération des statistiques des colis
   */
  @Get('statistics')
  async getColisStatistics(): Promise<{
    success: boolean;
    data: {
      totalColis: number;
      deliveredColis: number;
      inTransitColis: number;
      pendingColis: number;
      revenue: number;
      averageDeliveryTime: number;
    };
    message: string;
  }> {
    try {
      const statistics = await this.colisService.getColisStatistics();
      return {
        success: true,
        data: statistics,
        message: 'Statistiques récupérées avec succès',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Erreur lors de la récupération des statistiques',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Récupérer toutes les expéditions (pour le dashboard)
   */
  @Get('expeditions')
  async getAllExpeditions(): Promise<{
    success: boolean;
    data: any[];
    message: string;
  }> {
    try {
      const expeditions = await this.colisService.getAllExpeditions();
      return {
        success: true,
        data: expeditions,
        message: 'Toutes les expéditions récupérées avec succès',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Erreur lors de la récupération des expéditions',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Tracking universel - détecte automatiquement le type de colis
   */
  @Get(':trackingNumber')
  async trackParcel(@Param('trackingNumber') trackingNumber: string): Promise<{
    success: boolean;
    data: TrackingInfo;
    message: string;
  }> {
    try {
      const trackingInfo = await this.colisService.trackParcel(trackingNumber);
      return {
        success: true,
        data: trackingInfo,
        message: 'Informations de tracking récupérées avec succès',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Erreur lors du tracking',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Tracking national - format BD123456
   */
  @Get('national/:trackingNumber')
  async trackNationalParcel(@Param('trackingNumber') trackingNumber: string): Promise<{
    success: boolean;
    data: TrackingInfo;
    message: string;
  }> {
    try {
      const trackingInfo = await this.colisService.trackNationalParcel(trackingNumber);
      return {
        success: true,
        data: trackingInfo,
        message: 'Informations de tracking national récupérées avec succès',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Erreur lors du tracking national',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Tracking international - format DHL123456789, UPS123456789, etc.
   */
  @Get('international/:trackingNumber')
  async trackInternationalParcel(@Param('trackingNumber') trackingNumber: string): Promise<{
    success: boolean;
    data: TrackingInfo;
    message: string;
  }> {
    try {
      const trackingInfo = await this.colisService.trackInternationalParcel(trackingNumber);
      return {
        success: true,
        data: trackingInfo,
        message: 'Informations de tracking international récupérées avec succès',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Erreur lors du tracking international',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Calcul des tarifs de livraison
   */
  @Post('tarifs')
  async calculateTarifs(@Body() data: {
    from: string;
    to: string;
    weight: number;
    service: string;
  }): Promise<{
    success: boolean;
    data: TarifCalculation;
    message: string;
  }> {
    try {
      const tarifs = await this.colisService.calculateTarifs(data);
      return {
        success: true,
        data: tarifs,
        message: 'Tarifs calculés avec succès',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Erreur lors du calcul des tarifs',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Création d'une nouvelle expédition
   */
  @Post('expedier')
  async createExpedition(@Body() expeditionData: ExpeditionData): Promise<{
    success: boolean;
    data: { trackingNumber: string; success: boolean };
    message: string;
  }> {
    try {
      console.log('📦 Données d\'expédition reçues:', JSON.stringify(expeditionData, null, 2));
      
      const result = await this.colisService.createExpedition(expeditionData);
      
      console.log('✅ Expédition créée avec succès:', result);
      
      return {
        success: true,
        data: result,
        message: 'Expédition créée avec succès',
      };
    } catch (error) {
      console.error('❌ Erreur lors de la création de l\'expédition:', error);
      console.error('❌ Stack trace:', error.stack);
      
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Erreur lors de la création de l\'expédition',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Ajout d'un événement de tracking
   */
  @Post(':trackingNumber/events')
  async addTrackingEvent(
    @Param('trackingNumber') trackingNumber: string,
    @Body() eventData: {
      status: string;
      description: string;
      location: string;
      icon: string;
      details?: string;
    },
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const result = await this.colisService.addTrackingEvent(trackingNumber, eventData);
      return {
        success: result,
        message: result ? 'Événement ajouté avec succès' : 'Erreur lors de l\'ajout de l\'événement',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Erreur lors de l\'ajout de l\'événement',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Récupération de l'historique des colis d'un utilisateur
   */
  @Get('user/:userId/history')
  async getUserColisHistory(@Param('userId') userId: string): Promise<{
    success: boolean;
    data: any[];
    message: string;
  }> {
    try {
      const history = await this.colisService.getUserColisHistory(userId);
      return {
        success: true,
        data: history,
        message: 'Historique récupéré avec succès',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Erreur lors de la récupération de l\'historique',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Récupération de l'historique des colis de l'utilisateur connecté (par email)
   */
  @Get('history/:userId')
  async getMyColisHistory(@Param('userId') userId: string): Promise<{
    success: boolean;
    data: any[];
    message: string;
  }> {
    try {
      const history = await this.colisService.getUserColisHistory(userId);
      return {
        success: true,
        data: history,
        message: 'Historique récupéré avec succès',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Erreur lors de la récupération de l\'historique',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Créer un colis de test pour le tracking GPS
   */
  @Post('test/create')
  async createTestColis(@Body() createColisDto: CreateColisDto) {
    try {
      const colis = await this.colisService.createColis(createColisDto);
      
      return {
        success: true,
        message: 'Colis de test créé avec succès',
        data: {
          ...colis,
          trackingNumber: colis.trackingNumber
        }
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors de la création du colis de test',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Récupérer les détails d'un colis par numéro de tracking (pour page publique)
   */
  @Get('by-tracking/:trackingNumber')
  async getColisByTrackingNumber(@Param('trackingNumber') trackingNumber: string): Promise<{
    success: boolean;
          data: {
        id: string;
        trackingNumber: string;
        senderName: string;
        recipientName: string;
        packageType: string;
        weightKg: number;
        recipientAddress: string;
        status: string;
        createdAt: Date;
      };
    message: string;
  }> {
    try {
      const colis = await this.colisService.getColisByTrackingNumber(trackingNumber);
      
      if (!colis) {
        throw new HttpException(
          {
            success: false,
            message: 'Colis non trouvé',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        data: {
          id: colis.id,
          trackingNumber: colis.trackingNumber,
          senderName: colis.senderName,
          recipientName: colis.recipientName,
          packageType: colis.packageType,
          weightKg: colis.weightKg,
          recipientAddress: colis.recipientAddress,
          status: colis.status,
          createdAt: colis.createdAt,
        },
        message: 'Détails du colis récupérés avec succès',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Erreur lors de la récupération des détails du colis',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Endpoint pour envoyer les notifications (SMS/Email)
   */
  @Post('notifications/send')
  async sendNotifications(@Body() notificationData: {
    trackingNumber: string;
    senderPhone: string;
    senderEmail?: string;
    recipientPhone: string;
    recipientEmail?: string;
    fromCity: string;
    toCity: string;
    amount: number;
  }): Promise<{
    success: boolean;
    message: string;
    notificationsSent: {
      sms: boolean;
      email: boolean;
    };
  }> {
    try {
      await this.colisService.sendNotifications(notificationData);
      return {
        success: true,
        message: 'Notifications envoyées avec succès',
        notificationsSent: {
          sms: true,
          email: !!notificationData.senderEmail || !!notificationData.recipientEmail
        }
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Erreur lors de l\'envoi des notifications',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
