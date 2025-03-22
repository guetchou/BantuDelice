
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Home, Utensils, Info, LogIn, UserPlus, ShoppingBag, Heart, Settings, CreditCard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
  className?: string;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ className }) => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className={cn(className)}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="flex flex-col h-full py-6">
            <div className="text-lg font-bold mb-6">Buntudelice</div>
            
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="flex items-center px-2 py-2 rounded-md hover:bg-muted transition-colors"
                onClick={() => setOpen(false)}
              >
                <Home className="mr-2 h-5 w-5" />
                Accueil
              </Link>
              
              <Link 
                to="/restaurants" 
                className="flex items-center px-2 py-2 rounded-md hover:bg-muted transition-colors"
                onClick={() => setOpen(false)}
              >
                <Utensils className="mr-2 h-5 w-5" />
                Restaurants
              </Link>
              
              <Link 
                to="/about" 
                className="flex items-center px-2 py-2 rounded-md hover:bg-muted transition-colors"
                onClick={() => setOpen(false)}
              >
                <Info className="mr-2 h-5 w-5" />
                À propos
              </Link>
            </div>
            
            <div className="mt-auto">
              {user ? (
                <div className="flex flex-col space-y-3">
                  <Link 
                    to="/orders" 
                    className="flex items-center px-2 py-2 rounded-md hover:bg-muted transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Commandes
                  </Link>
                  
                  <Link 
                    to="/favorites" 
                    className="flex items-center px-2 py-2 rounded-md hover:bg-muted transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <Heart className="mr-2 h-5 w-5" />
                    Favoris
                  </Link>
                  
                  <Link 
                    to="/wallet" 
                    className="flex items-center px-2 py-2 rounded-md hover:bg-muted transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    Portefeuille
                  </Link>
                  
                  <Link 
                    to="/settings" 
                    className="flex items-center px-2 py-2 rounded-md hover:bg-muted transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <Settings className="mr-2 h-5 w-5" />
                    Paramètres
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link 
                    to="/auth/login" 
                    className="flex items-center px-2 py-2 rounded-md hover:bg-muted transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <LogIn className="mr-2 h-5 w-5" />
                    Connexion
                  </Link>
                  
                  <Link 
                    to="/auth/register" 
                    className="flex items-center px-2 py-2 rounded-md hover:bg-muted transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <UserPlus className="mr-2 h-5 w-5" />
                    Inscription
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileMenu;
