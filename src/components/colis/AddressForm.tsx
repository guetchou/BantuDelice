import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Building,
  Home,
  Copy,
  Camera,
  FileText
} from 'lucide-react';

interface Address {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  idNumber?: string;
}

interface AddressFormProps {
  type: 'sender' | 'recipient';
  defaultAddress?: Address;
  onValidate: (data: Address) => void;
  onNext: () => void;
}

const AddressForm: React.FC<AddressFormProps> = ({
  type,
  defaultAddress,
  onValidate,
  onNext
}) => {
  const [formData, setFormData] = useState<Address>({
    name: defaultAddress?.name || '',
    phone: defaultAddress?.phone || '',
    email: defaultAddress?.email || '',
    address: defaultAddress?.address || '',
    city: defaultAddress?.city || '',
    postalCode: defaultAddress?.postalCode || '',
    idNumber: defaultAddress?.idNumber || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isScanning, setIsScanning] = useState(false);

  const cities = [
    'Brazzaville', 'Pointe-Noire', 'Dolisie', 'Nkayi', 'Ouesso', 'Gamboma', 
    'Madingou', 'Mossendjo', 'Kinkala', 'Loandjili', 'Djambala', 'Ewo',
    'Sibiti', 'Impfondo', 'Makoua'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    } else if (!/^(06|05|04)[0-9]{7}$/.test(formData.phone)) {
      newErrors.phone = 'Format invalide (ex: 06xxxxxxx)';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'L\'adresse est requise';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'La ville est requise';
    }

    if (type === 'sender' && !formData.idNumber?.trim()) {
      newErrors.idNumber = 'Le numéro de pièce d\'identité est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onValidate(formData);
      onNext();
    }
  };

  const scanDocument = () => {
    setIsScanning(true);
    // Simulation du scan OCR
    setTimeout(() => {
      setFormData({
        ...formData,
        name: 'Jean Dupont',
        idNumber: '123456789'
      });
      setIsScanning(false);
    }, 2000);
  };

  const copyFromSender = () => {
    // Copier les données de l'expéditeur (si disponible)
    const senderData = localStorage.getItem('senderData');
    if (senderData) {
      const parsed = JSON.parse(senderData);
      setFormData({
        ...formData,
        name: parsed.name,
        phone: parsed.phone,
        email: parsed.email,
        address: parsed.address,
        city: parsed.city,
        postalCode: parsed.postalCode
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {type === 'sender' ? <User className="h-5 w-5" /> : <Building className="h-5 w-5" />}
          {type === 'sender' ? 'Informations Expéditeur' : 'Informations Destinataire'}
        </CardTitle>
        <p className="text-gray-600">
          {type === 'sender' 
            ? 'Vos informations pour l\'expédition' 
            : 'Informations de la personne qui recevra le colis'
          }
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Actions rapides */}
        {type === 'recipient' && (
          <div className="flex gap-2 mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={copyFromSender}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copier depuis l'expéditeur
            </Button>
          </div>
        )}

        {/* Scan de document (expéditeur uniquement) */}
        {type === 'sender' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blue-900">Scan de pièce d'identité</h4>
                <p className="text-sm text-blue-700">Scannez votre CNI ou passeport pour remplir automatiquement</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={scanDocument}
                disabled={isScanning}
                className="flex items-center gap-2"
              >
                {isScanning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    Scan en cours...
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4" />
                    Scanner
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Formulaire */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nom complet *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="phone">Téléphone *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="06xxxxxxx"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="city">Ville *</Label>
            <select
              id="city"
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              className={`w-full px-3 py-2 border rounded-md ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Sélectionnez une ville</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="address">Adresse complète *</Label>
            <Input
              id="address"
              placeholder="Rue, quartier, numéro..."
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className={errors.address ? 'border-red-500' : ''}
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          <div>
            <Label htmlFor="postalCode">Code postal</Label>
            <Input
              id="postalCode"
              placeholder="Code postal (optionnel)"
              value={formData.postalCode}
              onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
            />
          </div>

          {type === 'sender' && (
            <div>
              <Label htmlFor="idNumber">Numéro de pièce d'identité *</Label>
              <Input
                id="idNumber"
                placeholder="CNI ou passeport"
                value={formData.idNumber}
                onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
                className={errors.idNumber ? 'border-red-500' : ''}
              />
              {errors.idNumber && <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>}
            </div>
          )}
        </div>

        {/* Validation et navigation */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-600">
            * Champs obligatoires
          </div>
          <Button 
            onClick={handleSubmit}
            className="bg-orange-600 hover:bg-orange-700"
          >
            Continuer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressForm; 