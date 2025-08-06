import React, { Suspense, lazy } from 'react';

// Composant de fallback optimisé
const LoadingFallback = ({ message = "Chargement..." }: { message?: string }) => (
  <div className="flex items-center justify-center min-h-[200px] p-4">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-3"></div>
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  </div>
);

// Composant de lazy loading avec gestion d'erreur
export const LazyLoader = <T extends React.ComponentType<unknown>>(
  importFunc: () => Promise<{ default: T }>,
  fallbackMessage?: string
) => {
  const LazyComponent = lazy(importFunc);

  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={<LoadingFallback message={fallbackMessage} />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Lazy loading pour les pages principales
export const LazyHomePage = LazyLoader(
  () => import('../pages/Index'),
  "Chargement de la page d'accueil..."
);

export const LazyAuthPage = LazyLoader(
  () => import('../pages/auth/AuthPage'),
  "Chargement de l'authentification..."
);

export const LazyLoginPage = LazyLoader(
  () => import('../pages/auth/LoginPage'),
  "Chargement de la connexion..."
);

export const LazyRegisterPage = LazyLoader(
  () => import('../pages/auth/RegisterPage'),
  "Chargement de l'inscription..."
);

// Lazy loading pour les pages de services
export const LazyColisPage = LazyLoader(
  () => import('../pages/colis/ColisPage'),
  "Chargement du service colis..."
);

export const LazyTaxiPage = LazyLoader(
  () => import('../pages/taxi/TaxiPage'),
  "Chargement du service taxi..."
);

export const LazyDeliveryPage = LazyLoader(
  () => import('../pages/delivery/DeliveryPage'),
  "Chargement du service livraison..."
);

export const LazyRestaurantPage = LazyLoader(
  () => import('../pages/restaurant/RestaurantPage'),
  "Chargement des restaurants..."
);

// Lazy loading pour les composants lourds
export const LazyMapComponent = LazyLoader(
  () => import('../components/maps/MapComponent'),
  "Chargement de la carte..."
);

export const LazyChartComponent = LazyLoader(
  () => import('../components/charts/ChartComponent'),
  "Chargement du graphique..."
);

export const LazyAnalyticsComponent = LazyLoader(
  () => import('../components/analytics/AnalyticsComponent'),
  "Chargement des analyses..."
);

// Lazy loading pour les formulaires complexes
export const LazyBookingForm = LazyLoader(
  () => import('../components/forms/BookingForm'),
  "Chargement du formulaire..."
);

export const LazyPaymentForm = LazyLoader(
  () => import('../components/forms/PaymentForm'),
  "Chargement du paiement..."
);

// Hook pour le lazy loading conditionnel
export const useLazyLoad = (condition: boolean, importFunc: () => Promise<unknown>) => {
  const [Component, setComponent] = React.useState<React.ComponentType | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (condition && !Component) {
      setLoading(true);
      importFunc()
        .then((module) => {
          setComponent(() => module.default);
        })
        .catch((error) => {
          console.error('Erreur lors du chargement lazy:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [condition, Component, importFunc]);

  return { Component, loading };
};

// Composant de lazy loading avec preloading
export const LazyLoaderWithPreload = <T extends React.ComponentType<unknown>>(
  importFunc: () => Promise<{ default: T }>,
  fallbackMessage?: string
) => {
  const LazyComponent = lazy(importFunc);
  let preloaded = false;

  const preload = () => {
    if (!preloaded) {
      preloaded = true;
      importFunc();
    }
  };

  const Component = (props: React.ComponentProps<T>) => (
    <Suspense fallback={<LoadingFallback message={fallbackMessage} />}>
      <LazyComponent {...props} />
    </Suspense>
  );

  return { Component, preload };
};

export default LazyLoader; 