
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
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
  return (
    <div className="min-h-screen bg-gray-50">
      {!hideBackButton && (
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <Link to={backLink}>
              <Button variant="ghost" className="flex items-center">
                <ChevronLeft className="mr-2 h-4 w-4" />
                {backText}
              </Button>
            </Link>
          </div>
        </div>
      )}
      
      <main>
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default Layout;
