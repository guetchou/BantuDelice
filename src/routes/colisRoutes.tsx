import React, { Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Lazy loading des composants
const ColisLandingPage = React.lazy(() => import('@/pages/colis/ColisLandingPage'));
const ColisTrackingPage = React.lazy(() => import('@/pages/colis/ColisTrackingPageClean'));
const ColisTrackingPublic = React.lazy(() => import('@/pages/colis/ColisTrackingPublic'));
const ColisTarifsPage = React.lazy(() => import('@/pages/colis/ColisTarifsPage'));
const ColisNationalPage = React.lazy(() => import('@/pages/colis/ColisNationalPage'));
const ColisInternationalPage = React.lazy(() => import('@/pages/colis/ColisInternationalPage'));
const ColisDashboardPage = React.lazy(() => import('@/pages/colis/ColisDashboardPage'));
const ColisHistoriquePage = React.lazy(() => import('@/pages/colis/ColisHistoriquePage'));
const ColisExpeditionPage = React.lazy(() => import('@/pages/colis/ColisExpeditionModernFixed'));
const ColisExpeditionComplete = React.lazy(() => import('@/pages/colis/ColisExpeditionComplete'));
const ColisSupportPage = React.lazy(() => import('@/pages/colis/ColisSupportPage'));
const ColisRestrictionsPage = React.lazy(() => import('@/pages/colis/ColisRestrictionsPage'));
const AProposColisPage = React.lazy(() => import('@/pages/colis/AProposColisPage'));
const ColisExpeditionForm = React.lazy(() => import('@/pages/colis/ColisExpeditionModernFixed'));
const ColisReclamationPage = React.lazy(() => import('@/pages/colis/ColisReclamationPage'));
const ColisPlaintePage = React.lazy(() => import('@/pages/colis/ColisPlaintePage'));
const ColisFAQPage = React.lazy(() => import('@/pages/colis/ColisFAQPage'));
const ColisAuthPage = React.lazy(() => import('@/pages/colis/ColisAuthPage'));

export const colisRoutes: RouteObject[] = [
  // Route d'authentification
  {
    path: '/colis/auth',
    element: (
      <Suspense fallback={<div>Chargement...</div>}>
        <ColisAuthPage />
      </Suspense>
    ),
  },
  
  // Route principale colis
  {
    path: '/colis',
    element: (
      <Suspense fallback={<div>Chargement...</div>}>
        <ColisLandingPage />
      </Suspense>
    ),
  },
  
  // Routes pour le tracking
  {
    path: '/colis/tracking',
    element: (
      <Suspense fallback={<div>Chargement...</div>}>
        <ColisTrackingPage />
      </Suspense>
    ),
  },
  
  // Route publique pour le tracking (accessible sans authentification)
  {
    path: '/colis/tracking/:trackingNumber',
    element: (
      <Suspense fallback={<div>Chargement...</div>}>
        <ColisTrackingPublic />
      </Suspense>
    ),
  },
  
  // Routes pour les tarifs
  {
    path: '/colis/tarifs',
    element: (
      <Suspense fallback={<div>Chargement...</div>}>
        <ColisTarifsPage />
      </Suspense>
    ),
  },
  {
    path: '/colis/tarification',
    element: (
      <Suspense fallback={<div>Chargement...</div>}>
        <ColisTarifsPage />
      </Suspense>
    ),
  },
  
  // Routes pour les services
  {
    path: '/colis/national',
    element: (
      <Suspense fallback={<div>Chargement...</div>}>
        <ColisNationalPage />
      </Suspense>
    ),
  },
  {
    path: '/colis/international',
    element: (
      <Suspense fallback={<div>Chargement...</div>}>
        <ColisInternationalPage />
      </Suspense>
    ),
  },
  
  // Routes pour le dashboard et historique
  {
    path: '/colis/dashboard',
    element: (
      <Suspense fallback={<div>Chargement...</div>}>
        <ColisDashboardPage />
      </Suspense>
    ),
  },
  {
    path: '/colis/historique',
    element: (
      <Suspense fallback={<div>Chargement...</div>}>
        <ColisHistoriquePage />
      </Suspense>
    ),
  },
  
  // Routes pour l'expédition
  {
    path: '/colis/expedier',
    element: (
      <Suspense fallback={<div>Chargement...</div>}>
        <ColisExpeditionPage />
      </Suspense>
    ),
  },
  {
    path: '/colis/expedition',
    element: (
      <Suspense fallback={<div>Chargement...</div>}>
        <ColisExpeditionPage />
      </Suspense>
    ),
  },
  {
    path: '/colis/expedition-complete',
    element: (
      <Suspense fallback={<div>Chargement...</div>}>
        <ColisExpeditionComplete />
      </Suspense>
    ),
  },
  {
    path: '/colis/expedition-form',
    element: (
      <Suspense fallback={<div>Chargement...</div>}>
        <ColisExpeditionForm />
      </Suspense>
    ),
  },
  
  // Routes pour les pages d'information
  {
    path: '/colis/restrictions',
    element: (
      <Suspense fallback={<div>Chargement...</div>}>
        <ColisRestrictionsPage />
      </Suspense>
    ),
  },
  {
    path: '/colis/support',
    element: (
      <Suspense fallback={<div>Chargement...</div>}>
        <ColisSupportPage />
      </Suspense>
    ),
  },
  {
    path: '/colis/a-propos',
    element: (
      <Suspense fallback={<div>Chargement...</div>}>
        <AProposColisPage />
      </Suspense>
    ),
  },
  
  // Routes pour le support et assistance
  {
    path: '/colis/reclamation',
    element: (
      <Suspense fallback={<div>Chargement...</div>}>
        <ColisReclamationPage />
      </Suspense>
    ),
  },
  {
    path: '/colis/plainte',
    element: (
      <Suspense fallback={<div>Chargement...</div>}>
        <ColisPlaintePage />
      </Suspense>
    ),
  },
  {
    path: '/colis/faq',
    element: (
      <Suspense fallback={<div>Chargement...</div>}>
        <ColisFAQPage />
      </Suspense>
    ),
  },
]; 