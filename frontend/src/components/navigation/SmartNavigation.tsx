import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Package, 
  Truck, 
  Calculator, 
  FileText, 
  BarChart3, 
  Settings,
  HelpCircle,
  Shield,
  Building,
  Plus,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';

interface SmartNavigationProps {
  children: React.ReactNode;
}

const SmartNavigation: React.FC<SmartNavigationProps> = ({ children }) => {
  const location = useLocation();
  const [isColisContext, setIsColisContext] = useState(false);
  const [showContextSwitcher, setShowContextSwitcher] = useState(false);

  useEffect(() => {
    const isColis = location.pathname.startsWith('/colis');
    setIsColisContext(isColis);
    setShowContextSwitcher(isColis);
  }, [location.pathname]);

  // Navigation contextuelle pour Colis
  const colisNavigation = [
    { path: '/colis', label: 'Accueil', icon: Home, description: 'Page d\'accueil' },
    { path: '/colis/expedition', label: 'Expédier', icon: Package, description: 'Envoyer un colis', badge: 'Nouveau' },
    { path: '/colis/tracking', label: 'Suivi', icon: Truck, description: 'Suivre vos colis' },
    { path: '/colis/tarifs', label: 'Tarifs', icon: Calculator, description: 'Calculer les prix' },
    { path: '/colis/historique', label: 'Historique', icon: FileText, description: 'Historique des envois' },
    { path: '/colis/dashboard', label: 'Dashboard', icon: BarChart3, description: 'Tableau de bord' },
    { path: '/colis/support', label: 'Support', icon: HelpCircle, description: 'Support client' },
    { path: '/colis/restrictions', label: 'Restrictions', icon: Shield, description: 'Articles interdits' },
  ];

  // Navigation pour le site principal
  const mainNavigation = [
    { path: '/', label: 'Accueil', icon: Home, description: 'Page d\'accueil' },
    { path: '/restaurants', label: 'Restaurants', icon: Package, description: 'Commander des repas' },
    { path: '/taxi', label: 'Taxi', icon: Truck, description: 'Réserver un taxi' },
    { path: '/covoiturage', label: 'Covoiturage', icon: MapPin, description: 'Partager des trajets' },
    { path: '/services', label: 'Services', icon: Settings, description: 'Services professionnels' },
  ];

  const isActiveRoute = (path: string) => {
    if (path === '/colis' || path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const ContextSwitcher = () => (
    <div className="fixed top-20 right-4 z-40 bg-white rounded-lg shadow-lg border border-orange-200 p-4 w-64">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Navigation rapide</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowContextSwitcher(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </Button>
      </div>
      
      <div className="space-y-2">
        {colisNavigation.map((item) => {
          const isActive = isActiveRoute(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-lg' 
                  : 'text-gray-700 hover:text-orange-700 hover:bg-orange-50'
              }`}
              onClick={() => setShowContextSwitcher(false)}
            >
              <item.icon className="h-4 w-4" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.badge && (
                    <Badge className="bg-white/20 text-white text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-xs opacity-75">{item.description}</p>
              </div>
              {isActive && <CheckCircle className="h-4 w-4" />}
            </Link>
          );
        })}
      </div>

      <div className="border-t border-orange-100 mt-3 pt-3">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au site principal
        </Link>
      </div>
    </div>
  );

  const ColisContextIndicator = () => (
    <div className="fixed top-4 right-4 z-30">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowContextSwitcher(!showContextSwitcher)}
        className="bg-white/90 backdrop-blur border-orange-300 text-orange-700 hover:bg-orange-50 shadow-lg"
      >
        <Package className="h-4 w-4 mr-2" />
        Colis
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );

  return (
    <>
      {children}
      
      {/* Indicateur de contexte Colis */}
      {isColisContext && <ColisContextIndicator />}
      
      {/* Switcher de contexte */}
      {showContextSwitcher && <ContextSwitcher />}
      
      {/* Overlay pour fermer le switcher */}
      {showContextSwitcher && (
        <div 
          className="fixed inset-0 z-30"
          onClick={() => setShowContextSwitcher(false)}
        />
      )}
    </>
  );
};

export default SmartNavigation; 