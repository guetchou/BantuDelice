import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../context/NotificationContext';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  CheckCircle,
  ArrowLeft,
  Car,
  Camera,
  Upload,
  MapPin,
  CreditCard,
  FileText
} from 'lucide-react';

export default function DriverRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [licensePreview, setLicensePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    licenseNumber: '',
    vehicleType: '',
    vehicleModel: '',
    vehiclePlate: '',
    workZones: '',
    experience: '',
    acceptTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLicensePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      addNotification({
        type: 'error',
        title: 'Erreur de validation',
        message: 'Les mots de passe ne correspondent pas',
        duration: 4000,
      });
      return;
    }

    if (!formData.acceptTerms) {
      addNotification({
        type: 'error',
        title: 'Erreur de validation',
        message: 'Vous devez accepter les conditions d\'utilisation',
        duration: 4000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        userType: 'driver',
        avatar: avatarPreview,
        licenseNumber: formData.licenseNumber,
        vehicleType: formData.vehicleType,
        vehicleModel: formData.vehicleModel,
        vehiclePlate: formData.vehiclePlate,
        workZones: formData.workZones,
        experience: formData.experience
      });

      if (result.success) {
        addNotification({
          type: 'success',
          title: 'Inscription réussie !',
          message: 'Votre compte chauffeur a été créé avec succès',
          duration: 3000,
        });
        navigate('/login');
      } else {
        addNotification({
          type: 'error',
          title: 'Erreur d\'inscription',
          message: result.error || 'Impossible de créer le compte',
          duration: 4000,
        });
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
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex items-center space-x-3">
              <Link to="/auth" className="text-white hover:text-indigo-200">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="flex items-center space-x-3">
                <Car className="w-8 h-8" />
                <div>
                  <h1 className="text-2xl font-bold">Inscription Chauffeur Taxi</h1>
                  <p className="text-indigo-100">Rejoignez notre équipe de chauffeurs professionnels</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar et permis */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Photos et documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Avatar */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Photo de profil
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          {avatarPreview ? (
                            <img 
                              src={avatarPreview} 
                              alt="Avatar preview" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-10 h-10 text-gray-400" />
                          )}
                        </div>
                        <label 
                          htmlFor="avatar" 
                          className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors"
                        >
                          <Camera className="w-3 h-3" />
                        </label>
                      </div>
                      <div className="flex-1">
                        <input
                          id="avatar"
                          name="avatar"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById('avatar')?.click()}
                          className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Choisir une photo</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Permis de conduire */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Permis de conduire
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                          {licensePreview ? (
                            <img 
                              src={licensePreview} 
                              alt="License preview" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FileText className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        <label 
                          htmlFor="license" 
                          className="absolute bottom-0 right-0 bg-green-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-green-700 transition-colors"
                        >
                          <Camera className="w-3 h-3" />
                        </label>
                      </div>
                      <div className="flex-1">
                        <input
                          id="license"
                          name="license"
                          type="file"
                          accept="image/*"
                          onChange={handleLicenseChange}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById('license')?.click()}
                          className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Scanner le permis</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations personnelles */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informations personnelles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom *
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
                      Nom *
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
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse email *
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
                      Téléphone *
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
                </div>
              </div>

              {/* Informations professionnelles */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informations professionnelles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro de permis *
                    </label>
                    <input
                      id="licenseNumber"
                      name="licenseNumber"
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="1234567890"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                      Années d'expérience
                    </label>
                    <select
                      id="experience"
                      name="experience"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={formData.experience}
                      onChange={handleChange}
                    >
                      <option value="">Sélectionnez</option>
                      <option value="0-1">0-1 an</option>
                      <option value="1-3">1-3 ans</option>
                      <option value="3-5">3-5 ans</option>
                      <option value="5-10">5-10 ans</option>
                      <option value="10+">10+ ans</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Informations véhicule */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informations véhicule</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-2">
                      Type de véhicule *
                    </label>
                    <select
                      id="vehicleType"
                      name="vehicleType"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={formData.vehicleType}
                      onChange={handleChange}
                    >
                      <option value="">Sélectionnez</option>
                      <option value="sedan">Berline</option>
                      <option value="suv">SUV</option>
                      <option value="van">Fourgon</option>
                      <option value="luxury">Luxe</option>
                      <option value="electric">Électrique</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="vehicleModel" className="block text-sm font-medium text-gray-700 mb-2">
                      Modèle *
                    </label>
                    <input
                      id="vehicleModel"
                      name="vehicleModel"
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Toyota Camry"
                      value={formData.vehicleModel}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="vehiclePlate" className="block text-sm font-medium text-gray-700 mb-2">
                      Plaque d'immatriculation *
                    </label>
                    <input
                      id="vehiclePlate"
                      name="vehiclePlate"
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="AB-123-CD"
                      value={formData.vehiclePlate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Zones de travail */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Zones de travail</h3>
                <div>
                  <label htmlFor="workZones" className="block text-sm font-medium text-gray-700 mb-2">
                    Zones où vous souhaitez travailler
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="workZones"
                      name="workZones"
                      type="text"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Paris, Lyon, Marseille (séparés par des virgules)"
                      value={formData.workZones}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Sécurité</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe *
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
                      Confirmer le mot de passe *
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
                </div>
              </div>

              {/* Conditions */}
              <div className="flex items-start">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                />
                <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700">
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

              {/* Avantages */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Avantages de rejoindre notre équipe :</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Horaires flexibles
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Revenus attractifs
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Support technique 24/7
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Formation continue
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Assurance complète
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Paiements sécurisés
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Création du compte...
                  </div>
                ) : (
                  'Créer mon compte chauffeur'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Déjà un compte ?{' '}
                <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
                  Connectez-vous ici
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 