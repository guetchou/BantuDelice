import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards, 
  Request,
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TaxiService, CreateRideRequest, RideEstimate } from './taxi.service';
import { TaxiRide, TaxiRideStatus, VehicleType, PaymentMethod } from './entities/taxi-ride.entity';
import { Vehicle } from './entities/vehicle.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/entities/user.entity';

@ApiTags('taxi')
@Controller('taxi')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TaxiController {
  constructor(private readonly taxiService: TaxiService) {}

  @Post('rides')
  @ApiOperation({ summary: 'Créer une nouvelle course' })
  @ApiResponse({ status: 201, description: 'Course créée avec succès' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async createRide(@Body() createRideRequest: CreateRideRequest, @Request() req): Promise<TaxiRide> {
    return this.taxiService.createRide({
      ...createRideRequest,
      userId: req.user.id,
    });
  }

  @Get('rides/:id')
  @ApiOperation({ summary: 'Obtenir les détails d\'une course' })
  @ApiResponse({ status: 200, description: 'Détails de la course' })
  @ApiResponse({ status: 404, description: 'Course non trouvée' })
  async getRide(@Param('id') rideId: string): Promise<TaxiRide> {
    return this.taxiService.getRideById(rideId);
  }

  @Get('rides')
  @ApiOperation({ summary: 'Obtenir les courses de l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Liste des courses' })
  async getUserRides(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.taxiService.getUserRides(req.user.id, page, limit);
  }

  @Get('driver/rides')
  @Roles(UserRole.DRIVER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Obtenir les courses du chauffeur' })
  @ApiResponse({ status: 200, description: 'Liste des courses du chauffeur' })
  async getDriverRides(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.taxiService.getDriverRides(req.user.id, page, limit);
  }

  @Put('rides/:id/status')
  @ApiOperation({ summary: 'Mettre à jour le statut d\'une course' })
  @ApiResponse({ status: 200, description: 'Statut mis à jour' })
  @ApiResponse({ status: 404, description: 'Course non trouvée' })
  async updateRideStatus(
    @Param('id') rideId: string,
    @Body('status') status: TaxiRideStatus,
    @Body('driverId') driverId?: string,
    @Request() req?
  ) {
    // Only drivers can update ride status
    if (req?.user?.role === UserRole.DRIVER) {
      return this.taxiService.updateRideStatus(rideId, status, req.user.id);
    }
    return this.taxiService.updateRideStatus(rideId, status, driverId);
  }

  @Delete('rides/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Annuler une course' })
  @ApiResponse({ status: 204, description: 'Course annulée' })
  @ApiResponse({ status: 400, description: 'Impossible d\'annuler cette course' })
  async cancelRide(@Param('id') rideId: string, @Request() req): Promise<void> {
    await this.taxiService.cancelRide(rideId, req.user.id);
  }

  @Post('rides/:id/rate')
  @ApiOperation({ summary: 'Évaluer une course' })
  @ApiResponse({ status: 200, description: 'Évaluation enregistrée' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async rateRide(
    @Param('id') rideId: string,
    @Body() ratingData: {
      rating: number;
      comment?: string;
      categories?: {
        cleanliness?: number;
        punctuality?: number;
        service?: number;
        safety?: number;
      };
    },
    @Request() req
  ): Promise<TaxiRide> {
    return this.taxiService.rateRide(
      rideId,
      ratingData.rating,
      ratingData.comment,
      ratingData.categories
    );
  }

  @Post('estimate')
  @ApiOperation({ summary: 'Calculer une estimation de course' })
  @ApiResponse({ status: 200, description: 'Estimation calculée' })
  async calculateEstimate(
    @Body() estimateRequest: {
      pickupLatitude: number;
      pickupLongitude: number;
      destinationLatitude: number;
      destinationLongitude: number;
      vehicleType: VehicleType;
    }
  ): Promise<RideEstimate> {
    return this.taxiService.calculateRideEstimate(
      estimateRequest.pickupLatitude,
      estimateRequest.pickupLongitude,
      estimateRequest.destinationLatitude,
      estimateRequest.destinationLongitude,
      estimateRequest.vehicleType
    );
  }

  @Get('drivers/nearby')
  @ApiOperation({ summary: 'Trouver les chauffeurs à proximité' })
  @ApiResponse({ status: 200, description: 'Liste des chauffeurs' })
  async findNearbyDrivers(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('vehicleType') vehicleType: VehicleType,
    @Query('radius') radius: number = 5
  ): Promise<Vehicle[]> {
    return this.taxiService.findNearbyDrivers(latitude, longitude, vehicleType, radius);
  }

  @Post('drivers/:driverId/assign')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Assigner un chauffeur à une course' })
  @ApiResponse({ status: 200, description: 'Chauffeur assigné' })
  async assignDriver(
    @Param('driverId') driverId: string,
    @Body('rideId') rideId: string
  ): Promise<TaxiRide> {
    return this.taxiService.assignDriverToRide(rideId, driverId);
  }

  @Post('drivers/location')
  @Roles(UserRole.DRIVER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Mettre à jour la position du chauffeur' })
  @ApiResponse({ status: 200, description: 'Position mise à jour' })
  async updateDriverLocation(
    @Request() req,
    @Body() locationData: {
      latitude: number;
      longitude: number;
    }
  ): Promise<void> {
    await this.taxiService.updateDriverLocation(
      req.user.id,
      locationData.latitude,
      locationData.longitude
    );
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Obtenir les statistiques des courses' })
  @ApiResponse({ status: 200, description: 'Statistiques' })
  async getStatistics(
    @Query('userId') userId?: string,
    @Query('driverId') driverId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string
  ) {
    const fromDate = dateFrom ? new Date(dateFrom) : undefined;
    const toDate = dateTo ? new Date(dateTo) : undefined;
    
    return this.taxiService.getRideStatistics(userId, driverId, fromDate, toDate);
  }

  @Get('pricing')
  @ApiOperation({ summary: 'Obtenir les tarifs' })
  @ApiResponse({ status: 200, description: 'Liste des tarifs' })
  async getPricing(@Query('vehicleType') vehicleType?: VehicleType) {
    // This would typically call a pricing service
    return {
      standard: {
        basePrice: 500,
        pricePerKm: 150,
        pricePerMinute: 10,
        minimumFare: 1000,
        currency: 'XAF'
      },
      comfort: {
        basePrice: 800,
        pricePerKm: 200,
        pricePerMinute: 15,
        minimumFare: 1500,
        currency: 'XAF'
      },
      premium: {
        basePrice: 1200,
        pricePerKm: 300,
        pricePerMinute: 20,
        minimumFare: 2000,
        currency: 'XAF'
      },
      van: {
        basePrice: 1500,
        pricePerKm: 250,
        pricePerMinute: 18,
        minimumFare: 2500,
        currency: 'XAF'
      }
    };
  }
} 