
import React from 'react';
import { useNavigate } from 'react-router-dom';

const TaxiSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-white mb-6">Service de Taxi</h2>
            <p className="text-xl text-white/80 mb-8">
              Réservez un taxi en quelques clics et arrivez à destination en toute sécurité. 
              Nos chauffeurs professionnels sont disponibles 24h/24.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">✓</div>
                <span className="text-white/90">Réservation instantanée</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">✓</div>
                <span className="text-white/90">Suivi en temps réel</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">✓</div>
                <span className="text-white/90">Paiement sécurisé</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/delivery')}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-4 rounded-full text-lg transition-colors"
            >
              Réserver un taxi
            </button>
          </div>
          <div className="text-center">
            <div className="text-8xl mb-4">🚕</div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-2">Disponible maintenant</h3>
              <p className="text-white/70">Temps d'attente moyen : 5-10 minutes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TaxiSection;
