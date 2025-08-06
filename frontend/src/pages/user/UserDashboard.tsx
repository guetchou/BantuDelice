import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTaxiRide } from '@/hooks/useTaxiRide';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
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
  Heart,
  Settings,
  History
} from 'lucide-react';
import { TaxiRide, RideStatus } from '@/types/taxi';

export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    currentRide, 
    getUserRides, 
    cancelRide,
    rateRide,
    isLoading 
  } = useTaxiRide();
  
  const [activeTab, setActiveTab] = useState('current');
  const [rideHistory, setRideHistory] = useState<TaxiRide[]>([]);
  const [stats, setStats] = useState({
    totalRides: 0,
    totalSpent: 0,
    averageRating: 0,
    favoriteDriver: null as any
  });

  // Load ride history
  useEffect(() => {
    if (user) {
      getUserRides(1, 50).then(result => {
        setRideHistory(result.rides);
        calculateStats(result.rides);
      });
    }
  }, [user]);

  const calculateStats = (rides: TaxiRide[]) => {
    const completedRides = rides.filter(ride => ride.status === 'completed');
    const totalSpent = completedRides.reduce((sum, ride) => sum + (ride.actualPrice || 0), 0);
    const totalRating = completedRides.reduce((sum, ride) => sum + (ride.rating || 0), 0);
    const ratedRides = completedRides.filter(ride => ride.rating).length;
    
    // Find favorite driver
    const driverStats = completedRides.reduce((acc, ride) => {
      if (ride.driver?.id) {
        if (!acc[ride.driver.id]) {
          acc[ride.driver.id] = {
            driver: ride.driver,
            rides: 0,
            totalRating: 0
          };
        }
        acc[ride.driver.id].rides++;
        acc[ride.driver.id].totalRating += ride.rating || 0;
      }
      return acc;
    }, {} as any);

    const favoriteDriver = Object.values(driverStats).sort((a: any, b: any) => b.rides - a.rides)[0];

    setStats({
      totalRides: completedRides.length,
      totalSpent,
      averageRating: ratedRides > 0 ? totalRating / ratedRides : 0,
      favoriteDriver
    });
  };

  const handleCancelRide = async () => {
    if (!currentRide) return;
    
    const success = await cancelRide();
    if (success) {
      toast.success('Course annulée avec succès');
    }
  };

  const handleRateRide = async (rideId: string, rating: number, comment?: string) => {
    const success = await rateRide(rideId, rating, comment);
    if (success) {
      toast.success('Évaluation enregistrée');
      // Reload ride history
      getUserRides(1, 50).then(result => {
        setRideHistory(result.rides);
        calculateStats(result.rides);
      });
    }
  };

  const getStatusText = (status: RideStatus) => {
    switch (status) {
      case 'requested': return 'En attente';
      case 'accepted': return 'Chauffeur en route';
      case 'arriving': return 'Chauffeur arrive';
      case 'arrived': return 'Chauffeur arrivé';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const getStatusColor = (status: RideStatus) => {
    switch (status) {
      case 'requested': return 'bg-yellow-500';
      case 'accepted': return 'bg-blue-500';
      case 'arriving': return 'bg-orange-500';
      case 'arrived': return 'bg-green-500';
      case 'in_progress': return 'bg-purple-500';
      case 'completed': return 'bg-green-700';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mon Dashboard</h1>
              <p className="text-gray-600">Bienvenue, {user?.name || 'Utilisateur'}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => navigate('/taxi')}>
                <Car className="mr-2 h-4 w-4" />
                Réserver un taxi
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
              <CardTitle className="text-sm font-medium">Total des courses</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRides}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total dépensé</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSpent.toLocaleString()} FCFA</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Note moyenne donnée</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chauffeur préféré</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                {stats.favoriteDriver?.driver?.name || 'Aucun'}
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
                      {currentRide.driver && (
                        <div className="flex items-center space-x-3">
                          <User className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="font-medium">Chauffeur</p>
                            <p className="text-sm text-gray-600">{currentRide.driver.name}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center space-x-3">
                        <DollarSign className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">Prix estimé</p>
                          <p className="text-sm text-gray-600">{currentRide.estimatedPrice} FCFA</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Driver Info */}
                  {currentRide.driver && (
                    <Card className="bg-gray-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium">{currentRide.driver.name}</p>
                              <p className="text-sm text-gray-600">{currentRide.driver.phone}</p>
                              {currentRide.driver.rating && (
                                <div className="flex items-center mt-1">
                                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                  <span className="text-sm ml-1">{currentRide.driver.rating}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {(currentRide.status === 'requested' || currentRide.status === 'accepted') && (
                      <Button variant="destructive" onClick={handleCancelRide}>
                        Annuler la course
                      </Button>
                    )}
                    
                    <Button variant="outline" onClick={() => navigate(`/taxi/ride/${currentRide.id}`)}>
                      Voir les détails
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune course active</h3>
                  <p className="text-gray-600 mb-4">Vous n'avez pas de course en cours actuellement.</p>
                  <Button onClick={() => navigate('/taxi')}>
                    Réserver un taxi
                  </Button>
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
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <p className="font-medium">Course #{ride.id.substring(0, 8)}</p>
                            <Badge className={getStatusColor(ride.status)}>
                              {getStatusText(ride.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {ride.pickupAddress} → {ride.destinationAddress}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(ride.createdAt).toLocaleDateString()}
                          </p>
                          {ride.driver && (
                            <p className="text-sm text-gray-600 mt-1">
                              Chauffeur: {ride.driver.name}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{ride.actualPrice || ride.estimatedPrice} FCFA</p>
                          {ride.status === 'completed' && !ride.rating && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="mt-2"
                              onClick={() => {
                                const rating = prompt('Notez votre course (1-5):');
                                const comment = prompt('Commentaire (optionnel):');
                                if (rating) {
                                  handleRateRide(ride.id, parseInt(rating), comment || undefined);
                                }
                              }}
                            >
                              <Star className="h-3 w-3 mr-1" />
                              Évaluer
                            </Button>
                          )}
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
                <CardTitle>Profil Utilisateur</CardTitle>
                <CardDescription>Gérez vos informations personnelles et préférences</CardDescription>
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
                        <p className="text-sm text-gray-600">{stats.totalRides}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Total dépensé</label>
                        <p className="text-sm text-gray-600">{stats.totalSpent.toLocaleString()} FCFA</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Note moyenne donnée</label>
                        <p className="text-sm text-gray-600">{stats.averageRating.toFixed(1)} / 5</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Modifier le profil
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 