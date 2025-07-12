
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import MainNavbar from "@/components/layout/MainNavbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from '@/components/ui/toaster';
import SEO from '@/components/SEO';

const MainLayout: React.FC = () => {
  const location = useLocation();

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Définir les méta-données SEO selon la route actuelle
  const getSEOData = () => {
    const basePath = location.pathname.split('/')[1];
    
    switch (basePath) {
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
      
      <MainNavbar />
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <Footer />
      <Toaster />
    </div>
  );
};

export default MainLayout;
