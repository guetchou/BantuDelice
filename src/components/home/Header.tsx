
import { ChevronDown, Search, User, ShoppingCart, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SearchBar from "./SearchBar";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useApiAuth } from "@/contexts/ApiAuthContext";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Header = ({ searchQuery, setSearchQuery }: HeaderProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useApiAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <motion.header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/90 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-8">
          <div className="flex items-center gap-12">
            <motion.h1 
              className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent"
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Buntudelice
            </motion.h1>
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative group"
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-white/10 hover:text-primary">
                    Menu <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-black/90 backdrop-blur-lg border-white/20">
                  <DropdownMenuItem onClick={() => navigate('/restaurants')} className="text-white hover:bg-white/10 hover:text-primary cursor-pointer">
                    Restaurants
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/delivery')} className="text-white hover:bg-white/10 hover:text-primary cursor-pointer">
                    Livraison
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/taxis')} className="text-white hover:bg-white/10 hover:text-primary cursor-pointer">
                    Taxis
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/covoiturage')} className="text-white hover:bg-white/10 hover:text-primary cursor-pointer">
                    Covoiturage
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/contact')} className="text-white hover:bg-white/10 hover:text-primary cursor-pointer">
                    Contact
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>

            {isAuthenticated ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-white/10 hover:text-primary"
                  onClick={() => navigate('/profile')}
                >
                  <User className="w-5 h-5 mr-2" />
                  Mon Profil
                </Button>
              </motion.div>
            ) : (
              <div className="flex items-center gap-2">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button 
                    variant="ghost" 
                    className="text-white hover:bg-white/10 hover:text-primary"
                    onClick={() => navigate('/auth')}
                  >
                    Connexion
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button 
                    variant="default"
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => navigate('/auth?signup=true')}
                  >
                    Inscription
                  </Button>
                </motion.div>
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 hover:text-primary relative"
                onClick={() => navigate('/cart')}
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </Button>
            </motion.div>
          </nav>

          <div className="md:hidden">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
