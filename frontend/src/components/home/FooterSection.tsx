
import React from 'react';
import { MapPin, PhoneCall, Calendar } from 'lucide-react';

const FooterSection = () => {
  return (
    <footer className="py-16 bg-black text-white border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-6">Buntudelice</h3>
            <p className="text-gray-400 mb-6">Votre plateforme de livraison et de services au Congo, disponible 24h/24 et 7j/7.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Restaurants</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Livraison</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Taxis</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Covoiturage</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Entreprise</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">À propos</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Carrières</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Devenir partenaire</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-500 mt-0.5" />
                <span className="text-gray-400">123 Avenue de la République, Brazzaville</span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneCall className="w-5 h-5 text-orange-500" />
                <span className="text-gray-400">+242 06 123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-orange-500" />
                <span className="text-gray-400">Lun-Dim: 8h-22h</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">&copy; 2023 Buntudelice. Tous droits réservés.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-orange-500 text-sm">Confidentialité</a>
            <a href="#" className="text-gray-500 hover:text-orange-500 text-sm">Conditions d'utilisation</a>
            <a href="#" className="text-gray-500 hover:text-orange-500 text-sm">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
