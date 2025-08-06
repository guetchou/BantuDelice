import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, Package, Calculator, CreditCard, CheckCircle } from 'lucide-react';

interface ShippingFormData {
  // Expéditeur
  senderName: string;
  senderPhone: string;
  senderEmail: string;
  senderAddress: string;
  senderCity: string;
  
  // Destinataire
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;
  recipientAddress: string;
  recipientCity: string;
  
  // Colis
  packageType: string;
  weight: string;
  dimensions: string;
  description: string;
  value: string;
  
  // Service
  serviceType: string;
  insurance: boolean;
  fragile: boolean;
  express: boolean;
}

interface ColisShippingFormProps {
  onSubmit: (data: ShippingFormData) => void;
  onCalculatePrice: (data: Partial<ShippingFormData>) => number;
  isLoading?: boolean;
}

const ColisShippingForm: React.FC<ColisShippingFormProps> = ({
  onSubmit,
  onCalculatePrice,
  isLoading = false
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ShippingFormData>({
    senderName: '',
    senderPhone: '',
    senderEmail: '',
    senderAddress: '',
    senderCity: '',
    recipientName: '',
    recipientPhone: '',
    recipientEmail: '',
    recipientAddress: '',
    recipientCity: '',
    packageType: '',
    weight: '',
    dimensions: '',
    description: '',
    value: '',
    serviceType: 'standard',
    insurance: false,
    fragile: false,
    express: false
  });

  const [errors, setErrors] = useState<Partial<ShippingFormData>>({});
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);

  const steps = [
    { id: 1, title: 'Expéditeur', icon: User },
    { id: 2, title: 'Destinataire', icon: MapPin },
    { id: 3, title: 'Colis', icon: Package },
    { id: 4, title: 'Service', icon: Calculator },
    { id: 5, title: 'Validation', icon: CheckCircle }
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<ShippingFormData> = {};

    switch (step) {
      case 1:
        if (!formData.senderName) newErrors.senderName = 'Nom requis';
        if (!formData.senderPhone) newErrors.senderPhone = 'Téléphone requis';
        if (!formData.senderAddress) newErrors.senderAddress = 'Adresse requise';
        if (!formData.senderCity) newErrors.senderCity = 'Ville requise';
        break;
      case 2:
        if (!formData.recipientName) newErrors.recipientName = 'Nom requis';
        if (!formData.recipientPhone) newErrors.recipientPhone = 'Téléphone requis';
        if (!formData.recipientAddress) newErrors.recipientAddress = 'Adresse requise';
        if (!formData.recipientCity) newErrors.recipientCity = 'Ville requise';
        break;
      case 3:
        if (!formData.packageType) newErrors.packageType = 'Type de colis requis';
        if (!formData.weight) newErrors.weight = 'Poids requis';
        if (!formData.description) newErrors.description = 'Description requise';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 3) {
        // Calculer le prix
        const price = onCalculatePrice(formData);
        setCalculatedPrice(price);
      }
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof ShippingFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations de l'expéditeur</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet *</label>
                <Input
                  value={formData.senderName}
                  onChange={(e) => handleInputChange('senderName', e.target.value)}
                  placeholder="Nom et prénom"
                  className={errors.senderName ? 'border-red-500' : ''}
                />
                {errors.senderName && <p className="text-red-500 text-sm mt-1">{errors.senderName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                <Input
                  value={formData.senderPhone}
                  onChange={(e) => handleInputChange('senderPhone', e.target.value)}
                  placeholder="06xxxxxxx"
                  className={errors.senderPhone ? 'border-red-500' : ''}
                />
                {errors.senderPhone && <p className="text-red-500 text-sm mt-1">{errors.senderPhone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input
                  type="email"
                  value={formData.senderEmail}
                  onChange={(e) => handleInputChange('senderEmail', e.target.value)}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
                <Select value={formData.senderCity} onValueChange={(value) => handleInputChange('senderCity', value)}>
                  <SelectTrigger className={errors.senderCity ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Sélectionner une ville" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brazzaville">Brazzaville</SelectItem>
                    <SelectItem value="pointe-noire">Pointe-Noire</SelectItem>
                    <SelectItem value="dolisie">Dolisie</SelectItem>
                    <SelectItem value="n kayi">N'kayi</SelectItem>
                    <SelectItem value="ouesso">Ouesso</SelectItem>
                  </SelectContent>
                </Select>
                {errors.senderCity && <p className="text-red-500 text-sm mt-1">{errors.senderCity}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Adresse complète *</label>
              <Textarea
                value={formData.senderAddress}
                onChange={(e) => handleInputChange('senderAddress', e.target.value)}
                placeholder="Adresse complète"
                rows={3}
                className={errors.senderAddress ? 'border-red-500' : ''}
              />
              {errors.senderAddress && <p className="text-red-500 text-sm mt-1">{errors.senderAddress}</p>}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations du destinataire</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet *</label>
                <Input
                  value={formData.recipientName}
                  onChange={(e) => handleInputChange('recipientName', e.target.value)}
                  placeholder="Nom et prénom"
                  className={errors.recipientName ? 'border-red-500' : ''}
                />
                {errors.recipientName && <p className="text-red-500 text-sm mt-1">{errors.recipientName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                <Input
                  value={formData.recipientPhone}
                  onChange={(e) => handleInputChange('recipientPhone', e.target.value)}
                  placeholder="06xxxxxxx"
                  className={errors.recipientPhone ? 'border-red-500' : ''}
                />
                {errors.recipientPhone && <p className="text-red-500 text-sm mt-1">{errors.recipientPhone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input
                  type="email"
                  value={formData.recipientEmail}
                  onChange={(e) => handleInputChange('recipientEmail', e.target.value)}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
                <Select value={formData.recipientCity} onValueChange={(value) => handleInputChange('recipientCity', value)}>
                  <SelectTrigger className={errors.recipientCity ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Sélectionner une ville" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brazzaville">Brazzaville</SelectItem>
                    <SelectItem value="pointe-noire">Pointe-Noire</SelectItem>
                    <SelectItem value="dolisie">Dolisie</SelectItem>
                    <SelectItem value="n kayi">N'kayi</SelectItem>
                    <SelectItem value="ouesso">Ouesso</SelectItem>
                  </SelectContent>
                </Select>
                {errors.recipientCity && <p className="text-red-500 text-sm mt-1">{errors.recipientCity}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Adresse complète *</label>
              <Textarea
                value={formData.recipientAddress}
                onChange={(e) => handleInputChange('recipientAddress', e.target.value)}
                placeholder="Adresse complète"
                rows={3}
                className={errors.recipientAddress ? 'border-red-500' : ''}
              />
              {errors.recipientAddress && <p className="text-red-500 text-sm mt-1">{errors.recipientAddress}</p>}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Détails du colis</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de colis *</label>
                <Select value={formData.packageType} onValueChange={(value) => handleInputChange('packageType', value)}>
                  <SelectTrigger className={errors.packageType ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="vêtement">Vêtement</SelectItem>
                    <SelectItem value="électronique">Électronique</SelectItem>
                    <SelectItem value="alimentaire">Alimentaire</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
                {errors.packageType && <p className="text-red-500 text-sm mt-1">{errors.packageType}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Poids (kg) *</label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder="1.5"
                  className={errors.weight ? 'border-red-500' : ''}
                />
                {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions (cm)</label>
                <Input
                  value={formData.dimensions}
                  onChange={(e) => handleInputChange('dimensions', e.target.value)}
                  placeholder="30x20x10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valeur estimée (FCFA)</label>
                <Input
                  type="number"
                  value={formData.value}
                  onChange={(e) => handleInputChange('value', e.target.value)}
                  placeholder="50000"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description du contenu *</label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Décrivez le contenu de votre colis"
                rows={3}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Options de service</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de service</label>
                <Select value={formData.serviceType} onValueChange={(value) => handleInputChange('serviceType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard (3-5 jours)</SelectItem>
                    <SelectItem value="express">Express (1-2 jours)</SelectItem>
                    <SelectItem value="premium">Premium (même jour)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.insurance}
                    onChange={(e) => handleInputChange('insurance', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">Assurance supplémentaire</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.fragile}
                    onChange={(e) => handleInputChange('fragile', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">Colis fragile</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.express}
                    onChange={(e) => handleInputChange('express', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">Livraison express</span>
                </label>
              </div>
            </div>
            {calculatedPrice && (
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-orange-700">Prix estimé :</span>
                  <span className="text-2xl font-bold text-orange-600">
                    {calculatedPrice.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Récapitulatif</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Expéditeur</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p><strong>{formData.senderName}</strong></p>
                  <p>{formData.senderPhone}</p>
                  <p>{formData.senderAddress}</p>
                  <p>{formData.senderCity}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Destinataire</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p><strong>{formData.recipientName}</strong></p>
                  <p>{formData.recipientPhone}</p>
                  <p>{formData.recipientAddress}</p>
                  <p>{formData.recipientCity}</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Détails du colis</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Type :</span>
                  <span>{formData.packageType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Poids :</span>
                  <span>{formData.weight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Service :</span>
                  <span>{formData.serviceType}</span>
                </div>
                {calculatedPrice && (
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">Prix total :</span>
                    <span className="font-bold text-orange-600">
                      {calculatedPrice.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-700">
          <Package className="h-6 w-6" />
          Expédition de colis
        </CardTitle>
        
        {/* Stepper */}
        <div className="flex items-center justify-between mt-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step.id <= currentStep 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step.id < currentStep ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <step.icon className="h-4 w-4" />
                )}
              </div>
              <span className={`ml-2 text-sm ${
                step.id <= currentStep ? 'text-orange-600 font-medium' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  step.id < currentStep ? 'bg-orange-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {renderStepContent()}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 1}
          >
            Précédent
          </Button>
          
          <div className="flex gap-2">
            {currentStep < 5 ? (
              <Button onClick={handleNext} className="bg-gradient-to-r from-orange-400 to-yellow-400">
                Suivant
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={isLoading}
                className="bg-gradient-to-r from-orange-400 to-yellow-400"
              >
                {isLoading ? 'Envoi en cours...' : 'Confirmer l\'expédition'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColisShippingForm; 