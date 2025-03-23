
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
  Menu, X, User, ShoppingBag, Car, Users, Bell, MessageCircle, ChevronDown, Search, Home, Utensils, ArrowLeft 
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
  
  // Track active submenu to allow for back navigation from submenu
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSubmenuOpen = (menu: string) => {
    setActiveSubmenu(menu);
  };

  const handleBackFromSubmenu = () => {
    setActiveSubmenu(null);
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
                    className="text-white hover:bg-white/10 hover:text-orange-500 focus:bg-white/10 focus:text-orange-500"
                    onMouseOver={() => handleSubmenuOpen('main')}
                  >
                    Menu
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 w-[220px] bg-black/90 backdrop-blur-lg border-white/20">
                      {activeSubmenu === 'taxi' ? (
                        <>
                          <li className="mb-2">
                            <Button 
                              variant="ghost" 
                              className="flex items-center w-full justify-start p-2 text-white hover:bg-white/10"
                              onClick={handleBackFromSubmenu}
                            >
                              <ArrowLeft className="h-4 w-4 mr-2" />
                              Retour au menu
                            </Button>
                          </li>
                          <Separator className="my-2 bg-white/20" />
                          <li>
                            <Link to="/taxi/booking" onClick={() => setActiveSubmenu(null)}>
                              <NavigationMenuLink className="flex items-center gap-2 p-2 rounded-md text-white hover:bg-white/10">
                                <Car className="h-4 w-4 text-orange-500" />
                                <span>Réserver un taxi</span>
                              </NavigationMenuLink>
                            </Link>
                          </li>
                          <li>
                            <Link to="/taxi/history" onClick={() => setActiveSubmenu(null)}>
                              <NavigationMenuLink className="flex items-center gap-2 p-2 rounded-md text-white hover:bg-white/10">
                                <History className="h-4 w-4 text-orange-500" />
                                <span>Mes courses</span>
                              </NavigationMenuLink>
                            </Link>
                          </li>
                          <li>
                            <Link to="/taxi/locations" onClick={() => setActiveSubmenu(null)}>
                              <NavigationMenuLink className="flex items-center gap-2 p-2 rounded-md text-white hover:bg-white/10">
                                <MapPinned className="h-4 w-4 text-orange-500" />
                                <span>Mes adresses</span>
                              </NavigationMenuLink>
                            </Link>
                          </li>
                          <li>
                            <Link to="/taxi/subscription" onClick={() => setActiveSubmenu(null)}>
                              <NavigationMenuLink className="flex items-center gap-2 p-2 rounded-md text-white hover:bg-white/10">
                                <Calendar className="h-4 w-4 text-orange-500" />
                                <span>Abonnements</span>
                              </NavigationMenuLink>
                            </Link>
                          </li>
                          <li>
                            <Link to="/taxi/business" onClick={() => setActiveSubmenu(null)}>
                              <NavigationMenuLink className="flex items-center gap-2 p-2 rounded-md text-white hover:bg-white/10">
                                <Building2 className="h-4 w-4 text-orange-500" />
                                <span>Entreprises</span>
                              </NavigationMenuLink>
                            </Link>
                          </li>
                        </>
                      ) : (
                        <>
                          <li>
                            <Link to="/restaurants">
                              <NavigationMenuLink className="flex items-center gap-2 p-2 rounded-md text-white hover:bg-white/10">
                                <Utensils className="h-4 w-4 text-orange-500" />
                                <span>Restaurants</span>
                              </NavigationMenuLink>
                            </Link>
                          </li>
                          <li>
                            <Link to="/delivery">
                              <NavigationMenuLink className="flex items-center gap-2 p-2 rounded-md text-white hover:bg-white/10">
                                <ShoppingBag className="h-4 w-4 text-orange-500" />
                                <span>Livraison</span>
                              </NavigationMenuLink>
                            </Link>
                          </li>
                          <li>
                            <Button 
                              variant="ghost" 
                              className="flex items-center w-full justify-between p-2 text-white hover:bg-white/10"
                              onClick={() => handleSubmenuOpen('taxi')}
                            >
                              <div className="flex items-center">
                                <Car className="h-4 w-4 text-orange-500 mr-2" />
                                <span>Taxis</span>
                              </div>
                              <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
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
                                <MessageCircle className="h-4 w-4 text-orange-500" />
                                <span>Contact</span>
                              </NavigationMenuLink>
                            </Link>
                          </li>
                        </>
                      )}
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
          {activeSubmenu === 'taxi' ? (
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Button 
                variant="ghost" 
                className="flex items-center w-full justify-start p-2 text-white hover:bg-white/10"
                onClick={handleBackFromSubmenu}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au menu
              </Button>
              <Separator className="my-2 bg-white/20" />
              <Link
                to="/taxi/booking"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-orange-500 hover:bg-white/10"
                onClick={() => {
                  setIsMenuOpen(false);
                  setActiveSubmenu(null);
                }}
              >
                <div className="flex items-center">
                  <Car className="h-4 w-4 text-orange-500 mr-2" />
                  Réserver un taxi
                </div>
              </Link>
              <Link
                to="/taxi/history"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-orange-500 hover:bg-white/10"
                onClick={() => {
                  setIsMenuOpen(false);
                  setActiveSubmenu(null);
                }}
              >
                <div className="flex items-center">
                  <History className="h-4 w-4 text-orange-500 mr-2" />
                  Mes courses
                </div>
              </Link>
              <Link
                to="/taxi/locations"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-orange-500 hover:bg-white/10"
                onClick={() => {
                  setIsMenuOpen(false);
                  setActiveSubmenu(null);
                }}
              >
                <div className="flex items-center">
                  <MapPinned className="h-4 w-4 text-orange-500 mr-2" />
                  Mes adresses
                </div>
              </Link>
              <Link
                to="/taxi/subscription"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-orange-500 hover:bg-white/10"
                onClick={() => {
                  setIsMenuOpen(false);
                  setActiveSubmenu(null);
                }}
              >
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-orange-500 mr-2" />
                  Abonnements
                </div>
              </Link>
              <Link
                to="/taxi/business"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-orange-500 hover:bg-white/10"
                onClick={() => {
                  setIsMenuOpen(false);
                  setActiveSubmenu(null);
                }}
              >
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 text-orange-500 mr-2" />
                  Entreprises
                </div>
              </Link>
            </div>
          ) : (
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/restaurants"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-orange-500 hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <Utensils className="h-4 w-4 text-orange-500 mr-2" />
                  Restaurants
                </div>
              </Link>
              <Link
                to="/delivery"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-orange-500 hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <ShoppingBag className="h-4 w-4 text-orange-500 mr-2" />
                  Livraison
                </div>
              </Link>
              <Button
                variant="ghost"
                className="flex items-center w-full justify-between px-3 py-2 text-base font-medium text-white hover:text-orange-500 hover:bg-white/10"
                onClick={() => handleSubmenuOpen('taxi')}
              >
                <div className="flex items-center">
                  <Car className="h-4 w-4 text-orange-500 mr-2" />
                  <span>Taxis</span>
                </div>
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
              <Link
                to="/covoiturage"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-orange-500 hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-orange-500 mr-2" />
                  Covoiturage
                </div>
              </Link>
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-orange-500 hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <User className="h-4 w-4 text-orange-500 mr-2" />
                  Profil
                </div>
              </Link>
              <Link
                to="/cart"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-orange-500 hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <ShoppingBag className="h-4 w-4 text-orange-500 mr-2" />
                  Panier
                </div>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default MainNavbar;

// Import needed
const Separator = ({ className }: { className?: string }) => (
  <div className={cn("h-px w-full bg-gray-200", className)} />
);

const ChevronRight = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={cn("h-4 w-4", className)}
  >
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

const History = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={cn("h-4 w-4", className)}
  >
    <path d="M3 3v5h5"/>
    <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/>
    <path d="M12 7v5l4 2"/>
  </svg>
);

const MapPinned = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={cn("h-4 w-4", className)}
  >
    <path d="M18 8c0 4.5-6 9-6 9s-6-4.5-6-9a6 6 0 0 1 12 0"/>
    <circle cx="12" cy="8" r="2"/>
    <path d="M8.835 14H5a1 1 0 0 0-.9.7l-2 6c-.1.1-.1.2-.1.3 0 .6.4 1 1 1h18c.6 0 1-.4 1-1 0-.1 0-.2-.1-.3l-2-6a1 1 0 0 0-.9-.7h-3.835"/>
  </svg>
);

const Building2 = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={cn("h-4 w-4", className)}
  >
    <path d="M6 22V2a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v20Z"/>
    <path d="M6 12H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2"/>
    <path d="M18 12h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2"/>
    <path d="M10 7H8"/>
    <path d="M16 7h-2"/>
    <path d="M10 11H8"/>
    <path d="M16 11h-2"/>
    <path d="M10 15H8"/>
    <path d="M16 15h-2"/>
  </svg>
);

const Calendar = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={cn("h-4 w-4", className)}
  >
    <path d="M8 2v4"/>
    <path d="M16 2v4"/>
    <rect width="18" height="18" x="3" y="4" rx="2"/>
    <path d="M3 10h18"/>
  </svg>
);
