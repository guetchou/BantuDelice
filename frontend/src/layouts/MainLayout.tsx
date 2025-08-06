
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from "@/components/layout/Footer";
import { Toaster } from '@/components/ui/toaster';
import SEO from '@/components/SEO';
import NavbarGlassmorphism from '@/components/NavbarGlassmorphism';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const isColisContext = location.pathname.startsWith('/colis');
  const isAuthContext = location.pathname.startsWith('/login') || 
                       location.pathname.startsWith('/register') || 
                       location.pathname.startsWith('/auth');

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Définir les méta-données SEO selon la route actuelle
  const getSEOData = () => {
    const basePath = location.pathname.split('/')[1];
    
    switch (basePath) {
      case 'colis':
        return {
          title: 'BantuDelice Colis | Livraison de colis au Congo',
          description: 'Service de livraison de colis national et international au Congo. Suivi en temps réel, tarifs transparents.',
          keywords: 'colis, livraison, Congo, Brazzaville, Pointe-Noire, suivi, expédition',
          ogImage: '/images/og-colis.jpg'
        };
      case 'restaurants':
        return {
          title: 'Restaurants | Buntudelice',
          description: 'Découvrez les meilleurs restaurants à Brazzaville. Commandez en ligne et faites-vous livrer rapidement.',
          keywords: 'restaurants, Brazzaville, livraison, repas en ligne, cuisine congolaise',
          ogImage: '/images/og-restaurants.jpg'
        };
      case 'taxi':
        return {
          title: 'Réservation de taxi | Buntudelice',
          description: 'Réservez un taxi en quelques clics à Brazzaville. Service fiable, sûr et rapide.',
          keywords: 'taxi, Brazzaville, transport, réservation, course',
          ogImage: '/images/og-taxi.jpg'
        };
      case 'covoiturage':
        return {
          title: 'Covoiturage | Buntudelice',
          description: 'Partagez vos trajets et économisez sur vos déplacements à Brazzaville et aux alentours.',
          keywords: 'covoiturage, Brazzaville, partage de trajets, transport partagé',
          ogImage: '/images/og-covoiturage.jpg'
        };
      case 'services':
        return {
          title: 'Services professionnels | Buntudelice',
          description: 'Accédez à des services professionnels de qualité à Brazzaville: plomberie, électricité, ménage et plus.',
          keywords: 'services, professionnels, Brazzaville, prestataires, aide à domicile',
          ogImage: '/images/og-services.jpg'
        };
      default:
        return {
          title: 'Buntudelice | Livraison de repas, taxi et services à Brazzaville',
          description: 'Commandez des repas, réservez un taxi ou accédez à des services professionnels à Brazzaville.',
          keywords: 'livraison, repas, taxi, services, Brazzaville, Congo',
          ogImage: '/images/og-home.jpg'
        };
    }
  };

  const seoData = getSEOData();

  // Layout spécial pour les pages d'authentification
  if (isAuthContext) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <SEO
          title={seoData.title}
          description={seoData.description}
          keywords={seoData.keywords}
          ogImage={seoData.ogImage}
          url={`https://buntudelice.com${location.pathname}`}
          canonical={`https://buntudelice.com${location.pathname}`}
        />
        <Outlet />
        <Toaster />
      </div>
    );
  }

  // Layout spécial pour les pages colis
  if (isColisContext) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 to-pink-600 dark:from-gray-900 dark:to-gray-800">
        <SEO
          title={seoData.title}
          description={seoData.description}
          keywords={seoData.keywords}
          ogImage={seoData.ogImage}
          url={`https://buntudelice.com${location.pathname}`}
          canonical={`https://buntudelice.com${location.pathname}`}
        />
        <Outlet />
        <Toaster />
      </div>
    );
  }

  // Layout normal pour toutes les autres pages
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SEO
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        ogImage={seoData.ogImage}
        url={`https://buntudelice.com${location.pathname}`}
        canonical={`https://buntudelice.com${location.pathname}`}
      />
      
      <NavbarGlassmorphism />
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <Footer />
      <Toaster />
    </div>
  );
};

export default MainLayout;
