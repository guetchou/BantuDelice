import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Package, 
  Home, 
  Search, 
  QrCode, 
  Bell, 
  User, 
  Menu, 
  X, 
  Truck, 
  Calculator, 
  FileText, 
  BarChart3, 
  HelpCircle, 
  Shield, 
  Building, 
  Plus, 
  MapPin, 
  Clock, 
  CheckCircle, 
  ChevronDown,
  ArrowLeft,
  Settings,
  LogOut
} from 'lucide-react';

interface UnifiedNavigationProps {
  children: React.ReactNode;
}

const UnifiedNavigation: React.FC<UnifiedNavigationProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isColisContext = location.pathname.startsWith('/colis');

  // Navigation principale
  const mainNavigation = [
    { path: '/', label: 'Accueil', icon: Home, description: 'Page d\'accueil' },
    { path: '/restaurants', label: 'Restaurants', icon: Package, description: 'Commander des repas' },
    { path: '/taxi', label: 'Taxi', icon: Truck, description: 'Réserver un taxi' },
    { path: '/covoiturage', label: 'Covoiturage', icon: MapPin, description: 'Partager des trajets' },
    { path: '/services', label: 'Services', icon: Settings, description: 'Services professionnels' },
  ];

  // Navigation Colis
  const colisNavigation = [
    { path: '/colis', label: 'Accueil Colis', icon: Home, description: 'Page d\'accueil' },
    { path: '/colis/expedition', label: 'Expédier', icon: Package, description: 'Envoyer un colis', badge: 'Nouveau' },
    { path: '/colis/tracking', label: 'Suivi', icon: Truck, description: 'Suivre vos colis' },
    { path: '/colis/tarifs', label: 'Tarifs', icon: Calculator, description: 'Calculer les prix' },
    { path: '/colis/historique', label: 'Historique', icon: FileText, description: 'Historique des envois' },
    { path: '/colis/dashboard', label: 'Dashboard', icon: BarChart3, description: 'Tableau de bord' },
    { path: '/colis/support', label: 'Support', icon: HelpCircle, description: 'Support client' },
    { path: '/colis/restrictions', label: 'Restrictions', icon: Shield, description: 'Articles interdits' },
  ];

  const isActiveRoute = (path: string) => {
    if (path === '/colis' || path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (isColisContext) {
        navigate(`/colis/tracking?code=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      }
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const currentUser = {
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    role: 'user',
    avatar: '/images/avatar-placeholder.png'
  };

  const NavigationHeader = () => (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md border-b border-orange-200 shadow-lg' 
        : 'bg-white/90 backdrop-blur border-b border-orange-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo et titre */}
          <div className="flex items-center gap-3">
            <Link to={isColisContext ? "/colis" : "/"} className="flex items-center gap-3 group">
              <div className="relative">
                <img 
                  src="/images/logo/logo.png" 
                  alt="BantuDelice" 
                  className="h-10 w-10 rounded-full border-2 border-orange-400 shadow-lg group-hover:scale-105 transition-transform" 
                />
                {isColisContext && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-orange-700 text-lg">BantuDelice</span>
                {isColisContext && (
                  <span className="text-sm text-orange-600 font-medium">Colis</span>
                )}
              </div>
            </Link>
          </div>

          {/* Navigation desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {(isColisContext ? colisNavigation : mainNavigation).map((item) => {
              const isActive = isActiveRoute(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 group ${
                    isActive 
                      ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-lg' 
                      : 'text-orange-700 hover:text-orange-900 hover:bg-orange-50'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge className="ml-1 bg-white/20 text-white text-xs">
                      {item.badge}
                    </Badge>
                  )}
                  {!isActive && (
                    <div className="absolute inset-0 bg-orange-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Recherche rapide */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder={isColisContext ? "Numéro de suivi..." : "Rechercher..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-48"
                />
              </div>
              <Button type="submit" size="sm" className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white">
                {isColisContext ? 'Suivre' : 'Rechercher'}
              </Button>
            </form>

            {/* QR Code Scanner (Colis uniquement) */}
            {isColisContext && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="border-orange-300 text-orange-700 hover:bg-orange-50">
                    <QrCode className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Scanner QR Code</DialogTitle>
                  </DialogHeader>
                  <div className="text-center py-8">
                    <div className="w-32 h-32 mx-auto mb-4 border-2 border-dashed border-orange-300 rounded-lg flex items-center justify-center">
                      <QrCode className="h-12 w-12 text-orange-400" />
                    </div>
                    <p className="text-gray-600 mb-4">Scanner un QR code pour suivre un colis</p>
                    <Button className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white">
                      Activer la caméra
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {/* Notifications */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-orange-700 hover:text-orange-900 relative"
                onClick={() => navigate(isColisContext ? '/colis/support' : '/notifications')}
              >
                <Bell className="h-4 w-4" />
                {notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {notifications}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Menu utilisateur */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="text-orange-700 hover:text-orange-900 flex items-center gap-2"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-orange-600" />
                </div>
                <span className="hidden md:block text-sm font-medium">{currentUser.name}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>

              {/* Dropdown menu utilisateur */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-orange-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-orange-100">
                    <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                    <p className="text-sm text-gray-500">{currentUser.email}</p>
                  </div>
                  
                  <div className="py-1">
                    {isColisContext ? (
                      <>
                        <Link
                          to="/colis/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <BarChart3 className="h-4 w-4 mr-3" />
                          Mon Dashboard
                        </Link>
                        <Link
                          to="/colis/historique"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FileText className="h-4 w-4 mr-3" />
                          Mes Colis
                        </Link>
                      </>
                    ) : (
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-3" />
                        Mon Profil
                      </Link>
                    )}
                    
                    <Link
                      to={isColisContext ? "/colis/support" : "/help"}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <HelpCircle className="h-4 w-4 mr-3" />
                      Support
                    </Link>
                  </div>
                  
                  <div className="border-t border-orange-100 py-1">
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-orange-50">
                      <Settings className="h-4 w-4 mr-3" />
                      Paramètres
                    </button>
                    <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <LogOut className="h-4 w-4 mr-3" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Menu mobile */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-orange-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Menu mobile étendu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur border-t border-orange-200">
            <div className="px-4 py-4 space-y-4">
              {/* Recherche mobile */}
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  type="text"
                  placeholder={isColisContext ? "Numéro de suivi..." : "Rechercher..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="sm" className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white">
                  <Search className="h-4 w-4" />
                </Button>
              </form>

              {/* Navigation mobile */}
              <div className="space-y-1">
                {(isColisContext ? colisNavigation : mainNavigation).map((item) => {
                  const isActive = isActiveRoute(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-lg' 
                          : 'text-orange-700 hover:text-orange-900 hover:bg-orange-50'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge className="ml-auto bg-white/20 text-white text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Lien de contexte */}
              <div className="border-t border-orange-100 pt-3">
                <Link
                  to={isColisContext ? "/" : "/colis"}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-orange-700 hover:text-orange-900 hover:bg-orange-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ArrowLeft className="h-4 w-4" />
                  {isColisContext ? "Retour au site principal" : "Aller au module Colis"}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );

  return (
    <>
      <NavigationHeader />
      {children}
    </>
  );
};

export default UnifiedNavigation; 