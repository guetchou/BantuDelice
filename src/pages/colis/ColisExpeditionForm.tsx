import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Truck, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Weight, 
  DollarSign,
  Calendar,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useColisAuth } from '@/context/ColisAuthContext';
import { toast } from 'sonner';

interface FormData {
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
  packageDescription: string;
  weightKg: number;
  insuranceAmount: number;
  declaredValue: number;
  
  // Expédition
  expeditionType: 'national' | 'international';
  deliveryType: 'standard' | 'express' | 'premium';
  pickupLocation: string;
  specialInstructions: string;
}

// Composant d'étape mémorisé
const StepIndicator = React.memo<{
  currentStep: number;
  totalSteps: number;
  steps: string[];
}>(({ currentStep, totalSteps, steps }) => (
  <div className="flex items-center justify-center mb-8">
    <div className="flex items-center space-x-4">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              index < currentStep 
                ? 'bg-green-500 text-white' 
                : index === currentStep 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {index < currentStep ? <CheckCircle className="h-4 w-4" /> : index + 1}
            </div>
            <span className={`ml-2 text-sm font-medium ${
              index <= currentStep ? 'text-gray-900' : 'text-gray-500'
            }`}>
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-12 h-0.5 ${
              index < currentStep ? 'bg-green-500' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
));

// Composant de formulaire d'étape mémorisé
const SenderForm = React.memo<{
  formData: FormData;
  setFormData: (data: FormData) => void;
  user: any;
}>(({ formData, setFormData, user }) => {
  const handleInputChange = useCallback((field: keyof FormData, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  }, [formData, setFormData]);

  // Auto-remplir avec les données utilisateur
  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        senderName: user.name || '',
        senderPhone: user.phone || '',
        senderEmail: user.email || '',
        senderAddress: user.address || ''
      });
    }
  }, [user, setFormData]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="senderName">Nom complet *</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="senderName"
              value={formData.senderName}
              onChange={(e) => handleInputChange('senderName', e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="senderPhone">Téléphone *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="senderPhone"
              value={formData.senderPhone}
              onChange={(e) => handleInputChange('senderPhone', e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="senderEmail">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="senderEmail"
            type="email"
            value={formData.senderEmail}
            onChange={(e) => handleInputChange('senderEmail', e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="senderAddress">Adresse complète *</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="senderAddress"
            value={formData.senderAddress}
            onChange={(e) => handleInputChange('senderAddress', e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="senderCity">Ville *</Label>
        <Select value={formData.senderCity} onValueChange={(value) => handleInputChange('senderCity', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une ville" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Brazzaville">Brazzaville</SelectItem>
            <SelectItem value="Pointe-Noire">Pointe-Noire</SelectItem>
            <SelectItem value="Dolisie">Dolisie</SelectItem>
            <SelectItem value="Nkayi">Nkayi</SelectItem>
            <SelectItem value="Ouesso">Ouesso</SelectItem>
            <SelectItem value="Djambala">Djambala</SelectItem>
            <SelectItem value="Ewo">Ewo</SelectItem>
            <SelectItem value="Sibiti">Sibiti</SelectItem>
            <SelectItem value="Impfondo">Impfondo</SelectItem>
            <SelectItem value="Makoua">Makoua</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
});

const RecipientForm = React.memo<{
  formData: FormData;
  setFormData: (data: FormData) => void;
}>(({ formData, setFormData }) => {
  const handleInputChange = useCallback((field: keyof FormData, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  }, [formData, setFormData]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="recipientName">Nom complet *</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="recipientName"
              value={formData.recipientName}
              onChange={(e) => handleInputChange('recipientName', e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="recipientPhone">Téléphone *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="recipientPhone"
              value={formData.recipientPhone}
              onChange={(e) => handleInputChange('recipientPhone', e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="recipientEmail">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="recipientEmail"
            type="email"
            value={formData.recipientEmail}
            onChange={(e) => handleInputChange('recipientEmail', e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="recipientAddress">Adresse complète *</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="recipientAddress"
            value={formData.recipientAddress}
            onChange={(e) => handleInputChange('recipientAddress', e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="recipientCity">Ville *</Label>
        <Select value={formData.recipientCity} onValueChange={(value) => handleInputChange('recipientCity', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une ville" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Brazzaville">Brazzaville</SelectItem>
            <SelectItem value="Pointe-Noire">Pointe-Noire</SelectItem>
            <SelectItem value="Dolisie">Dolisie</SelectItem>
            <SelectItem value="Nkayi">Nkayi</SelectItem>
            <SelectItem value="Ouesso">Ouesso</SelectItem>
            <SelectItem value="Djambala">Djambala</SelectItem>
            <SelectItem value="Ewo">Ewo</SelectItem>
            <SelectItem value="Sibiti">Sibiti</SelectItem>
            <SelectItem value="Impfondo">Impfondo</SelectItem>
            <SelectItem value="Makoua">Makoua</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
});

const PackageForm = React.memo<{
  formData: FormData;
  setFormData: (data: FormData) => void;
}>(({ formData, setFormData }) => {
  const handleInputChange = useCallback((field: keyof FormData, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  }, [formData, setFormData]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="packageDescription">Description du colis *</Label>
        <Textarea
          id="packageDescription"
          value={formData.packageDescription}
          onChange={(e) => handleInputChange('packageDescription', e.target.value)}
          placeholder="Décrivez le contenu de votre colis..."
          rows={3}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="weightKg">Poids (kg) *</Label>
          <div className="relative">
            <Weight className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="weightKg"
              type="number"
              min="0.1"
              step="0.1"
              value={formData.weightKg}
              onChange={(e) => handleInputChange('weightKg', parseFloat(e.target.value) || 0)}
              className="pl-10"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="declaredValue">Valeur déclarée (FCFA)</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="declaredValue"
              type="number"
              min="0"
              value={formData.declaredValue}
              onChange={(e) => handleInputChange('declaredValue', parseInt(e.target.value) || 0)}
              className="pl-10"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="insuranceAmount">Montant d'assurance (FCFA)</Label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="insuranceAmount"
            type="number"
            min="0"
            value={formData.insuranceAmount}
            onChange={(e) => handleInputChange('insuranceAmount', parseInt(e.target.value) || 0)}
            className="pl-10"
          />
        </div>
      </div>
    </div>
  );
});

const ExpeditionForm = React.memo<{
  formData: FormData;
  setFormData: (data: FormData) => void;
}>(({ formData, setFormData }) => {
  const handleInputChange = useCallback((field: keyof FormData, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  }, [formData, setFormData]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expeditionType">Type d'expédition *</Label>
          <Select value={formData.expeditionType} onValueChange={(value: 'national' | 'international') => handleInputChange('expeditionType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez le type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="national">National</SelectItem>
              <SelectItem value="international">International</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="deliveryType">Type de livraison *</Label>
          <Select value={formData.deliveryType} onValueChange={(value: 'standard' | 'express' | 'premium') => handleInputChange('deliveryType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez le type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard (3-5 jours)</SelectItem>
              <SelectItem value="express">Express (1-2 jours)</SelectItem>
              <SelectItem value="premium">Premium (24h)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="pickupLocation">Lieu/Agence d'envoi *</Label>
        <Select value={formData.pickupLocation} onValueChange={(value) => handleInputChange('pickupLocation', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une agence" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="agence_brazzaville_centre">Agence Brazzaville Centre</SelectItem>
            <SelectItem value="agence_brazzaville_aeroport">Agence Brazzaville Aéroport</SelectItem>
            <SelectItem value="agence_pointe_noire_centre">Agence Pointe-Noire Centre</SelectItem>
            <SelectItem value="agence_pointe_noire_port">Agence Pointe-Noire Port</SelectItem>
            <SelectItem value="agence_dolisie">Agence Dolisie</SelectItem>
            <SelectItem value="agence_nkayi">Agence Nkayi</SelectItem>
            <SelectItem value="agence_ouesso">Agence Ouesso</SelectItem>
            <SelectItem value="agence_djambala">Agence Djambala</SelectItem>
            <SelectItem value="agence_ewo">Agence Ewo</SelectItem>
            <SelectItem value="agence_sibiti">Agence Sibiti</SelectItem>
            <SelectItem value="agence_impfondo">Agence Impfondo</SelectItem>
            <SelectItem value="agence_makoua">Agence Makoua</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="specialInstructions">Instructions spéciales</Label>
        <Textarea
          id="specialInstructions"
          value={formData.specialInstructions}
          onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
          placeholder="Instructions particulières pour la livraison..."
          rows={3}
        />
      </div>
    </div>
  );
});

const ColisExpeditionForm: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useColisAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    // Expéditeur
    senderName: '',
    senderPhone: '',
    senderEmail: '',
    senderAddress: '',
    senderCity: '',
    
    // Destinataire
    recipientName: '',
    recipientPhone: '',
    recipientEmail: '',
    recipientAddress: '',
    recipientCity: '',
    
    // Colis
    packageDescription: '',
    weightKg: 0,
    insuranceAmount: 0,
    declaredValue: 0,
    
    // Expédition
    expeditionType: 'national',
    deliveryType: 'standard',
    pickupLocation: '',
    specialInstructions: ''
  });

  // Étapes mémorisées
  const steps = useMemo(() => [
    'Expéditeur',
    'Destinataire', 
    'Colis',
    'Expédition',
    'Confirmation'
  ], []);

  // Calcul du prix mémorisé
  const calculatedPrice = useMemo(() => {
    let basePrice = 0;
    
    // Prix de base selon le type d'expédition
    if (formData.expeditionType === 'national') {
      basePrice = 5000; // 5000 FCFA pour national
    } else {
      basePrice = 15000; // 15000 FCFA pour international
    }
    
    // Multiplicateur selon le type de livraison
    const deliveryMultiplier = {
      standard: 1,
      express: 1.5,
      premium: 2.5
    };
    
    // Prix selon le poids (500 FCFA par kg)
    const weightPrice = formData.weightKg * 500;
    
    // Prix d'assurance (2% de la valeur déclarée)
    const insurancePrice = formData.declaredValue * 0.02;
    
    const total = (basePrice + weightPrice + insurancePrice) * deliveryMultiplier[formData.deliveryType];
    
    return Math.round(total);
  }, [formData.expeditionType, formData.deliveryType, formData.weightKg, formData.declaredValue]);

  // Handlers mémorisés
  const nextStep = useCallback(() => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, steps.length]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleSubmit = useCallback(async () => {
    if (!isAuthenticated || !user) {
      toast.error('Vous devez être connecté pour créer une expédition');
      return;
    }

    setIsSubmitting(true);
    try {
      const expeditionData = {
        userId: user.id,
        senderName: formData.senderName,
        senderPhone: formData.senderPhone,
        senderEmail: formData.senderEmail,
        senderAddress: formData.senderAddress,
        senderCity: formData.senderCity,
        recipientName: formData.recipientName,
        recipientPhone: formData.recipientPhone,
        recipientEmail: formData.recipientEmail,
        recipientAddress: formData.recipientAddress,
        recipientCity: formData.recipientCity,
        packageDescription: formData.packageDescription,
        weightKg: formData.weightKg,
        insuranceAmount: formData.insuranceAmount,
        declaredValue: formData.declaredValue,
        expeditionType: formData.expeditionType,
        deliveryType: formData.deliveryType,
        pickupLocation: formData.pickupLocation,
        specialInstructions: formData.specialInstructions,
        totalPrice: calculatedPrice
      };

      const response = await fetch('/api/colis/expedier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expeditionData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de l\'expédition');
      }

      const result = await response.json();
      
      navigate('/colis/expedition-complete', {
        state: { 
          trackingNumber: result.data.trackingNumber, 
          formData: {
            senderName: formData.senderName,
            recipientName: formData.recipientName,
            packageDescription: formData.packageDescription,
            weightKg: formData.weightKg,
            expeditionType: formData.expeditionType,
            deliveryType: formData.deliveryType
          }, 
          price: calculatedPrice 
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'expédition:', error);
      toast.error('Erreur lors de la création de l\'expédition');
    } finally {
      setIsSubmitting(false);
    }
  }, [isAuthenticated, user, formData, calculatedPrice, navigate]);

  // Validation des étapes mémorisée
  const canProceedToNext = useMemo(() => {
    switch (currentStep) {
      case 1: // Expéditeur
        return formData.senderName && formData.senderPhone && formData.senderAddress && formData.senderCity;
      case 2: // Destinataire
        return formData.recipientName && formData.recipientPhone && formData.recipientAddress && formData.recipientCity;
      case 3: // Colis
        return formData.packageDescription && formData.weightKg > 0;
      case 4: // Expédition
        return formData.pickupLocation;
      default:
        return true;
    }
  }, [currentStep, formData]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-orange-500" />
            <h2 className="text-xl font-semibold mb-2">Connexion requise</h2>
            <p className="text-gray-600 mb-4">Connectez-vous pour créer une expédition</p>
            <Button onClick={() => navigate('/colis/auth')}>
              Se connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Nouvelle Expédition
          </h1>
          <p className="text-gray-600">
            Créez votre expédition en quelques étapes simples
          </p>
        </div>

        {/* Indicateur d'étapes */}
        <StepIndicator currentStep={currentStep} totalSteps={steps.length} steps={steps} />

        {/* Formulaire */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-6 w-6 text-orange-600" />
              {steps[currentStep - 1]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && (
              <SenderForm formData={formData} setFormData={setFormData} user={user} />
            )}
            
            {currentStep === 2 && (
              <RecipientForm formData={formData} setFormData={setFormData} />
            )}
            
            {currentStep === 3 && (
              <PackageForm formData={formData} setFormData={setFormData} />
            )}
            
            {currentStep === 4 && (
              <ExpeditionForm formData={formData} setFormData={setFormData} />
            )}
            
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Récapitulatif de votre expédition</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Expéditeur</h4>
                      <p className="text-sm text-gray-600">{formData.senderName}</p>
                      <p className="text-sm text-gray-600">{formData.senderPhone}</p>
                      <p className="text-sm text-gray-600">{formData.senderAddress}</p>
                      <p className="text-sm text-gray-600">{formData.senderCity}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Destinataire</h4>
                      <p className="text-sm text-gray-600">{formData.recipientName}</p>
                      <p className="text-sm text-gray-600">{formData.recipientPhone}</p>
                      <p className="text-sm text-gray-600">{formData.recipientAddress}</p>
                      <p className="text-sm text-gray-600">{formData.recipientCity}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium text-gray-900 mb-2">Détails du colis</h4>
                    <p className="text-sm text-gray-600">{formData.packageDescription}</p>
                    <p className="text-sm text-gray-600">Poids: {formData.weightKg} kg</p>
                    <p className="text-sm text-gray-600">Valeur déclarée: {formData.declaredValue.toLocaleString()} FCFA</p>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium text-gray-900 mb-2">Options d'expédition</h4>
                    <div className="flex gap-2">
                      <Badge variant="outline">{formData.expeditionType}</Badge>
                      <Badge variant="outline">{formData.deliveryType}</Badge>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium text-gray-900 mb-2">Prix total</h4>
                    <p className="text-2xl font-bold text-orange-600">{calculatedPrice.toLocaleString()} FCFA</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Précédent
              </Button>
              
              {currentStep < steps.length ? (
                <Button
                  onClick={nextStep}
                  disabled={!canProceedToNext}
                >
                  Suivant
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !canProceedToNext}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Création...
                    </>
                  ) : (
                    <>
                      Créer l'expédition
                      <Package className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

ColisExpeditionForm.displayName = 'ColisExpeditionForm';

export default ColisExpeditionForm; 