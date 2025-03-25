
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  superAdminOnly?: boolean;
  restaurantOwnerOnly?: boolean;
  driverOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  adminOnly = false,
  superAdminOnly = false,
  restaurantOwnerOnly = false,
  driverOnly = false
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with return URL
    return <Navigate to={`/auth/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Check for specific permissions
  if (superAdminOnly && user?.role !== 'super_admin') {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && !['admin', 'super_admin'].includes(user?.role || '')) {
    return <Navigate to="/" replace />;
  }

  if (restaurantOwnerOnly && user?.role !== 'restaurant_owner') {
    return <Navigate to="/" replace />;
  }

  if (driverOnly && user?.role !== 'driver') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
