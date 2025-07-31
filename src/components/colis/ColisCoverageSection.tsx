import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

const ColisCoverageSection: React.FC = () => {
  const cities = [
    'Brazzaville', 'Pointe-Noire', 'Dolisie', 'Nkayi', 'Ouesso', 'Gamboma', 
    'Madingou', 'Mossendjo', 'Kinkala', 'Loandjili', 'Djambala', 'Ewo',
    'Sibiti', 'Impfondo', 'Makoua'
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-700">Couverture Nationale</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Notre réseau postal couvre les 15 départements du Congo avec des agences dans chaque ville principale
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-100 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">15</div>
                <div className="text-sm text-gray-600">Départements</div>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">50+</div>
                <div className="text-sm text-gray-600">Agences</div>
              </div>
              <div className="bg-emerald-100 p-4 rounded-lg">
                <div className="text-2xl font-bold text-emerald-600">24h</div>
                <div className="text-sm text-gray-600">Délai max</div>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">100%</div>
                <div className="text-sm text-gray-600">Couverture</div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Villes principales desservies :</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {cities.slice(0, 8).map((city) => (
                  <div key={city} className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-orange-600" />
                    <span>{city}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <img 
              src="/images/bg-colis4.jpeg" 
              alt="Carte du Congo avec couverture nationale"
              className="w-full h-auto rounded-2xl shadow-lg object-cover"
              style={{ aspectRatio: '3/2' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                Voir la carte interactive
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ColisCoverageSection; 