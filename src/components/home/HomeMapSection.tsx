
import React from 'react';

const HomeMapSection = () => {
  return (
    <section className="py-16 bg-white/5 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Carte Interactive</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Découvrez les restaurants et services disponibles près de chez vous
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
          <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center text-white/60">
              <div className="text-6xl mb-4">🗺️</div>
              <p className="text-lg">Carte interactive en cours de développement</p>
              <p className="text-sm mt-2">Bientôt disponible pour localiser les services</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeMapSection;
