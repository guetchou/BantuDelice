import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import { UserRole } from '../services/api';
import Icons from './ui/IconLibrary';

export const Navigation: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isAdmin, isDriver, isRestaurantOwner, isCustomer } = usePermissions();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const getCustomerNavItems = () => [
    { name: 'Accueil', href: '/', icon: <Icons.star className="w-4 h-4" /> },
    { name: 'Services', href: '/services', icon: <Icons.services className="w-4 h-4" /> },
    { name: 'Mes Commandes', href: '/orders', icon: <Icons.orders className="w-4 h-4" /> },
    { name: 'Mes Favoris', href: '/favorites', icon: <Icons.favorites className="w-4 h-4" /> },
    { name: 'Mon Profil', href: '/profile', icon: <Icons.settings className="w-4 h-4" /> },
  ];

  const getDriverNavItems = () => [
    { name: 'Dashboard', href: '/driver/dashboard', icon: <Icons.car className="w-4 h-4" /> },
    { name: 'Mes Livraisons', href: '/driver/orders', icon: <Icons.orders className="w-4 h-4" /> },
    { name: 'Mon Itinéraire', href: '/driver/routes', icon: <Icons.routes className="w-4 h-4" /> },
    { name: 'Mes Statistiques', href: '/driver/stats', icon: <Icons.settings className="w-4 h-4" /> },
    { name: 'Mon Profil', href: '/profile', icon: <Icons.settings className="w-4 h-4" /> },
  ];

  const getRestaurantOwnerNavItems = () => [
    { name: 'Dashboard', href: '/restaurant/dashboard', icon: <Icons.restaurant className="w-4 h-4" /> },
    { name: 'Mon Restaurant', href: '/restaurant/manage', icon: <Icons.restaurant className="w-4 h-4" /> },
    { name: 'Mon Menu', href: '/restaurant/menu', icon: <Icons.restaurant className="w-4 h-4" /> },
    { name: 'Mes Commandes', href: '/restaurant/orders', icon: <Icons.orders className="w-4 h-4" /> },
    { name: 'Mes Analytics', href: '/restaurant/analytics', icon: <Icons.settings className="w-4 h-4" /> },
    { name: 'Mon Profil', href: '/profile', icon: <Icons.settings className="w-4 h-4" /> },
  ];

  const getAdminNavItems = () => [
    { name: 'Dashboard', href: '/admin/dashboard', icon: <Icons.settings className="w-4 h-4" /> },
    { name: 'Utilisateurs', href: '/admin/users', icon: <Icons.settings className="w-4 h-4" /> },
    { name: 'Services', href: '/admin/services', icon: <Icons.services className="w-4 h-4" /> },
    { name: 'Commandes', href: '/admin/orders', icon: <Icons.orders className="w-4 h-4" /> },
    { name: 'Restaurants', href: '/admin/restaurants', icon: <Icons.restaurant className="w-4 h-4" /> },
    { name: 'Analytics', href: '/admin/analytics', icon: <Icons.settings className="w-4 h-4" /> },
    { name: 'Paiements', href: '/admin/payments', icon: <Icons.mobileMoney className="w-4 h-4" /> },
    { name: 'Configuration', href: '/admin/config', icon: <Icons.wrench className="w-4 h-4" /> },
  ];

  const getNavItems = () => {
    if (isAdmin()) return getAdminNavItems();
    if (isDriver()) return getDriverNavItems();
    if (isRestaurantOwner()) return getRestaurantOwnerNavItems();
    if (isCustomer()) return getCustomerNavItems();
    return [];
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">BantuDelice</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      location.pathname === item.href
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
                
                {/* User Menu */}
                <div className="relative">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-700">
                      Bonjour, {user?.name}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="text-sm text-gray-700 hover:text-indigo-600 transition-colors"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-indigo-600 focus:outline-none focus:text-indigo-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {isAuthenticated ? (
              <>
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors ${
                      location.pathname === item.href
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="px-3 py-2 text-sm text-gray-700">
                    Bonjour, {user?.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:text-indigo-600 transition-colors"
                  >
                    Déconnexion
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-base font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}; 