import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

interface BackToHomeProps {
  variant?: 'icon' | 'text' | 'full';
  className?: string;
}

const BackToHome: React.FC<BackToHomeProps> = ({ 
  variant = 'full', 
  className = "" 
}) => {
  const baseClasses = "backdrop-blur-md bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300";
  
  if (variant === 'icon') {
    return (
      <Button 
        asChild 
        variant="outline" 
        size="sm" 
        className={`rounded-full w-12 h-12 p-0 ${baseClasses} ${className}`}
      >
        <Link to="/">
          <Home className="h-5 w-5" />
        </Link>
      </Button>
    );
  }
  
  if (variant === 'text') {
    return (
      <Button 
        asChild 
        variant="outline" 
        size="sm" 
        className={`${baseClasses} ${className}`}
      >
        <Link to="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Accueil
        </Link>
      </Button>
    );
  }
  
  return (
    <Button 
      asChild 
      variant="outline" 
      size="lg" 
      className={`${baseClasses} ${className}`}
    >
      <Link to="/">
        <Home className="h-5 w-5 mr-2" />
        Retour à l'accueil
      </Link>
    </Button>
  );
};

export default BackToHome; 