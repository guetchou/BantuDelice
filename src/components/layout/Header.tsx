
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { apiClient } from '@/integrations/api/client';
import { useUser } from '@/hooks/useUser';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import MobileMenu from './header/MobileMenu';
import UserMenu from './header/UserMenu';
import DesktopNav from './header/DesktopNav';
import SearchBar from './header/SearchBar';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useUser();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    try {
      await apiClient.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery)}`);
      setOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Mobile Menu */}
        <MobileMenu 
          isAdmin={isAdmin()} 
          open={open} 
          setOpen={setOpen} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          handleSearch={handleSearch}
        />
        
        {/* Logo */}
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="hidden font-bold sm:inline-block">EazyCongo</span>
        </Link>
        
        {/* Desktop Navigation */}
        <DesktopNav isAdmin={isAdmin()} />
        
        <div className="flex-1" />
        
        {/* Desktop Search */}
        <SearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          handleSearch={handleSearch}
        />
        
        {/* Theme Switcher */}
        <ThemeSwitcher />
        
        {/* User Menu or Login Button */}
        <AnimatePresence>
          {user ? (
            <UserMenu 
              user={user} 
              isAdmin={isAdmin()} 
              handleLogout={handleLogout}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button onClick={() => navigate('/auth')} variant="default">
                Connexion
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
