
import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Car, 
  UtensilsCrossed, 
  User, 
  LayoutList, 
  LogOut,
  ChevronDown,
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from "@/hooks/useAuth";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Navigation links
  const navLinks = [
    { to: "/restaurants", label: "Restaurants", icon: <UtensilsCrossed className="h-5 w-5" /> },
    { to: "/taxi", label: "Taxi", icon: <Car className="h-5 w-5" /> },
    { to: "/covoiturage", label: "Covoiturage", icon: <User className="h-5 w-5" /> },
    { to: "/orders", label: "Commandes", icon: <LayoutList className="h-5 w-5" /> },
  ];
  
  // Handle scroll for header effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
  // Get initials for avatar
  const getUserInitials = () => {
    if (!user) return "U";
    return user.first_name?.charAt(0) || user.email?.charAt(0) || "U";
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header 
        className={`sticky top-0 z-40 transition-all duration-200 ${
          scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-white'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Mobile Menu Button */}
            <div className="flex items-center">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] p-0">
                  <SheetHeader className="p-6 border-b">
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="py-4">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.to}>
                        <NavLink
                          to={link.to}
                          className={({ isActive }) => `
                            flex items-center px-6 py-3 hover:bg-gray-100
                            ${isActive ? 'text-primary font-medium bg-gray-50' : 'text-gray-600'}
                          `}
                        >
                          {link.icon}
                          <span className="ml-3">{link.label}</span>
                        </NavLink>
                      </SheetClose>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
              
              <NavLink to="/" className="font-bold text-2xl text-primary">
                BuntuDelice
              </NavLink>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => `
                    px-3 py-2 rounded-md flex items-center gap-2 transition-colors
                    ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600 hover:bg-gray-100'}
                  `}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </nav>
            
            {/* User Menu & Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-gray-600">
                <Search className="h-5 w-5" />
              </Button>
              
              <Button variant="ghost" size="icon" className="text-gray-600">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center">
                  2
                </Badge>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <NavLink to="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Profil</span>
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <NavLink to="/orders" className="flex items-center gap-2">
                      <LayoutList className="h-4 w-4" />
                      <span>Commandes</span>
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-100 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-primary">BuntuDelice</h2>
              <p className="text-gray-600 max-w-md">
                La plateforme de services digitaux tout-en-un pour Brazzaville : 
                restaurants, taxi, covoiturage et plus encore.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-3">Services</h3>
                <ul className="space-y-2 text-gray-600">
                  <li><a href="/restaurants" className="hover:text-primary">Restaurants</a></li>
                  <li><a href="/taxi" className="hover:text-primary">Taxi</a></li>
                  <li><a href="/covoiturage" className="hover:text-primary">Covoiturage</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Légal</h3>
                <ul className="space-y-2 text-gray-600">
                  <li><a href="#" className="hover:text-primary">Confidentialité</a></li>
                  <li><a href="#" className="hover:text-primary">Conditions</a></li>
                  <li><a href="#" className="hover:text-primary">Cookies</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Contact</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>support@buntudelice.com</li>
                  <li>+242 123 456 789</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} BuntuDelice. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
