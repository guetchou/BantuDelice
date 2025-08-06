import { Controller, Get, Put, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, Permissions } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/entities/user.entity';
import { Permission } from '../common/enums/permissions.enum';

@Controller('drivers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DRIVER)
export class DriversController {
  constructor() {}

  @Get('orders')
  @Permissions(Permission.VIEW_DRIVER_ORDERS)
  async getDriverOrders(@Request() req) {
    // Logique pour récupérer les commandes du chauffeur
    return {
      message: 'Commandes du chauffeur',
      driverId: req.user.id,
      orders: []
    };
  }

  @Put('orders/:orderId/status')
  @Permissions(Permission.UPDATE_ORDER_STATUS)
  async updateOrderStatus(@Request() req, @Body() statusData: any) {
    // Logique pour mettre à jour le statut d'une commande
    return {
      message: 'Statut de commande mis à jour',
      orderId: statusData.orderId,
      status: statusData.status
    };
  }

  @Post('location')
  @Permissions(Permission.UPDATE_LOCATION)
  async updateLocation(@Request() req, @Body() locationData: any) {
    // Logique pour mettre à jour la position du chauffeur
    return {
      message: 'Position mise à jour',
      driverId: req.user.id,
      location: locationData
    };
  }

  @Get('routes')
  @Permissions(Permission.VIEW_DELIVERY_ROUTES)
  async getDeliveryRoutes(@Request() req) {
    // Logique pour récupérer les itinéraires de livraison
    return {
      message: 'Itinéraires de livraison',
      driverId: req.user.id,
      routes: []
    };
  }
} 