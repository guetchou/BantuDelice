import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/ColisAuthContext';
import { LoyaltyStatus } from '@/components/LoyaltyStatus';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  // Effet de scroll pour changer l'opacité
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const avatarUrl = user?.avatar || user?.photoURL;

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-white/20 dark:border-black/30 shadow-lg' 
          : 'backdrop-blur-md bg-white/40 dark:bg-black/40 border-b border-white/10 dark:border-black/20'
      }`}
    >
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        <Link   
          to="/" 
          className="text-xl font-bold text-foreground hover:text-primary transition-colors flex items-center gap-2"
        >
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Buntudelice
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-foreground/70 hover:text-foreground hover:bg-white/20 dark:hover:bg-black/20 backdrop-blur-sm transition-all duration-200"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 transition-transform hover:scale-110" />
            ) : (
              <Moon className="h-5 w-5 transition-transform hover:scale-110" />
            )}
          </Button>
          
          {isLoading ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-9 w-9 rounded-full hover:bg-white/20 dark:hover:bg-black/20 backdrop-blur-sm transition-all duration-200"
                >
                  <Avatar className="h-8 w-8 ring-2 ring-primary/30 hover:ring-primary/50 transition-all">
                    <AvatarImage src={avatarUrl || undefined} alt={user?.email || "Profile"} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
                      {user?.email?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-56 rounded-lg border-white/20 dark:border-black/30 shadow-xl backdrop-blur-xl bg-white/90 dark:bg-black/90" 
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
                  className="cursor-pointer focus:bg-primary/10 focus:text-primary hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                >
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate('/orders')}
                  className="cursor-pointer focus:bg-primary/10 focus:text-primary hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                >
                  Mes commandes
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate('/favorites')}
                  className="cursor-pointer focus:bg-primary/10 focus:text-primary hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                >
                  Favoris
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate('/loyalty')}
                  className="cursor-pointer focus:bg-primary/10 focus:text-primary hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                >
                  Programme de fidélité
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate('/settings')}
                  className="cursor-pointer focus:bg-primary/10 focus:text-primary hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                >
                  Paramètres
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/20 dark:bg-black/30" />
                <DropdownMenuItem className="focus:bg-transparent">
                  <LoyaltyStatus />
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/20 dark:bg-black/30" />
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Déconnexion
                  <LogOut className="ml-auto h-4 w-4" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                to="/auth" 
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-white/20 dark:hover:bg-black/20 backdrop-blur-sm"
              >
                Se connecter
              </Link>
              <Link
                to="/auth"
                className="px-4 py-1.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-primary/20 hover:scale-105"
              >
                S'inscrire
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;