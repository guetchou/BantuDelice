
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  CreditCard, 
  Star, 
  Car, 
  ArrowRight,
  Calendar
} from "lucide-react";
import apiService from '@/services/api';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { TaxiRide, TaxiDriver } from '@/types/taxi';
import Layout from '@/components/Layout';

const TaxiRideDetails = () => {
  const { rideId } = useParams<{ rideId: string }>();
  const [ride, setRide] = useState<TaxiRide | null>(null);
  const [driver, setDriver] = useState<TaxiDriver | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRideDetails = async () => {
      setLoading(true);
      try {
        // Fetch ride details
        const { data: rideData, error: rideError } = await supabase
          .from('taxi_rides')
          .select('*')
          .eq('id', rideId)
          .single();

        if (rideError) throw rideError;
        setRide(rideData as TaxiRide);

        // Fetch driver details if available
        if (rideData.driver_id) {
          const { data: driverData, error: driverError } = await supabase
            .from('taxi_drivers')
            .select('*')
            .eq('id', rideData.driver_id)
            .single();

          if (!driverError) {
            setDriver(driverData as TaxiDriver);
          }
        }
      } catch (error) {
        console.error('Error fetching ride details:', error);
        toast.error('Impossible de récupérer les détails de la course');
      } finally {
        setLoading(false);
      }
    };

    if (rideId) {
      fetchRideDetails();
    }
  }, [rideId]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!ride) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">Course non trouvée</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Helper function to display status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">En attente</Badge>;
      case 'accepted':
        return <Badge variant="outline">Acceptée</Badge>;
      case 'in_progress':
        return <Badge variant="default">En cours</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Terminée</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Annulée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Layout backLink="/taxis" backText="Retour aux courses">
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Course #{ride.id.substring(0, 8)}</CardTitle>
                <CardDescription>
                  {new Date(ride.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </CardDescription>
              </div>
              {getStatusBadge(ride.status)}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-800">Détails du trajet</h3>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium">Point de départ</p>
                    <p className="text-gray-600">{ride.pickup_address}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium">Destination</p>
                    <p className="text-gray-600">{ride.destination_address}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="font-medium">Heure de prise en charge</p>
                    <p className="text-gray-600">
                      {new Date(ride.pickup_time).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      {ride.pickup_time_type === 'scheduled' ? ' (programmée)' : ' (immédiate)'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="font-medium">Date de réservation</p>
                    <p className="text-gray-600">
                      {formatDistanceToNow(new Date(ride.created_at), { 
                        addSuffix: true,
                        locale: fr
                      })}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-gray-800">Détails du paiement</h3>
                
                <div className="flex items-center">
                  <Car className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="font-medium">Type de véhicule</p>
                    <p className="text-gray-600">
                      {ride.vehicle_type === 'standard' ? 'Standard' : 
                       ride.vehicle_type === 'premium' ? 'Premium' : 
                       ride.vehicle_type === 'electric' ? 'Électrique' : 
                       ride.vehicle_type}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="font-medium">Méthode de paiement</p>
                    <p className="text-gray-600">
                      {ride.payment_method === 'cash' ? 'Espèces' : 
                       ride.payment_method === 'card' ? 'Carte' : 
                       ride.payment_method === 'mobile_money' ? 'Mobile Money' : 
                       ride.payment_method}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="h-5 w-5 flex items-center justify-center text-gray-500 mr-3">
                    <span className="font-bold">FCFA </span>
                  </div>
                  <div>
                    <p className="font-medium">Prix estimé</p>
                    <p className="text-gray-600">{ride.estimated_price.toLocaleString('fr-FR')} XAF</p>
                  </div>
                </div>
                
                {ride.actual_price && (
                  <div className="flex items-center">
                    <div className="h-5 w-5 flex items-center justify-center text-primary mr-3">
                      <span className="font-bold">FCFA </span>
                    </div>
                    <div>
                      <p className="font-medium">Prix final</p>
                      <p className="text-gray-600">{ride.actual_price.toLocaleString('fr-FR')} XAF</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {driver && (
              <>
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-800">Détails du chauffeur</h3>
                  
                  <div className="flex items-center">
                    <div className="mr-4">
                      {driver.profile_picture ? (
                        <div className="h-12 w-12 rounded-full overflow-hidden">
                          <img 
                            src={driver.profile_picture} 
                            alt={driver.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <p className="font-medium">{driver.name}</p>
                      <div className="flex items-center text-gray-600">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span>{driver.average_rating.toFixed(1)}</span>
                        <span className="mx-2">•</span>
                        <span>{driver.vehicle_type}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="font-medium">Contact</p>
                      <p className="text-gray-600">{driver.phone}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between pt-2">
            {ride.status === 'completed' ? (
              <Button variant="outline" asChild>
                <Link to={`/taxi/rating/${ride.id}`}>
                  Évaluer cette course
                </Link>
              </Button>
            ) : ride.status === 'in_progress' ? (
              <Button asChild>
                <Link to={`/taxi/ride/${ride.id}`}>
                  Suivre en temps réel <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : ride.status === 'pending' || ride.status === 'accepted' ? (
              <Button asChild>
                <Link to={`/taxi/ride/${ride.id}`}>
                  Voir le statut <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link to="/taxis">
                  Réserver une nouvelle course
                </Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default TaxiRideDetails;
