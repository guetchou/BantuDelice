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

// Note: This component is now deprecated since its functionality 
// has been moved to MainNavbar.tsx
// Keeping it for backwards compatibility
const Header = ({ searchQuery, setSearchQuery }: HeaderProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useApiAuth();
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

  // This component is now deprecated, navigation has been moved to MainNavbar.tsx
  return null;
};

export default Header;
