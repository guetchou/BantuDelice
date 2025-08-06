import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, MapPin, Clock, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TrackingEvent {
  id: string;
  status: string;
  location: string;
  timestamp: string;
  description: string;
  icon: 'package' | 'truck' | 'check' | 'alert';
}

interface ColisTrackingCardProps {
  colis: {
    id: string;
    status: string;
    sender: string;
    recipient: string;
    from: string;
    to: string;
    estimatedDelivery: string;
    weight: string;
    price: number;
    type: 'national' | 'international';
    events: TrackingEvent[];
  };
  onDownloadLabel?: (colisId: string) => void;
  onResend?: (colisId: string) => void;
}

const ColisTrackingCard: React.FC<ColisTrackingCardProps> = ({ 
  colis, 
  onDownloadLabel, 
  onResend 
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'livré': return 'bg-green-100 text-green-800';
      case 'en cours de livraison': return 'bg-orange-100 text-orange-800';
      case 'en transit': return 'bg-blue-100 text-blue-800';
      case 'pris en charge': return 'bg-yellow-100 text-yellow-800';
      case 'retardé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'national' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800';
  };

  const getEventIcon = (icon: string) => {
    switch (icon) {
      case 'package': return <Package className="h-4 w-4" />;
      case 'truck': return <Truck className="h-4 w-4" />;
      case 'check': return <CheckCircle className="h-4 w-4" />;
      case 'alert': return <AlertCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="bg-white/90 backdrop-blur border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-orange-500" />
            <div>
              <CardTitle className="text-xl font-bold text-gray-800">
                {colis.id}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getStatusColor(colis.status)}>
                  {colis.status}
                </Badge>
                <Badge className={getTypeColor(colis.type)}>
                  {colis.type === 'national' ? 'National' : 'International'}
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-orange-600">
              {colis.price.toLocaleString('fr-FR')} FCFA
            </p>
            <p className="text-sm text-gray-500">{colis.weight}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Informations de base */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Expéditeur:</span>
              <span>{colis.sender}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Destinataire:</span>
              <span>{colis.recipient}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 text-orange-500" />
              <span className="font-medium">De:</span>
              <span>{colis.from}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 text-green-500" />
              <span className="font-medium">Vers:</span>
              <span>{colis.to}</span>
            </div>
          </div>
        </div>

        {/* Livraison estimée */}
        <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
          <Clock className="h-5 w-5 text-orange-500" />
          <div>
            <p className="text-sm font-medium text-orange-700">Livraison estimée</p>
            <p className="text-sm text-orange-600">{formatDate(colis.estimatedDelivery)}</p>
          </div>
        </div>

        {/* Timeline des événements */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">Historique de suivi</h4>
          <div className="space-y-3">
            {colis.events.map((event, index) => (
              <div key={event.id} className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${index === 0 ? 'bg-orange-100' : 'bg-gray-100'}`}>
                  {getEventIcon(event.icon)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{event.status}</p>
                  <p className="text-sm text-gray-600">{event.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{event.location}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{formatDate(event.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
          <Link to={`/colis/tracking/${colis.id}`}>
            <Button variant="outline" size="sm" className="border-orange-300 text-orange-700">
              Voir les détails
            </Button>
          </Link>
          {onDownloadLabel && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onDownloadLabel(colis.id)}
              className="border-blue-300 text-blue-700"
            >
              Télécharger l'étiquette
            </Button>
          )}
          {onResend && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onResend(colis.id)}
              className="border-green-300 text-green-700"
            >
              Réexpédier
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ColisTrackingCard; 