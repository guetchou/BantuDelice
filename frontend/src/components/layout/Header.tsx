
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import SearchBar from './SearchBar';
import UserProfileMenu from './UserProfileMenu';
import { ShoppingCart, Menu } from 'lucide-react';
import MobileMenu from './MobileMenu';

const Header: React.FC = () => {
  const { user, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    logout();
    // Redirect to home page or login page
    window.location.href = '/';
  };

  return (
    <header className="bg-background sticky top-0 z-50 border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-primary mr-8">
            Buntudelice
          </Link>
          
          <div className="hidden md:flex space-x-4">
            <Link to="/restaurants" className="text-sm hover:text-primary transition-colors">
              Restaurants
            </Link>
            <Link to="/specialties" className="text-sm hover:text-primary transition-colors">
              Spécialités
            </Link>
            <Link to="/about" className="text-sm hover:text-primary transition-colors">
              À propos
            </Link>
          </div>
        </div>
        
        <div className="hidden md:flex items-center flex-1 justify-center max-w-xl">
          <SearchBar />
        </div>
        
        <div className="flex items-center space-x-2">
          <Link to="/cart" className="p-2 rounded-full hover:bg-muted transition-colors relative">
            <ShoppingCart className="h-5 w-5" />
            {/* Notification badge would go here */}
          </Link>
          
          {isLoading ? (
            <div className="h-10 w-24 animate-pulse bg-muted rounded"></div>
          ) : user ? (
            <UserProfileMenu user={user} onLogout={handleLogout} />
          ) : (
            <div className="hidden sm:flex space-x-2">
              <Link to="/auth/login">
                <Button variant="outline" size="sm">Connexion</Button>
              </Link>
              <Link to="/auth/register">
                <Button size="sm">Inscription</Button>
              </Link>
            </div>
          )}
          
          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile search bar */}
      <div className="md:hidden px-4 pb-3">
        <SearchBar />
      </div>
      
      {/* Mobile menu would be here */}
      <MobileMenu className="md:hidden" />
    </header>
  );
};

export default Header;
