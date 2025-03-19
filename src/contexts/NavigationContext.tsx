
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationContextType {
  previousRoute: string | null;
  navigateBack: () => void;
  navigateTo: (path: string) => void;
  canGoBack: boolean;
  breadcrumbs: { label: string; path: string }[];
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [previousRoute, setPreviousRoute] = useState<string | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<{ label: string; path: string }[]>([]);

  // Update previous route when location changes
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Skip authentication routes for breadcrumbs
    if (!currentPath.startsWith('/auth')) {
      // Generate breadcrumbs based on current path
      const pathSegments = currentPath.split('/').filter(Boolean);
      const newBreadcrumbs = pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
        
        // Try to make a readable label from the segment
        let label = segment.charAt(0).toUpperCase() + segment.slice(1);
        
        // Handle special cases
        if (segment === 'taxis') label = 'Taxis';
        if (segment === 'covoiturage') label = 'Covoiturage';
        if (segment === 'restaurant') label = 'Restaurant';
        if (segment === 'orders') label = 'Commandes';
        if (segment === 'order') label = 'Commande';
        if (segment === 'referral') label = 'Parrainage';
        if (segment === 'wallet') label = 'Portefeuille';
        
        return { label, path };
      });
      
      // Add home as first breadcrumb if we're not on the home page
      if (currentPath !== '/') {
        newBreadcrumbs.unshift({ label: 'Accueil', path: '/' });
      }
      
      setBreadcrumbs(newBreadcrumbs);
    }
  }, [location.pathname]);

  const navigateBack = () => {
    if (previousRoute) {
      navigate(previousRoute);
      setPreviousRoute(null);
      setCanGoBack(false);
    } else {
      navigate('/');
    }
  };

  const navigateTo = (path: string) => {
    if (location.pathname !== path) {
      setPreviousRoute(location.pathname);
      setCanGoBack(true);
      navigate(path);
    }
  };

  return (
    <NavigationContext.Provider value={{ 
      previousRoute, 
      navigateBack, 
      navigateTo,
      canGoBack,
      breadcrumbs
    }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
