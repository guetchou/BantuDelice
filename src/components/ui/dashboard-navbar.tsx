import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Package, 
  Truck, 
  Calculator, 
  User, 
  LogOut, 
  Bell, 
  Settings,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useColisAuth } from '@/context/ColisAuthContext';
import { toast } from 'sonner';

interface DashboardNavbarProps {
  className?: string;
}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({ className = "" }) => {
  const { user, isAuthenticated, logout } = useColisAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(3); // Simulé

  const handleLogout = () => {
    logout();
    toast.success('Déconnexion réussie');
  };

  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [
      { name: 'Accueil', path: '/', icon: Home }
    ];

    if (pathSegments.includes('colis')) {
      breadcrumbs.push({ name: 'Colis', path: '/colis', icon: Package });
      
      if (pathSegments.includes('dashboard')) {
        breadcrumbs.push({ name: 'Dashboard', path: '/colis/dashboard', icon: Package });
      } else if (pathSegments.includes('expedition')) {
        breadcrumbs.push({ name: 'Nouvelle expédition', path: '/colis/expedition', icon: Truck });
      } else if (pathSegments.includes('tracking')) {
        breadcrumbs.push({ name: 'Suivi', path: '/colis/tracking', icon: Truck });
      }
    }

    return breadcrumbs;
  };

  const navigationItems = [
    { name: 'Accueil', path: '/', icon: Home },
    { name: 'Dashboard', path: '/colis/dashboard', icon: Package },
    { name: 'Nouvelle expédition', path: '/colis/expedition', icon: Truck },
    { name: 'Suivi colis', path: '/colis/tracking', icon: Truck },
    { name: 'Calcul tarif', path: '/colis/tarification', icon: Calculator },
  ];

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className={`bg-white border-b border-gray-200 shadow-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo et navigation principale */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold text-gray-900">BantuDelice</span>
            </Link>
            
            {/* Breadcrumbs - Desktop */}
            <div className="hidden md:flex items-center ml-8 space-x-2">
              {breadcrumbs.map((breadcrumb, index) => (
                <React.Fragment key={breadcrumb.path}>
                  <Link
                    to={breadcrumb.path}
                    className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <breadcrumb.icon className="h-4 w-4 mr-1" />
                    {breadcrumb.name}
                  </Link>
                  {index < breadcrumbs.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-orange-100 text-orange-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* Actions utilisateur */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {notificationsCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
                >
                  {notificationsCount > 9 ? '9+' : notificationsCount}
                </Badge>
              )}
            </Button>

            {/* Profil utilisateur */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
                <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-orange-600" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Link to="/colis/auth">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Se connecter
                </Button>
              </Link>
            )}

            {/* Menu mobile */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.name}
                </Link>
              ))}
              
              {/* Breadcrumbs mobile */}
              <div className="px-3 py-2">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  {breadcrumbs.map((breadcrumb, index) => (
                    <React.Fragment key={breadcrumb.path}>
                      <Link
                        to={breadcrumb.path}
                        className="flex items-center hover:text-gray-700"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <breadcrumb.icon className="h-3 w-3 mr-1" />
                        {breadcrumb.name}
                      </Link>
                      {index < breadcrumbs.length - 1 && (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default DashboardNavbar; 