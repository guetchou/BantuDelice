
import React from 'react';

const FooterSection = () => {
  return (
    <footer className="bg-black/80 backdrop-blur-sm border-t border-white/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Buntudelice</h3>
            <p className="text-white/70 mb-4">
              Votre plateforme de livraison de nourriture et services à Brazzaville
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/70 hover:text-white transition">📘</a>
              <a href="#" className="text-white/70 hover:text-white transition">📷</a>
              <a href="#" className="text-white/70 hover:text-white transition">🐦</a>
              <a href="#" className="text-white/70 hover:text-white transition">💬</a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-white transition">Livraison de nourriture</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition">Service de taxi</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition">Livraison de colis</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition">Covoiturage</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Entreprise</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-white transition">À propos</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition">Carrières</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition">Partenaires</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-white transition">Aide</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition">FAQ</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition">Conditions</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition">Confidentialité</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-white/70">
            © 2024 Buntudelice par Top Center. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
