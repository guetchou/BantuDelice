import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Home, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Clock,
  Truck,
  Calculator,
  FileText,
  BarChart3,
  HelpCircle,
  Shield,
  Building,
  Users,
  Settings
} from 'lucide-react';

interface ContextTransitionProps {
  children: React.ReactNode;
}

const ContextTransition: React.FC<ContextTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [previousPath, setPreviousPath] = useState<string>('');
  const [showTransition, setShowTransition] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'in' | 'out'>('in');

  useEffect(() => {
    const currentPath = location.pathname;
    const wasInColis = previousPath.startsWith('/colis');
    const isInColis = currentPath.startsWith('/colis');

    // Détecter les transitions de contexte
    if (wasInColis !== isInColis) {
      setTransitionDirection(isInColis ? 'in' : 'out');
      setShowTransition(true);
      
      // Masquer la transition après 2 secondes
      setTimeout(() => {
        setShowTransition(false);
      }, 2000);
    }

    setPreviousPath(currentPath);
  }, [location.pathname, previousPath]);

  const getContextInfo = (path: string) => {
    if (path.startsWith('/colis')) {
      return {
        title: 'BantuDelice Colis',
        description: 'Service de livraison de colis',
        icon: Package,
        color: 'orange',
        features: [
          { icon: Truck, label: 'Suivi en temps réel' },
          { icon: Calculator, label: 'Tarifs transparents' },
          { icon: FileText, label: 'Historique complet' },
          { icon: BarChart3, label: 'Dashboard personnel' }
        ]
      };
    }
    
    return {
      title: 'BantuDelice',
      description: 'Plateforme de services',
      icon: Home,
      color: 'blue',
      features: [
        { icon: Package, label: 'Livraison de repas' },
        { icon: Truck, label: 'Réservation taxi' },
        { icon: Users, label: 'Covoiturage' },
        { icon: Settings, label: 'Services pro' }
      ]
    };
  };

  const contextInfo = getContextInfo(location.pathname);

  if (!showTransition) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      
      {/* Overlay de transition */}
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
        <div className={`bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 transform transition-all duration-500 ${
          transitionDirection === 'in' ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}>
          <div className="text-center">
            {/* Icône et titre */}
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-${contextInfo.color}-100 flex items-center justify-center`}>
              <contextInfo.icon className={`h-8 w-8 text-${contextInfo.color}-600`} />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {contextInfo.title}
            </h2>
            
            <p className="text-gray-600 mb-6">
              {contextInfo.description}
            </p>

            {/* Fonctionnalités */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {contextInfo.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                  <feature.icon className="h-4 w-4 text-orange-500" />
                  <span>{feature.label}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowTransition(false)}
              >
                Continuer
              </Button>
              
              {location.pathname.startsWith('/colis') ? (
                <Link to="/" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Site principal
                  </Button>
                </Link>
              ) : (
                <Link to="/colis" className="flex-1">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    <Package className="h-4 w-4 mr-2" />
                    Module Colis
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              )}
            </div>

            {/* Indicateur de chargement */}
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
              Chargement...
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContextTransition; 