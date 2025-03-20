
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useNavigation } from '@/contexts/NavigationContext';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface LayoutProps {
  children?: React.ReactNode;
  backLink?: string;
  backText?: string;
  hideBackButton?: boolean;
}

const Layout = ({ 
  children, 
  backLink = "/", 
  backText = "Retour",
  hideBackButton = false 
}: LayoutProps) => {
  const { navigate, currentPath } = useNavigation();

  // Si on est sur la page d'accueil ou la page d'auth, on utilise le layout par défaut
  if (currentPath === '/' || currentPath === '/auth') {
    return (
      <div className="min-h-screen bg-background">
        {!hideBackButton && currentPath !== '/' && (
          <div className="bg-card shadow-sm">
            <div className="container mx-auto px-4 py-4">
              <Button 
                variant="ghost" 
                className="flex items-center hover:bg-secondary"
                onClick={() => navigate(backLink)}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                {backText}
              </Button>
            </div>
          </div>
        )}
        
        <main className="animate-fade-in">
          {children || <Outlet />}
        </main>
      </div>
    );
  }
  
  // Sinon, on renvoie juste l'outlet pour que les autres layouts puissent être utilisés
  return children || <Outlet />;
};

export default Layout;
