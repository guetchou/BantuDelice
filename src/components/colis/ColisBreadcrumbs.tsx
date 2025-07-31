import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const ColisBreadcrumbs: React.FC = () => {
  const location = useLocation();

  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    const breadcrumbs = [];

    // Ajouter l'accueil
    breadcrumbs.push({
      name: 'Accueil',
      path: '/',
      icon: Home
    });

    // Ajouter les segments du chemin
    let currentPath = '';
    pathnames.forEach((name, index) => {
      currentPath += `/${name}`;
      
      // Mapper les noms d'affichage
      let displayName = name;
      switch (name) {
        case 'colis':
          displayName = 'Colis';
          break;
        case 'tracking':
          displayName = 'Suivi';
          break;
        case 'tarifs':
          displayName = 'Tarifs';
          break;
        case 'expedier':
          displayName = 'Expédier';
          break;
        case 'historique':
          displayName = 'Historique';
          break;
        case 'dashboard':
          displayName = 'Dashboard';
          break;
        case 'api':
          displayName = 'API';
          break;
        case 'national':
          displayName = 'National';
          break;
        case 'international':
          displayName = 'International';
          break;
        case 'a-propos':
          displayName = 'À propos';
          break;
        default:
          displayName = name.charAt(0).toUpperCase() + name.slice(1);
      }

      breadcrumbs.push({
        name: displayName,
        path: currentPath,
        isLast: index === pathnames.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-600 mb-6">
      {breadcrumbs.map((breadcrumb, index) => {
        const isLast = breadcrumb.isLast;
        
        return (
          <React.Fragment key={breadcrumb.path}>
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
            
            {isLast ? (
              <span className="text-orange-700 font-medium">
                {breadcrumb.icon ? <breadcrumb.icon className="h-4 w-4 inline mr-1" /> : null}
                {breadcrumb.name}
              </span>
            ) : (
              <Link
                to={breadcrumb.path}
                className="hover:text-orange-600 transition-colors flex items-center"
              >
                {breadcrumb.icon ? <breadcrumb.icon className="h-4 w-4 mr-1" /> : null}
                {breadcrumb.name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default ColisBreadcrumbs; 