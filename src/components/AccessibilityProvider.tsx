import React, { createContext, useContext, useEffect, useState } from 'react';

interface AccessibilityContextType {
  announceMessage: (message: string) => void;
  setFocus: (elementId: string) => void;
  isHighContrast: boolean;
  toggleHighContrast: () => void;
  isReducedMotion: boolean;
  toggleReducedMotion: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Annoncer des messages aux lecteurs d'écran
  const announceMessage = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Nettoyer après l'annonce
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  // Gérer le focus
  const setFocus = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.focus();
    }
  };

  // Basculer le mode contraste élevé
  const toggleHighContrast = () => {
    setIsHighContrast(!isHighContrast);
    if (!isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  // Basculer la réduction de mouvement
  const toggleReducedMotion = () => {
    setIsReducedMotion(!isReducedMotion);
    if (!isReducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  };

  // Détecter les préférences système
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    if (mediaQuery.matches) {
      document.documentElement.classList.add('reduced-motion');
    }

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
      if (e.matches) {
        document.documentElement.classList.add('reduced-motion');
      } else {
        document.documentElement.classList.remove('reduced-motion');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Gérer les raccourcis clavier d'accessibilité
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt + H pour activer/désactiver le contraste élevé
      if (event.altKey && event.key === 'h') {
        event.preventDefault();
        toggleHighContrast();
        announceMessage(`Mode contraste élevé ${isHighContrast ? 'désactivé' : 'activé'}`);
      }
      
      // Alt + M pour activer/désactiver la réduction de mouvement
      if (event.altKey && event.key === 'm') {
        event.preventDefault();
        toggleReducedMotion();
        announceMessage(`Réduction de mouvement ${isReducedMotion ? 'désactivée' : 'activée'}`);
      }
      
      // Alt + S pour aller au contenu principal
      if (event.altKey && event.key === 's') {
        event.preventDefault();
        setFocus('main-content');
        announceMessage('Aller au contenu principal');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isHighContrast, isReducedMotion]);

  const value: AccessibilityContextType = {
    announceMessage,
    setFocus,
    isHighContrast,
    toggleHighContrast,
    isReducedMotion,
    toggleReducedMotion,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

 