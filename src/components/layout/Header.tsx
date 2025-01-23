import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Coffee, Utensils, Salad, Truck, Cylinder, HeartHandshake } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-white">
            BuntuDélice
          </Link>

          <nav className="hidden md:flex space-x-4">
            {categories.map((category) => (
              <DropdownMenu key={category.name}>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center space-x-2 text-white hover:bg-orange-600"
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

          <Button 
            variant="outline" 
            className="md:hidden text-white border-white hover:bg-orange-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            Menu
          </Button>
        </div>
      </div>
    </header>
  );
}