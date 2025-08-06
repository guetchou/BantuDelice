import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../entities/user.entity';
import { Permission } from '../enums/permissions.enum';

export const ROLES_KEY = 'roles';
export const PERMISSIONS_KEY = 'permissions';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
export const Permissions = (...permissions: Permission[]) => SetMetadata(PERMISSIONS_KEY, permissions); 