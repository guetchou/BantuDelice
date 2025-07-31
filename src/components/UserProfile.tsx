import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../services/api';

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
    <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
    {children}
  </div>
);

export const UserProfile: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Accès refusé</h2>
          <p className="text-gray-600">Veuillez vous connecter pour accéder à votre profil.</p>
        </div>
      </div>
    );
  }

  const renderUserProfile = () => (
    <ProfileSection title="Informations Personnelles">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom</label>
          <p className="mt-1 text-sm text-gray-900">{user.name}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <p className="mt-1 text-sm text-gray-900">{user.email}</p>
        </div>
        {user.phone && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Téléphone</label>
            <p className="mt-1 text-sm text-gray-900">{user.phone}</p>
          </div>
        )}
        {user.address && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Adresse</label>
            <p className="mt-1 text-sm text-gray-900">{user.address}</p>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">Rôle</label>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {user.role}
          </span>
        </div>
      </div>
    </ProfileSection>
  );

  const renderCustomerFeatures = () => (
    <>
      <ProfileSection title="Mes Commandes">
        <p className="text-gray-600">Historique de vos commandes</p>
        {/* Intégrer le composant de commandes */}
      </ProfileSection>
      
      <ProfileSection title="Mes Favoris">
        <p className="text-gray-600">Services que vous avez aimés</p>
        {/* Intégrer le composant de favoris */}
      </ProfileSection>
      
      <ProfileSection title="Mes Avis">
        <p className="text-gray-600">Avis que vous avez laissés</p>
        {/* Intégrer le composant d'avis */}
      </ProfileSection>
    </>
  );

  const renderDriverFeatures = () => (
    <>
      <ProfileSection title="Mes Livraisons">
        <p className="text-gray-600">Commandes à livrer</p>
        {/* Intégrer le composant de livraisons */}
      </ProfileSection>
      
      <ProfileSection title="Mon Itinéraire">
        <p className="text-gray-600">Planification des livraisons</p>
        {/* Intégrer le composant d'itinéraire */}
      </ProfileSection>
      
      <ProfileSection title="Mes Statistiques">
        <p className="text-gray-600">Performance et revenus</p>
        {/* Intégrer le composant de statistiques */}
      </ProfileSection>
    </>
  );

  const renderRestaurantOwnerFeatures = () => (
    <>
      <ProfileSection title="Mon Restaurant">
        <p className="text-gray-600">Gestion de votre restaurant</p>
        {/* Intégrer le composant de gestion de restaurant */}
      </ProfileSection>
      
      <ProfileSection title="Mon Menu">
        <p className="text-gray-600">Gestion de votre menu</p>
        {/* Intégrer le composant de gestion de menu */}
      </ProfileSection>
      
      <ProfileSection title="Mes Commandes">
        <p className="text-gray-600">Commandes reçues</p>
        {/* Intégrer le composant de commandes restaurant */}
      </ProfileSection>
      
      <ProfileSection title="Mes Analytics">
        <p className="text-gray-600">Statistiques de votre restaurant</p>
        {/* Intégrer le composant d'analytics */}
      </ProfileSection>
    </>
  );

  const renderAdminFeatures = () => (
    <>
      <ProfileSection title="Dashboard Administrateur">
        <p className="text-gray-600">Vue d'ensemble de la plateforme</p>
        {/* Intégrer le composant dashboard admin */}
      </ProfileSection>
      
      <ProfileSection title="Gestion des Utilisateurs">
        <p className="text-gray-600">Gérer tous les utilisateurs</p>
        {/* Intégrer le composant de gestion des utilisateurs */}
      </ProfileSection>
      
      <ProfileSection title="Gestion des Services">
        <p className="text-gray-600">Gérer tous les services</p>
        {/* Intégrer le composant de gestion des services */}
      </ProfileSection>
      
      <ProfileSection title="Analytics Globales">
        <p className="text-gray-600">Statistiques de la plateforme</p>
        {/* Intégrer le composant d'analytics globales */}
      </ProfileSection>
      
      <ProfileSection title="Configuration Système">
        <p className="text-gray-600">Paramètres de la plateforme</p>
        {/* Intégrer le composant de configuration */}
      </ProfileSection>
    </>
  );

  const getRoleFeatures = () => {
    switch (user.role) {
      case UserRole.USER:
        return renderCustomerFeatures();
      case UserRole.DRIVER:
        return renderDriverFeatures();
      case UserRole.RESTAURANT_OWNER:
        return renderRestaurantOwnerFeatures();
      case UserRole.ADMIN:
        return renderAdminFeatures();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <p className="mt-2 text-gray-600">
            Bienvenue, {user.name} ! Voici votre espace personnel.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-indigo-600">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                  {user.role}
                </span>
              </div>
              
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  Modifier le profil
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  Paramètres
                </button>
                <button 
                  onClick={logout}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                >
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {renderUserProfile()}
            {getRoleFeatures()}
          </div>
        </div>
      </div>
    </div>
  );
}; 