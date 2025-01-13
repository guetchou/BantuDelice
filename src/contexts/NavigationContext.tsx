import { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logger } from '@/services/logger';

interface NavigationContextType {
  previousRoute: string | null;
  navigateBack: () => void;
  navigateTo: (path: string) => void;
  canGoBack: boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [previousRoute, setPreviousRoute] = useState<string | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  const navigateBack = () => {
    if (previousRoute) {
      logger.info("Navigating back to:", { route: previousRoute });
      navigate(previousRoute);
      setPreviousRoute(null);
      setCanGoBack(false);
    } else {
      logger.info("No previous route, navigating to home");
      navigate('/');
    }
  };

  const navigateTo = (path: string) => {
    if (location.pathname !== path) {
      logger.info("Navigating to:", { path, from: location.pathname });
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
      canGoBack 
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