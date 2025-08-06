import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, ShoppingBag, Sun, Moon } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const navLinks = [
  { label: "Accueil", to: "/" },
  { label: "Restaurants", to: "/restaurants" },
  { label: "Taxi", to: "/taxi" },
  { label: "Colis", to: "/colis" },
  { label: "Covoiturage", to: "/covoiturage" },
  { label: "Services", to: "/services" },
  { label: "Contact", to: "/contact" },
  { label: "Panier", to: "/cart", icon: <ShoppingBag className="inline w-5 h-5 mb-1 mr-1" /> },
];

export default function NavbarGlassmorphism() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, isLoading, logout } = useAuth();

  // Effet de scroll pour changer l'opacité et l'effet glass
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const avatarUrl = undefined; // Pas d'avatar pour l'instant

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Cart Drawer (affiché si ouvert) */}
      {cartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm" onClick={() => setCartDrawerOpen(false)}>
          <div className="w-full max-w-md bg-white/95 dark:bg-black/95 backdrop-blur-xl h-full shadow-2xl border-l border-white/20 dark:border-black/30" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Votre panier</h2>
              <button className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 dark:hover:bg-black/20 transition-colors" onClick={() => setCartDrawerOpen(false)}><X /></button>
              <p>Contenu du panier ici...</p>
            </div>
          </div>
        </div>
      )}
      
      <nav
        className={`transition-all duration-500 ${
          scrolled 
            ? 'backdrop-blur-2xl bg-white/90 dark:bg-black/90 border-b border-white/30 dark:border-black/50 shadow-2xl' 
            : 'backdrop-blur-xl bg-white/60 dark:bg-black/60 border-b border-white/20 dark:border-black/30 shadow-lg'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 min-h-[80px] group">
            <div className="relative">
              <img
                src="/images/logo/logo.png"
                alt="Buntudelice Logo"
                className={`h-20 w-20 object-contain rounded-full shadow-lg border-2 border-white/60 bg-white/80 transition-all duration-300 group-hover:scale-105 ${
                  scrolled ? 'shadow-2xl' : 'shadow-lg'
                }`}
                style={{ minWidth: 80, minHeight: 80 }}
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span className="text-3xl font-extrabold text-orange-500 tracking-tight drop-shadow-lg hidden sm:inline-block align-middle leading-tight">
              
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            {navLinks.filter(link => link.label !== "Panier").map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="relative px-3 py-2 rounded-lg font-medium text-white dark:text-white hover:text-orange-400 transition-all duration-200 group flex items-center hover:bg-white/10 dark:hover:bg-black/10 backdrop-blur-sm"
              >
                {link.icon && link.icon}
                <span>{link.label}</span>
                <span className="absolute left-1/2 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full transition-all duration-300 group-hover:w-3/4 group-hover:h-1 -translate-x-1/2"></span>
              </Link>
            ))}
            <button
              className="ml-4 px-5 py-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold shadow-lg hover:scale-105 hover:from-orange-600 hover:to-pink-600 transition-all duration-200 hover:shadow-orange-500/25"
              onClick={() => navigate("/order")}
            >
              Commander
            </button>
            
            {/* Icône panier avec effet glass */}
            <button
              className="ml-2 relative p-2 rounded-full bg-white/40 dark:bg-black/40 hover:bg-white/60 dark:hover:bg-black/60 transition-all duration-200 backdrop-blur-sm border border-white/20 dark:border-black/20 hover:border-white/40 dark:hover:border-black/40"
              onClick={() => setCartDrawerOpen(true)}
              aria-label="Panier"
            >
              <ShoppingBag className="w-7 h-7 text-orange-500" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow-lg animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Bouton thème avec effet glass */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/40 dark:bg-black/40 hover:bg-white/60 dark:hover:bg-black/60 transition-all duration-200 backdrop-blur-sm border border-white/20 dark:border-black/20 hover:border-white/40 dark:hover:border-black/40"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-orange-500 transition-transform hover:scale-110" />
              ) : (
                <Moon className="h-5 w-5 text-orange-500 transition-transform hover:scale-110" />
              )}
            </Button>
          </div>

          {/* Actions (profile) avec effet glass */}
          <div className="hidden md:flex items-center gap-2 ml-4">
            {isLoading ? (
              <div className="h-10 w-10 rounded-full bg-white/40 dark:bg-black/40 animate-pulse backdrop-blur-sm border border-white/20 dark:border-black/20" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-10 w-10 rounded-full bg-white/40 dark:bg-black/40 hover:bg-white/60 dark:hover:bg-black/60 transition-all duration-200 backdrop-blur-sm border border-white/20 dark:border-black/20 hover:border-white/40 dark:hover:border-black/40"
                  >
                    <Avatar className="h-8 w-8 ring-2 ring-orange-400/30 hover:ring-orange-400/50 transition-all">
                      <AvatarImage src={avatarUrl || undefined} alt={user?.email || "Profile"} />
                      <AvatarFallback className="bg-gradient-to-br from-orange-400/20 to-pink-400/10">
                        {user?.email?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-56 rounded-lg border-white/20 dark:border-black/30 shadow-2xl backdrop-blur-2xl bg-white/95 dark:bg-black/95" 
                  align="end" 
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.email}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        Bon retour !
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/20 dark:bg-black/30" />
                  <DropdownMenuItem 
                    onClick={() => navigate('/profile')}
                    className="cursor-pointer focus:bg-orange-400/10 focus:text-orange-400 hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                  >
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate('/orders')}
                    className="cursor-pointer focus:bg-orange-400/10 focus:text-orange-400 hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                  >
                    Mes commandes
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/20 dark:bg-black/30" />
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="cursor-pointer text-red-500 focus:bg-red-500/10 focus:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                className="p-2 rounded-full bg-white/40 dark:bg-black/40 hover:bg-white/60 dark:hover:bg-black/60 transition-all duration-200 backdrop-blur-sm border border-white/20 dark:border-black/20 hover:border-white/40 dark:hover:border-black/40"
                onClick={() => navigate("/auth")}
                aria-label="Profil"
              >
                <User className="w-5 h-5 text-orange-500" />
              </button>
            )}
          </div>

          {/* Mobile Hamburger avec effet glass */}
          <button
            className="md:hidden p-2 rounded-full bg-white/40 dark:bg-black/40 hover:bg-white/60 dark:hover:bg-black/60 transition-all duration-200 backdrop-blur-sm border border-white/20 dark:border-black/20 hover:border-white/40 dark:hover:border-black/40"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6 text-orange-500" /> : <Menu className="w-6 h-6 text-orange-500" />}
          </button>
        </div>

        {/* Mobile Menu avec effet glass */}
        {mobileOpen && (
          <div className="md:hidden px-4 pb-4 pt-2 bg-white/90 dark:bg-black/90 backdrop-blur-2xl shadow-2xl border-t border-white/20 dark:border-black/30 animate-fade-in-down">
            <div className="flex flex-col gap-2">
              {navLinks.filter(link => link.label !== "Panier").map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-4 py-3 rounded-lg font-semibold text-gray-900 dark:text-white hover:bg-orange-100 dark:hover:bg-orange-900/20 hover:text-orange-400 transition-all duration-200 flex items-center backdrop-blur-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.icon && link.icon}
                  {link.label}
                </Link>
              ))}
              <button
                className="mt-2 px-5 py-3 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold shadow-lg hover:scale-105 hover:from-orange-600 hover:to-pink-600 transition-all duration-200"
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/order");
                }}
              >
                Commander
              </button>
              
              {/* Icône panier mobile */}
              <button
                className="mt-2 relative p-3 rounded-full bg-white/40 dark:bg-black/40 hover:bg-white/60 dark:hover:bg-black/60 transition-all duration-200 backdrop-blur-sm border border-white/20 dark:border-black/20"
                onClick={() => {
                  setMobileOpen(false);
                  setCartDrawerOpen(true);
                }}
                aria-label="Panier"
              >
                <ShoppingBag className="w-7 h-7 text-orange-500 mx-auto" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow-lg">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
} 