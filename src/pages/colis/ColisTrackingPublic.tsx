import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MapPin, Clock, Truck, Package, CheckCircle, AlertCircle } from 'lucide-react';
import RealTimeTracking from '@/components/RealTimeTracking';

interface TrackingInfo {
  trackingNumber: string;
  status: string;
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  estimatedArrival: string;
  route: {
    distance: number;
    duration: number;
    waypoints: any[];
  };
  lastUpdate: string;
  colis?: {
    senderName: string;
    recipientName: string;
    packageType: string;
    weightKg: number;
    recipientAddress: string;
  };
}

const ColisTrackingPublic: React.FC = () => {
  const { trackingNumber } = useParams<{ trackingNumber: string }>();
  const [searchParams] = useSearchParams();
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRealTimeTracking, setShowRealTimeTracking] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Récupérer le token depuis l'URL si présent
  const token = searchParams.get('token');

  const fetchTrackingInfo = async () => {
    if (!trackingNumber) return;

    try {
      setLoading(true);
      const baseUrl = import.meta.env?.VITE_API_URL || 'http://localhost:3001';
      
      // Appel API avec token si présent
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${baseUrl}/tracking/${trackingNumber}`, {
        headers
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Numéro de suivi non trouvé');
        } else if (response.status === 401) {
          throw new Error('Accès non autorisé. Vérifiez votre lien de suivi.');
        } else {
          throw new Error(`Erreur serveur: ${response.status}`);
        }
      }

      const data = await response.json();
      setTrackingInfo(data.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des informations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackingInfo();
    
    // Rafraîchir automatiquement toutes les 30 secondes
    const interval = setInterval(() => {
      fetchTrackingInfo();
      setLastRefresh(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, [trackingNumber, token]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'out_for_delivery': return 'bg-blue-100 text-blue-800';
      case 'in_transit': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'out_for_delivery': return <Truck className="w-4 h-4" />;
      case 'in_transit': return <Package className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Livré';
      case 'out_for_delivery': return 'En cours de livraison';
      case 'in_transit': return 'En transit';
      case 'pending': return 'En attente';
      default: return 'Statut inconnu';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des informations de suivi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur de suivi</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchTrackingInfo} variant="outline">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  if (!trackingInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Aucune information de suivi disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Suivi de Colis</h1>
                <p className="text-sm text-gray-500">BantuDelice - Livraison Express</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Dernière mise à jour</p>
              <p className="text-sm font-medium text-gray-900">
                {lastRefresh.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations principales */}
          <div className="lg:col-span-2 space-y-6">
            {/* Numéro de suivi et statut */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Suivi #{trackingInfo.trackingNumber}</span>
                  <Badge className={getStatusColor(trackingInfo.status)}>
                    <span className="flex items-center space-x-1">
                      {getStatusIcon(trackingInfo.status)}
                      <span>{getStatusText(trackingInfo.status)}</span>
                    </span>
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Arrivée estimée</p>
                      <p className="font-medium">
                        {new Date(trackingInfo.estimatedArrival).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Position actuelle</p>
                      <p className="font-medium">
                        {trackingInfo.currentLocation.latitude !== 0 
                          ? `${trackingInfo.currentLocation.latitude.toFixed(4)}, ${trackingInfo.currentLocation.longitude.toFixed(4)}`
                          : 'Non disponible'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Carte en temps réel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Localisation en temps réel</span>
                  <Button
                    onClick={() => setShowRealTimeTracking(!showRealTimeTracking)}
                    variant={showRealTimeTracking ? "default" : "outline"}
                    size="sm"
                  >
                    {showRealTimeTracking ? 'Désactiver' : 'Activer'} le suivi temps réel
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {showRealTimeTracking ? (
                  <div className="h-96 rounded-lg overflow-hidden border">
                    <RealTimeTracking 
                      trackingNumber={trackingNumber!}
                      isPublic={true}
                    />
                  </div>
                ) : (
                  <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Cliquez sur "Activer le suivi temps réel" pour voir la position</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informations du colis */}
            {trackingInfo.colis && (
              <Card>
                <CardHeader>
                  <CardTitle>Détails du colis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Expéditeur</p>
                    <p className="font-medium">{trackingInfo.colis.senderName}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-500">Destinataire</p>
                    <p className="font-medium">{trackingInfo.colis.recipientName}</p>
                    <p className="text-sm text-gray-600">{trackingInfo.colis.recipientAddress}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-500">Type de colis</p>
                    <p className="font-medium">{trackingInfo.colis.packageType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Poids</p>
                    <p className="font-medium">{trackingInfo.colis.weightKg} kg</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">
                    Cette page se met à jour automatiquement toutes les 30 secondes
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">
                    Activez le suivi temps réel pour voir la position en direct
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">
                    Partagez ce lien avec le destinataire pour qu'il puisse suivre aussi
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Besoin d'aide ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Si vous avez des questions concernant votre livraison :
                </p>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Téléphone :</span> +242 06 XXX XXX
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Email :</span> support@bantudelice.com
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColisTrackingPublic; 