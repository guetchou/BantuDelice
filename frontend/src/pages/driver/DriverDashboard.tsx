import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTaxiRide } from '@/hooks/useTaxiRide';
import { useAuth } from '@/hooks/useAuth';
import { useGeolocation } from '@/hooks/useGeolocation';
import { toast } from 'sonner';
import { 
  Car, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Phone, 
  MessageCircle,
  Navigation,
  User,
  Calendar,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { TaxiRide, RideStatus } from '@/types/taxi';

export default function DriverDashboard() {
  const { user } = useAuth();
  const { 
    currentRide, 
    getUserRides, 
    updateRideStatus, 
    updateDriverLocation,
    isLoading 
  } = useTaxiRide();
  const { latitude, longitude, error: locationError } = useGeolocation();
  
  const [activeTab, setActiveTab] = useState('current');
  const [rideHistory, setRideHistory] = useState<TaxiRide[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [earnings, setEarnings] = useState({
    today: 0,
    week: 0,
    month: 0,
    total: 0
  });

  // Update location every 30 seconds when online
  useEffect(() => {
    if (isOnline && latitude && longitude) {
      updateDriverLocation(latitude, longitude, currentRide?.id);
    }
  }, [latitude, longitude, isOnline, currentRide]);

  // Load ride history
  useEffect(() => {
    if (user) {
      getUserRides(1, 50).then(result => {
        setRideHistory(result.rides);
        calculateEarnings(result.rides);
      });
    }
  }, [user]);

  const calculateEarnings = (rides: TaxiRide[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const completedRides = rides.filter(ride => ride.status === 'completed');
    
    const todayEarnings = completedRides
      .filter(ride => new Date(ride.completedAt || '') >= today)
      .reduce((sum, ride) => sum + (ride.actualPrice || 0), 0);
    
    const weekEarnings = completedRides
      .filter(ride => new Date(ride.completedAt || '') >= weekAgo)
      .reduce((sum, ride) => sum + (ride.actualPrice || 0), 0);
    
    const monthEarnings = completedRides
      .filter(ride => new Date(ride.completedAt || '') >= monthAgo)
      .reduce((sum, ride) => sum + (ride.actualPrice || 0), 0);
    
    const totalEarnings = completedRides
      .reduce((sum, ride) => sum + (ride.actualPrice || 0), 0);

    setEarnings({
      today: todayEarnings,
      week: weekEarnings,
      month: monthEarnings,
      total: totalEarnings
    });
  };

  const handleStatusUpdate = async (status: RideStatus) => {
    if (!currentRide) return;
    
    const success = await updateRideStatus(currentRide.id, status);
    if (success) {
      toast.success(`Statut mis à jour: ${getStatusText(status)}`);
    }
  };

  const getStatusText = (status: RideStatus) => {
    switch (status) {
      case 'accepted': return 'En route';
      case 'arriving': return 'Arrivant';
      case 'arrived': return 'Arrivé';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminé';
      default: return status;
    }
  };

  const getStatusColor = (status: RideStatus) => {
    switch (status) {
      case 'accepted': return 'bg-blue-500';
      case 'arriving': return 'bg-yellow-500';
      case 'arrived': return 'bg-green-500';
      case 'in_progress': return 'bg-purple-500';
      case 'completed': return 'bg-green-700';
      default: return 'bg-gray-500';
    }
  };

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
    toast.success(isOnline ? 'Vous êtes maintenant hors ligne' : 'Vous êtes maintenant en ligne');
  };

  if (locationError) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <div>
                <h3 className="font-semibold text-red-800">Erreur de géolocalisation</h3>
                <p className="text-red-600">Veuillez autoriser l'accès à votre position pour utiliser le dashboard chauffeur.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Chauffeur</h1>
              <p className="text-gray-600">Bienvenue, {user?.name || 'Chauffeur'}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={isOnline ? "default" : "secondary"}>
                {isOnline ? 'En ligne' : 'Hors ligne'}
              </Badge>
              <Button 
                variant={isOnline ? "outline" : "default"}
                onClick={toggleOnlineStatus}
              >
                {isOnline ? 'Se déconnecter' : 'Se connecter'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gains Aujourd'hui</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{earnings.today.toLocaleString()} FCFA</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gains Semaine</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{earnings.week.toLocaleString()} FCFA</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Courses Aujourd'hui</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {rideHistory.filter(ride => 
                  new Date(ride.createdAt).toDateString() === new Date().toDateString()
                ).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Note Moyenne</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {rideHistory.length > 0 
                  ? (rideHistory.reduce((sum, ride) => sum + (ride.rating || 0), 0) / 
                     rideHistory.filter(ride => ride.rating).length).toFixed(1)
                  : '0.0'
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current">Course Actuelle</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-6">
            {currentRide ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Car className="h-5 w-5" />
                    <span>Course #{currentRide.id.substring(0, 8)}</span>
                    <Badge className={getStatusColor(currentRide.status)}>
                      {getStatusText(currentRide.status)}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Ride Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">Point de départ</p>
                          <p className="text-sm text-gray-600">{currentRide.pickupAddress}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Navigation className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">Destination</p>
                          <p className="text-sm text-gray-600">{currentRide.destinationAddress}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <User className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">Passager</p>
                          <p className="text-sm text-gray-600">{currentRide.user?.name || 'Passager'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <DollarSign className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">Prix estimé</p>
                          <p className="text-sm text-gray-600">{currentRide.estimatedPrice} FCFA</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {currentRide.status === 'accepted' && (
                      <>
                        <Button onClick={() => handleStatusUpdate('arriving')}>
                          <Navigation className="mr-2 h-4 w-4" />
                          En route vers le client
                        </Button>
                      </>
                    )}
                    
                    {currentRide.status === 'arriving' && (
                      <Button onClick={() => handleStatusUpdate('arrived')}>
                        <MapPin className="mr-2 h-4 w-4" />
                        Arrivé chez le client
                      </Button>
                    )}
                    
                    {currentRide.status === 'arrived' && (
                      <Button onClick={() => handleStatusUpdate('in_progress')}>
                        <Car className="mr-2 h-4 w-4" />
                        Débuter le trajet
                      </Button>
                    )}
                    
                    {currentRide.status === 'in_progress' && (
                      <Button onClick={() => handleStatusUpdate('completed')}>
                        <Clock className="mr-2 h-4 w-4" />
                        Terminer le trajet
                      </Button>
                    )}

                    <Button variant="outline">
                      <Phone className="mr-2 h-4 w-4" />
                      Appeler le client
                    </Button>
                    
                    <Button variant="outline">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune course active</h3>
                  <p className="text-gray-600">Vous recevrez une notification quand une nouvelle course sera disponible.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Historique des courses</CardTitle>
                <CardDescription>Vos courses récentes et leurs détails</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rideHistory.slice(0, 10).map((ride) => (
                    <div key={ride.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Course #{ride.id.substring(0, 8)}</p>
                          <p className="text-sm text-gray-600">
                            {ride.pickupAddress} → {ride.destinationAddress}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(ride.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(ride.status)}>
                            {getStatusText(ride.status)}
                          </Badge>
                          <p className="font-medium mt-1">{ride.actualPrice || ride.estimatedPrice} FCFA</p>
                          {ride.rating && (
                            <div className="flex items-center mt-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-sm ml-1">{ride.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profil Chauffeur</CardTitle>
                <CardDescription>Gérez vos informations personnelles et véhicule</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Informations personnelles</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Nom complet</label>
                        <p className="text-sm text-gray-600">{user?.name || 'Non défini'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <p className="text-sm text-gray-600">{user?.email || 'Non défini'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Téléphone</label>
                        <p className="text-sm text-gray-600">{user?.phone || 'Non défini'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Statistiques</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Total des courses</label>
                        <p className="text-sm text-gray-600">{rideHistory.length}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Gains totaux</label>
                        <p className="text-sm text-gray-600">{earnings.total.toLocaleString()} FCFA</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Note moyenne</label>
                        <p className="text-sm text-gray-600">
                          {rideHistory.length > 0 
                            ? (rideHistory.reduce((sum, ride) => sum + (ride.rating || 0), 0) / 
                               rideHistory.filter(ride => ride.rating).length).toFixed(1)
                            : '0.0'
                          } / 5
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button variant="outline">Modifier le profil</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 