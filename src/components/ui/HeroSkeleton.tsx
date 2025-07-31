import React from 'react';

const HeroSkeleton: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Skeleton pour l'image de fond */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-amber-300 animate-pulse" />
      
      {/* Contenu principal skeleton */}
      <div className="relative z-20 container mx-auto px-4 py-20 text-center">
        {/* Badge skeleton */}
        <div className="inline-flex items-center gap-2 bg-orange-200/50 rounded-full px-5 py-2.5 mb-8 animate-pulse">
          <div className="w-4 h-4 bg-orange-300 rounded-full" />
          <div className="w-32 h-4 bg-orange-300 rounded" />
        </div>

        {/* Titre skeleton */}
        <div className="mb-8 space-y-4">
          <div className="w-64 h-16 bg-orange-200 rounded-lg mx-auto animate-pulse" />
          <div className="w-80 h-8 bg-orange-200 rounded-lg mx-auto animate-pulse" />
        </div>

        {/* Sous-titre skeleton */}
        <div className="mb-12 max-w-3xl mx-auto space-y-2">
          <div className="w-full h-6 bg-orange-200 rounded animate-pulse" />
          <div className="w-3/4 h-6 bg-orange-200 rounded mx-auto animate-pulse" />
        </div>

        {/* Boutons skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-16">
          <div className="w-48 h-14 bg-orange-200 rounded-xl animate-pulse" />
          <div className="w-48 h-14 bg-orange-200 rounded-xl animate-pulse" />
        </div>

        {/* Indicateurs skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-center gap-3 bg-orange-100 rounded-xl px-4 py-3 animate-pulse">
              <div className="w-5 h-5 bg-orange-300 rounded-full" />
              <div className="w-24 h-4 bg-orange-300 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Indicateur de scroll skeleton */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center">
          <div className="w-8 h-12 rounded-full border-2 border-orange-300 bg-orange-100 animate-pulse" />
          <div className="w-16 h-3 bg-orange-200 rounded mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSkeleton; 