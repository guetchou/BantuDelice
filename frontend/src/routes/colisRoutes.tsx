import { Suspense } from 'react';
import { 
  LazyColisDashboard, 
  LazyColisExpedition, 
  LazyColisTracking, 
  LazyColisTrackingPublic,
  LazyColisExpeditionComplete,
  LazyExpeditionConfirmation,
  LazyColisAuthPage,
  lazyFallback 
} from '@/utils/lazyImports';

export const colisRoutes = [
  {
    path: '/colis',
    element: (
      <Suspense fallback={lazyFallback}>
        <LazyColisDashboard />
      </Suspense>
    ),
  },
  {
    path: '/colis/dashboard',
    element: (
      <Suspense fallback={lazyFallback}>
        <LazyColisDashboard />
      </Suspense>
    ),
  },
  {
    path: '/colis/auth',
    element: (
      <Suspense fallback={lazyFallback}>
        <LazyColisAuthPage />
      </Suspense>
    ),
  },
  {
    path: '/colis/expedition',
    element: (
      <Suspense fallback={lazyFallback}>
        <LazyColisExpedition />
      </Suspense>
    ),
  },
  {
    path: '/colis/expedier',
    element: (
      <Suspense fallback={lazyFallback}>
        <LazyColisExpedition />
      </Suspense>
    ),
  },
  {
    path: '/colis/tracking',
    element: (
      <Suspense fallback={lazyFallback}>
        <LazyColisTracking />
      </Suspense>
    ),
  },
  {
    path: '/colis/tracking/:trackingNumber',
    element: (
      <Suspense fallback={lazyFallback}>
        <LazyColisTrackingPublic />
      </Suspense>
    ),
  },
  {
    path: '/colis/expedition-complete',
    element: (
      <Suspense fallback={lazyFallback}>
        <LazyColisExpeditionComplete />
      </Suspense>
    ),
  },
  {
    path: '/colis/confirmation/:trackingNumber',
    element: (
      <Suspense fallback={lazyFallback}>
        <LazyExpeditionConfirmation />
      </Suspense>
    ),
  },
  {
    path: '/colis/confirmation/:trackingNumber/:expeditionId',
    element: (
      <Suspense fallback={lazyFallback}>
        <LazyExpeditionConfirmation />
      </Suspense>
    ),
  },
  {
    path: '/colis/tarification',
    element: (
      <Suspense fallback={lazyFallback}>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Tarification des Colis</h1>
          <p>Page de tarification en cours de développement...</p>
        </div>
      </Suspense>
    ),
  },
]; 