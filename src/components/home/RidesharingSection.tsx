
import React from 'react';
import { useNavigate } from 'react-router-dom';

const RidesharingSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="text-8xl mb-4">🚗</div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8">
              <h3 className="text-xl font-semibold text-white mb-2">Économisez ensemble</h3>
              <p className="text-white/70">Partagez vos trajets et réduisez vos coûts</p>
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white mb-6">Covoiturage</h2>
            <p className="text-xl text-white/80 mb-8">
              Partagez vos trajets avec d'autres utilisateurs et économisez sur vos déplacements. 
              Une solution écologique et économique pour vos voyages.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">✓</div>
                <span className="text-white/90">Trajets partagés</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">✓</div>
                <span className="text-white/90">Économies garanties</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">✓</div>
                <span className="text-white/90">Impact écologique</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/covoiturage')}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-full text-lg transition-colors"
            >
              Trouver un trajet
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RidesharingSection;
