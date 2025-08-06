import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, ArrowLeft } from 'lucide-react';

export default function DeliveryRegister() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex items-center space-x-3">
              <Link to="/auth" className="text-white hover:text-indigo-200">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="flex items-center space-x-3">
                <Truck className="w-8 h-8" />
                <div>
                  <h1 className="text-2xl font-bold">Inscription Livreur</h1>
                  <p className="text-indigo-100">Page en cours de développement</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-8 text-center">
            <p className="text-gray-600 mb-4">Cette page d'inscription pour les livreurs sera bientôt disponible.</p>
            <Link to="/auth" className="text-indigo-600 hover:text-indigo-500 font-medium">
              Retour à la page d'authentification
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 