import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NavbarColis from '@/components/colis/NavbarColis';

interface ContextualNavbarProps {
  children: React.ReactNode;
}

const ContextualNavbar: React.FC<ContextualNavbarProps> = ({ children }) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Détecter si nous sommes dans le contexte Colis
  const isColisContext = location.pathname.startsWith('/colis');

  // Si nous sommes dans le contexte Colis, afficher la navbar Colis
  if (isColisContext) {
    return (
      <>
        <NavbarColis isScrolled={isScrolled} />
        {children}
      </>
    );
  }

  // Sinon, afficher la navbar principale (à implémenter si nécessaire)
  // Pour l'instant, on retourne juste les enfants
  return <>{children}</>;
};

export default ContextualNavbar; 