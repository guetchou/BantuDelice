
import React from 'react';
import { Link } from 'react-router-dom';

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
              <li><Link to="/order" className="text-white/70 hover:text-white transition">Livraison de nourriture</Link></li>
              <li><Link to="/taxi" className="text-white/70 hover:text-white transition">Service de taxi</Link></li>
              <li><Link to="/services/colis" className="text-white/70 hover:text-white transition">Livraison de colis</Link></li>
              <li><Link to="/covoiturage" className="text-white/70 hover:text-white transition">Covoiturage</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Entreprise</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-white/70 hover:text-white transition">À propos</Link></li>
              <li><Link to="/careers" className="text-white/70 hover:text-white transition">Carrières</Link></li>
              <li><Link to="/partners" className="text-white/70 hover:text-white transition">Partenaires</Link></li>
              <li><Link to="/contact" className="text-white/70 hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-white/70 hover:text-white transition">Aide</Link></li>
              <li><Link to="/faq" className="text-white/70 hover:text-white transition">FAQ</Link></li>
              <li><Link to="/terms" className="text-white/70 hover:text-white transition">Conditions</Link></li>
              <li><Link to="/privacy" className="text-white/70 hover:text-white transition">Confidentialité</Link></li>
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
