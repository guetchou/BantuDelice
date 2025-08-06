import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import {
  Search,
  QrCode,
  Bell,
  User,
  Menu,
  X,
  Package,
  Truck,
  Calculator,
  BarChart3,
  Home,
  ChevronDown,
  LogOut,
  Settings,
  ScanLine,
  PackageCheck,
  ArrowLeft
} from 'lucide-react';
import { useColisAuth } from '@/context/ColisAuthContext';

const NavbarColis: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Effet pour le shadow au scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effet pour fermer le menu utilisateur au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const navItems = [
    { path: '/colis/expedition', label: 'Expédier', icon: Package, badge: 'Nouveau' },
    { path: '/colis/tracking', label: 'Suivi', icon: Truck },
    { path: '/colis/tarifs', label: 'Tarifs', icon: Calculator },
    { path: '/colis/dashboard', label: 'Dashboard', icon: BarChart3 },
  ];

  const isActiveRoute = (path: string, exact = false) => 
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/colis/tracking?code=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  // Get user data from authentication context
  const { user, isAuthenticated, logout } = useColisAuth();
  
  const currentUser = {
    name: user?.name || 'Utilisateur',
    email: user?.email || '',
    avatar: '/images/avatars/user-01.jpg'
  };

  return (
    <nav className={`sticky top-0 z-50 w-full backdrop-blur-xl bg-white/30 border-b border-white/20 shadow-lg transition-all duration-300 ${scrolled ? 'bg-white/40' : ''}`}>
      <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 xl:px-6">
        <div className="relative flex items-center justify-between h-16 min-w-0">
          
          {/* SECTION GAUCHE - Logo poussé à l'extrême gauche */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 mr-auto">
            {/* Logo cliquable vers /colis */}
            <Link 
              to="/colis" 
              className="flex items-center gap-1 sm:gap-2 group"
              aria-label=""
            >
              <div className="relative">
                <img
                  src="/images/logo/logo.png"
                  alt=""
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border-2 border-orange-400 shadow-lg group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
                  <PackageCheck className="h-2 w-2 sm:h-3 sm:w-3 text-white" />
                </div>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xs text-orange-500 font-medium">Colis</span>
              </div>
            </Link>

            {/* Lien retour au site principal */}
            <Link
              to="/"
              className="hidden sm:flex items-center gap-1 px-2 py-2 text-sm text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-lg transition-all duration-200 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden lg:inline">Retour au site</span>
            </Link>
          </div>

          {/* SECTION CENTRE - Navigation principale centrée */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center mx-4 xl:mx-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1 px-3 xl:px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm relative group flex-shrink-0 ${
                  isActiveRoute(item.path)
                    ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-lg'
                    : 'text-orange-700 hover:text-orange-900 hover:bg-orange-50/50'
                }`}
                aria-current={isActiveRoute(item.path) ? 'page' : undefined}
              >
                <item.icon className={`h-4 w-4 xl:h-5 xl:w-5 ${isActiveRoute(item.path) ? 'text-white' : 'text-orange-600 group-hover:text-orange-800'}`} />
                <span className="whitespace-nowrap">{item.label}</span>
                {item.badge && (
                  <Badge 
                    className={`ml-1 ${isActiveRoute(item.path) ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-700'} text-xs px-1 xl:px-2 py-0.5 rounded-full`}
                  >
                    {item.badge}
                  </Badge>
                )}
                {!isActiveRoute(item.path) && (
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-orange-400 group-hover:w-4/5 group-hover:left-[10%] transition-all duration-300"></span>
                )}
              </Link>
            ))}
          </div>

          {/* SECTION DROITE - Actions utilisateur */}
          <div className="flex items-center gap-1 lg:gap-2 flex-shrink-0 min-w-0">
            {/* Recherche avancée */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center gap-1">
              <div className="relative w-40 xl:w-48 transition-all duration-300 focus-within:w-44 xl:focus-within:w-52">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="N° de suivi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-orange-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent w-full bg-white/80 backdrop-blur-sm"
                  maxLength={30}
                  aria-label="Rechercher un colis"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button 
                type="submit" 
                size="sm" 
                className="bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white font-semibold px-3 xl:px-4 shadow-md hover:shadow-lg transition-all text-xs xl:text-sm"
              >
                Suivre
              </Button>
            </form>

            {/* Séparateur visuel */}
            <div className="hidden md:block w-px h-8 bg-orange-200"></div>

            {/* Scanner QR Code */}
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-orange-300 text-orange-700 hover:bg-orange-50 hover:text-orange-800 hidden sm:flex"
                  aria-label="Scanner un QR code"
                >
                  <ScanLine className="h-4 w-4 mr-1" />
                  <span className="hidden xl:inline">Scanner</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-orange-700 flex items-center gap-2">
                    <QrCode className="h-5 w-5" />
                    <span>Scanner un colis</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="text-center py-4">
                  <div className="w-48 h-48 mx-auto mb-6 border-2 border-dashed border-orange-300 rounded-lg flex items-center justify-center bg-orange-50/50">
                    <QrCode className="h-16 w-16 text-orange-400 opacity-70" />
                  </div>
                  <p className="text-gray-600 mb-6">Scannez le QR code d'un colis pour accéder à son suivi</p>
                  <div className="flex gap-3 justify-center">
                    <Button className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-md">
                      Activer la caméra
                    </Button>
                    <Button variant="outline" className="border-orange-300">
                      Entrer manuellement
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Séparateur visuel */}
            <div className="hidden md:block w-px h-8 bg-orange-200"></div>

            {/* Notifications */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-orange-700 hover:text-orange-900 relative"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center animate-pulse">
                    {notifications}
                  </span>
                )}
              </Button>
            </div>

            {/* Séparateur visuel */}
            <div className="hidden md:block w-px h-8 bg-orange-200"></div>

            {/* Menu utilisateur */}
            <div className="relative" ref={userMenuRef}>
              {isAuthenticated ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-orange-700 hover:text-orange-900 flex items-center gap-1 lg:gap-2"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  aria-expanded={isUserMenuOpen}
                  aria-label="Menu utilisateur"
                >
                  {currentUser.avatar ? (
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name} 
                      className="w-7 h-7 lg:w-8 lg:h-8 rounded-full object-cover border-2 border-orange-200"
                    />
                  ) : (
                    <div className="w-7 h-7 lg:w-8 lg:h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <User className="h-3 w-3 lg:h-4 lg:w-4 text-orange-600" />
                    </div>
                  )}
                  <span className="hidden xl:block text-sm font-medium truncate max-w-[100px]">
                    {currentUser.name}
                  </span>
                  <ChevronDown className={`h-3 w-3 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-orange-700 hover:text-orange-900 flex items-center gap-1 lg:gap-2"
                  onClick={() => navigate('/colis/auth')}
                  aria-label="Se connecter"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden xl:block text-sm font-medium">Se connecter</span>
                </Button>
              )}
              
              {isUserMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-orange-100 py-2 z-50 animate-in fade-in zoom-in-95"
                >
                  <div className="px-4 py-3 border-b border-orange-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{currentUser.name}</p>
                    <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/colis/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <BarChart3 className="h-4 w-4 mr-3 text-orange-500" />
                      Mon Dashboard
                    </Link>
                  </div>
                  <div className="border-t border-orange-100 py-1">
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 transition-colors">
                      <Settings className="h-4 w-4 mr-3 text-orange-500" />
                      Paramètres
                    </button>
                    <button 
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                        navigate('/colis');
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bouton menu mobile */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-orange-700 hover:text-orange-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu mobile"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-lg border-t border-orange-200 animate-in slide-in-from-top">
          <div className="px-4 py-4 space-y-4">
            {/* Lien retour au site principal (mobile) */}
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-3 text-sm text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-lg transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Retour au site principal</span>
            </Link>

            {/* Recherche mobile */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="N° de suivi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-orange-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 w-full bg-white"
                  maxLength={30}
                  aria-label="Rechercher un colis (mobile)"
                />
              </div>
              <Button 
                type="submit" 
                size="sm" 
                className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-md"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>

            {/* Navigation mobile */}
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                    isActiveRoute(item.path)
                      ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-md'
                      : 'text-orange-700 hover:text-orange-900 hover:bg-orange-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-current={isActiveRoute(item.path) ? 'page' : undefined}
                >
                  <item.icon className={`h-5 w-5 ${isActiveRoute(item.path) ? 'text-white' : 'text-orange-600'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge 
                      className={`ml-auto ${isActiveRoute(item.path) ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-700'} text-xs px-2 py-0.5 rounded-full`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>

            {/* Section utilisateur mobile */}
            <div className="border-t border-orange-100 pt-4 space-y-1">
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                <p className="text-xs text-gray-500">{currentUser.email}</p>
              </div>
              <Link
                to="/colis/dashboard"
                className="flex items-center px-3 py-3 text-sm text-orange-700 hover:bg-orange-50 transition-colors rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BarChart3 className="h-5 w-5 mr-3 text-orange-600" />
                Mon Dashboard
              </Link>
              <button className="flex items-center w-full px-3 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-lg">
                <Settings className="h-5 w-5 mr-3 text-gray-600" />
                Paramètres
              </button>
              <button 
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                  navigate('/colis');
                }}
                className="flex items-center w-full px-3 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-lg"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarColis;