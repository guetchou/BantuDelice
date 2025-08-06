import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface GlassCTAProps {
  title: string;
  description: string;
  primaryButton: {
    text: string;
    href: string;
  };
  secondaryButton?: {
    text: string;
    href: string;
  };
  backgroundImage?: string;
  className?: string;
}

const GlassCTA: React.FC<GlassCTAProps> = ({
  title,
  description,
  primaryButton,
  secondaryButton,
  backgroundImage,
  className = ""
}) => {
  return (
    <section className={`relative py-16 bg-gradient-to-r from-orange-600 to-pink-600 text-white overflow-hidden ${className}`}>
      {/* Arrière-plan avec image */}
      {backgroundImage && (
        <>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0">
            <img 
              src={backgroundImage} 
              alt="Background" 
              className="w-full h-full object-cover opacity-10"
            />
          </div>
        </>
      )}
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl font-bold mb-6">{title}</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          {description}
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Button 
            asChild 
            variant="outline" 
            size="lg" 
            className="backdrop-blur-md bg-white/20 border-white/40 text-white hover:bg-white/30 hover:border-white/60 transition-all duration-300"
          >
            <Link to={primaryButton.href}>{primaryButton.text}</Link>
          </Button>
          {secondaryButton && (
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="backdrop-blur-md bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300"
            >
              <Link to={secondaryButton.href}>{secondaryButton.text}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default GlassCTA; 