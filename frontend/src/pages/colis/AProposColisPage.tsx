import React from 'react';

const AProposColisPage: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-100 to-yellow-200 py-12 px-4">
    <div className="max-w-3xl mx-auto bg-white/90 rounded-xl shadow-lg p-8 border border-yellow-200">
      <div className="flex items-center gap-4 mb-6">
        <img src="/images/logo/logo.png" alt="BantuDelice Colis" className="h-16 w-16 rounded-full border-2 border-yellow-400 shadow" />
        <h1 className="text-3xl font-extrabold text-orange-700">À propos de BantuDelice Colis</h1>
      </div>
      <p className="text-lg text-gray-700 mb-4">
        <b>BantuDelice Colis</b> est la solution moderne pour l’envoi, le suivi et la gestion de vos colis au Congo et à l’international.
        Notre mission : simplifier la logistique, offrir une expérience fluide et transparente, et connecter la diaspora à ses proches.
      </p>
      <ul className="list-disc pl-6 text-gray-800 mb-4">
        <li>Expédition nationale et internationale</li>
        <li>Suivi en temps réel, notifications à chaque étape</li>
        <li>Tarification claire, options d’assurance et de livraison express</li>
        <li>Portail opérateurs privés et diaspora</li>
        <li>Interopérabilité avec les acteurs majeurs (SOPECO, etc.)</li>
      </ul>
      <p className="text-gray-700 mb-2">
        <b>Contact :</b> <a href="mailto:contact@bantudelice.com" className="text-orange-700 underline">contact@bantudelice.com</a>
      </p>
      <p className="text-gray-700">
        <b>Adresse :</b> 123, Avenue de la Logistique, Brazzaville, Congo
      </p>
    </div>
  </div>
);

export default AProposColisPage; 