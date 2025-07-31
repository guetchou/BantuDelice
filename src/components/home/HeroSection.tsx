import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, ChevronRight, Shield, Smartphone, Clock, ArrowDown } from "lucide-react";
import HeroSkeleton from "@/components/ui/HeroSkeleton";

// Hook pour détecter les préférences d'accessibilité
const useAccessibilityPreferences = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');

    setPrefersReducedMotion(motionQuery.matches);
    setPrefersHighContrast(contrastQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    const handleContrastChange = (e: MediaQueryListEvent) => setPrefersHighContrast(e.matches);

    motionQuery.addEventListener('change', handleMotionChange);
    contrastQuery.addEventListener('change', handleContrastChange);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      contrastQuery.removeEventListener('change', handleContrastChange);
    };
  }, []);

  return { prefersReducedMotion, prefersHighContrast };
};

// Hook pour gérer le chargement des images
const useImageLoading = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setIsImageLoaded(true);
    img.onerror = () => setIsImageLoaded(true); // Fallback si l'image échoue
    img.src = '/images/hero-bg-dynamic.webp';
  }, []);

  return isImageLoaded;
};

// Composant d'image optimisée avec fallback
const OptimizedHeroImage = () => (
  <picture className="absolute inset-0 w-full h-full">
    <source 
      srcSet="/images/hero-bg-dynamic.webp" 
      type="image/webp" 
    />
    <source 
      srcSet="/images/hero-bg-dynamic.jpg" 
      type="image/jpeg" 
    />
    <img
      src="/images/hero-bg-dynamic.jpg"
      alt="Vue dynamique de Brazzaville avec éléments de livraison"
      className="w-full h-full object-cover object-center opacity-90"
      loading="lazy"
      decoding="async"
      fetchPriority="high"
    />
  </picture>
);

// Composant d'indicateur de confiance accessible
const TrustIndicator = ({ 
  icon: Icon, 
  text, 
  color, 
  bg, 
  index 
}: {
  icon: React.ComponentType<any>;
  text: string;
  color: string;
  bg: string;
  index: number;
}) => (
  <div 
    className={`flex items-center justify-center gap-3 ${bg} rounded-xl px-4 py-3 border border-transparent hover:border-white/50 transition-all shadow-sm hover:shadow-md ${
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches 
        ? 'animate-fade-in-up' 
        : ''
    }`}
    style={{ animationDelay: `${0.3 + index * 0.1}s` }}
    role="listitem"
    aria-label={text}
  >
    <Icon className={`w-5 h-5 ${color}`} aria-hidden="true" />
    <span className="font-medium text-gray-800">{text}</span>
  </div>
);

// Composant d'indicateur de scroll accessible
const ScrollIndicator = ({ prefersReducedMotion }: { prefersReducedMotion: boolean }) => (
  <div 
    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
    role="button"
    tabIndex={0}
    aria-label="Faire défiler vers le bas"
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
      }
    }}
  >
    <div className="flex flex-col items-center">
      <div className="w-8 h-12 rounded-full border-2 border-orange-600/30 flex justify-center bg-white/80 backdrop-blur-sm">
        <div 
          className={`w-1 h-3 bg-orange-600 rounded-full mt-2 ${
            !prefersReducedMotion ? 'animate-scroll-indicator' : ''
          }`}
        />
      </div>
      <span className="text-xs text-orange-700/80 mt-2 tracking-wider">DÉFILER</span>
    </div>
  </div>
);

export default function HeroSection() {
  const navigate = useNavigate();
  const { prefersReducedMotion, prefersHighContrast } = useAccessibilityPreferences();
  const isImageLoaded = useImageLoading();

  const trustIndicators = [
    { icon: Clock, text: "Livraison en 30min", color: "text-orange-500", bg: "bg-orange-100" },
    { icon: Shield, text: "Paiement sécurisé", color: "text-emerald-600", bg: "bg-emerald-100" },
    { icon: Smartphone, text: "App gratuite", color: "text-blue-600", bg: "bg-blue-100" }
  ];

  // Afficher le skeleton pendant le chargement
  if (!isImageLoaded) {
    return <HeroSkeleton />;
  }

  return (
    <section 
      className={`relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 to-orange-100 ${
        prefersHighContrast ? 'border-2 border-orange-600' : ''
      }`}
      aria-labelledby="hero-title"
      role="banner"
    >
      {/* Fond optimisé */}
      <div className="absolute inset-0 overflow-hidden">
        <OptimizedHeroImage />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/40 to-white/70" />
      </div>

      {/* Contenu principal */}
      <div className="relative z-20 container mx-auto px-4 py-20 text-center">
        {/* Badge coloré avec accessibilité */}
        <div 
          className={`inline-flex items-center gap-2 bg-orange-500/10 backdrop-blur-sm border border-orange-500/20 rounded-full px-5 py-2.5 mb-8 ${
            !prefersReducedMotion ? 'animate-fade-in' : ''
          }`}
          role="status"
          aria-live="polite"
        >
          <Zap className="w-4 h-4 text-orange-600" aria-hidden="true" />
          <span className="text-sm font-medium text-orange-800 tracking-wide">
            +10,000 utilisateurs satisfaits
          </span>
        </div>

        {/* Titre optimisé avec hiérarchie typographique responsive */}
        <div className="mb-8 overflow-hidden">
          <h1 
            id="hero-title" 
            className="font-bold mb-4 leading-tight"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 4rem)',
              lineHeight: '1.1'
            }}
          >
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-700 pb-2">
              BantuDelice
            </span>
            <span 
              className="block font-medium text-gray-800 mt-4"
              style={{
                fontSize: 'clamp(1.125rem, 4vw, 1.5rem)',
                lineHeight: '1.4'
              }}
            >
              Votre super-app congolaise tout-en-un
            </span>
          </h1>
        </div>

        {/* Sous-titre avec meilleure lisibilité */}
        <p 
          className="text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed"
          style={{
            fontSize: 'clamp(1rem, 3vw, 1.25rem)'
          }}
        >
          Livraison express, transport fiable et services à domicile - 
          <span className="text-orange-600 font-medium"> simplifiez votre quotidien</span> avec une solution 100% locale
        </p>

        {/* Boutons CTA optimisés */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-16">
          <Button
            size="lg"
            className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => navigate('/delivery')}
            aria-label="Commander maintenant - Aller à la page de livraison"
          >
            <span className="relative z-10 flex items-center gap-2 text-lg font-semibold text-white">
              Commander maintenant
              <ChevronRight 
                className={`w-5 h-5 transition-transform duration-300 ${
                  !prefersReducedMotion ? 'group-hover:translate-x-1' : ''
                }`} 
                aria-hidden="true" 
              />
            </span>
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="border-orange-600 bg-white/80 text-orange-600 hover:bg-orange-600/10 hover:border-orange-700 px-8 py-6 rounded-xl backdrop-blur-sm hover:shadow-md transition-all duration-300"
            onClick={() => navigate('/explore')}
            aria-label="Réserver un service - Explorer les services disponibles"
          >
            <span className="flex items-center gap-2 text-lg font-semibold">
              Réserver un service
            </span>
          </Button>
        </div>

        {/* Indicateurs de confiance avec accessibilité */}
        <div 
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto"
          role="list"
          aria-label="Avantages de BantuDelice"
        >
          {trustIndicators.map((item, index) => (
            <TrustIndicator key={index} {...item} index={index} />
          ))}
        </div>
      </div>

      {/* Indicateur de scroll accessible */}
      <ScrollIndicator prefersReducedMotion={prefersReducedMotion} />

      {/* Effets visuels conditionnels */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-orange-400/10 blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-amber-300/10 blur-3xl animate-pulse delay-1000" />
        </div>
      )}

      {/* Styles CSS optimisés */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in,
          .animate-fade-in-up,
          .animate-scroll-indicator,
          .animate-pulse {
            animation: none !important;
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        @keyframes scroll-indicator {
          0% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(6px); opacity: 1; }
          100% { transform: translateY(0); opacity: 0.4; }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-scroll-indicator {
          animation: scroll-indicator 1.8s ease-in-out infinite;
        }

        /* Optimisations pour les écrans tactiles */
        @media (hover: none) and (pointer: coarse) {
          .hover\\:shadow-xl:hover {
            box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
          }
        }

        /* Amélioration du contraste pour l'accessibilité */
        @media (prefers-contrast: high) {
          .text-gray-800 {
            color: #000000;
          }
          .text-gray-700 {
            color: #1f2937;
          }
        }
      `}</style>
    </section>
  );
}