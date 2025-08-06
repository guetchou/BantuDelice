
import React from 'react';
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page non trouvée</h2>
        
        <p className="text-gray-600 mb-6">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        
        <div className="space-y-3">
          <Link 
            to="/"
            className="block w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition text-center"
          >
            Retour à l'accueil
          </Link>
          
          <Link 
            to="/help"
            className="block w-full border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50 transition text-center"
          >
            Centre d'aide
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
