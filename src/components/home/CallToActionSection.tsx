
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CallToActionSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-gradient-to-r from-orange-500/20 to-pink-500/20 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Prêt à commencer ?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs satisfaits et découvrez une nouvelle façon de commander et de se déplacer à Brazzaville
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => navigate('/order')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-full text-lg transition-colors"
            >
              Commander maintenant
            </button>
            <button
              onClick={() => navigate('/delivery')}
              className="bg-white/20 hover:bg-white/30 text-white font-semibold px-8 py-4 rounded-full text-lg backdrop-blur-sm transition-colors"
            >
              Découvrir nos services
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-white font-semibold mb-2">Rapide</h3>
              <p className="text-white/70 text-sm">Livraison en moins de 30 minutes</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-white font-semibold mb-2">Sécurisé</h3>
              <p className="text-white/70 text-sm">Paiement sécurisé et traçabilité</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-white font-semibold mb-2">Qualité</h3>
              <p className="text-white/70 text-sm">Restaurants sélectionnés avec soin</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
