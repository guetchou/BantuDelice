import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Phone, 
  MessageSquare, 
  MapPin, 
  Clock, 
  Car, 
  Star, 
  Navigation,
  User,
  Shield,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface Driver {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  rating: number;
  vehicle: {
    model: string;
    plate: string;
    color: string;
    type: string;
  };
  location: [number, number];
  estimatedArrival: number; // minutes
}

interface RideStatus {
  status: 'searching' | 'driver_assigned' | 'driver_arriving' | 'driver_arrived' | 'in_progress' | 'completed' | 'cancelled';
  estimatedTime: number;
  currentLocation: [number, number];
  driver?: Driver;
}

interface TaxiRideTrackerProps {
  rideId: string;
  pickupLocation: string;
  destination: string;
  onCancel?: () => void;
  onComplete?: () => void;
}

export default function TaxiRideTracker({ 
  rideId, 
  pickupLocation, 
  destination, 
  onCancel, 
  onComplete 
}: TaxiRideTrackerProps) {
  const [rideStatus, setRideStatus] = useState<RideStatus>({
    status: 'searching',
    estimatedTime: 5,
    currentLocation: [15.2429, -4.2634] // Brazzaville center
  });

  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Array<{
    id: string;
    sender: 'user' | 'driver';
    message: string;
    timestamp: Date;
  }>>([]);
  const [newMessage, setNewMessage] = useState('');

  // Simuler le processus de course
  useEffect(() => {
    const simulateRide = async () => {
      // Étape 1: Recherche de chauffeur (2 secondes)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Étape 2: Chauffeur assigné
      setRideStatus(prev => ({
        ...prev,
        status: 'driver_assigned',
        driver: {
          id: '1',
          name: 'Jean-Pierre Mbemba',
          phone: '+242 06 123 4567',
          avatar: '/api/avatars/driver1.jpg',
          rating: 4.8,
          vehicle: {
            model: 'Toyota Corolla',
            plate: 'CG-1234-AB',
            color: 'Blanc',
            type: 'Standard'
          },
          location: [15.245, -4.26],
          estimatedArrival: 3
        }
      }));

      // Étape 3: Chauffeur en route (3 secondes)
      await new Promise(resolve => setTimeout(resolve, 3000));
      setRideStatus(prev => ({
        ...prev,
        status: 'driver_arriving',
        estimatedTime: 2
      }));

      // Étape 4: Chauffeur arrivé (2 secondes)
      await new Promise(resolve => setTimeout(resolve, 2000));
      setRideStatus(prev => ({
        ...prev,
        status: 'driver_arrived',
        estimatedTime: 0
      }));

      // Étape 5: Course en cours (5 secondes)
      await new Promise(resolve => setTimeout(resolve, 5000));
      setRideStatus(prev => ({
        ...prev,
        status: 'in_progress',
        estimatedTime: 8
      }));

      // Étape 6: Course terminée (8 secondes)
      await new Promise(resolve => setTimeout(resolve, 8000));
      setRideStatus(prev => ({
        ...prev,
        status: 'completed',
        estimatedTime: 0
      }));
    };

    simulateRide();
  }, []);

  const handleCallDriver = () => {
    if (rideStatus.driver) {
      toast.success(`Appel en cours vers ${rideStatus.driver.name}...`);
      // Ici on pourrait intégrer une vraie API d'appel
    }
  };

  const handleSendSMS = () => {
    if (rideStatus.driver) {
      toast.success(`SMS envoyé à ${rideStatus.driver.name}`);
      // Ici on pourrait intégrer une vraie API SMS
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && rideStatus.driver) {
      const message = {
        id: Date.now().toString(),
        sender: 'user' as const,
        message: newMessage.trim(),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');

      // Simuler une réponse du chauffeur
      setTimeout(() => {
        const driverResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'driver' as const,
          message: 'Message reçu, je serai là dans quelques minutes.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, driverResponse]);
      }, 2000);
    }
  };

  const getStatusColor = (status: RideStatus['status']) => {
    switch (status) {
      case 'searching': return 'bg-yellow-500';
      case 'driver_assigned': return 'bg-blue-500';
      case 'driver_arriving': return 'bg-orange-500';
      case 'driver_arrived': return 'bg-green-500';
      case 'in_progress': return 'bg-purple-500';
      case 'completed': return 'bg-green-600';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: RideStatus['status']) => {
    switch (status) {
      case 'searching': return 'Recherche de chauffeur...';
      case 'driver_assigned': return 'Chauffeur assigné';
      case 'driver_arriving': return 'Chauffeur en route';
      case 'driver_arrived': return 'Chauffeur arrivé';
      case 'in_progress': return 'En route vers la destination';
      case 'completed': return 'Course terminée';
      case 'cancelled': return 'Course annulée';
      default: return 'Statut inconnu';
    }
  };

  return (
    <div className="space-y-4">
      {/* Statut de la course */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(rideStatus.status)}`}></div>
              <span>{getStatusText(rideStatus.status)}</span>
            </CardTitle>
            {rideStatus.status === 'searching' && (
              <Button variant="outline" onClick={onCancel}>
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Informations de trajet */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <p className="font-medium text-sm">Point de départ</p>
                  <p className="text-sm text-gray-600">{pickupLocation}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Navigation className="w-5 h-5 text-red-600 mt-1" />
                <div>
                  <p className="font-medium text-sm">Destination</p>
                  <p className="text-sm text-gray-600">{destination}</p>
                </div>
              </div>
            </div>

            {/* Temps estimé */}
            {rideStatus.estimatedTime > 0 && (
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-sm">
                    {rideStatus.status === 'in_progress' ? 'Temps restant' : 'Temps d\'attente estimé'}
                  </p>
                  <p className="text-sm text-gray-600">{rideStatus.estimatedTime} minutes</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Informations du chauffeur */}
      {rideStatus.driver && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Car className="w-5 h-5" />
              <span>Votre chauffeur</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Profil du chauffeur */}
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={rideStatus.driver.avatar} />
                  <AvatarFallback>
                    <User className="w-8 h-8" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{rideStatus.driver.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{rideStatus.driver.rating}</span>
                    <Badge variant="secondary" className="text-xs">
                      <Shield className="w-3 h-3 mr-1" />
                      Vérifié
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Informations du véhicule */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-sm mb-2">Véhicule</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Modèle</p>
                    <p className="font-medium">{rideStatus.driver.vehicle.model}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Plaque</p>
                    <p className="font-medium">{rideStatus.driver.vehicle.plate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Couleur</p>
                    <p className="font-medium">{rideStatus.driver.vehicle.color}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Type</p>
                    <p className="font-medium">{rideStatus.driver.vehicle.type}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button onClick={handleCallDriver} className="flex-1">
                  <Phone className="w-4 h-4 mr-2" />
                  Appeler
                </Button>
                <Button onClick={handleSendSMS} variant="outline" className="flex-1">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  SMS
                </Button>
                <Button 
                  onClick={() => setShowChat(!showChat)} 
                  variant="outline"
                  className="flex-1"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat avec le chauffeur */}
      {showChat && rideStatus.driver && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Chat avec {rideStatus.driver.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Messages */}
              <div className="h-64 overflow-y-auto space-y-2 border rounded-lg p-4">
                {messages.length === 0 ? (
                  <p className="text-center text-gray-500 text-sm">
                    Aucun message pour le moment
                  </p>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                          message.sender === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        {message.message}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input pour nouveau message */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Tapez votre message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  Envoyer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Carte en temps réel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Suivi en temps réel</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Carte de suivi en temps réel</p>
              <p className="text-sm text-gray-400">Intégration GPS en cours...</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions finales */}
      {rideStatus.status === 'completed' && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h3 className="text-xl font-semibold">Course terminée !</h3>
              <p className="text-gray-600">Merci d'avoir utilisé notre service</p>
              <div className="flex space-x-2">
                <Button onClick={onComplete} className="flex-1">
                  Noter la course
                </Button>
                <Button variant="outline" className="flex-1">
                  Nouvelle course
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 