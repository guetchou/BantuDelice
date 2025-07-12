import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  MapPin, 
  Truck, 
  Clock, 
  Phone, 
  MessageSquare,
  Navigation,
  Eye,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Package,
  Route,
  Star,
  Camera,
  FileText
} from 'lucide-react';
import { EdgeFunctionsService } from '@/services/edgeFunctions';
import LocationMap from '@/components/location/LocationMap';

interface TrackingInfo {
  trackingNumber: string;
  status: string;
  location: string;
  lastUpdate: string;
  estimatedDelivery: string;
  currentLocation?: [number, number];
  route?: any;
  driver?: {
    name: string;
    phone: string;
    vehicle: string;
  };
  history: Array<{
    timestamp: string;
    status: string;
    location: string;
    description: string;
  }>;
}

interface DeliveryTrackerProps {
  initialTrackingNumber?: string;
  onTrackingUpdate?: (info: TrackingInfo) => void;
}

const statusColors = {
  'Commande créée': 'bg-blue-100 text-blue-800',
  'En attente de collecte': 'bg-yellow-100 text-yellow-800',
  'Collecté': 'bg-orange-100 text-orange-800',
  'En transit': 'bg-purple-100 text-purple-800',
  'En cours de livraison': 'bg-green-100 text-green-800',
  'Livré': 'bg-green-500 text-white'
};

export default function DeliveryTracker({ 
  initialTrackingNumber = '', 
  onTrackingUpdate 
}: DeliveryTrackerProps) {
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber);
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const refreshInterval = useRef<NodeJS.Timeout | null>(null);

  // Auto-refresh tracking info
  useEffect(() => {
    if (autoRefresh && trackingInfo) {
      refreshInterval.current = setInterval(() => {
        trackPackage();
      }, 30000); // Refresh every 30 seconds
    }

    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
    };
  }, [autoRefresh, trackingInfo]);

  const trackPackage = async () => {
    if (!trackingNumber.trim()) {
      toast.error('Veuillez entrer un numéro de suivi');
      return;
    }

    setIsLoading(true);
    try {
      const info = await EdgeFunctionsService.trackDelivery(trackingNumber);
      setTrackingInfo(info);
      onTrackingUpdate?.(info);
      toast.success('Informations de suivi mises à jour');
    } catch (error) {
      console.error('Erreur lors du suivi:', error);
      toast.error('Erreur lors du suivi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackPackage();
  };

  const callDriver = () => {
    if (trackingInfo?.driver?.phone) {
      window.open(`tel:${trackingInfo.driver.phone}`, '_blank');
    }
  };

  const sendMessage = () => {
    if (chatMessage.trim() && trackingInfo?.driver?.phone) {
      const message = encodeURIComponent(`Bonjour, je suis le client pour la livraison ${trackingNumber}. ${chatMessage}`);
      window.open(`https://wa.me/${trackingInfo.driver.phone}?text=${message}`, '_blank');
      setChatMessage('');
      setShowChat(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Commande créée':
        return <Package className="w-5 h-5" />;
      case 'En attente de collecte':
        return <Clock className="w-5 h-5" />;
      case 'Collecté':
        return <Truck className="w-5 h-5" />;
      case 'En transit':
        return <Route className="w-5 h-5" />;
      case 'En cours de livraison':
        return <Navigation className="w-5 h-5" />;
      case 'Livré':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tracking Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Suivre un colis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              placeholder="Numéro de suivi (ex: BUNT-ABC12345)"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              Suivre
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Tracking Information */}
      {trackingInfo && (
        <div className="space-y-6">
          {/* Current Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Statut de la livraison</span>
                <Badge className={statusColors[trackingInfo.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
                  {trackingInfo.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Informations générales</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Numéro de suivi :</span>
                      <span className="font-mono font-semibold">{trackingInfo.trackingNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Localisation actuelle :</span>
                      <span>{trackingInfo.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dernière mise à jour :</span>
                      <span>{trackingInfo.lastUpdate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Livraison estimée :</span>
                      <span>{trackingInfo.estimatedDelivery}</span>
                    </div>
                  </div>
                </div>

                {trackingInfo.driver && (
                  <div>
                    <h4 className="font-semibold mb-2">Livreur assigné</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Nom :</span>
                        <span>{trackingInfo.driver.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Véhicule :</span>
                        <span>{trackingInfo.driver.vehicle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Téléphone :</span>
                        <span>{trackingInfo.driver.phone}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setShowMap(true)} variant="outline">
                  <MapPin className="w-4 h-4 mr-2" />
                  Voir sur la carte
                </Button>
                {trackingInfo.driver && (
                  <>
                    <Button onClick={callDriver} variant="outline">
                      <Phone className="w-4 h-4 mr-2" />
                      Appeler le livreur
                    </Button>
                    <Button onClick={() => setShowChat(true)} variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  </>
                )}
                <Button 
                  onClick={() => setAutoRefresh(!autoRefresh)} 
                  variant={autoRefresh ? "default" : "outline"}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {autoRefresh ? 'Auto-refresh activé' : 'Activer auto-refresh'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tracking History */}
          <Card>
            <CardHeader>
              <CardTitle>Historique de suivi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trackingInfo.history.map((event, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(event.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{event.status}</span>
                        <Badge variant="outline" className="text-xs">
                          {event.location}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{event.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{event.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Map Modal */}
      {showMap && trackingInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Suivi en temps réel</h3>
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
                onLocationSelect={() => {}}
                onAddressChange={() => {}}
                initialAddress={trackingInfo.location}
                showSavedLocations={false}
                trackingMode={true}
                trackingData={trackingInfo}
              />
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {showChat && trackingInfo?.driver && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Message au livreur</h3>
                <Button
                  onClick={() => setShowChat(false)}
                  variant="ghost"
                  size="sm"
                >
                  ✕
                </Button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="text-sm text-gray-600">
                Envoyer un message WhatsApp à {trackingInfo.driver.name}
              </div>
              <textarea
                className="w-full border rounded p-2 text-sm"
                placeholder="Votre message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button onClick={sendMessage} className="flex-1">
                  Envoyer
                </Button>
                <Button onClick={() => setShowChat(false)} variant="outline">
                  Annuler
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 