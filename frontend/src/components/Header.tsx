import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import Icons from "./ui/IconLibrary";

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState<unknown>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <header className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-30" role="banner">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2 gap-2">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => navigate("/")}
          onKeyDown={(e) => e.key === 'Enter' && navigate("/")}
          tabIndex={0}
          role="button"
          aria-label="Retour à l'accueil BantuDelice"
        >
          <span className="inline-block w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl" aria-hidden="true">B</span>
          <span className="font-bold text-lg text-gray-900 dark:text-white tracking-tight hidden sm:block">BantuDelice</span>
        </div>

        {/* Search bar */}
        <div className="flex-1 mx-2 max-w-md hidden sm:flex">
          <input
            type="text"
            placeholder="Que voulez-vous faire aujourd'hui ?"
            className="w-full rounded-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
            aria-label="Rechercher un service"
          />
        </div>

        {/* Quick icons */}
        <nav className="flex items-center gap-2" aria-label="Actions rapides">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full"
            aria-label={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'}
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
          >
            {theme === 'dark' ? <Icons.sun className="w-5 h-5" /> : <Icons.moon className="w-5 h-5" />}
          </Button>
          {user ? (
            <>
              <Button variant="ghost" size="sm" className="rounded-full" aria-label="Mon panier" onClick={() => navigate('/cart')}>
                <Icons.shopping className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full" aria-label="Mon profil" onClick={() => navigate('/profile')}>
                <Icons.settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full" aria-label="Déconnexion" onClick={handleLogout}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="rounded-full" aria-label="Se connecter" onClick={() => navigate('/login')}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full" aria-label="Changer de langue">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </Button>
            </>
          )}
        </nav>
      </div>

      {/* Mobile search bar */}
      <div className="px-4 pb-2 block sm:hidden">
        <input
          type="text"
          placeholder="Que voulez-vous faire aujourd'hui ?"
          className="w-full rounded-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
          aria-label="Rechercher un service"
        />
      </div>
    </header>
  );
} 