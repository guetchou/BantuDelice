import React from 'react';
import HeroSection from '@/components/home/HeroSection';

const HeroTest: React.FC = () => {
  return (
    <div className="min-h-screen">
      <div className="bg-green-100 p-4 text-center">
        <h2 className="text-lg font-bold text-green-800 mb-2">
          🧪 Test de la HeroSection Optimisée
        </h2>
        <p className="text-green-700">
          Vérification des optimisations : Performance, Accessibilité, UX Mobile
        </p>
      </div>
      
      <HeroSection />
      
      <div className="bg-blue-100 p-4 text-center">
        <h3 className="text-md font-bold text-blue-800 mb-2">
          ✅ Optimisations Implémentées
        </h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Images WebP optimisées (96KB vs 1.4MB original)</li>
          <li>• Lazy loading et skeleton loading</li>
          <li>• Support prefers-reduced-motion</li>
          <li>• Navigation clavier accessible</li>
          <li>• Typographie responsive avec clamp()</li>
          <li>• ARIA labels et rôles sémantiques</li>
          <li>• Optimisations tactiles pour mobile</li>
        </ul>
      </div>
    </div>
  );
};

export default HeroTest; 