import React, { useState, useEffect } from 'react';
import NavbarColis from '@/components/colis/NavbarColis';
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
  Factory
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface PriceCalculation {
  baseRate: number;
  weightCharge: number;
  fuelSurcharge: number;
  insurance: number;
  serviceCharge: number;
  total: number;
  currency: string;
  estimatedDays: number;
  breakdown: {
    baseRate: number;
    weightCharge: number;
    fuelSurcharge: number;
    insurance: number;
    serviceCharge: number;
  };
}

const ColisExpeditionModern: React.FC = () => {
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
      city: 'Brazzaville',
      type: 'individual'
    },
    recipient: { 
      name: '', 
      phone: '', 
      email: '', 
      address: '', 
      city: 'Pointe-Noire', 
      country: 'Congo',
      type: 'individual'
    },
    service: 'standard',
    insurance: false,
    insuranceValue: '',
    specialInstructions: '',
    paymentMethod: 'momo',
    phoneNumber: '',
    cashAmount: ''
  });

  const [priceCalculation, setPriceCalculation] = useState<PriceCalculation | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [autoComplete, setAutoComplete] = useState<string[]>([]);

  // Données selon la politique tarifaire
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

  // Calcul automatique du prix selon la politique tarifaire
  const calculatePrice = async () => {
    if (!formData.weight || !formData.sender.city || !formData.recipient.city) return;

    setIsCalculating(true);
    
    // Simulation d'un délai de calcul
    await new Promise(resolve => setTimeout(resolve, 1000));

    const weight = parseFloat(formData.weight);
    const service = services.find(s => s.id === formData.service);
    
    // Tarifs selon la politique tarifaire
    let baseRate = 0;
    let fuelSurcharge = 0;
    let insuranceIncluded = 0;

    if (formData.serviceType === 'national') {
      if (formData.sender.city === formData.recipient.city) {
        // Zone Urbaine
        baseRate = 1500;
        fuelSurcharge = 0.05;
        insuranceIncluded = 25000;
      } else if ((formData.sender.city === 'Brazzaville' && formData.recipient.city === 'Pointe-Noire') ||
                 (formData.sender.city === 'Pointe-Noire' && formData.recipient.city === 'Brazzaville')) {
        // Axe Principal
        baseRate = 5000;
        fuelSurcharge = 0.08;
        insuranceIncluded = 50000;
      } else {
        // Villes Secondaires
        baseRate = 3500;
        fuelSurcharge = 0.10;
        insuranceIncluded = 40000;
      }
    } else {
      // International
      baseRate = 25000;
      fuelSurcharge = 0.12;
      insuranceIncluded = 150000;
    }

    // Calcul des charges par poids
    let weightCharge = 0;
    if (weight > 1 && weight <= 5) weightCharge = 500;
    else if (weight > 5 && weight <= 10) weightCharge = 800;
    else if (weight > 10 && weight <= 20) weightCharge = 1200;
    else if (weight > 20) weightCharge = 1500;

    // Multiplicateur de service
    const serviceMultiplier = service?.price || 1.0;
    
    // Calculs
    const baseRateWithService = baseRate * serviceMultiplier;
    const weightChargeWithService = weightCharge * serviceMultiplier;
    const fuelSurchargeAmount = (baseRateWithService + weightChargeWithService) * fuelSurcharge;
    const insurance = formData.insurance ? parseFloat(formData.insuranceValue || '0') * 0.02 : 0;
    const serviceCharge = baseRateWithService * 0.1;

    const total = baseRateWithService + weightChargeWithService + fuelSurchargeAmount + insurance + serviceCharge;

    const calculation: PriceCalculation = {
      baseRate: baseRateWithService,
      weightCharge: weightChargeWithService,
      fuelSurcharge: fuelSurchargeAmount,
      insurance,
      serviceCharge,
      total,
      currency: 'FCFA',
      estimatedDays: service?.delay ? parseInt(service.delay.split('-')[0]) : 3,
      breakdown: {
        baseRate: baseRateWithService,
        weightCharge: weightChargeWithService,
        fuelSurcharge: fuelSurchargeAmount,
        insurance,
        serviceCharge
      }
    };

    setPriceCalculation(calculation);
    setIsCalculating(false);
  };

  // Calcul automatique dès le début
  useEffect(() => {
    if (formData.weight && formData.sender.city && formData.recipient.city) {
      calculatePrice();
    }
  }, [formData.weight, formData.sender.city, formData.recipient.city, formData.service, formData.insurance, formData.insuranceValue, formData.packageType]);

  // Auto-complétion des adresses
  const handleAddressInput = (type: 'sender' | 'recipient', value: string) => {
    const suggestions = cities.filter(city => 
      city.toLowerCase().includes(value.toLowerCase())
    );
    setAutoComplete(suggestions);
  };

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
        return !!formData.weight;
      case 2:
        return !!formData.sender.name && !!formData.sender.phone && !!formData.sender.city && !!formData.sender.agency;
      case 3:
        return !!formData.recipient.name && !!formData.recipient.phone && !!formData.recipient.city;
      case 4:
        return true; // Service toujours valide
      case 5:
        return formData.paymentMethod === 'cash' ? !!formData.cashAmount : !!formData.phoneNumber;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulation de soumission
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    // Redirection vers la page de confirmation
    window.location.href = '/colis/expedition-complete';
  };

  const updateFormData = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent: string, field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent as keyof ExpeditionData], [field]: value }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50">
      <NavbarColis />
      
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
                                onClick={() => updateFormData('packageType', type.id)}
                                className="h-20 flex flex-col items-center justify-center"
                              >
                                <type.icon className="h-5 w-5 mb-1" />
                                <span className="text-xs">{type.name}</span>
                              </Button>
                            ))}
                          </div>
                        </div>

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
                          <Label htmlFor="senderAgency">Lieu/Agence d'envoi *</Label>
                          <Input
                            id="senderAgency"
                            value={formData.sender.agency || ''}
                            onChange={(e) => updateNestedField('sender', 'agency', e.target.value)}
                            placeholder="Nom de l'agence ou lieu de récupération"
                          />
                        </div>

                        <div>
                          <Label htmlFor="senderCity">Ville *</Label>
                          <Select
                            value={formData.sender.city}
                            onValueChange={(value) => updateNestedField('sender', 'city', value)}
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
                              id="insurance"
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

export default ColisExpeditionModern; 