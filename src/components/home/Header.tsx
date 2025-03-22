
import { ChevronDown } from "lucide-react";
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
import { mockData } from "@/utils/mockData";
import { useApiAuth } from "@/contexts/ApiAuthContext";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Header = ({ searchQuery, setSearchQuery }: HeaderProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useApiAuth();

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-8">
          <div className="flex items-center gap-12">
            <h1 
              className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent"
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            >
              Buntudelice
            </h1>
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
          
          <nav className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 border-white/30 text-white hover:bg-white/10 hover:border-white">
                  Menu <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-black/90 backdrop-blur-lg border-white/20">
                <DropdownMenuItem onClick={() => navigate('/restaurants')} className="text-white hover:bg-white/10">
                  Restaurants
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/delivery')} className="text-white hover:bg-white/10">
                  Livraison
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/taxis')} className="text-white hover:bg-white/10">
                  Taxis
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/covoiturage')} className="text-white hover:bg-white/10">
                  Covoiturage
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/contact')} className="text-white hover:bg-white/10">
                  Contact
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {isAuthenticated ? (
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10"
                onClick={() => navigate('/profile')}
              >
                Mon Profil
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-white/10"
                  onClick={() => navigate('/auth')}
                >
                  Connexion
                </Button>
                <Button 
                  variant="default"
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => navigate('/auth?signup=true')}
                >
                  Inscription
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
