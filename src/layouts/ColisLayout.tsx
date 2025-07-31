import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavbarColis from '@/components/colis/NavbarColis';
import FooterColis from '@/components/colis/FooterColis';

const ColisLayout: React.FC = () => {
  const location = useLocation();
  const [bgImage, setBgImage] = useState('');

  const bgImages = [
    '/images/bg-colis.jpeg',
    '/images/bg-colis2.jpeg',
    '/images/bg-colis3.jpeg',
    '/images/bg-colis4.jpeg',
  ];

  useEffect(() => {
    setBgImage(bgImages[Math.floor(Math.random() * bgImages.length)]);
    // eslint-disable-next-line
  }, []);
  console.log(bgImage);   
  return (
    <div className="min-h-screen relative flex flex-col" style={{
      backgroundImage: `url(${bgImage})`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
      backgroundRepeat: 'no-repeat'
    }}>
        {/* Overlay dégradé semi-transparent */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/80 via-orange-100/80 to-yellow-200/80 z-0"></div>
          {/* Overlay blanc pour la lisibilité */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-0"></div>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar Colis */}
        <NavbarColis />

        {/* Contenu principal */}
        <main className="flex-1">
          <Outlet />
        </main>

        {/* Footer Colis */}
        <FooterColis />
      </div>
    </div>
  );
};

export default ColisLayout; 