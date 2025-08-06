import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Get Mapbox access token
   * GET /config/mapbox-token
   * Returns the Mapbox access token for frontend use
   */
  @Get('mapbox-token')
  getMapboxToken() {
    try {
      const mapboxToken = this.configService.get<string>('MAPBOX_ACCESS_TOKEN');
      
      if (!mapboxToken) {
        return {
          error: 'Mapbox token not configured',
          message: 'Le token Mapbox n\'est pas configuré sur le serveur'
        };
      }

      return {
        token: mapboxToken,
        message: 'Token Mapbox récupéré avec succès'
      };
    } catch (error) {
      console.error('Error fetching Mapbox token:', error);
      return {
        error: 'Internal server error',
        message: 'Erreur interne du serveur lors de la récupération du token'
      };
    }
  }

  /**
   * Get public configuration
   * GET /config/public
   * Returns public configuration that can be safely exposed to frontend
   */
  @Get('public')
  getPublicConfig() {
    try {
      return {
        mapboxToken: this.configService.get<string>('MAPBOX_ACCESS_TOKEN') || '',
        environment: this.configService.get<string>('NODE_ENV') || 'development',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching public config:', error);
      return {
        error: 'Internal server error',
        message: 'Erreur interne du serveur'
      };
    }
  }
} 