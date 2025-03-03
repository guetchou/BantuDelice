
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2,
  UserRound, 
  ShoppingCart,
  Bell,
  Menu,
  X,
  Home,
  Wallet,
  Car,
  Package
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCart } from '@/contexts/CartContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { state: cartState } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const cartItemCount = cartState.items.reduce((sum, item) => sum + item.quantity, 0);

  const menuItems = [
    { name: 'Accueil', icon: Home, path: '/' },
    { name: 'Restaurants', icon: Building2, path: '/restaurants' },
    { name: 'Taxi', icon: Car, path: '/taxi' },
    { name: 'Commandes', icon: Package, path: '/orders' },
    { name: 'Wallet', icon: Wallet, path: '/wallet' },
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 to-gray-800 shadow-xl"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-2xl font-bold text-white hover:text-gray-200 transition-colors"
          >
            <Building2 className="w-8 h-8" />
            <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              EazyCongo
            </span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Button 
                key={item.name}
                variant="ghost" 
                className="flex items-center space-x-2 text-white hover:bg-white/10 transition-colors"
                onClick={() => navigate(item.path)}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Button>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              className="relative text-white hover:bg-white/10"
              onClick={() => toast({
                title: "Panier",
                description: "Votre panier contient " + cartItemCount + " articles"
              })}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>

            <Button 
              variant="ghost" 
              className="relative text-white hover:bg-white/10"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-white/10"
                >
                  <UserRound className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl"
                align="end"
              >
                <DropdownMenuItem className="font-medium">
                  <Link to="/profile" className="w-full">Mon Profil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="font-medium">
                  <Link to="/orders" className="w-full">Mes Commandes</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="font-medium">
                  <Link to="/wallet" className="w-full">Mon Wallet</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600 font-medium">
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              variant="ghost" 
              className="lg:hidden text-white hover:bg-white/10"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-gray-800 border-t border-gray-700"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <Button
                    key={item.name}
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10"
                    onClick={() => {
                      navigate(item.path);
                      setIsOpen(false);
                    }}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Button>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
