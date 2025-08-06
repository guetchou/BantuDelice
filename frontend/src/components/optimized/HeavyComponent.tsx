import React, { Suspense, lazy, ComponentType } from 'react';

interface OptimizedComponentProps {
  component: ComponentType<unknown>;
  fallback?: React.ReactNode;
  props?: unknown;
}

// Composant optimisé avec lazy loading
export const OptimizedComponent: React.FC<OptimizedComponentProps> = ({
  component: Component,
  fallback,
  props = {}
}) => {
  return (
    <Suspense fallback={fallback || <DefaultFallback />}>
      <Component {...props} />
    </Suspense>
  );
};

// Fallback par défaut
const DefaultFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-[200px] p-4">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
      <p className="text-sm text-gray-500">Chargement...</p>
    </div>
  </div>
);

// Hook pour optimiser les composants avec intersection observer
export const useIntersectionObserver = (
  callback: () => void,
  options: IntersectionObserverInit = {}
) => {
  const observerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback();
          observer.disconnect();
        }
      });
    }, options);

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [callback, options]);

  return observerRef;
};

// Composant avec chargement conditionnel basé sur la visibilité
export const LazyLoadOnVisible: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const observerRef = useIntersectionObserver(() => setIsVisible(true));

  return (
    <div ref={observerRef}>
      {isVisible ? children : (fallback || <DefaultFallback />)}
    </div>
  );
}; 