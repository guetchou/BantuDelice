
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useServices } from '../hooks/useServices';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../context/NotificationContext';

export default function Home() {
  const { services, loading, error } = useServices();
  const { isAuthenticated, user } = useAuth();
  const { addNotification } = useNotifications();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'Tous les services', icon: '🌟' },
    { id: 'FOOD', name: 'Nourriture', icon: '🍕' },
    { id: 'TRANSPORT', name: 'Transport', icon: '🚗' },
    { id: 'DELIVERY', name: 'Livraison', icon: '📦' },
    { id: 'CLEANING', name: 'Nettoyage', icon: '🧹' },
    { id: 'BEAUTY', name: 'Beauté', icon: '💄' },
    { id: 'HEALTH', name: 'Santé', icon: '🏥' },
    { id: 'EDUCATION', name: 'Éducation', icon: '📚' },
  ];

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  const handleServiceClick = (service: unknown) => {
    if (!isAuthenticated) {
      addNotification({
        type: 'info',
        title: 'Connexion requise',
        message: 'Veuillez vous connecter pour accéder aux services',
        duration: 3000,
      });
      return;
    }
    // Navigation vers la page de service
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-indigo-600">BantuDelice</h1>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-700">Bonjour, {user?.name}</span>
                  <Link
                    to="/profile"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Mon Profil
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-indigo-600 hover:text-indigo-500"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Découvrez les meilleurs services
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Trouvez et réservez des services de qualité dans votre région
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Catégories de services
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-6 rounded-lg border-2 transition-all ${
                  selectedCategory === category.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:border-indigo-300'
                }`}
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="text-sm font-medium text-gray-900">
                  {category.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Services disponibles
          </h3>
          {filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-600">Aucun service trouvé dans cette catégorie</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleServiceClick(service)}
                >
                  {service.image && (
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                      {service.name}
                    </h4>
                    {service.description && (
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {service.description}
                      </p>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-indigo-600">
                        ${service.price}
                      </span>
                      <span className="text-sm text-gray-500 capitalize">
                        {service.category.toLowerCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">BantuDelice</h3>
            <p className="text-gray-300">
              Votre plateforme de services de confiance
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
