
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useAppNavigation } from '@/utils/navigation';
import { Home, Menu, Search, X, ShoppingBag, Car, Users, Coffee, MapPin, MessageCircle, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import UserProfileMenu from './UserProfileMenu';
import { toast } from '@/hooks/use-toast';

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, label, onClick }) => {
  const { isActive } = useAppNavigation();
  const active = isActive(to);
  
  return (
    <Link
      to={to}
      className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
        active 
          ? 'bg-primary text-white' 
          : 'hover:bg-gray-100 text-gray-700'
      }`}
      onClick={onClick}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

const MainNavbar: React.FC = () => {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { navigate } = useAppNavigation();
  const location = useLocation();
  
  // Update scroll state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    setSearchQuery('');
    setIsMobileMenuOpen(false);
  };
  
  const handleLogout = () => {
    // Implement logout logic
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès.",
    });
    navigate('/');
  };
  
  const navItems = [
    { to: '/', icon: <Home size={20} />, label: 'Accueil' },
    { to: '/restaurants', icon: <Coffee size={20} />, label: 'Restaurants' },
    { to: '/taxi/booking', icon: <Car size={20} />, label: 'Taxi' },
    { to: '/covoiturage', icon: <Users size={20} />, label: 'Covoiturage' },
    { to: '/services', icon: <MapPin size={20} />, label: 'Services' },
  ];
  
  return (
    <header 
      className={`sticky top-0 z-40 w-full ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-md' 
          : 'bg-white'
      } transition-all duration-200`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-xl font-bold text-primary">Buntudelice</h1>
          </Link>
          
          {/* Desktop Search */}
          <div className="hidden md:flex max-w-md w-full mx-4">
            <form onSubmit={handleSearch} className="w-full relative">
              <Input
                type="search"
                placeholder="Rechercher un restaurant, un plat..."
                className="pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit"
                className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-gray-400 hover:text-gray-700"
              >
                <Search size={18} />
              </button>
            </form>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </nav>
          
          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <Link to="/notifications" className="relative p-2 rounded-full hover:bg-gray-100">
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </Link>
                <Link to="/messages" className="p-2 rounded-full hover:bg-gray-100">
                  <MessageCircle size={20} />
                </Link>
                <Link to="/orders" className="p-2 rounded-full hover:bg-gray-100">
                  <ShoppingBag size={20} />
                </Link>
                <UserProfileMenu user={user} onLogout={handleLogout} />
              </>
            ) : (
              <div className="flex space-x-2">
                <Link to="/auth/login">
                  <Button variant="outline" size="sm">Connexion</Button>
                </Link>
                <Link to="/auth/register" className="hidden sm:block">
                  <Button size="sm">Inscription</Button>
                </Link>
              </div>
            )}
            
            {/* Mobile Menu Trigger */}
            <div className="lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu size={20} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
                  <div className="flex flex-col h-full">
                    {/* Mobile menu header */}
                    <div className="p-4 border-b">
                      <div className="flex items-center justify-between">
                        <h2 className="font-bold text-lg">Menu</h2>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <X size={20} />
                        </Button>
                      </div>
                      
                      {/* Mobile Search */}
                      <form onSubmit={handleSearch} className="mt-4">
                        <div className="relative">
                          <Input
                            type="search"
                            placeholder="Rechercher..."
                            className="pr-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          <button 
                            type="submit"
                            className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-gray-400"
                          >
                            <Search size={18} />
                          </button>
                        </div>
                      </form>
                    </div>
                    
                    {/* Mobile Navigation */}
                    <div className="overflow-y-auto flex-1 py-4 px-3 space-y-1">
                      {navItems.map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          icon={item.icon}
                          label={item.label}
                          onClick={() => setIsMobileMenuOpen(false)}
                        />
                      ))}
                      
                      {user ? (
                        <>
                          <div className="pt-4 mt-4 border-t">
                            <h3 className="px-3 py-2 text-sm font-medium text-gray-500">Mon compte</h3>
                            <NavLink
                              to="/profile"
                              icon={<Users size={20} />}
                              label="Mon profil"
                              onClick={() => setIsMobileMenuOpen(false)}
                            />
                            <NavLink
                              to="/orders"
                              icon={<ShoppingBag size={20} />}
                              label="Mes commandes"
                              onClick={() => setIsMobileMenuOpen(false)}
                            />
                            <NavLink
                              to="/favorites"
                              icon={<Coffee size={20} />}
                              label="Favoris"
                              onClick={() => setIsMobileMenuOpen(false)}
                            />
                            <NavLink
                              to="/wallet"
                              icon={<Coffee size={20} />}
                              label="Portefeuille"
                              onClick={() => setIsMobileMenuOpen(false)}
                            />
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => {
                                handleLogout();
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              <span className="mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                              </span>
                              <span>Déconnexion</span>
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="pt-4 mt-4 border-t px-3">
                          <div className="flex flex-col space-y-2">
                            <Link to="/auth/login">
                              <Button variant="outline" className="w-full">Connexion</Button>
                            </Link>
                            <Link to="/auth/register">
                              <Button className="w-full">Inscription</Button>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainNavbar;
