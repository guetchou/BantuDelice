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

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Header = ({ searchQuery, setSearchQuery }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/10 border-b border-white/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Buntudelice
            </h1>
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
          <nav className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-white/10">
                  Menu <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white/10 backdrop-blur-lg border-white/20">
                <DropdownMenuItem onClick={() => navigate('/restaurants')} className="text-white hover:bg-white/10">
                  Restaurants
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/services')} className="text-white hover:bg-white/10">
                  Services
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/contact')} className="text-white hover:bg-white/10">
                  Contact
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;