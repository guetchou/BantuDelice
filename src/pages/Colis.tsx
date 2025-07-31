import React from 'react';
import { Helmet } from 'react-helmet-async';
import ColisLandingPage from '@/pages/colis/ColisLandingPage';

export default function Colis() {
  return (
    <>
      <Helmet>
        <title>BantuDelice Colis - Livraison Nationale et Internationale</title>
        <meta name="description" content="Service de livraison de colis au Congo. Expédition nationale et internationale, suivi en temps réel, tarifs transparents." />
      </Helmet>
      
      {/* Skip Link pour l'accessibilité */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50">
        Aller au contenu principal
      </a>
      
      <main id="main-content" className="min-h-screen">
        <ColisLandingPage />
      </main>
    </>
  );
} 