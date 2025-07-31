import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin,
  User,
  Phone,
  Download,
  Share2,
  AlertTriangle,
  Eye
} from 'lucide-react';

interface ColisStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  timestamp?: string;
  location?: string;
}

interface ColisItem {
  id: string;
  status: 'pending' | 'confirmed' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';
  steps: ColisStep[];
  sender: {
    name: string;
    phone: string;
  };
  recipient: {
    name: string;
    phone: string;
    address: string;
  };
  package: {
    weight: number;
    description: string;
    declaredValue: number;
  };
  price: number;
  createdAt: string;
  estimatedDelivery?: string;
}

interface ColisStatusProps {
  items: ColisItem[];
  onViewDetails?: (colisId: string) => void;
  onDownloadLabel?: (colisId: string) => void;
  onShare?: (colisId: string) => void;
}

const ColisStatus: React.FC<ColisStatusProps> = ({
  items,
  onViewDetails,
  onDownloadLabel,
  onShare
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'out_for_delivery': return 'bg-orange-100 text-orange-800';
      case 'confirmed': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'returned': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'in_transit': return <Truck className="h-4 w-4" />;
      case 'out_for_delivery': return <Package className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'cancelled': return <AlertTriangle className="h-4 w-4" />;
      case 'returned': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Livré';
      case 'in_transit': return 'En transit';
      case 'out_for_delivery': return 'En livraison';
      case 'confirmed': return 'Confirmé';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulé';
      case 'returned': return 'Retourné';
      default: return 'Inconnu';
    }
  };

  const TimelineStep = ({ step, isLast }: { step: ColisStep; isLast: boolean }) => (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          step.status === 'completed' 
            ? 'bg-green-500 text-white' 
            : step.status === 'current'
            ? 'bg-orange-500 text-white'
            : 'bg-gray-300 text-gray-600'
        }`}>
          {step.status === 'completed' ? (
            <CheckCircle className="h-4 w-4" />
          ) : step.status === 'current' ? (
            <Clock className="h-4 w-4" />
          ) : (
            <div className="w-2 h-2 bg-gray-400 rounded-full" />
          )}
        </div>
        {!isLast && (
          <div className={`w-0.5 h-8 mx-auto mt-2 ${
            step.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
          }`} />
        )}
      </div>
      <div className="flex-1 min-w-0 pb-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900">{step.title}</h4>
          {step.timestamp && (
            <span className="text-xs text-gray-500">{step.timestamp}</span>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
        {step.location && (
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-500">{step.location}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {items.map((colis) => (
        <Card key={colis.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package className="h-6 w-6 text-orange-600" />
                <div>
                  <CardTitle className="text-lg">Colis #{colis.id}</CardTitle>
                  <p className="text-sm text-gray-600">
                    Créé le {new Date(colis.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              <Badge className={getStatusColor(colis.status)}>
                <div className="flex items-center gap-1">
                  {getStatusIcon(colis.status)}
                  {getStatusText(colis.status)}
                </div>
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Informations rapides */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Destinataire</span>
                </div>
                <p className="text-sm text-gray-700">{colis.recipient.name}</p>
                <p className="text-xs text-gray-500">{colis.recipient.address}</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Package className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Colis</span>
                </div>
                <p className="text-sm text-gray-700">{colis.package.weight}kg</p>
                <p className="text-xs text-gray-500">{colis.package.description}</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Livraison estimée</span>
                </div>
                <p className="text-sm text-gray-700">
                  {colis.estimatedDelivery 
                    ? new Date(colis.estimatedDelivery).toLocaleDateString('fr-FR')
                    : 'À déterminer'
                  }
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-4">Suivi du colis</h4>
              <div className="space-y-2">
                {colis.steps.map((step, index) => (
                  <TimelineStep 
                    key={step.id} 
                    step={step} 
                    isLast={index === colis.steps.length - 1}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t mt-6">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails?.(colis.id)}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Voir détails
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownloadLabel?.(colis.id)}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Étiquette
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onShare?.(colis.id)}
                  className="flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Partager
                </Button>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-600">Prix total</p>
                <p className="text-lg font-bold text-orange-600">
                  {colis.price.toLocaleString()} FCFA
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ColisStatus; 