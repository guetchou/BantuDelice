import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Truck, 
  Calculator, 
  History, 
  Code, 
  BarChart3, 
  Globe, 
  MapPin,
  TrendingUp,
  Settings,
  HelpCircle,
  Home,
  Zap,
  Bot,
  Navigation,
  CheckCircle,
  MessageSquare,
  Camera,
  Heart,
  Wrench
} from 'lucide-react';

interface ColisNavigationProps {
  variant?: 'horizontal' | 'vertical';
  className?: string;
}

const ColisNavigation: React.FC<ColisNavigationProps> = ({ 
  variant = 'horizontal', 
  className = '' 
}) => {
  const location = useLocation();

  const navigationItems = [
    { 
      path: '/colis', 
      label: 'Accueil', 
      icon: Home,
      description: 'Page d\'accueil du service colis'
    },
    { 
      path: '/colis/tracking', 
      label: 'Suivi', 
      icon: Truck,
      description: 'Suivre vos colis en temps réel'
    },
    { 
      path: '/colis/tarifs', 
      label: 'Tarifs', 
      icon: Calculator,
      description: 'Calculer les tarifs de livraison'
    },
    { 
      path: '/colis/expedition', 
      label: 'Expédier', 
      icon: Package,
      description: 'Envoyer un nouveau colis'
    },
    { 
      path: '/colis/historique', 
      label: 'Historique', 
      icon: History,
      description: 'Consulter l\'historique des colis'
    },
    { 
      path: '/colis/dashboard', 
      label: 'Dashboard', 
      icon: BarChart3,
      description: 'Tableau de bord et statistiques'
    },
    { 
      path: '/colis/api', 
      label: 'API', 
      icon: Code,
      description: 'Documentation API'
    },
    { 
      path: '/colis/api-example', 
      label: 'API Example', 
      icon: Code,
      description: 'Exemples d\'utilisation de l\'API'
    },
    { 
      path: '/colis/advanced-features', 
      label: 'Fonctionnalités Avancées', 
      icon: Zap,
      description: 'Fonctionnalités avancées du module'
    },
    { 
      path: '/colis/predictive-analytics', 
      label: 'Analytics Prédictives', 
      icon: BarChart3,
      description: 'Analytics prédictives et IA'
    },
    { 
      path: '/colis/automation-hub', 
      label: 'Hub d\'Automatisation', 
      icon: Bot,
      description: 'Automatisation des processus'
    },
    { 
      path: '/colis/intelligent-routing', 
      label: 'Routage Intelligent', 
      icon: Navigation,
      description: 'Optimisation des routes'
    },
    { 
      path: '/colis/ai-chatbot', 
      label: 'Assistant IA', 
      icon: MessageSquare,
      description: 'Chatbot intelligent pour le support'
    },
    { 
      path: '/colis/image-recognition', 
      label: 'Reconnaissance d\'Images', 
      icon: Camera,
      description: 'Analyse IA des colis'
    },
    { 
      path: '/colis/sentiment-analysis', 
      label: 'Analyse de Sentiment', 
      icon: Heart,
      description: 'Analyse des avis clients'
    },
    { 
      path: '/colis/predictive-maintenance', 
      label: 'Maintenance Prédictive', 
      icon: Wrench,
      description: 'Maintenance IA des véhicules'
    },
    { 
      path: '/colis/production-ready', 
      label: 'Production Ready', 
      icon: CheckCircle,
      description: 'Fonctionnalités de production'
    },
  ];

  const isActiveRoute = (path: string) => {
    if (path === '/colis') {
      return location.pathname === '/colis';
    }
    return location.pathname.startsWith(path);
  };

  if (variant === 'vertical') {
    return (
      <nav className={`space-y-2 ${className}`}>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveRoute(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`w-full flex items-center gap-3 py-3 px-4 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-lg' 
                  : 'text-orange-700 hover:text-orange-900 hover:bg-orange-50'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <div className="text-left">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs opacity-75">{item.description}</div>
              </div>
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className={`flex items-center gap-1 overflow-x-auto hide-scrollbar ${className}`}>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = isActiveRoute(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`gap-2 flex-shrink-0 px-3 py-2 rounded-lg transition-colors ${
              isActive 
                ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-lg' 
                : 'text-orange-700 hover:text-orange-900 hover:bg-orange-50'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default ColisNavigation; 