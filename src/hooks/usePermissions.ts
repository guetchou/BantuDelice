import { useAuth } from './useAuth';
import { Permission } from '../services/api';

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permission: Permission): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    if (!user || !user.permissions) return false;
    return permissions.some(permission => user.permissions.includes(permission));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    if (!user || !user.permissions) return false;
    return permissions.every(permission => user.permissions.includes(permission));
  };

  const isRole = (role: string): boolean => {
    return user?.role === role;
  };

  const isAdmin = (): boolean => {
    return isRole('ADMIN');
  };

  const isDriver = (): boolean => {
    return isRole('DRIVER');
  };

  const isRestaurantOwner = (): boolean => {
    return isRole('RESTAURANT_OWNER');
  };

  const isCustomer = (): boolean => {
    return isRole('USER');
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isRole,
    isAdmin,
    isDriver,
    isRestaurantOwner,
    isCustomer,
    userPermissions: user?.permissions || [],
    userRole: user?.role,
  };
}; 