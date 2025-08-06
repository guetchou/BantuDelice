import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { TarificationService, TarifCalculation } from './tarification.service';

@Controller('colis/tarification')
export class TarificationController {
  constructor(private readonly tarificationService: TarificationService) {}

  /**
   * Calcule un tarif personnalisé
   */
  @Post('calculer')
  async calculateTarif(@Body() params: {
    from: string;
    to: string;
    weight: number;
    service: string;
    declaredValue?: number;
    isFragile?: boolean;
    isUrgent?: boolean;
  }): Promise<{
    success: boolean;
    data?: TarifCalculation;
    message: string;
  }> {
    try {
      const tarif = this.tarificationService.calculateTarif(params);
      return {
        success: true,
        data: tarif,
        message: 'Tarif calculé avec succès'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erreur lors du calcul du tarif'
      };
    }
  }

  /**
   * Compare avec la concurrence
   */
  @Post('comparer')
  async compareWithCompetition(@Body() params: {
    from: string;
    to: string;
    weight: number;
    service: string;
  }): Promise<{
    success: boolean;
    data: any;
    message: string;
  }> {
    try {
      const comparison = this.tarificationService.compareWithCompetition(params);
      return {
        success: true,
        data: comparison,
        message: 'Comparaison effectuée avec succès'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message || 'Erreur lors de la comparaison'
      };
    }
  }

  /**
   * Obtient la grille tarifaire complète
   */
  @Get('grille')
  async getTarifGrid(): Promise<{
    success: boolean;
    data: any;
    message: string;
  }> {
    try {
      const grid = this.tarificationService.generateTarifGrid();
      return {
        success: true,
        data: grid,
        message: 'Grille tarifaire récupérée avec succès'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message || 'Erreur lors de la récupération de la grille'
      };
    }
  }

  /**
   * Obtient les zones tarifaires
   */
  @Get('zones')
  async getZones(): Promise<{
    success: boolean;
    data: any;
    message: string;
  }> {
    try {
      const zones = this.tarificationService.getZones();
      return {
        success: true,
        data: zones,
        message: 'Zones tarifaires récupérées avec succès'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message || 'Erreur lors de la récupération des zones'
      };
    }
  }

  /**
   * Obtient les types de service
   */
  @Get('services')
  async getServices(): Promise<{
    success: boolean;
    data: any;
    message: string;
  }> {
    try {
      const services = this.tarificationService.getServiceTypes();
      return {
        success: true,
        data: services,
        message: 'Types de service récupérés avec succès'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message || 'Erreur lors de la récupération des services'
      };
    }
  }

  /**
   * Calcule un tarif rapide (GET pour les calculs simples)
   */
  @Get('rapide')
  async calculateQuickTarif(@Query() params: {
    from: string;
    to: string;
    weight: string;
    service: string;
  }): Promise<{
    success: boolean;
    data?: TarifCalculation;
    message: string;
  }> {
    try {
      const tarif = this.tarificationService.calculateTarif({
        from: params.from,
        to: params.to,
        weight: parseFloat(params.weight),
        service: params.service
      });
      return {
        success: true,
        data: tarif,
        message: 'Tarif calculé avec succès'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erreur lors du calcul du tarif'
      };
    }
  }

  /**
   * Obtient des exemples de tarifs
   */
  @Get('exemples')
  async getExamples(): Promise<{
    success: boolean;
    data: any;
    message: string;
  }> {
    try {
      const examples = [
        {
          title: 'Livraison urbaine',
          description: 'Colis de 2kg dans Brazzaville',
          params: { from: 'Brazzaville', to: 'Brazzaville', weight: 2, service: 'standard' }
        },
        {
          title: 'Livraison interurbaine standard',
          description: 'Colis de 5kg Brazzaville vers Pointe-Noire',
          params: { from: 'Brazzaville', to: 'Pointe-Noire', weight: 5, service: 'standard' }
        },
        {
          title: 'Livraison express',
          description: 'Colis de 5kg Brazzaville vers Pointe-Noire en express',
          params: { from: 'Brazzaville', to: 'Pointe-Noire', weight: 5, service: 'express' }
        },
        {
          title: 'Livraison vers ville secondaire',
          description: 'Colis de 3kg vers Dolisie',
          params: { from: 'Brazzaville', to: 'Dolisie', weight: 3, service: 'standard' }
        },
        {
          title: 'Livraison internationale',
          description: 'Colis de 2kg vers Kinshasa',
          params: { from: 'Brazzaville', to: 'Kinshasa', weight: 2, service: 'express' }
        }
      ];

      const calculatedExamples = examples.map(example => ({
        ...example,
        tarif: this.tarificationService.calculateTarif(example.params)
      }));

      return {
        success: true,
        data: calculatedExamples,
        message: 'Exemples de tarifs récupérés avec succès'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message || 'Erreur lors de la récupération des exemples'
      };
    }
  }
} 