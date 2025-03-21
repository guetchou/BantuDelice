
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { 
  Menu, X, User, ShoppingBag, Car, Users, Bell, MessageCircle, ChevronDown
} from 'lucide-react';
import { cn } from "@/lib/utils";

const MainNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-orange-500">Buntudelice</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/restaurants">
                    <NavigationMenuLink 
                      className={cn(
                        "px-3 py-2 text-sm font-medium rounded-md",
                        isActive("/restaurants") 
                          ? "text-orange-500" 
                          : "text-gray-700 hover:text-orange-500"
                      )}
                    >
                      Restaurants
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger 
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-md",
                      isActive("/taxi") 
                        ? "text-orange-500" 
                        : "text-gray-700 hover:text-orange-500"
                    )}
                  >
                    Transport
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 w-[220px]">
                      <li>
                        <Link to="/taxi/booking">
                          <NavigationMenuLink className="flex items-center gap-2 p-2 rounded-md hover:bg-orange-50">
                            <Car className="h-4 w-4 text-orange-500" />
                            <span>Réserver un taxi</span>
                          </NavigationMenuLink>
                        </Link>
                      </li>
                      <li>
                        <Link to="/covoiturage">
                          <NavigationMenuLink className="flex items-center gap-2 p-2 rounded-md hover:bg-orange-50">
                            <Users className="h-4 w-4 text-orange-500" />
                            <span>Covoiturage</span>
                          </NavigationMenuLink>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart">
              <Button variant="ghost" size="icon" aria-label="Panier">
                <ShoppingBag className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/notifications">
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/messages">
              <Button variant="ghost" size="icon" aria-label="Messages">
                <MessageCircle className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="outline" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Profil</span>
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

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/restaurants"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Restaurants
            </Link>
            <Link
              to="/taxi/booking"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Taxi
            </Link>
            <Link
              to="/covoiturage"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Covoiturage
            </Link>
            <Link
              to="/profile"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Profil
            </Link>
            <Link
              to="/cart"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50"
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
