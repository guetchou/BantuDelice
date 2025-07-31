
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, MapPin, ShoppingBag, Wallet, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MobileMenuProps {
  isAdmin: boolean;
  open: boolean; 
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: (e: React.FormEvent) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isAdmin, 
  open, 
  setOpen, 
  searchQuery, 
  setSearchQuery, 
  handleSearch 
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Accueil', icon: <Home className="w-4 h-4 mr-2" />, path: '/home' },
    { label: 'Restaurants', icon: <MapPin className="w-4 h-4 mr-2" />, path: '/restaurants' },
    { label: 'Commandes', icon: <ShoppingBag className="w-4 h-4 mr-2" />, path: '/orders' },
    { label: 'Wallet', icon: <Wallet className="w-4 h-4 mr-2" />, path: '/wallet' },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="px-7">
          <Link to="/" className="flex items-center" onClick={() => setOpen(false)}>
            <span className="font-bold text-xl">EazyCongo</span>
          </Link>
        </div>
        <div className="px-4 py-4">
          <form onSubmit={handleSearch} className="relative mb-4">
            <Input
              placeholder="Rechercher un restaurant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10"
            />
            <Button 
              type="submit" 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-0 h-full"
            >
              🔍
            </Button>
          </form>
          <nav className="flex flex-col space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => {
                  navigate(item.path);
                  setOpen(false);
                }}
              >
                {item.icon}
                {item.label}
              </Button>
            ))}
            
            {isAdmin && (
              <Button
                variant={location.pathname === '/admin' ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => {
                  navigate('/admin');
                  setOpen(false);
                }}
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Admin
              </Button>
            )}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
