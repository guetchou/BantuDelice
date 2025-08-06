import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Search,
  Download,
  Share2,
  ArrowLeft,
  Loader2,
  Calendar,
  User,
  Phone,
  Mail,
  Weight,
  DollarSign,
  Navigation,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useColisAuth } from '@/context/ColisAuthContext';
import RealTimeTracking from '@/components/tracking/RealTimeTracking';
import ColisMap from '@/components/colis/ColisMap';

interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  location: string;
  timestamp: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface TrackingInfo {
  trackingNumber: string;
  status: 'pending' | 'confirmed' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';
  sender: {
    name: string;
    phone: string;
    address: string;
  };
  recipient: {
    name: string;
    phone: string;
    address: string;
  };
  package?: {
    weight?: number;
    description?: string;
    declaredValue?: number;
  };
  totalPrice?: number;
  createdAt: string;
  estimatedDelivery?: string;
  events: TrackingEvent[];
  // Informations de localisation
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  lastUpdate?: Date;
  route?: {
    distance?: number;
    duration?: number;
    waypoints?: Array<{ lat: number; lng: number }>;
  };
  driverInfo?: {
    id: string;
    name: string;
    phone: string;
    photo?: string;
  };
}

// Composant de recherche mémorisé
const TrackingSearch = React.memo<{
  onSearch: (trackingNumber: string) => void;
  loading: boolean;
}>(({ onSearch, loading }) => {
  const [trackingNumber, setTrackingNumber] = useState('');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      onSearch(trackingNumber.trim());
    }
  }, [trackingNumber, onSearch]);

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Entrez votre numéro de suivi (ex: BD123456 ou DHL123456789)"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          disabled={loading}
        />
      </div>
      <Button type="submit" disabled={loading || !trackingNumber.trim()}>
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Recherche...
          </>
        ) : (
          <>
            <Search className="h-4 w-4 mr-2" />
            Suivre
          </>
        )}
      </Button>
    </form>
  );
});

// Composant d'événement de suivi mémorisé
const TrackingEvent = React.memo<{
  event: TrackingEvent;
  isLast: boolean;
}>(({ event, isLast }) => {
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600';
      case 'in_transit': return 'text-blue-600';
      case 'pending': return 'text-yellow-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }, []);

  return (
    <div className="flex items-start space-x-4">
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isLast ? 'bg-orange-100' : 'bg-gray-100'
      }`}>
        <event.icon className={`h-4 w-4 ${isLast ? 'text-orange-600' : 'text-gray-400'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${getStatusColor(event.status)}`}>
          {event.description}
        </p>
        <p className="text-sm text-gray-500">{event.location}</p>
        <p className="text-xs text-gray-400">
          {new Date(event.timestamp).toLocaleString('fr-FR')}
        </p>
      </div>
    </div>
  );
});

// Composant d'informations du colis mémorisé
const PackageInfo = React.memo<{
  trackingInfo: TrackingInfo | null;
}>(({ trackingInfo }) => {
  // Vérification de sécurité
  if (!trackingInfo) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune information disponible
          </h3>
          <p className="text-gray-600">
            Veuillez rechercher un numéro de suivi valide
          </p>
        </CardContent>
      </Card>
    );
  }

  // Vérification supplémentaire pour les détails du colis
  if (!trackingInfo.package) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Détails du colis manquants
          </h3>
          <p className="text-gray-600">
            Les informations du colis ne sont pas disponibles
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);

  const getStatusText = useCallback((status: string) => {
    switch (status) {
      case 'delivered': return 'Livré';
      case 'in_transit': return 'En transit';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* En-tête avec statut */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Colis {trackingInfo.trackingNumber}
          </h2>
          <p className="text-gray-600">Créé le {new Date(trackingInfo.createdAt).toLocaleDateString('fr-FR')}</p>
        </div>
        <Badge className={getStatusColor(trackingInfo.status)}>
          {getStatusText(trackingInfo.status)}
        </Badge>
      </div>

      {/* Informations expéditeur/destinataire */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Expéditeur
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{trackingInfo.sender.name}</p>
            <p className="text-sm text-gray-600">{trackingInfo.sender.phone}</p>
            <p className="text-sm text-gray-600">{trackingInfo.sender.address}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Destinataire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{trackingInfo.recipient.name}</p>
            <p className="text-sm text-gray-600">{trackingInfo.recipient.phone}</p>
            <p className="text-sm text-gray-600">{trackingInfo.recipient.address}</p>
          </CardContent>
        </Card>
      </div>

      {/* Détails du colis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Détails du colis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Weight className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{trackingInfo.package?.weight ?? '–'} kg</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{trackingInfo.package?.declaredValue?.toLocaleString() ?? '–'} FCFA</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{trackingInfo.package?.description ?? '–'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Livraison estimée */}
      {trackingInfo.estimatedDelivery && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Livraison estimée
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">
              {new Date(trackingInfo.estimatedDelivery).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
});

// Composant de timeline mémorisé
const TrackingTimeline = React.memo<{
  events: TrackingEvent[];
}>(({ events }) => {
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [events]);

  if (!events || events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Historique de suivi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Aucun événement de suivi disponible</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Historique de suivi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sortedEvents.map((event, index) => (
            <TrackingEvent
              key={event.id}
              event={event}
              isLast={index === 0}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

const ColisTracking: React.FC = React.memo(() => {
  const { trackingNumber: urlTrackingNumber } = useParams<{ trackingNumber: string }>();
  const [searchParams] = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState(urlTrackingNumber || searchParams.get('tracking') || '');
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRealTimeTracking, setShowRealTimeTracking] = useState(false);
  
  const { user, isAuthenticated } = useColisAuth();

  // Fonction de recherche mémorisée
  const handleSearch = useCallback(async (searchTrackingNumber: string) => {
    if (!searchTrackingNumber.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      // Utiliser le bon endpoint API
      const baseUrl = import.meta.env?.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/colis/${searchTrackingNumber}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Numéro de suivi non trouvé');
        } else {
          throw new Error(`Erreur serveur: ${response.status}`);
        }
      }
      
      const data = await response.json();
      
      if (data.success) {
        setTrackingInfo(data.data);
        setTrackingNumber(searchTrackingNumber);
        setShowRealTimeTracking(true);
        toast.success('Informations de suivi récupérées');
      } else {
        throw new Error(data.message || 'Erreur lors de la récupération des données');
      }
    } catch (error: unknown) {
      console.error('Erreur de suivi:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue lors du suivi';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Recherche automatique si numéro dans l'URL
  useEffect(() => {
    if (trackingNumber && !trackingInfo) {
      handleSearch(trackingNumber);
    }
  }, [trackingNumber, trackingInfo, handleSearch]);

  // Handlers mémorisés
  const handleDownloadLabel = useCallback(() => {
    toast.info('Téléchargement de l\'étiquette...');
  }, []);

  const handleShare = useCallback(() => {
    if (trackingInfo && navigator.share) {
      navigator.share({
        title: `Suivi de mon colis ${trackingInfo.trackingNumber}`,
        text: `Suivez mon colis ${trackingInfo.trackingNumber} sur BantuDelice`,
        url: `${window.location.origin}/colis/tracking/${trackingInfo.trackingNumber}`
      });
    } else {
      toast.info('Partage non supporté sur ce navigateur');
    }
  }, [trackingInfo]);

  // Générer les événements de tracking basés sur le statut
  const trackingEvents = useMemo(() => {
    if (!trackingInfo) return [];

    const events: TrackingEvent[] = [];
    const baseDate = trackingInfo.createdAt ? new Date(trackingInfo.createdAt) : new Date();

    // Vérifier que la date est valide
    if (isNaN(baseDate.getTime())) {
      console.warn('Date invalide pour trackingInfo.createdAt:', trackingInfo.createdAt);
      return [];
    }

    // Événement initial
    events.push({
      id: '1',
      status: 'pending',
      description: 'Colis créé',
      location: trackingInfo.sender.address,
      timestamp: baseDate.toISOString(),
      icon: Package
    });

    if (trackingInfo.status === 'confirmed' || trackingInfo.status === 'in_transit' || trackingInfo.status === 'delivered') {
      events.push({
        id: '2',
        status: 'confirmed',
        description: 'Colis confirmé',
        location: trackingInfo.sender.address,
        timestamp: new Date(baseDate.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        icon: CheckCircle
      });
    }

    if (trackingInfo.status === 'in_transit' || trackingInfo.status === 'delivered') {
      events.push({
        id: '3',
        status: 'in_transit',
        description: 'Colis en transit',
        location: 'Centre de tri',
        timestamp: new Date(baseDate.getTime() + 4 * 60 * 60 * 1000).toISOString(),
        icon: Truck
      });
    }

    if (trackingInfo.status === 'delivered') {
      const deliveryDate = trackingInfo.estimatedDelivery ? new Date(trackingInfo.estimatedDelivery) : new Date();
      events.push({
        id: '4',
        status: 'delivered',
        description: 'Colis livré',
        location: trackingInfo.recipient.address,
        timestamp: isNaN(deliveryDate.getTime()) ? new Date().toISOString() : deliveryDate.toISOString(),
        icon: CheckCircle
      });
    }

    return events;
  }, [trackingInfo]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/colis" className="flex items-center text-gray-600 hover:text-gray-900 mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au module Colis
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Suivi de Colis</h1>
            <p className="text-gray-600">Suivez votre colis en temps réel</p>
          </div>
        </div>

        {/* Recherche */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <TrackingSearch onSearch={handleSearch} loading={loading} />
          </CardContent>
        </Card>

        {/* Contenu principal */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-orange-500" />
            <p className="text-gray-600">Recherche en cours...</p>
          </div>
        )}

        {error && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {trackingInfo && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-8">
              {/* Actions */}
              <div className="flex gap-4">
                <Button onClick={handleDownloadLabel} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger l'étiquette
                </Button>
                <Button onClick={handleShare} variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
                {isAuthenticated && (
                  <Button 
                    onClick={() => setShowRealTimeTracking(!showRealTimeTracking)}
                    variant={showRealTimeTracking ? "default" : "outline"}
                  >
                    {showRealTimeTracking ? (
                      <>
                        <WifiOff className="h-4 w-4 mr-2" />
                        Désactiver GPS
                      </>
                    ) : (
                      <>
                        <Wifi className="h-4 w-4 mr-2" />
                        Activer GPS
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Carte de localisation du colis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Localisation du colis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    {trackingInfo?.currentLocation ? (
                      <div className="text-center">
                        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Package className="h-8 w-8 text-white" />
                        </div>
                        <p className="font-medium">Colis localisé</p>
                        <p className="text-sm text-gray-600">
                          Lat: {trackingInfo.currentLocation.latitude.toFixed(4)}, 
                          Lng: {trackingInfo.currentLocation.longitude.toFixed(4)}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Dernière mise à jour: {new Date(trackingInfo.lastUpdate).toLocaleString('fr-FR')}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500">
                        <MapPin className="h-12 w-12 mx-auto mb-2" />
                        <p>Localisation en cours de récupération...</p>
                        <p className="text-sm">Le colis sera affiché sur la carte</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Informations de localisation */}
                  {trackingInfo?.currentLocation && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-600 font-medium">Position actuelle</p>
                        <p className="font-mono text-xs">
                          {trackingInfo.currentLocation.latitude.toFixed(6)}, {trackingInfo.currentLocation.longitude.toFixed(6)}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-600 font-medium">Statut</p>
                        <p className="capitalize">{trackingInfo.status}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-600 font-medium">Arrivée estimée</p>
                        <p>{trackingInfo.estimatedArrival ? new Date(trackingInfo.estimatedArrival).toLocaleString('fr-FR') : 'Non disponible'}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tracking temps réel (pour utilisateurs authentifiés) */}
              {showRealTimeTracking && isAuthenticated && user && (
                <RealTimeTracking
                  trackingNumber={trackingNumber}
                  userId={user.id}
                  showMap={true}
                  showDriverInfo={true}
                  showRoute={true}
                />
              )}

              {/* Informations du colis */}
              <PackageInfo trackingInfo={trackingInfo} />

              {/* Timeline */}
              <TrackingTimeline events={trackingEvents} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Statut de connexion */}
              {isAuthenticated && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wifi className="h-5 w-5" />
                      Statut de connexion
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Authentification</span>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Connecté
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Tracking GPS</span>
                        <Badge variant="outline" className={showRealTimeTracking ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"}>
                          {showRealTimeTracking ? "Actif" : "Inactif"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle>Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-gray-600">
                    <p>• Le suivi GPS temps réel nécessite une connexion</p>
                    <p>• Les mises à jour se font automatiquement</p>
                    <p>• Vous recevrez des notifications en temps réel</p>
                    <p>• L'historique est conservé pendant 30 jours</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {!loading && !error && !trackingInfo && (
          <Card>
            <CardContent className="pt-6 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Recherchez votre colis
              </h3>
              <p className="text-gray-600">
                Entrez votre numéro de suivi pour voir les informations de votre colis
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
});

ColisTracking.displayName = 'ColisTracking';

export default ColisTracking; 