
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { 
  Menu, X, User, ShoppingBag, Car, Users, Bell, MessageCircle, ChevronDown, Search 
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { useApiAuth } from '@/contexts/ApiAuthContext';

const MainNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useApiAuth();
  
  const isActive = (path: string) => location.pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-black/90 backdrop-blur-lg shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Buntudelice
            </span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <form onSubmit={handleSearch} className="w-full relative">
              <Input
                type="text"
                placeholder="Rechercher un restaurant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
              <Button type="submit" className="absolute right-0 top-0 h-full rounded-l-none">
                Rechercher
              </Button>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger 
                    className="text-white hover:bg-white/10 hover:text-orange-500"
                  >
                    Menu
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 w-[220px] bg-black/90 backdrop-blur-lg border-white/20">
                      <li>
                        <Link to="/restaurants">
                          <NavigationMenuLink className="flex items-center gap-2 p-2 rounded-md text-white hover:bg-white/10">
                            Restaurants
                          </NavigationMenuLink>
                        </Link>
                      </li>
                      <li>
                        <Link to="/delivery">
                          <NavigationMenuLink className="flex items-center gap-2 p-2 rounded-md text-white hover:bg-white/10">
                            Livraison
                          </NavigationMenuLink>
                        </Link>
                      </li>
                      <li>
                        <Link to="/taxis">
                          <NavigationMenuLink className="flex items-center gap-2 p-2 rounded-md text-white hover:bg-white/10">
                            <Car className="h-4 w-4 text-orange-500" />
                            <span>Taxis</span>
                          </NavigationMenuLink>
                        </Link>
                      </li>
                      <li>
                        <Link to="/covoiturage">
                          <NavigationMenuLink className="flex items-center gap-2 p-2 rounded-md text-white hover:bg-white/10">
                            <Users className="h-4 w-4 text-orange-500" />
                            <span>Covoiturage</span>
                          </NavigationMenuLink>
                        </Link>
                      </li>
                      <li>
                        <Link to="/contact">
                          <NavigationMenuLink className="flex items-center gap-2 p-2 rounded-md text-white hover:bg-white/10">
                            Contact
                          </NavigationMenuLink>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {isAuthenticated ? (
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10 hover:text-orange-500"
                onClick={() => navigate('/profile')}
              >
                <User className="w-5 h-5 mr-2" />
                Mon Profil
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-white/10 hover:text-orange-500"
                  onClick={() => navigate('/auth')}
                >
                  Connexion
                </Button>
                <Button 
                  variant="default"
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => navigate('/auth?signup=true')}
                >
                  Inscription
                </Button>
              </div>
            )}

            <Link to="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 hover:text-orange-500 relative"
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
              className="text-white"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="relative">
          <Input
            placeholder="Rechercher un restaurant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
          <Button type="submit" className="absolute right-0 top-0 h-full rounded-l-none">
            Rechercher
          </Button>
        </form>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/95 border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/restaurants"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-orange-500 hover:bg-white/10"
              onClick={() => setIsMenuOpen(false)}
            >
              Restaurants
            </Link>
            <Link
              to="/delivery"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-orange-500 hover:bg-white/10"
              onClick={() => setIsMenuOpen(false)}
            >
              Livraison
            </Link>
            <Link
              to="/taxi/booking"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-orange-500 hover:bg-white/10"
              onClick={() => setIsMenuOpen(false)}
            >
              Taxi
            </Link>
            <Link
              to="/covoiturage"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-orange-500 hover:bg-white/10"
              onClick={() => setIsMenuOpen(false)}
            >
              Covoiturage
            </Link>
            <Link
              to="/profile"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-orange-500 hover:bg-white/10"
              onClick={() => setIsMenuOpen(false)}
            >
              Profil
            </Link>
            <Link
              to="/cart"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-orange-500 hover:bg-white/10"
              onClick={() => setIsMenuOpen(false)}
            >
              Panier
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default MainNavbar;
