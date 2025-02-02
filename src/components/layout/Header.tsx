import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronDown, 
  Coffee, 
  Utensils, 
  Salad, 
  Truck, 
  Cylinder, 
  HeartHandshake,
  ShoppingCart,
  Bell,
  User
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
import { motion } from "framer-motion";

const categories = [
  {
    name: 'Tout',
    icon: Coffee,
    items: ['Restaurants', 'Services', 'Livraison']
  },
  {
    name: 'Congolais',
    icon: Utensils,
    items: ['Plats traditionnels', 'Grillades', 'Poisson']
  },
  {
    name: 'Fast Food',
    icon: Coffee,
    items: ['Burgers', 'Pizza', 'Sandwiches']
  },
  {
    name: 'Healthy',
    icon: Salad,
    items: ['Salades', 'Jus frais', 'Bio']
  },
  {
    name: 'Livraison',
    icon: Truck,
    items: ['Express', 'Standard', 'Planifiée']
  },
  {
    name: 'Gaz',
    icon: Cylinder,
    items: ['Recharge', 'Nouvelle bouteille', 'Accessoires']
  },
  {
    name: 'Services',
    icon: HeartHandshake,
    items: ['Taxi', 'Courses', 'Autres']
  }
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { state: cartState } = useCart();
  const { toast } = useToast();

  const cartItemCount = cartState.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-white hover:text-orange-100 transition-colors">
            BuntuDélice
          </Link>

          <nav className="hidden md:flex space-x-4">
            {categories.map((category) => (
              <DropdownMenu key={category.name}>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center space-x-2 text-white hover:bg-orange-600 hover:text-white transition-colors"
                  >
                    <category.icon className="w-4 h-4" />
                    <span>{category.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white/90 backdrop-blur-md border border-orange-200">
                  {category.items.map((item) => (
                    <DropdownMenuItem 
                      key={item}
                      className="hover:bg-orange-100 cursor-pointer"
                    >
                      {item}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="relative text-white hover:bg-orange-600"
              onClick={() => toast({
                title: "Panier",
                description: "Votre panier contient " + cartItemCount + " articles"
              })}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>

            <Button 
              variant="ghost" 
              className="relative text-white hover:bg-orange-600"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-orange-600"
                >
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white/90 backdrop-blur-md">
                <DropdownMenuItem>
                  <Link to="/profile" className="w-full">Mon Profil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/orders" className="w-full">Mes Commandes</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/settings" className="w-full">Paramètres</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              variant="outline" 
              className="md:hidden text-white border-white hover:bg-orange-600"
              onClick={() => setIsOpen(!isOpen)}
            >
              Menu
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}