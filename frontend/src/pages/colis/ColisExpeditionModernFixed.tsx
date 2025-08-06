// Version mise à jour le 2025-08-03T22:32:09.747Z - Force reload
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useColisAuth } from '@/context/ColisAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import {
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  Truck,
  Shield,
  Clock,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Calculator,
  CreditCard,
  FileText,
  AlertTriangle,
  Star,
  Zap,
  Plane,
  Ship,
  Globe,
  Target,
  ArrowRight,
  Loader2,
  Sparkles,
  Gift,
  Box,
  Archive,
  Scale,
  Ruler,
  Calendar,
  Navigation,
  Smartphone,
  Mail as MailIcon,
  Building,
  Home,
  Store,
  Factory,
  MapPin as MapPinIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TarifService, { TarifCalculation } from '@/services/tarifService';
import { colisApi } from '@/services/colisApi';

  // Configuration des agences par ville
  const AGENCIES_BY_CITY = {
  "Brazzaville": [
    {
      "id": "agence_brazzaville_centre",
      "name": "Agence Brazzaville Centre",
      "address": "Centre-ville, Brazzaville"
    },
    {
      "id": "agence_brazzaville_aeroport",
      "name": "Agence Brazzaville Aéroport",
      "address": "Aéroport Maya-Maya, Brazzaville"
    },
    {
      "id": "agence_brazzaville_poto_poto",
      "name": "Agence Poto-Poto",
      "address": "Quartier Poto-Poto, Brazzaville"
    },
    {
      "id": "agence_brazzaville_bacongo",
      "name": "Agence Bacongo",
      "address": "Quartier Bacongo, Brazzaville"
    }
  ],
  "Pointe-Noire": [
    {
      "id": "agence_pointe_noire_centre",
      "name": "Agence Pointe-Noire Centre",
      "address": "Centre-ville, Pointe-Noire"
    },
    {
      "id": "agence_pointe_noire_port",
      "name": "Agence Pointe-Noire Port",
      "address": "Zone portuaire, Pointe-Noire"
    },
    {
      "id": "agence_pointe_noire_aeroport",
      "name": "Agence Pointe-Noire Aéroport",
      "address": "Aéroport Agostinho-Neto, Pointe-Noire"
    },
    {
      "id": "agence_pointe_noire_loandjili",
      "name": "Agence Loandjili",
      "address": "Quartier Loandjili, Pointe-Noire"
    }
  ],
  "Dolisie": [
    {
      "id": "agence_dolisie_centre",
      "name": "Agence Dolisie Centre",
      "address": "Centre-ville, Dolisie"
    },
    {
      "id": "agence_dolisie_gare",
      "name": "Agence Dolisie Gare",
      "address": "Gare ferroviaire, Dolisie"
    }
  ],
  "Nkayi": [
    {
      "id": "agence_nkayi_centre",
      "name": "Agence Nkayi Centre",
      "address": "Centre-ville, Nkayi"
    },
    {
      "id": "agence_nkayi_marché",
      "name": "Agence Nkayi Marché",
      "address": "Marché central, Nkayi"
    }
  ],
  "Ouesso": [
    {
      "id": "agence_ouesso_centre",
      "name": "Agence Ouesso Centre",
      "address": "Centre-ville, Ouesso"
    },
    {
      "id": "agence_ouesso_aeroport",
      "name": "Agence Ouesso Aéroport",
      "address": "Aéroport local, Ouesso"
    }
  ],
  "Impfondo": [
    {
      "id": "agence_impfondo_centre",
      "name": "Agence Impfondo Centre",
      "address": "Centre-ville, Impfondo"
    },
    {
      "id": "agence_impfondo_port",
      "name": "Agence Impfondo Port",
      "address": "Port fluvial, Impfondo"
    }
  ],
  "Gamboma": [
    {
      "id": "agence_gamboma_centre",
      "name": "Agence Gamboma Centre",
      "address": "Centre-ville, Gamboma"
    }
  ],
  "Madingou": [
    {
      "id": "agence_madingou_centre",
      "name": "Agence Madingou Centre",
      "address": "Centre-ville, Madingou"
    }
  ],
  "Mossendjo": [
    {
      "id": "agence_mossendjo_centre",
      "name": "Agence Mossendjo Centre",
      "address": "Centre-ville, Mossendjo"
    }
  ],
  "Kinkala": [
    {
      "id": "agence_kinkala_centre",
      "name": "Agence Kinkala Centre",
      "address": "Centre-ville, Kinkala"
    }
  ]
};

  // Fonction pour obtenir les agences d'une ville
  const getAgenciesForCity = (city: string) => {
    return AGENCIES_BY_CITY[city] || [];
  };

  // Configuration des types de colis avec champs spécifiques
  const PACKAGE_TYPE_CONFIG = {
  "document": {
    "name": "Document",
    "icon": "FileText",
    "description": "Lettres, papiers, contrats",
    "requiredFields": [
      "weight"
    ],
    "optionalFields": [
      "dimensions"
    ],
    "specialFields": [],
    "insuranceRequired": false,
    "maxWeight": 2,
    "baseMultiplier": 0.8
  },
  "package": {
    "name": "Colis Standard",
    "icon": "Package",
    "description": "Objets divers, vêtements",
    "requiredFields": [
      "weight",
      "dimensions"
    ],
    "optionalFields": [
      "specialInstructions"
    ],
    "specialFields": [],
    "insuranceRequired": false,
    "maxWeight": 30,
    "baseMultiplier": 1
  },
  "fragile": {
    "name": "Fragile",
    "icon": "AlertTriangle",
    "description": "Verre, céramique, électronique",
    "requiredFields": [
      "weight",
      "dimensions",
      "specialInstructions"
    ],
    "optionalFields": [
      "insuranceValue"
    ],
    "specialFields": [
      "fragileHandling",
      "protectivePackaging"
    ],
    "insuranceRequired": true,
    "maxWeight": 20,
    "baseMultiplier": 1.5
  },
  "heavy": {
    "name": "Lourd",
    "icon": "Scale",
    "description": "Plus de 10kg, équipements",
    "requiredFields": [
      "weight",
      "dimensions",
      "specialInstructions"
    ],
    "optionalFields": [
      "insuranceValue"
    ],
    "specialFields": [
      "heavyLifting",
      "specialEquipment"
    ],
    "insuranceRequired": true,
    "maxWeight": 100,
    "baseMultiplier": 2
  },
  "electronics": {
    "name": "Électronique",
    "icon": "Smartphone",
    "description": "Téléphones, ordinateurs",
    "requiredFields": [
      "weight",
      "dimensions",
      "specialInstructions"
    ],
    "optionalFields": [
      "insuranceValue"
    ],
    "specialFields": [
      "antiStaticPackaging",
      "temperatureControl",
      "originalBox"
    ],
    "insuranceRequired": true,
    "maxWeight": 25,
    "baseMultiplier": 1.8
  },
  "clothing": {
    "name": "Vêtements",
    "icon": "Gift",
    "description": "Textiles, chaussures",
    "requiredFields": [
      "weight"
    ],
    "optionalFields": [
      "dimensions",
      "specialInstructions"
    ],
    "specialFields": [
      "dryCleaning",
      "foldedPackaging"
    ],
    "insuranceRequired": false,
    "maxWeight": 15,
    "baseMultiplier": 0.9
  },
  "food": {
    "name": "Alimentaire",
    "icon": "Box",
    "description": "Produits alimentaires",
    "requiredFields": [
      "weight",
      "specialInstructions"
    ],
    "optionalFields": [
      "dimensions"
    ],
    "specialFields": [
      "temperatureControl",
      "expiryDate",
      "fragileHandling"
    ],
    "insuranceRequired": false,
    "maxWeight": 10,
    "baseMultiplier": 1.2
  }
};

  // Configuration des tarifs par ville
  const CITY_PRICING = {
  "Brazzaville": {
    "zone": "urbain",
    "baseRate": 800,
    "fuelSurcharge": 0.05,
    "insuranceIncluded": 15000
  },
  "Pointe-Noire": {
    "zone": "urbain",
    "baseRate": 800,
    "fuelSurcharge": 0.05,
    "insuranceIncluded": 15000
  },
  "Dolisie": {
    "zone": "secondaire",
    "baseRate": 1800,
    "fuelSurcharge": 0.1,
    "insuranceIncluded": 25000
  },
  "Nkayi": {
    "zone": "secondaire",
    "baseRate": 1800,
    "fuelSurcharge": 0.1,
    "insuranceIncluded": 25000
  },
  "Ouesso": {
    "zone": "enclave",
    "baseRate": 3500,
    "fuelSurcharge": 0.15,
    "insuranceIncluded": 40000
  },
  "Impfondo": {
    "zone": "enclave",
    "baseRate": 3500,
    "fuelSurcharge": 0.15,
    "insuranceIncluded": 40000
  },
  "Gamboma": {
    "zone": "secondaire",
    "baseRate": 1800,
    "fuelSurcharge": 0.1,
    "insuranceIncluded": 25000
  },
  "Madingou": {
    "zone": "secondaire",
    "baseRate": 1800,
    "fuelSurcharge": 0.1,
    "insuranceIncluded": 25000
  },
  "Mossendjo": {
    "zone": "secondaire",
    "baseRate": 1800,
    "fuelSurcharge": 0.1,
    "insuranceIncluded": 25000
  },
  "Kinkala": {
    "zone": "secondaire",
    "baseRate": 1800,
    "fuelSurcharge": 0.1,
    "insuranceIncluded": 25000
  }
};

  // Fonction pour obtenir les champs requis selon le type de colis
  const getRequiredFieldsForPackageType = (packageType: string) => {
    return PACKAGE_TYPE_CONFIG[packageType]?.requiredFields || [];
  };

  // Fonction pour obtenir les champs optionnels selon le type de colis
  const getOptionalFieldsForPackageType = (packageType: string) => {
    return PACKAGE_TYPE_CONFIG[packageType]?.optionalFields || [];
  };

  // Fonction pour obtenir les champs spéciaux selon le type de colis
  const getSpecialFieldsForPackageType = (packageType: string) => {
    return PACKAGE_TYPE_CONFIG[packageType]?.specialFields || [];
  };

  // Fonction pour calculer le tarif selon la ville de destination
  const calculatePriceByCity = (fromCity: string, toCity: string, weight: number, packageType: string, service: string) => {
    const fromPricing = CITY_PRICING[fromCity] || CITY_PRICING['Brazzaville'];
    const toPricing = CITY_PRICING[toCity] || CITY_PRICING['Brazzaville'];

    // Utiliser le tarif le plus élevé entre départ et arrivée
    const baseRate = Math.max(fromPricing.baseRate, toPricing.baseRate);
    const fuelSurcharge = Math.max(fromPricing.fuelSurcharge, toPricing.fuelSurcharge);

    // Multiplicateur selon le type de colis
    const packageMultiplier = PACKAGE_TYPE_CONFIG[packageType]?.baseMultiplier || 1.0;

    // Multiplicateur selon le service
    const serviceMultipliers = {
      economy: 0.7,
      standard: 1.0,
      express: 1.8,
      premium: 1.3
    };
    const serviceMultiplier = serviceMultipliers[service] || 1.0;

    // Calcul du prix
    const basePrice = baseRate * packageMultiplier * serviceMultiplier;
    const weightPrice = weight * 300; // 300 FCFA par kg
    const fuelPrice = (basePrice + weightPrice) * fuelSurcharge;

    return {
      basePrice,
      weightPrice,
      fuelPrice,
      total: basePrice + weightPrice + fuelPrice
    };
  };

interface ExpeditionData {
  // Étape 1: Type de service
  serviceType: 'national' | 'international';
  packageType: 'document' | 'package' | 'fragile' | 'heavy' | 'electronics' | 'clothing' | 'food';
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };

  // Étape 2: Expéditeur
  sender: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    agency: string;
    type: 'individual' | 'business';
    company?: string;
  };

  // Étape 3: Destinataire
  recipient: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    country: string;
    agency?: string;
    deliveryType: 'agence' | 'domicile';
    type: 'individual' | 'business';
    company?: string;
  };

  // Étape 4: Service et options
  service: 'economy' | 'standard' | 'express' | 'premium';
  insurance: boolean;
  insuranceValue: string;
  specialInstructions: string;
  deliveryDate?: string;

  // Étape 5: Paiement
  paymentMethod: 'momo' | 'airtel' | 'card' | 'cash';
  phoneNumber: string;
  cashAmount?: string;
}

const ColisExpeditionModernFixed: React.FC = () => {
  // Fonctions de validation (définies en premier)
  const validateEmail = (email: string): boolean => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    if (!phone) return false;
    const cleanPhone = phone.replace(/\s/g, '');
    return /^(\+242|242)?[0-9]{9}$/.test(cleanPhone);
  };

  const validateDimensions = (dimensions: { length: string; width: string; height: string }): boolean => {
    if (!dimensions) return false;
    const { length, width, height } = dimensions;
    return !!(length && width && height &&
              parseFloat(length) > 0 && parseFloat(width) > 0 && parseFloat(height) > 0);
  };

  // Fonctions de mise à jour des données
  const updateFormData = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent: string, field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent as keyof ExpeditionData], [field]: value }
    }));
  };

  // Fonction pour réinitialiser l'agence quand la ville change
  const handleCityChange = (city: string, isSender: boolean = true) => {
    if (isSender) {
      updateNestedField('sender', 'city', city);
      updateNestedField('sender', 'agency', ''); // Réinitialiser l'agence
    } else {
      updateNestedField('recipient', 'city', city);
      updateNestedField('recipient', 'agency', ''); // Réinitialiser l'agence
    }
  };

  // États du composant
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ExpeditionData>({
    serviceType: 'national',
    packageType: 'package',
    weight: '',
    dimensions: { length: '', width: '', height: '' },
    sender: {
      name: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      agency: '',
      type: 'individual'
    },
    recipient: {
      name: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      country: 'Congo',
      deliveryType: 'agence',
      type: 'individual'
    },
    service: 'standard',
    insurance: false,
    insuranceValue: '',
    specialInstructions: '',
    paymentMethod: 'momo',
    phoneNumber: ''
  });

  const [stepErrors, setStepErrors] = useState<Record<number, string[]>>({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [priceCalculation, setPriceCalculation] = useState<TarifCalculation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [autoComplete, setAutoComplete] = useState<string[]>([]);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useColisAuth();

  // Initialiser les données depuis les paramètres URL et utilisateur connecté
  useEffect(() => {
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const weight = searchParams.get('weight');
    const service = searchParams.get('service');

    if (from) setFormData(prev => ({ ...prev, sender: { ...prev.sender, city: from } }));
    if (to) setFormData(prev => ({ ...prev, recipient: { ...prev.recipient, city: to } }));
    if (weight) setFormData(prev => ({ ...prev, weight }));
    if (service) setFormData(prev => ({ ...prev, service: service as any }));

    // Auto-remplir avec les données de l'utilisateur connecté
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        sender: {
          ...prev.sender,
          name: user.name || prev.sender.name,
          phone: user.phone || prev.sender.phone,
          email: user.email || prev.sender.email,
          address: user.address || prev.sender.address,
        }
      }));
    }
  }, [searchParams, isAuthenticated, user]);

  // Villes disponibles selon la politique tarifaire
  const cities = [
    'Brazzaville', 'Pointe-Noire', 'Dolisie', 'Nkayi', 'Ouesso', 'Gamboma',
    'Madingou', 'Mossendjo', 'Kinkala', 'Loandjili', 'Djambala', 'Ewo',
    'Sibiti', 'Impfondo', 'Makoua'
  ];

  const countries = [
    'Congo', 'France', 'Belgique', 'Suisse', 'Allemagne', 'Italie', 'Espagne',
    'Pays-Bas', 'Royaume-Uni', 'États-Unis', 'Canada', 'Brésil', 'Chine',
    'Japon', 'Corée du Sud', 'Inde', 'Australie', 'Afrique du Sud'
  ];

  const packageTypes = [
    { id: 'document', name: 'Document', icon: FileText, description: 'Lettres, papiers, contrats' },
    { id: 'package', name: 'Colis Standard', icon: Package, description: 'Objets divers, vêtements' },
    { id: 'fragile', name: 'Fragile', icon: AlertTriangle, description: 'Verre, céramique, électronique' },
    { id: 'heavy', name: 'Lourd', icon: Scale, description: 'Plus de 10kg, équipements' },
    { id: 'electronics', name: 'Électronique', icon: Smartphone, description: 'Téléphones, ordinateurs' },
    { id: 'clothing', name: 'Vêtements', icon: Gift, description: 'Textiles, chaussures' },
    { id: 'food', name: 'Alimentaire', icon: Box, description: 'Produits alimentaires' }
  ];

  const services = [
    {
      id: 'economy',
      name: 'Économique',
      description: 'Livraison groupée, délais plus longs',
      price: 0.8,
      delay: '5-7 jours',
      icon: Ship,
      color: 'text-green-600'
    },
    {
      id: 'standard',
      name: 'Standard',
      description: 'Service classique, bon rapport qualité-prix',
      price: 1.0,
      delay: '3-5 jours',
      icon: Truck,
      color: 'text-blue-600',
      popular: true
    },
    {
      id: 'express',
      name: 'Express',
      description: 'Livraison rapide, priorité haute',
      price: 2.0,
      delay: '1-2 jours',
      icon: Plane,
      color: 'text-orange-600'
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Service haut de gamme, suivi dédié',
      price: 1.5,
      delay: '24h',
      icon: Star,
      color: 'text-purple-600'
    }
  ];

  // Calcul automatique du prix selon la politique tarifaire officielle

  // Calcul automatique du prix selon la politique tarifaire officielle
  const calculatePrice = async () => {
    if (!formData.weight || !formData.sender.city || !formData.recipient.city || !formData.packageType) return;

    setIsCalculating(true);

    // Simulation d'un délai de calcul
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      // Calculer le prix selon la ville de destination
      const pricing = calculatePriceByCity(
        formData.sender.city,
        formData.recipient.city,
        parseFloat(formData.weight),
        formData.packageType,
        formData.service
      );

      // Multiplicateur selon le service
      const serviceMultipliers = {
        economy: 0.7,
        standard: 1.0,
        express: 1.8,
        premium: 1.3
      };
      const serviceMultiplier = serviceMultipliers[formData.service] || 1.0;

      // Prix final
      const finalPrice = pricing.total * serviceMultiplier;

      setPriceCalculation({
        baseRate: pricing.basePrice,
        weightCharge: pricing.weightPrice,
        fuelSurcharge: pricing.fuelPrice,
        serviceCharge: finalPrice - pricing.basePrice - pricing.weightPrice - pricing.fuelPrice,
        insurance: 0,
        specialCharges: 0,
        total: finalPrice,
        estimatedDays: formData.service === 'express' ? 2 : formData.service === 'premium' ? 1 : 5,
        zone: { name: CITY_PRICING[formData.recipient.city]?.zone || 'Non définie' }
      });

      console.log('💰 Prix calculé:', {
        from: formData.sender.city,
        to: formData.recipient.city,
        weight: formData.weight,
        packageType: formData.packageType,
        service: formData.service,
        price: finalPrice
      });

    } catch (error) {
      console.error('❌ Erreur lors du calcul du prix:', error);
      setPriceCalculation(null);
    } finally {
      setIsCalculating(false);
    }
  };

  // Calcul automatique dès le début
  useEffect(() => {
    if (formData.weight && formData.sender.city && formData.recipient.city) {
      calculatePrice();
    }
  }, [formData.weight, formData.sender.city, formData.recipient.city, formData.service, formData.insurance, formData.insuranceValue, formData.packageType, formData.recipient.deliveryType]);

  // Mettre à jour le montant en espèces
  useEffect(() => {
    if (formData.paymentMethod === 'cash' && priceCalculation) {
      setFormData(prev => ({ ...prev, cashAmount: priceCalculation.total.toString() }));
    }
  }, [formData.paymentMethod, priceCalculation]);

  // Validation en temps réel
  useEffect(() => {
    if (currentStep > 0) {
      const validation = validateStepWithErrors(currentStep);
      setStepErrors(prev => ({ ...prev, [currentStep]: validation.errors }));
    }
  }, [formData, currentStep]);
  // Validation en temps réel pour l'étape 5
  useEffect(() => {
    if (currentStep === 5) {
      const validation = validateStepWithErrors(5);
      if (!validation.isValid) {
        setStepErrors(prev => ({ ...prev, 5: validation.errors }));
      } else {
        setStepErrors(prev => ({ ...prev, 5: [] }));
      }
    }
  }, [currentStep, formData.paymentMethod, formData.phoneNumber, formData.cashAmount]);

  const steps = [
    { id: 1, title: 'Type de colis', description: 'Définissez votre envoi' },
    { id: 2, title: 'Expéditeur', description: 'Vos informations' },
    { id: 3, title: 'Destinataire', description: 'Informations de livraison' },
    { id: 4, title: 'Service', description: 'Options et garanties' },
    { id: 5, title: 'Paiement', description: 'Finalisez votre commande' }
  ];

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!formData.serviceType && !!formData.weight && !!formData.packageType &&
               (formData.packageType === 'document' || validateDimensions(formData.dimensions));
      case 2:
        return !!formData.sender.name && !!formData.sender.phone &&
               !!formData.sender.city && !!formData.sender.agency &&
               validateEmail(formData.sender.email);
      case 3:
        return !!formData.recipient.name && !!formData.recipient.phone &&
               !!formData.recipient.city && !!formData.recipient.address &&
               (formData.serviceType === 'national' || !!formData.recipient.country);
      case 4:
        const requiredFields = getRequiredFieldsForPackageType(formData.packageType);
        if (requiredFields.includes('specialInstructions') && !formData.specialInstructions) {
          return false;
        }
        if (!formData.service) {
          return false;
        }
        if ((formData.packageType === 'fragile' || formData.packageType === 'electronics') && !formData.insurance) {
          return false;
        }
        if (!priceCalculation || !priceCalculation.total) {
          return false;
        }
        return true;
            case 5:
        if (!formData.paymentMethod) {
          return false;
        }
        if (formData.paymentMethod === 'cash') {
          return !!formData.cashAmount && parseFloat(formData.cashAmount) > 0;
        } else {
          return !!formData.phoneNumber && validatePhoneNumber(formData.phoneNumber);
        }
      default:
        return false;
    }
  };

  const validateStepWithErrors = (step: number): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    switch (step) {
      case 1:
        if (!formData.serviceType) errors.push('Veuillez sélectionner le type de service (national/international)');
        if (!formData.weight) errors.push('Le poids est obligatoire');
        if (!formData.packageType) errors.push('Le type de colis est obligatoire');
        if (formData.packageType !== 'document' && !validateDimensions(formData.dimensions)) {
          errors.push('Les dimensions sont obligatoires pour ce type de colis');
        }
        break;

      case 2:
        if (!formData.sender.name) errors.push("Le nom de l'expéditeur est obligatoire");
        if (!formData.sender.phone) errors.push("Le téléphone de l'expéditeur est obligatoire");
        if (!formData.sender.city) errors.push("La ville de l'expéditeur est obligatoire");
        if (!formData.sender.agency) errors.push("L'agence d'envoi est obligatoire");
        if (!validateEmail(formData.sender.email)) errors.push("L'email de l'expéditeur n'est pas valide");
        break;

      case 3:
        if (!formData.recipient.name) errors.push("Le nom du destinataire est obligatoire");
        if (!formData.recipient.phone) errors.push("Le téléphone du destinataire est obligatoire");
        if (!formData.recipient.city) errors.push("La ville du destinataire est obligatoire");
        if (!formData.recipient.address) errors.push("L'adresse du destinataire est obligatoire");
        if (formData.serviceType === 'international' && !formData.recipient.country) {
          errors.push("Le pays est obligatoire pour les envois internationaux");
        }
        break;

      case 4:
        if (!formData.service) errors.push("Veuillez sélectionner un service");
        if ((formData.packageType === 'fragile' || formData.packageType === 'electronics') && !formData.insurance) {
          errors.push("L'assurance est obligatoire pour les colis fragiles et électroniques");
        }
        if (!priceCalculation || !priceCalculation.total) {
          errors.push("Le calcul de prix est obligatoire avant de continuer");
        }
        break;

            case 5:
        if (!formData.paymentMethod) {
          errors.push("Veuillez sélectionner une méthode de paiement");
        }
        if (formData.paymentMethod === 'cash') {
          if (!formData.cashAmount || parseFloat(formData.cashAmount) <= 0) {
            errors.push("Le montant en espèces doit être supérieur à 0");
          }
        } else {
          if (!formData.phoneNumber) {
            errors.push("Le numéro de téléphone est obligatoire pour le paiement mobile");
          } else if (!validatePhoneNumber(formData.phoneNumber)) {
            errors.push("Le numéro de téléphone n'est pas valide");
          }
        }
        break;
    }

    return { isValid: errors.length === 0, errors };
  };

  const handleNext = () => {
    const validation = validateStepWithErrors(currentStep);
    setStepErrors(prev => ({ ...prev, [currentStep]: validation.errors }));

    if (validation.isValid && currentStep < 5) {
      setCurrentStep(currentStep + 1);
      setStepErrors(prev => ({ ...prev, [currentStep]: [] }));
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Fonction pour transformer les données au format backend
  const transformExpeditionData = (formData: any, paymentResult: any, priceCalculation: any) => {
    return {
      type: formData.serviceType || 'national',
      service: formData.service || 'standard',
      sender: {
        name: formData.sender?.name || '',
        phone: formData.sender?.phone || '',
        email: formData.sender?.email || '',
        address: formData.sender?.address || '',
        city: formData.sender?.city || '',
        country: formData.sender?.country || 'Congo'
      },
      recipient: {
        name: formData.recipient?.name || '',
        phone: formData.recipient?.phone || '',
        email: formData.recipient?.email || '',
        address: formData.recipient?.address || '',
        city: formData.recipient?.city || '',
        country: formData.recipient?.country || 'Congo'
      },
      package: {
        weight: parseFloat(formData.weight) || 0,
        dimensions: `${formData.dimensions?.length || 30}x${formData.dimensions?.width || 20}x${formData.dimensions?.height || 15}`,
        contents: formData.packageType || 'package',
        declaredValue: priceCalculation?.total || 0
      },
      insurance: {
        amount: priceCalculation?.total || 0,
        currency: 'FCFA'
      },
      deliveryInstructions: formData.specialInstructions || '',
      signatureRequired: false
    };
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Validation finale avant soumission
      const finalValidation = validateStepWithErrors(5);
      if (!finalValidation.isValid) {
        setStepErrors(prev => ({ ...prev, 5: finalValidation.errors }));
        setIsSubmitting(false);
        return;
      }

      // Préparer les données de paiement
      const paymentData = {
        amount: priceCalculation?.total || 0,
        method: formData.paymentMethod.toUpperCase(),
        phoneNumber: formData.phoneNumber,
        orderId: `COLIS_${Date.now()}`,
        description: `Expédition colis de ${formData.sender.city} vers ${formData.recipient.city}`
      };

      console.log('💳 Données de paiement:', paymentData);

      // Appel API de paiement via colisApi
      const paymentResult = await colisApi.processPayment(paymentData);
      
      if (!paymentResult.success) {
        throw new Error(paymentResult.message || 'Erreur lors du traitement du paiement');
      }

      console.log('✅ Paiement traité:', paymentResult);

      // Préparer les données d'expédition au format backend
      const expeditionData = transformExpeditionData(formData, paymentResult, priceCalculation);

      console.log('📤 Données d\'expédition transformées:', JSON.stringify(expeditionData, null, 2));

      // Appel API de création d'expédition via colisApi
      const expeditionResult = await colisApi.createExpedition(expeditionData);
      
      if (!expeditionResult.success) {
        throw new Error(expeditionResult.message || 'Erreur lors de la création de l\'expédition');
      }

      console.log('📦 Expédition créée:', expeditionResult);

      // Sauvegarder les données pour la page de confirmation
      localStorage.setItem('expeditionData', JSON.stringify({
        ...expeditionData,
        trackingNumber: expeditionResult.data.trackingNumber,
        paymentResult: paymentResult,
        createdAt: new Date().toISOString()
      }));

      // Envoyer les notifications
      await sendNotifications(expeditionData, expeditionResult.data.trackingNumber);

      setIsSubmitting(false);
      
      // Redirection vers la page de confirmation
      navigate(`/colis/confirmation/${expeditionResult.data.trackingNumber}`);
      
    } catch (error) {
      console.error('❌ Erreur lors de la soumission:', error);
      setStepErrors(prev => ({ 
        ...prev, 
        5: [error.message || 'Erreur lors de la soumission de l\'expédition'] 
      }));
      setIsSubmitting(false);
    }
  };

  // Fonction pour envoyer les notifications
  const sendNotifications = async (expeditionData, trackingNumber) => {
    try {
      const notificationData = {
        trackingNumber,
        senderPhone: expeditionData.sender.phone,
        senderEmail: expeditionData.sender.email,
        recipientPhone: expeditionData.recipient.phone,
        recipientEmail: expeditionData.recipient.email,
        fromCity: expeditionData.sender.city,
        toCity: expeditionData.recipient.city,
        amount: expeditionData.insurance.amount // Utiliser le montant de l'assurance
      };

      console.log('📧 Données de notification:', notificationData);

      // Appel API de notifications via colisApi
      const notificationResult = await colisApi.sendExpeditionNotification(notificationData);

      if (notificationResult.success) {
        console.log('📱 Notifications envoyées avec succès');
      } else {
        console.warn('⚠️ Erreur lors de l\'envoi des notifications:', notificationResult.message);
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi des notifications:', error);
      // Ne pas faire échouer la confirmation pour une erreur de notification
    }
  };

  // Composant d'affichage des erreurs
  const StepErrors: React.FC<{ step: number }> = ({ step }) => {
    const errors = stepErrors[step] || [];

    if (errors.length === 0) return null;

    return (
      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-2 text-red-700 mb-2">
          <AlertTriangle className="h-4 w-4" />
          <span className="font-medium">Erreurs à corriger :</span>
        </div>
        <ul className="text-sm text-red-600 space-y-1">
          {errors.map((error, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-red-500">•</span>
              <span>{error}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Expédier un Colis
          </h1>
          <p className="text-lg text-gray-600">
            Processus simple et automatisé pour vos envois
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulaire principal */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-6 w-6" />
                  Formulaire d'expédition
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {/* Barre de progression */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    {steps.map((step, index) => (
                      <div key={step.id} className="flex items-center">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                          currentStep >= step.id
                            ? 'bg-orange-500 border-orange-500 text-white'
                            : 'bg-white border-gray-300 text-gray-500'
                        }`}>
                          {currentStep > step.id ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <span className="font-semibold">{step.id}</span>
                          )}
                        </div>
                        {index < steps.length - 1 && (
                          <div className={`w-16 h-1 mx-2 ${
                            currentStep > step.id ? 'bg-orange-500' : 'bg-gray-300'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                  <Progress value={(currentStep / 5) * 100} className="h-2" />
                  <div className="text-center mt-2">
                    <span className="text-sm font-medium text-gray-600">
                      Étape {currentStep} sur 5 : {steps[currentStep - 1].title}
                    </span>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Étape 1: Type de colis */}
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <div>
                          <Label className="text-lg font-semibold mb-4 block">Type de service</Label>
                          <div className="grid grid-cols-2 gap-4">
                            <Button
                              variant={formData.serviceType === 'national' ? 'default' : 'outline'}
                              onClick={() => updateFormData('serviceType', 'national')}
                              className="h-16 flex flex-col items-center justify-center"
                            >
                              <Truck className="h-6 w-6 mb-2" />
                              <span>National</span>
                            </Button>
                            <Button
                              variant={formData.serviceType === 'international' ? 'default' : 'outline'}
                              onClick={() => updateFormData('serviceType', 'international')}
                              className="h-16 flex flex-col items-center justify-center"
                            >
                              <Plane className="h-6 w-6 mb-2" />
                              <span>International</span>
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label className="text-lg font-semibold mb-4 block">Type de colis</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {packageTypes.map((type) => (
                              <Button
                                key={type.id}
                                variant={formData.packageType === type.id ? 'default' : 'outline'}
                                onClick={() => {
                                  updateFormData('packageType', type.id);
                                  // Réinitialiser les champs spéciaux lors du changement de type
                                  updateFormData('specialInstructions', '');
                                  updateFormData('insuranceValue', '');
                                }}
                                className="h-20 flex flex-col items-center justify-center"
                              >
                                <type.icon className="h-5 w-5 mb-1" />
                                <span className="text-xs">{type.name}</span>
                                <span className="text-xs text-gray-500 mt-1">{PACKAGE_TYPE_CONFIG[type.id]?.description}</span>
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Champs dynamiques selon le type de colis */}
                        {formData.packageType && (
                          <div className="space-y-4">
                            
                        {/* Affichage des erreurs de validation */}
                        <AnimatePresence>
                          {stepErrors[5] && stepErrors[5].length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="space-y-2"
                            >
                              {stepErrors[5].map((error, index) => (
                                <div key={index} className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                  <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                                  <span className="text-sm text-red-700">{error}</span>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="bg-blue-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-blue-800 mb-2">
                                Configuration pour {PACKAGE_TYPE_CONFIG[formData.packageType]?.name}
                              </h4>
                              <p className="text-sm text-blue-600">
                                {PACKAGE_TYPE_CONFIG[formData.packageType]?.description}
                              </p>
                            </div>

                            {/* Champs spéciaux selon le type */}
                            {getSpecialFieldsForPackageType(formData.packageType).length > 0 && (
                              <div>
                                <Label className="text-sm font-medium">Options spéciales</Label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                  {getSpecialFieldsForPackageType(formData.packageType).map((field) => (
                                    <div key={field} className="flex items-center space-x-2">
                                      <input
                                        type="checkbox"
                                        id={field}
                                        className="rounded border-gray-300"
                                      />
                                      <label htmlFor={field} className="text-sm">
                                        {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Instructions spéciales obligatoires pour certains types */}
                            {getRequiredFieldsForPackageType(formData.packageType).includes('specialInstructions') && (
                              <div>
                                <Label htmlFor="specialInstructions">Instructions spéciales *</Label>
                                <Textarea
                                  id="specialInstructions"
                                  value={formData.specialInstructions}
                                  onChange={(e) => updateFormData('specialInstructions', e.target.value)}
                                  placeholder="Instructions spécifiques pour ce type de colis..."
                                  className="mt-1"
                                />
                              </div>
                            )}

                            {/* Assurance obligatoire pour certains types */}
                            {PACKAGE_TYPE_CONFIG[formData.packageType]?.insuranceRequired && (
                              <div>
                                <Label htmlFor="insuranceValue">Valeur déclarée *</Label>
                                <Input
                                  id="insuranceValue"
                                  type="number"
                                  value={formData.insuranceValue}
                                  onChange={(e) => updateFormData('insuranceValue', e.target.value)}
                                  placeholder="Valeur en FCFA"
                                  className="mt-1"
                                />
                                <p className="text-sm text-gray-600 mt-1">
                                  Assurance obligatoire pour ce type de colis
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="weight">Poids (kg) *</Label>
                            <Input
                              id="weight"
                              type="number"
                              value={formData.weight}
                              onChange={(e) => updateFormData('weight', e.target.value)}
                              placeholder="0.5"
                              step="0.1"
                              min="0.1"
                              max="50"
                            />
                          </div>
                          <div>
                            <Label>Dimensions (cm) - Optionnel</Label>
                            <p className="text-sm text-gray-600 mb-2">Ces informations aident à optimiser le calcul du tarif</p>
                            <div className="grid grid-cols-3 gap-2">
                              <Input
                                placeholder="Longueur"
                                value={formData.dimensions.length}
                                onChange={(e) => updateNestedField('dimensions', 'length', e.target.value)}
                              />
                              <Input
                                placeholder="Largeur"
                                value={formData.dimensions.width}
                                onChange={(e) => updateNestedField('dimensions', 'width', e.target.value)}
                              />
                              <Input
                                placeholder="Hauteur"
                                value={formData.dimensions.height}
                                onChange={(e) => updateNestedField('dimensions', 'height', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Étape 2: Expéditeur */}
                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <div>
                          <Label className="text-lg font-semibold mb-4 block">Type d'expéditeur</Label>
                          <div className="grid grid-cols-2 gap-4">
                            <Button
                              variant={formData.sender.type === 'individual' ? 'default' : 'outline'}
                              onClick={() => updateNestedField('sender', 'type', 'individual')}
                              className="h-12 flex items-center justify-center"
                            >
                              <User className="h-4 w-4 mr-2" />
                              Particulier
                            </Button>
                            <Button
                              variant={formData.sender.type === 'business' ? 'default' : 'outline'}
                              onClick={() => updateNestedField('sender', 'type', 'business')}
                              className="h-12 flex items-center justify-center"
                            >
                              <Building className="h-4 w-4 mr-2" />
                              Entreprise
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="senderName">Nom complet *</Label>
                            <Input
                              id="senderName"
                              value={formData.sender.name}
                              onChange={(e) => updateNestedField('sender', 'name', e.target.value)}
                              placeholder="Votre nom"
                            />
                          </div>
                          <div>
                            <Label htmlFor="senderPhone">Téléphone *</Label>
                            <Input
                              id="senderPhone"
                              value={formData.sender.phone}
                              onChange={(e) => updateNestedField('sender', 'phone', e.target.value)}
                              placeholder="+242 06 XXX XXX"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="senderEmail">Email</Label>
                          <Input
                            id="senderEmail"
                            type="email"
                            value={formData.sender.email}
                            onChange={(e) => updateNestedField('sender', 'email', e.target.value)}
                            placeholder="votre@email.com"
                          />
                        </div>

                        {formData.sender.type === 'business' && (
                          <div>
                            <Label htmlFor="senderCompany">Nom de l'entreprise</Label>
                            <Input
                              id="senderCompany"
                              value={formData.sender.company || ''}
                              onChange={(e) => updateNestedField('sender', 'company', e.target.value)}
                              placeholder="Nom de votre entreprise"
                            />
                          </div>
                        )}

                        <div>
                          <Label htmlFor="senderAddress">Adresse *</Label>
                          <Input
                            id="senderAddress"
                            value={formData.sender.address}
                            onChange={(e) => updateNestedField('sender', 'address', e.target.value)}
                            placeholder="Adresse complète"
                          />
                        </div>

                        <div>
                          <Label htmlFor="senderCity">Ville d'envoi *</Label>
                          <Select
                            value={formData.sender.city}
                            onValueChange={(value) => updateNestedField('sender', 'city', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez une ville" />
                            </SelectTrigger>
                            <SelectContent>
                              {cities.map((city) => (
                                <SelectItem key={city} value={city}>
                                  {city}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {formData.sender.city && (
                          <div>
                            <Label htmlFor="senderAgency">Agence d'envoi *</Label>
                            <Select
                              value={formData.sender.agency}
                              onValueChange={(value) => updateNestedField('sender', 'agency', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez une agence" />
                              </SelectTrigger>
                              <SelectContent>
                                {getAgenciesForCity(formData.sender.city).map((agency) => (
                                  <SelectItem key={agency.id} value={agency.id}>
                                    <div className="flex flex-col">
                                      <span className="font-medium">{agency.name}</span>
                                      <span className="text-xs text-gray-500">{agency.address}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                                <SelectItem value="ramassage_domicile">
                                  <div className="flex flex-col">
                                    <span className="font-medium">Ramassage à domicile</span>
                                    <span className="text-xs text-gray-500">Service de collecte à domicile</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="point_relais">
                                  <div className="flex flex-col">
                                    <span className="font-medium">Point Relais</span>
                                    <span className="text-xs text-gray-500">Point de dépôt partenaire</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            {formData.sender.agency && (
                              <p className="text-sm text-gray-600 mt-1">
                                {formData.sender.agency === 'ramassage_domicile'
                                  ? "Un agent viendra récupérer votre colis à l'adresse indiquée"
                                  : formData.sender.agency === 'point_relais'
                                  ? 'Déposez votre colis dans un point relais partenaire'
                                  : 'Déposez votre colis dans cette agence'
                                }
                              </p>
                            )}
                          </div>
                        )}

                      </div>
                    )}

                    {/* Étape 3: Destinataire */}
                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <div>
                          <Label className="text-lg font-semibold mb-4 block">Type de destinataire</Label>
                          <div className="grid grid-cols-2 gap-4">
                            <Button
                              variant={formData.recipient.type === 'individual' ? 'default' : 'outline'}
                              onClick={() => updateNestedField('recipient', 'type', 'individual')}
                              className="h-12 flex items-center justify-center"
                            >
                              <User className="h-4 w-4 mr-2" />
                              Particulier
                            </Button>
                            <Button
                              variant={formData.recipient.type === 'business' ? 'default' : 'outline'}
                              onClick={() => updateNestedField('recipient', 'type', 'business')}
                              className="h-12 flex items-center justify-center"
                            >
                              <Building className="h-4 w-4 mr-2" />
                              Entreprise
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="recipientName">Nom complet *</Label>
                            <Input
                              id="recipientName"
                              value={formData.recipient.name}
                              onChange={(e) => updateNestedField('recipient', 'name', e.target.value)}
                              placeholder="Nom du destinataire"
                            />
                          </div>
                          <div>
                            <Label htmlFor="recipientPhone">Téléphone *</Label>
                            <Input
                              id="recipientPhone"
                              value={formData.recipient.phone}
                              onChange={(e) => updateNestedField('recipient', 'phone', e.target.value)}
                              placeholder="+242 06 XXX XXX"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="recipientEmail">Email</Label>
                          <Input
                            id="recipientEmail"
                            type="email"
                            value={formData.recipient.email}
                            onChange={(e) => updateNestedField('recipient', 'email', e.target.value)}
                            placeholder="destinataire@email.com"
                          />
                        </div>

                        {formData.recipient.type === 'business' && (
                          <div>
                            <Label htmlFor="recipientCompany">Nom de l'entreprise</Label>
                            <Input
                              id="recipientCompany"
                              value={formData.recipient.company || ''}
                              onChange={(e) => updateNestedField('recipient', 'company', e.target.value)}
                              placeholder="Nom de l'entreprise"
                            />
                          </div>
                        )}

                        <div>
                          <Label htmlFor="recipientAddress">Adresse *</Label>
                          <Input
                            id="recipientAddress"
                            value={formData.recipient.address}
                            onChange={(e) => updateNestedField('recipient', 'address', e.target.value)}
                            placeholder="Adresse de livraison"
                          />
                        </div>

                        <div>
                          <Label className="text-lg font-semibold mb-4 block">Mode de livraison</Label>
                          <div className="grid grid-cols-2 gap-4">
                            <Button
                              variant={formData.recipient.deliveryType === 'agence' ? 'default' : 'outline'}
                              onClick={() => updateNestedField('recipient', 'deliveryType', 'agence')}
                              className="h-16 flex flex-col items-center justify-center"
                            >
                              <Building className="h-6 w-6 mb-2" />
                              <span>Agence</span>
                              <span className="text-xs">Récupération en agence</span>
                            </Button>
                            <Button
                              variant={formData.recipient.deliveryType === 'domicile' ? 'default' : 'outline'}
                              onClick={() => updateNestedField('recipient', 'deliveryType', 'domicile')}
                              className="h-16 flex flex-col items-center justify-center"
                            >
                              <Home className="h-6 w-6 mb-2" />
                              <span>Domicile</span>
                              <span className="text-xs">Livraison à domicile</span>
                            </Button>
                          </div>
                        </div>

                        {formData.recipient.deliveryType === 'agence' && (
                          <div>
                            <Label htmlFor="recipientAgency">Agence de récupération (optionnel)</Label>
                            <Input
                              id="recipientAgency"
                              value={formData.recipient.agency || ''}
                              onChange={(e) => updateNestedField('recipient', 'agency', e.target.value)}
                              placeholder="Nom de l'agence préférée (laisser vide pour agence la plus proche)"
                            />
                            <p className="text-sm text-gray-600 mt-1">
                              Si vous ne spécifiez pas d'agence, le destinataire pourra récupérer dans n'importe quelle agence de la ville
                            </p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="recipientCity">Ville *</Label>
                            <Select
                              value={formData.recipient.city}
                              onValueChange={(value) => updateNestedField('recipient', 'city', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez une ville" />
                              </SelectTrigger>
                              <SelectContent>
                                {cities.map((city) => (
                                  <SelectItem key={city} value={city}>{city}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {formData.serviceType === 'international' && (
                            <div>
                              <Label htmlFor="recipientCountry">Pays *</Label>
                              <Select
                                value={formData.recipient.country}
                                onValueChange={(value) => updateNestedField('recipient', 'country', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionnez un pays" />
                                </SelectTrigger>
                                <SelectContent>
                                  {countries.map((country) => (
                                    <SelectItem key={country} value={country}>{country}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Étape 4: Service et options */}
                    {currentStep === 4 && (
                      <div className="space-y-6">
                        <div>
                          <Label className="text-lg font-semibold mb-4 block">Type de service</Label>
                          <div className="grid grid-cols-2 gap-4">
                            {services.map((service) => (
                              <Card
                                key={service.id}
                                className={`cursor-pointer transition-all hover:shadow-lg ${
                                  formData.service === service.id ? 'ring-2 ring-orange-500' : ''
                                }`}
                                onClick={() => updateFormData('service', service.id)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-3 mb-2">
                                    <service.icon className={`h-5 w-5 ${service.color}`} />
                                    <div className="flex-1">
                                      <h3 className="font-semibold">{service.name}</h3>
                                      <p className="text-sm text-gray-600">{service.description}</p>
                                    </div>
                                    {service.popular && (
                                      <Badge variant="secondary" className="text-xs">
                                        Populaire
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">{service.delay}</span>
                                    <span className="font-semibold">{service.price}x</span>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="insurance">Assurance supplémentaire</Label>
                              <p className="text-sm text-gray-600">Protection pour votre colis</p>
                            </div>
                            <Switch
                              checked={formData.insurance}
                              onCheckedChange={(checked) => updateFormData('insurance', checked)}
                            />
                          </div>

                          {formData.insurance && (
                            <div>
                              <Label htmlFor="insuranceValue">Valeur déclarée (FCFA)</Label>
                              <Input
                                id="insuranceValue"
                                type="number"
                                value={formData.insuranceValue}
                                onChange={(e) => updateFormData('insuranceValue', e.target.value)}
                                placeholder="50000"
                              />
                            </div>
                          )}

                          <div>
                            <Label htmlFor="specialInstructions">Instructions spéciales</Label>
                            <Textarea
                              id="specialInstructions"
                              value={formData.specialInstructions}
                              onChange={(e) => updateFormData('specialInstructions', e.target.value)}
                              placeholder="Instructions pour la livraison..."
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Étape 5: Paiement */}
                    {currentStep === 5 && (
                      <div className="space-y-6">
                        <div>
                          <Label className="text-lg font-semibold mb-4 block">Méthode de paiement</Label>
                          <div className="grid grid-cols-2 gap-4">
                            <Button
                              variant={formData.paymentMethod === 'momo' ? 'default' : 'outline'}
                              onClick={() => updateFormData('paymentMethod', 'momo')}
                              className="h-16 flex flex-col items-center justify-center"
                            >
                              <Smartphone className="h-6 w-6 mb-2" />
                              <span>MTN Money</span>
                            </Button>
                            <Button
                              variant={formData.paymentMethod === 'airtel' ? 'default' : 'outline'}
                              onClick={() => updateFormData('paymentMethod', 'airtel')}
                              className="h-16 flex flex-col items-center justify-center"
                            >
                              <Smartphone className="h-6 w-6 mb-2" />
                              <span>Airtel Money</span>
                            </Button>
                            <Button
                              variant={formData.paymentMethod === 'card' ? 'default' : 'outline'}
                              onClick={() => updateFormData('paymentMethod', 'card')}
                              className="h-16 flex flex-col items-center justify-center"
                              disabled
                            >
                              <CreditCard className="h-6 w-6 mb-2" />
                              <span>Carte bancaire</span>
                              <Badge variant="secondary" className="text-xs mt-1">
                                Bientôt disponible
                              </Badge>
                            </Button>
                            <Button
                              variant={formData.paymentMethod === 'cash' ? 'default' : 'outline'}
                              onClick={() => updateFormData('paymentMethod', 'cash')}
                              className="h-16 flex flex-col items-center justify-center"
                            >
                              <CreditCard className="h-6 w-6 mb-2" />
                              <span>Espèces</span>
                            </Button>
                          </div>
                        </div>

                        {formData.paymentMethod !== 'cash' && (
                          <div>
                            <Label htmlFor="phoneNumber">Numéro de téléphone *</Label>
                            <Input
                              id="phoneNumber"
                              value={formData.phoneNumber}
                              onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                              placeholder="+242 06 XXX XXX"
                            />
                          </div>
                        )}

                        {formData.paymentMethod === 'cash' && (
                          <div>
                            <Label htmlFor="cashAmount">Montant à payer *</Label>
                            <Input
                              id="cashAmount"
                              type="number"
                              value={formData.cashAmount || ''}
                              onChange={(e) => updateFormData('cashAmount', e.target.value)}
                              placeholder={priceCalculation ? `${priceCalculation.total.toLocaleString()} FCFA` : "Montant"}
                              readOnly
                            />
                            <p className="text-sm text-gray-600 mt-1">
                              Paiement en espèces à l'agence lors de la récupération
                            </p>
                          </div>
                        )}

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-blue-900 mb-2">Informations importantes</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Votre colis sera récupéré dans les 24h</li>
                            <li>• Vous recevrez un numéro de suivi par SMS</li>
                            <li>• Le paiement sera débité après la récupération</li>
                            <li>• Service client disponible 24h/24</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Précédent
                  </Button>

                  {currentStep < 5 ? (
                    <Button
                      onClick={handleNext}
                      disabled={!validateStep(currentStep)}
                      className="flex items-center gap-2"
                    >
                      Suivant
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting || !validateStep(currentStep)}
                      className="flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Traitement...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4" />
                          Confirmer l'expédition
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panneau latéral - Calcul et résumé */}
          <div className="space-y-6">
            {/* Calcul de prix en temps réel */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Calcul en temps réel
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isCalculating ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
                    <p className="text-gray-600">Calcul en cours...</p>
                  </div>
                ) : priceCalculation ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">
                        {priceCalculation.total.toLocaleString()} FCFA
                      </div>
                      <div className="text-sm text-gray-600">
                        Livraison en {priceCalculation.estimatedDays} jours
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Zone: {CITY_PRICING[formData.recipient.city]?.zone || 'Non définie'}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Tarif de base</span>
                        <span>{priceCalculation.baseRate.toLocaleString()} FCFA</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Charge poids</span>
                        <span>{priceCalculation.weightCharge.toLocaleString()} FCFA</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Surcharge carburant</span>
                        <span>{priceCalculation.fuelSurcharge.toLocaleString()} FCFA</span>
                      </div>
                      {priceCalculation.insurance > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Assurance</span>
                          <span>{priceCalculation.insurance.toLocaleString()} FCFA</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span>Frais de service</span>
                        <span>{priceCalculation.serviceCharge.toLocaleString()} FCFA</span>
                      </div>
                      {priceCalculation.specialCharges > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Surcharges spéciales</span>
                          <span>{priceCalculation.specialCharges.toLocaleString()} FCFA</span>
                        </div>
                      )}
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total</span>
                        <span>{priceCalculation.total.toLocaleString()} FCFA</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calculator className="h-8 w-8 mx-auto mb-4" />
                    <p>Remplissez les informations pour voir le tarif</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Résumé de l'expédition */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Résumé
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Type:</span>
                    <span className="capitalize">{formData.packageType}</span>
                  </div>
                  {formData.weight && (
                    <div className="flex items-center gap-2 text-sm">
                      <Scale className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Poids:</span>
                      <span>{formData.weight} kg</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Service:</span>
                    <span className="capitalize">{formData.service}</span>
                  </div>
                  {formData.sender.city && formData.recipient.city && (
                    <div className="flex items-center gap-2 text-sm">
                      <Navigation className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Trajet:</span>
                      <span>{formData.sender.city} → {formData.recipient.city}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <MapPinIcon className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Livraison:</span>
                    <span className="capitalize">{formData.recipient.deliveryType}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Aide et support */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Besoin d'aide ?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  Appeler le support
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MailIcon className="h-4 w-4 mr-2" />
                  Chat en ligne
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Guide d'expédition
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColisExpeditionModernFixed;