import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../entities/user.entity';
import { Permission, RolePermissions } from '../enums/permissions.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>('permissions', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles && !requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user) {
      return false;
    }

    // Check roles
    if (requiredRoles && !requiredRoles.includes(user.role)) {
      return false;
    }

    // Check permissions
    if (requiredPermissions) {
      const userPermissions = RolePermissions[user.role] || [];
      return requiredPermissions.every(permission => userPermissions.includes(permission));
    }

    return true;
  }
} 