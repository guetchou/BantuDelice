import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  MessageSquare,
  Star,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Shield,
  Truck,
  Wrench,
  Zap,
  Home,
  Scissors
} from 'lucide-react';
import { toast } from 'sonner';

// Types
interface ServiceProvider {
  id: string;
  name: string;
  category: string;
  description: string;
  rating: number;
  hourlyRate: number;
  basePrice: number;
  experience: string;
  qualifications: string[];
  location: string;
  avatar: string;
  isAvailable: boolean;
  isVerified: boolean;
}

interface BookingFormData {
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;
  specialRequests: string;
  urgency: 'normal' | 'urgent' | 'emergency';
  paymentMethod: 'cash' | 'mobile_money' | 'card';
}

interface ServiceBookingFormProps {
  provider: ServiceProvider;
  onClose: () => void;
  onSubmit: (bookingData: BookingFormData) => void;
}

// Composant pour afficher les informations du prestataire
const ProviderInfo: React.FC<{ provider: ServiceProvider }> = ({ provider }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'plomberie':
        return <Wrench className="h-5 w-5" />;
      case 'electricite':
        return <Zap className="h-5 w-5" />;
      case 'menage':
        return <Home className="h-5 w-5" />;
      case 'jardinage':
        return <Scissors className="h-5 w-5" />;
      default:
        return <Truck className="h-5 w-5" />;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={provider.avatar} />
            <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-xl font-semibold">{provider.name}</h3>
              {provider.isVerified && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Vérifié
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-1 mb-2">
              {renderStars(provider.rating)}
              <span className="text-sm text-gray-600 ml-1">
                ({provider.rating} avis)
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                {getCategoryIcon(provider.category)}
                <span className="capitalize">{provider.category}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{provider.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{provider.experience} d'expérience</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{provider.description}</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Tarif horaire:</span>
            <span className="text-lg font-bold text-green-600">
              {provider.hourlyRate.toLocaleString()} FCFA/h
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Prix de base:</span>
            <span className="text-lg font-bold text-green-600">
              {provider.basePrice.toLocaleString()} FCFA
            </span>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="font-medium mb-2">Qualifications:</h4>
          <div className="flex flex-wrap gap-1">
            {provider.qualifications.map((qual, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {qual}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Composant principal
export default function ServiceBookingForm({ provider, onClose, onSubmit }: ServiceBookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    scheduledDate: '',
    scheduledTime: '',
    duration: 2,
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    clientAddress: '',
    specialRequests: '',
    urgency: 'normal',
    paymentMethod: 'cash'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = provider.hourlyRate * formData.duration;
  const urgencyMultiplier = {
    normal: 1,
    urgent: 1.5,
    emergency: 2
  };
  const finalPrice = totalPrice * urgencyMultiplier[formData.urgency];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.scheduledDate || !formData.scheduledTime || !formData.clientName || !formData.clientPhone || !formData.clientAddress) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onSubmit(formData);
      toast.success('Réservation créée avec succès!');
      onClose();
    } catch (error) {
      toast.error('Erreur lors de la création de la réservation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof BookingFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Réserver {provider.name}</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>

          <ProviderInfo provider={provider} />

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations de réservation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Détails de la réservation</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Heure *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.scheduledTime}
                      onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Durée (heures)</Label>
                    <Select
                      value={formData.duration.toString()}
                      onValueChange={(value) => handleInputChange('duration', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 heure</SelectItem>
                        <SelectItem value="2">2 heures</SelectItem>
                        <SelectItem value="3">3 heures</SelectItem>
                        <SelectItem value="4">4 heures</SelectItem>
                        <SelectItem value="5">5 heures</SelectItem>
                        <SelectItem value="6">6 heures</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgence</Label>
                    <Select
                      value={formData.urgency}
                      onValueChange={(value) => handleInputChange('urgency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="urgent">Urgent (+50%)</SelectItem>
                        <SelectItem value="emergency">Urgence (+100%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations client */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Informations client</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Nom complet *</Label>
                    <Input
                      id="clientName"
                      value={formData.clientName}
                      onChange={(e) => handleInputChange('clientName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientPhone">Téléphone *</Label>
                    <Input
                      id="clientPhone"
                      type="tel"
                      value={formData.clientPhone}
                      onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientAddress">Adresse complète *</Label>
                  <Textarea
                    id="clientAddress"
                    value={formData.clientAddress}
                    onChange={(e) => handleInputChange('clientAddress', e.target.value)}
                    placeholder="Votre adresse complète pour l'intervention"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialRequests">Demandes spéciales</Label>
                  <Textarea
                    id="specialRequests"
                    value={formData.specialRequests}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                    placeholder="Précisions sur le service souhaité, contraintes particulières..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Paiement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Paiement</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Méthode de paiement</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) => handleInputChange('paymentMethod', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Espèces</SelectItem>
                      <SelectItem value="mobile_money">Mobile Money</SelectItem>
                      <SelectItem value="card">Carte bancaire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Tarif horaire:</span>
                    <span>{provider.hourlyRate.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Durée:</span>
                    <span>{formData.duration} heure(s)</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Sous-total:</span>
                    <span>{totalPrice.toLocaleString()} FCFA</span>
                  </div>
                  {formData.urgency !== 'normal' && (
                    <div className="flex justify-between items-center mb-2 text-orange-600">
                      <span className="font-medium">Majoration urgence:</span>
                      <span>+{((urgencyMultiplier[formData.urgency] - 1) * 100).toFixed(0)}%</span>
                    </div>
                  )}
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Total:</span>
                      <span className="text-lg font-bold text-green-600">
                        {finalPrice.toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="h-4 w-4" />
                <span>Paiement sécurisé</span>
              </div>
              <div className="flex space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Création...' : 'Confirmer la réservation'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 