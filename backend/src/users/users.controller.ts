import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, Permissions } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/entities/user.entity';
import { Permission } from '../common/enums/permissions.enum';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @Permissions(Permission.VIEW_PROFILE)
  async getProfile(@Request() req) {
    return this.usersService.findById(req.user.id);
  }

  @Put('profile')
  @Permissions(Permission.UPDATE_PROFILE)
  async updateProfile(@Request() req, @Body() updateData: any) {
    return this.usersService.update(req.user.id, updateData);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @Permissions(Permission.MANAGE_USERS)
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Get('drivers')
  @Roles(UserRole.ADMIN)
  @Permissions(Permission.MANAGE_USERS)
  async getDrivers() {
    return this.usersService.findByRole(UserRole.DRIVER);
  }

  @Get('restaurant-owners')
  @Roles(UserRole.ADMIN)
  @Permissions(Permission.MANAGE_USERS)
  async getRestaurantOwners() {
    return this.usersService.findByRole(UserRole.RESTAURANT_OWNER);
  }

  @Get('customers')
  @Roles(UserRole.ADMIN)
  @Permissions(Permission.MANAGE_USERS)
  async getCustomers() {
    return this.usersService.findByRole(UserRole.USER);
  }
} 