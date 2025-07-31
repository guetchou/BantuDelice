
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface MobileMenuProps {
  className?: string;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ className }) => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className={`${className} py-4 px-4 space-y-4 border-t`}>
      <div className="space-y-2">
        <Link to="/restaurants" className="block py-2 text-sm">
          Restaurants
        </Link>
        <Link to="/specialties" className="block py-2 text-sm">
          Spécialités
        </Link>
        <Link to="/about" className="block py-2 text-sm">
          À propos
        </Link>
      </div>
      
      {!isAuthenticated && (
        <div className="flex flex-col space-y-2 pt-2 border-t">
          <Link to="/auth/login" className="block py-2 text-sm font-medium text-primary">
            Connexion
          </Link>
          <Link to="/auth/register" className="block py-2 text-sm font-medium text-primary">
            Inscription
          </Link>
        </div>
      )}
      
      {isAuthenticated && (
        <div className="space-y-2 pt-2 border-t">
          <Link to="/profile" className="block py-2 text-sm">
            Mon profil
          </Link>
          <Link to="/orders" className="block py-2 text-sm">
            Mes commandes
          </Link>
          <Link to="/settings" className="block py-2 text-sm">
            Paramètres
          </Link>
          <button className="block py-2 text-sm text-red-500">
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
