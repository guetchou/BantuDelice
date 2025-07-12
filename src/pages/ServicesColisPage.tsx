import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  MapPin, 
  Navigation, 
  Crosshair, 
  Search, 
  Clock,
  Star,
  Users,
  Loader2,
  Truck,
  Package,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  Globe,
  Shield,
  Zap,
  Eye,
  Route,
  CheckCircle,
  AlertCircle,
  Info,
  Calculator
} from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { GeolocationService } from '@/services/geolocationService';
import { EdgeFunctionsService } from '@/services/edgeFunctions';
import LocationMap from '@/components/location/LocationMap';

interface DeliveryService {
  id: string;
  name: string;
  logo: string;
  price: number;
  estimatedTime: string;
  features: string[];
  rating: number;
  coverage: string[];
  tracking: boolean;
  insurance: boolean;
}

interface DeliveryRequest {
  pickupAddress: string;
  deliveryAddress: string;
  packageType: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  service: string;
  insurance: boolean;
  tracking: boolean;
  specialInstructions: string;
  contactInfo: {
    name: string;
    phone: string;
    email: string;
  };
}

const deliveryServices: DeliveryService[] = [
  {
    id: 'buntudelice-express',
    name: 'Buntudelice Express',
    logo: '🚀',
    price: 2500,
    estimatedTime: '2-4 heures',
    features: ['Livraison express', 'Suivi GPS', 'Assurance incluse', 'Service client 24/7'],
    rating: 4.9,
    coverage: ['Brazzaville', 'Pointe-Noire', 'Dolisie', 'Nkayi'],
    tracking: true,
    insurance: true
  },
  {
    id: 'buntudelice-standard',
    name: 'Buntudelice Standard',
    logo: '📦',
    price: 1500,
    estimatedTime: '24-48 heures',
    features: ['Livraison standard', 'Suivi en ligne', 'Assurance optionnelle'],
    rating: 4.7,
    coverage: ['Tout le Congo'],
    tracking: true,
    insurance: false
  },
  {
    id: 'buntudelice-economy',
    name: 'Buntudelice Economy',
    logo: '💰',
    price: 800,
    estimatedTime: '3-5 jours',
    features: ['Prix économique', 'Livraison groupée'],
    rating: 4.5,
    coverage: ['Tout le Congo'],
    tracking: false,
    insurance: false
  },
  {
    id: 'buntudelice-international',
    name: 'Buntudelice International',
    logo: '🌍',
    price: 15000,
    estimatedTime: '5-10 jours',
    features: ['Livraison internationale', 'Dédouanement', 'Suivi avancé', 'Assurance complète'],
    rating: 4.8,
    coverage: ['Afrique', 'Europe', 'Amérique'],
    tracking: true,
    insurance: true
  }
];

export default function ServicesColisPage() {
  const [deliveryRequest, setDeliveryRequest] = useState<DeliveryRequest>({
    pickupAddress: '',
    deliveryAddress: '',
    packageType: 'colis',
    weight: 1,
    dimensions: { length: 30, width: 20, height: 15 },
    service: 'buntudelice-standard',
    insurance: false,
    tracking: true,
    specialInstructions: '',
    contactInfo: { name: '', phone: '', email: '' }
  });

  const [selectedService, setSelectedService] = useState<DeliveryService | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [deliveryEstimate, setDeliveryEstimate] = useState<any>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingInfo, setTrackingInfo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'create' | 'track' | 'services'>('create');

  const {
    coordinates: userCoordinates,
    loading: locationLoading,
    requestPosition,
    formatDistance,
    getDistanceTo
  } = useGeolocation();

  // Utiliser la position actuelle pour l'adresse de départ
  const useCurrentLocation = async () => {
    try {
      const result = await GeolocationService.getCurrentLocation();
      if (result) {
        setDeliveryRequest(prev => ({
          ...prev,
          pickupAddress: result.formatted_address
        }));
        toast.success('Adresse de départ mise à jour avec votre position actuelle');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la position:', error);
      toast.error('Erreur lors de la récupération de la position');
    }
  };

  // Calculer l'estimation de livraison
  const calculateDeliveryEstimate = async () => {
    if (!deliveryRequest.pickupAddress || !deliveryRequest.deliveryAddress) {
      toast.error('Veuillez remplir les adresses de départ et de livraison');
      return;
    }

    setIsCalculating(true);
    try {
      // Géocoder les adresses
      const pickupGeocode = await GeolocationService.geocodeAddress(deliveryRequest.pickupAddress);
      const deliveryGeocode = await GeolocationService.geocodeAddress(deliveryRequest.deliveryAddress);

      if (pickupGeocode && deliveryGeocode) {
        const estimate = await EdgeFunctionsService.getDeliveryEstimate(
          pickupGeocode.coordinates,
          deliveryGeocode.coordinates
        );

        setDeliveryEstimate({
          ...estimate,
          pickupCoordinates: pickupGeocode.coordinates,
          deliveryCoordinates: deliveryGeocode.coordinates
        });

        toast.success('Estimation calculée avec succès');
      }
    } catch (error) {
      console.error('Erreur lors du calcul de l\'estimation:', error);
      toast.error('Erreur lors du calcul de l\'estimation');
    } finally {
      setIsCalculating(false);
    }
  };

  // Créer une demande de livraison
  const createDeliveryRequest = async () => {
    if (!selectedService) {
      toast.error('Veuillez sélectionner un service de livraison');
      return;
    }

    try {
      const deliveryData = {
        ...deliveryRequest,
        serviceId: selectedService.id,
        estimatedCost: selectedService.price + (deliveryEstimate?.additionalCost || 0),
        estimatedDistance: deliveryEstimate?.distance,
        estimatedTime: deliveryEstimate?.duration
      };

      // Ici vous appelleriez votre API pour créer la demande
      console.log('Demande de livraison:', deliveryData);
      
      // Générer un numéro de suivi
      const trackingNumber = 'BUNT-' + Math.random().toString(36).substr(2, 8).toUpperCase();
      setTrackingNumber(trackingNumber);

      toast.success(`Demande de livraison créée ! Numéro de suivi: ${trackingNumber}`);
    } catch (error) {
      console.error('Erreur lors de la création de la demande:', error);
      toast.error('Erreur lors de la création de la demande');
    }
  };

  // Suivre un colis
  const trackPackage = async () => {
    if (!trackingNumber.trim()) {
      toast.error('Veuillez entrer un numéro de suivi');
      return;
    }

    try {
      const trackingInfo = await EdgeFunctionsService.trackDelivery(trackingNumber);
      setTrackingInfo(trackingInfo);
      toast.success('Informations de suivi récupérées');
    } catch (error) {
      console.error('Erreur lors du suivi:', error);
      toast.error('Erreur lors du suivi');
    }
  };

  // Mettre à jour le service sélectionné
  useEffect(() => {
    const service = deliveryServices.find(s => s.id === deliveryRequest.service);
    setSelectedService(service || null);
  }, [deliveryRequest.service]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Services de Livraison Buntudelice
          </h1>
          <p className="text-lg text-gray-600">
            Livraison rapide, sécurisée et fiable dans tout le Congo et à l'international
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-2 rounded-md font-semibold transition ${
                activeTab === 'create' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Package className="w-4 h-4 inline mr-2" />
              Créer une livraison
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className={`px-6 py-2 rounded-md font-semibold transition ${
                activeTab === 'track' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye className="w-4 h-4 inline mr-2" />
              Suivre un colis
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`px-6 py-2 rounded-md font-semibold transition ${
                activeTab === 'services' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Truck className="w-4 h-4 inline mr-2" />
              Nos services
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'create' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulaire de livraison */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Informations de livraison
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Adresse de départ */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Adresse de départ</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Adresse de départ"
                        value={deliveryRequest.pickupAddress}
                        onChange={(e) => setDeliveryRequest(prev => ({
                          ...prev,
                          pickupAddress: e.target.value
                        }))}
                      />
                      <Button
                        onClick={useCurrentLocation}
                        variant="outline"
                        size="icon"
                        disabled={locationLoading}
                      >
                        {locationLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crosshair className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Adresse de livraison */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Adresse de livraison</label>
                    <Input
                      placeholder="Adresse de livraison"
                      value={deliveryRequest.deliveryAddress}
                      onChange={(e) => setDeliveryRequest(prev => ({
                        ...prev,
                        deliveryAddress: e.target.value
                      }))}
                    />
                  </div>

                  {/* Type de colis */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Type de colis</label>
                    <Select
                      value={deliveryRequest.packageType}
                      onValueChange={(value) => setDeliveryRequest(prev => ({
                        ...prev,
                        packageType: value
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="colis">Colis standard</SelectItem>
                        <SelectItem value="fragile">Fragile</SelectItem>
                        <SelectItem value="lourd">Lourd</SelectItem>
                        <SelectItem value="refrigere">Réfrigéré</SelectItem>
                        <SelectItem value="documents">Documents</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Poids */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Poids (kg)</label>
                    <Input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={deliveryRequest.weight}
                      onChange={(e) => setDeliveryRequest(prev => ({
                        ...prev,
                        weight: parseFloat(e.target.value) || 0
                      }))}
                    />
                  </div>

                  {/* Instructions spéciales */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Instructions spéciales</label>
                    <Textarea
                      placeholder="Instructions pour le livreur..."
                      value={deliveryRequest.specialInstructions}
                      onChange={(e) => setDeliveryRequest(prev => ({
                        ...prev,
                        specialInstructions: e.target.value
                      }))}
                    />
                  </div>

                  {/* Informations de contact */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Informations de contact</h4>
                    <Input
                      placeholder="Nom complet"
                      value={deliveryRequest.contactInfo.name}
                      onChange={(e) => setDeliveryRequest(prev => ({
                        ...prev,
                        contactInfo: { ...prev.contactInfo, name: e.target.value }
                      }))}
                    />
                    <Input
                      placeholder="Téléphone"
                      value={deliveryRequest.contactInfo.phone}
                      onChange={(e) => setDeliveryRequest(prev => ({
                        ...prev,
                        contactInfo: { ...prev.contactInfo, phone: e.target.value }
                      }))}
                    />
                    <Input
                      placeholder="Email"
                      type="email"
                      value={deliveryRequest.contactInfo.email}
                      onChange={(e) => setDeliveryRequest(prev => ({
                        ...prev,
                        contactInfo: { ...prev.contactInfo, email: e.target.value }
                      }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Services et estimation */}
            <div className="space-y-6">
              {/* Services disponibles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Services disponibles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {deliveryServices.map((service) => (
                      <div
                        key={service.id}
                        className={`p-4 border rounded-lg cursor-pointer transition ${
                          selectedService?.id === service.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setDeliveryRequest(prev => ({
                          ...prev,
                          service: service.id
                        }))}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{service.logo}</span>
                            <div>
                              <h3 className="font-semibold">{service.name}</h3>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span>{service.rating}</span>
                                <span>•</span>
                                <span>{service.estimatedTime}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">{service.price.toLocaleString()} FCFA</div>
                            <div className="text-sm text-gray-600">base</div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {service.features.map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>

                        <div className="text-sm text-gray-600">
                          <strong>Couverture :</strong> {service.coverage.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Estimation */}
              {deliveryEstimate && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Route className="w-5 h-5" />
                      Estimation de livraison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Distance :</span>
                        <span className="font-semibold">{deliveryEstimate.distance} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Durée estimée :</span>
                        <span className="font-semibold">{deliveryEstimate.duration} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Coût supplémentaire :</span>
                        <span className="font-semibold">{deliveryEstimate.additionalCost} FCFA</span>
                      </div>
                      <hr />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total estimé :</span>
                        <span className="text-blue-600">
                          {(selectedService?.price || 0) + (deliveryEstimate.additionalCost || 0)} FCFA
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={calculateDeliveryEstimate}
                  disabled={isCalculating || !deliveryRequest.pickupAddress || !deliveryRequest.deliveryAddress}
                  className="w-full"
                >
                  {isCalculating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Calcul en cours...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4 mr-2" />
                      Calculer l'estimation
                    </>
                  )}
                </Button>

                <Button
                  onClick={createDeliveryRequest}
                  disabled={!selectedService || !deliveryEstimate}
                  variant="default"
                  className="w-full"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Créer la livraison
                </Button>

                <Button
                  onClick={() => setShowMap(true)}
                  variant="outline"
                  className="w-full"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Voir sur la carte
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'track' && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Suivre un colis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Numéro de suivi</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ex: BUNT-ABC12345"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                    />
                    <Button onClick={trackPackage}>
                      <Search className="w-4 h-4 mr-2" />
                      Suivre
                    </Button>
                  </div>
                </div>

                {trackingInfo && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-3">Informations de suivi</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Statut :</span>
                        <Badge variant="outline">{trackingInfo.status}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Localisation :</span>
                        <span>{trackingInfo.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dernière mise à jour :</span>
                        <span>{trackingInfo.lastUpdate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimation de livraison :</span>
                        <span>{trackingInfo.estimatedDelivery}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deliveryServices.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition">
                <CardHeader>
                  <div className="text-center">
                    <div className="text-4xl mb-2">{service.logo}</div>
                    <CardTitle>{service.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {service.price.toLocaleString()} FCFA
                    </div>
                    <div className="text-sm text-gray-600">{service.estimatedTime}</div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Fonctionnalités :</h4>
                    <ul className="space-y-1 text-sm">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Couverture :</h4>
                    <div className="flex flex-wrap gap-1">
                      {service.coverage.map((area, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span>Note :</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{service.rating}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">
                    En savoir plus
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal de carte */}
      {showMap && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Carte de livraison</h3>
                <Button
                  onClick={() => setShowMap(false)}
                  variant="ghost"
                  size="sm"
                >
                  ✕
                </Button>
              </div>
            </div>
            <div className="p-4">
              <LocationMap
                onLocationSelect={(location) => {
                  if (deliveryRequest.pickupAddress === '') {
                    setDeliveryRequest(prev => ({
                      ...prev,
                      pickupAddress: location.address
                    }));
                  } else {
                    setDeliveryRequest(prev => ({
                      ...prev,
                      deliveryAddress: location.address
                    }));
                  }
                }}
                onAddressChange={(address) => {
                  if (deliveryRequest.pickupAddress === '') {
                    setDeliveryRequest(prev => ({
                      ...prev,
                      pickupAddress: address
                    }));
                  } else {
                    setDeliveryRequest(prev => ({
                      ...prev,
                      deliveryAddress: address
                    }));
                  }
                }}
                initialAddress={deliveryRequest.pickupAddress || deliveryRequest.deliveryAddress}
                showSavedLocations={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 