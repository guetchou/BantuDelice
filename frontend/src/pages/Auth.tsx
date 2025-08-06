
import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../context/NotificationContext';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Building, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Car,
  Truck,
  Store,
  Users,
  MapPin,
  CreditCard,
  Clock,
  Star
} from 'lucide-react';

export default function Auth() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    company: '',
    userType: 'customer' as 'customer' | 'driver' | 'restaurant' | 'delivery' | 'business' | 'hotel' | 'shop' | 'service_provider' | 'admin'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login, register, isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Types de comptes avec descriptions
  const accountTypes = [
    {
      value: 'customer',
      label: 'Client',
      icon: Users,
      description: 'Utilisateur final - Accès à tous les services',
      features: ['Réservation de taxi', 'Livraison à domicile', 'Commandes restaurants', 'Location de voiture', 'Covoiturage', 'Shopping en ligne', 'Services à domicile']
    },
    {
      value: 'driver',
      label: 'Chauffeur Taxi',
      icon: Car,
      description: 'Conducteur de taxi - Transport de passagers',
      features: ['Transport de passagers', 'Gestion des courses', 'Suivi GPS', 'Calcul des tarifs', 'Historique des courses']
    },
    {
      value: 'delivery',
      label: 'Livreur',
      icon: Truck,
      description: 'Livreur de colis et nourriture',
      features: ['Livraison de colis', 'Livraison de nourriture', 'Suivi des livraisons', 'Gestion des tournées', 'Validation des livraisons']
    },
    {
      value: 'restaurant',
      label: 'Restaurant',
      icon: Store,
      description: 'Restaurant - Gestion des commandes et menus',
      features: ['Gestion des menus', 'Commandes en ligne', 'Livraison', 'Gestion des stocks', 'Analytics des ventes']
    },
    {
      value: 'hotel',
      label: 'Hôtel',
      icon: Building,
      description: 'Hôtel - Gestion des réservations',
      features: ['Gestion des chambres', 'Réservations en ligne', 'Gestion des clients', 'Services hôteliers']
    },
    {
      value: 'shop',
      label: 'Boutique',
      icon: Store,
      description: 'Boutique en ligne - E-commerce',
      features: ['Gestion des produits', 'Commandes en ligne', 'Livraison', 'Gestion des stocks', 'Marketing']
    },
    {
      value: 'service_provider',
      label: 'Prestataire de services',
      icon: Building,
      description: 'Services à domicile (plombier, électricien, etc.)',
      features: ['Gestion des interventions', 'Devis en ligne', 'Planification', 'Facturation']
    },
    {
      value: 'business',
      label: 'Entreprise B2B',
      icon: Building,
      description: 'Compte entreprise - Services B2B',
      features: ['Services corporate', 'Facturation', 'Gestion d\'équipe', 'Réservations groupées']
    },
    {
      value: 'admin',
      label: 'Administrateur',
      icon: Shield,
      description: 'Administration du système',
      features: ['Gestion des utilisateurs', 'Configuration système', 'Analytics', 'Support technique']
    }
  ];

  // Rediriger si déjà connecté
  React.useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = searchParams.get('redirect') || '/';
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (activeTab === 'login') {
        const result = await login({
          email: formData.email,
          password: formData.password
        });
        
        if (result.success) {
          addNotification({
            type: 'success',
            title: 'Connexion réussie !',
            message: 'Bienvenue sur BantuDelice',
            duration: 3000,
          });
          const redirectTo = searchParams.get('redirect') || '/';
          navigate(redirectTo, { replace: true });
        } else {
          addNotification({
            type: 'error',
            title: 'Erreur de connexion',
            message: result.error || 'Vérifiez vos identifiants',
            duration: 4000,
          });
        }
      } else {
        // Validation pour l'inscription
        if (formData.password !== formData.confirmPassword) {
          addNotification({
            type: 'error',
            title: 'Erreur de validation',
            message: 'Les mots de passe ne correspondent pas',
            duration: 4000,
          });
          setIsLoading(false);
          return;
        }

        const result = await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          company: formData.company,
          userType: formData.userType
        });

        if (result.success) {
          addNotification({
            type: 'success',
            title: 'Inscription réussie !',
            message: 'Votre compte a été créé avec succès',
            duration: 3000,
          });
          setActiveTab('login');
          setFormData({
            ...formData,
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            phone: '',
            company: ''
          });
        } else {
          addNotification({
            type: 'error',
            title: 'Erreur d\'inscription',
            message: result.error || 'Impossible de créer le compte',
            duration: 4000,
          });
        }
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Une erreur est survenue',
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const selectedAccountType = accountTypes.find(type => type.value === formData.userType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Section gauche - Image/Illustration */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 lg:p-12 flex flex-col justify-center">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl font-bold text-white mb-4">
                  BantuDelice
                </h1>
                <p className="text-indigo-100 text-lg mb-8">
                  Votre plateforme complète pour la livraison, les taxis, et plus encore
                </p>
                
                {/* Fonctionnalités */}
                <div className="space-y-4">
                  <div className="flex items-center text-indigo-100">
                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span>Livraison rapide et sécurisée</span>
                  </div>
                  <div className="flex items-center text-indigo-100">
                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span>Service taxi professionnel</span>
                  </div>
                  <div className="flex items-center text-indigo-100">
                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span>Restaurants et services locaux</span>
                  </div>
                  <div className="flex items-center text-indigo-100">
                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span>Support client 24/7</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section droite - Formulaire */}
            <div className="p-8 lg:p-12">
              {/* Onglets */}
              <div className="flex mb-8">
                <button
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'login'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Connexion
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'register'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Inscription
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {activeTab === 'login' ? (
                  // Formulaire de connexion
                  <>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="votre@email.com"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Mot de passe
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Votre mot de passe"
                          value={formData.password}
                          onChange={handleChange}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                          Se souvenir de moi
                        </label>
                      </div>
                      <Link
                        to="/forgot-password"
                        className="text-sm text-indigo-600 hover:text-indigo-500"
                      >
                        Mot de passe oublié ?
                      </Link>
                    </div>
                  </>
                ) : (
                  // Formulaire d'inscription
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                          Prénom
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Votre prénom"
                            value={formData.firstName}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                          Nom
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Votre nom"
                            value={formData.lastName}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="votre@email.com"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="+33 6 12 34 56 78"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* Sélection du type de compte */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Type de compte
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {accountTypes.map((type) => {
                          const IconComponent = type.icon;
                          return (
                            <div
                              key={type.value}
                              className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                formData.userType === type.value
                                  ? 'border-indigo-500 bg-indigo-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => setFormData({ ...formData, userType: type.value as any })}
                            >
                              <div className="flex items-start space-x-3">
                                <div className={`p-2 rounded-lg ${
                                  formData.userType === type.value
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                  <IconComponent className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-medium text-gray-900">{type.label}</h3>
                                  <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                                  <div className="mt-2 space-y-1">
                                    {type.features.map((feature, index) => (
                                      <div key={index} className="flex items-center text-xs text-gray-500">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        {feature}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {(formData.userType === 'restaurant' || formData.userType === 'business' || formData.userType === 'hotel' || formData.userType === 'shop' || formData.userType === 'service_provider') && (
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                          {formData.userType === 'restaurant' ? 'Nom du restaurant' : 
                           formData.userType === 'hotel' ? 'Nom de l\'hôtel' :
                           formData.userType === 'shop' ? 'Nom de la boutique' :
                           formData.userType === 'service_provider' ? 'Nom de l\'entreprise' :
                           'Nom de l\'entreprise'}
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            id="company"
                            name="company"
                            type="text"
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder={
                              formData.userType === 'restaurant' ? 'Nom de votre restaurant' :
                              formData.userType === 'hotel' ? 'Nom de votre hôtel' :
                              formData.userType === 'shop' ? 'Nom de votre boutique' :
                              formData.userType === 'service_provider' ? 'Nom de votre entreprise' :
                              'Nom de votre entreprise'
                            }
                            value={formData.company}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Mot de passe
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Créez un mot de passe"
                          value={formData.password}
                          onChange={handleChange}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmer le mot de passe
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Confirmez votre mot de passe"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        required
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
                      />
                      <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                        J'accepte les{' '}
                        <Link to="/terms" className="text-indigo-600 hover:text-indigo-500">
                          conditions d'utilisation
                        </Link>{' '}
                        et la{' '}
                        <Link to="/privacy" className="text-indigo-600 hover:text-indigo-500">
                          politique de confidentialité
                        </Link>
                      </label>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {activeTab === 'login' ? 'Connexion...' : 'Inscription...'}
                    </div>
                  ) : (
                    activeTab === 'login' ? 'Se connecter' : 'Créer un compte'
                  )}
                </button>
              </form>

              {/* Liens supplémentaires */}
              <div className="mt-6 text-center">
                {activeTab === 'login' ? (
                  <p className="text-sm text-gray-600">
                    Pas encore de compte ?{' '}
                    <button
                      onClick={() => setActiveTab('register')}
                      className="text-indigo-600 hover:text-indigo-500 font-medium"
                    >
                      Créez-en un ici
                    </button>
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">
                    Déjà un compte ?{' '}
                    <button
                      onClick={() => setActiveTab('login')}
                      className="text-indigo-600 hover:text-indigo-500 font-medium"
                    >
                      Connectez-vous ici
                    </button>
                  </p>
                )}
              </div>

              {/* Séparateur */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Ou continuez avec</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="ml-2">Google</span>
                  </button>

                  <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                    <span className="ml-2">Twitter</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
