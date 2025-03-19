
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { TaxiRide, TaxiDriver } from '@/types/taxi';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Clock, 
  Car, 
  User, 
  Phone, 
  CreditCard, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/Layout';

const TaxiRideDetails = () => {
  const { rideId } = useParams<{ rideId: string }>();
  const [ride, setRide] = useState<TaxiRide | null>(null);
  const [driver, setDriver] = useState<TaxiDriver | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRideDetails = async () => {
      if (!rideId) {
        setError('Identifiant de course invalide');
        setLoading(false);
        return;
      }

      try {
        const { data: rideData, error: rideError } = await supabase
          .from('taxi_rides')
          .select('*')
          .eq('id', rideId)
          .single();

        if (rideError) {
          throw rideError;
        }

        setRide(rideData as TaxiRide);

        // Fetch driver info if available
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
      } catch (err) {
        console.error('Error fetching ride details:', err);
        setError('Erreur lors du chargement des détails de la course');
      } finally {
        setLoading(false);
      }
    };

    fetchRideDetails();
  }, [rideId]);

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'accepted': return 'Acceptée';
      case 'en_route': return 'En route';
      case 'arrived': return 'Arrivée';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
      default: return 'Statut inconnu';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'en_route': return 'bg-blue-100 text-blue-800';
      case 'arrived': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const cancelRide = async () => {
    if (!ride) return;

    try {
      const { error } = await supabase
        .from('taxi_rides')
        .update({ status: 'cancelled' })
        .eq('id', ride.id);

      if (error) throw error;

      setRide({ ...ride, status: 'cancelled' } as TaxiRide);
      toast.success('Votre course a été annulée');
    } catch (err) {
      console.error('Error cancelling ride:', err);
      toast.error('Erreur lors de l\'annulation de la course');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (error || !ride) {
    return (
      <Layout>
        <Card className="max-w-3xl mx-auto mt-8">
          <CardHeader>
            <CardTitle className="text-red-500 flex items-center">
              <AlertCircle className="mr-2" /> Erreur
            </CardTitle>
            <CardDescription>
              {error || "Impossible de trouver les détails de cette course"}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link to="/taxis">Retour à la réservation</Link>
            </Button>
          </CardFooter>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-8 px-4">
        <Link to="/taxis" className="inline-flex items-center text-primary mb-6 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-2" /> Retour aux réservations
        </Link>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Détails de la course</CardTitle>
                <CardDescription>
                  Réservée le {formatDate(ride.created_at)}
                </CardDescription>
              </div>
              <Badge className={getStatusColor(ride.status)}>
                {getStatusText(ride.status)}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm">Point de départ</h3>
                    <p>{ride.pickup_address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm">Destination</h3>
                    <p>{ride.destination_address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm">Heure de prise en charge</h3>
                    <p>{formatDate(ride.pickup_time)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Car className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm">Type de véhicule</h3>
                    <p className="capitalize">{ride.vehicle_type}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CreditCard className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm">Paiement</h3>
                    <p>
                      {ride.payment_method === 'card' ? 'Carte bancaire' : 
                        ride.payment_method === 'cash' ? 'Espèces' : 'Mobile money'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CreditCard className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm">Prix</h3>
                    <p>{ride.estimated_price} FCFA{ride.actual_price ? ` (Final: ${ride.actual_price} FCFA)` : ''}</p>
                  </div>
                </div>
              </div>
            </div>

            {ride.special_instructions && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Instructions spéciales</h3>
                <p className="text-gray-700">{ride.special_instructions}</p>
              </div>
            )}

            {driver && (
              <div className="bg-primary/5 p-4 rounded-md">
                <h3 className="font-medium mb-3">Détails du chauffeur</h3>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                      {driver.photo_url ? (
                        <img src={driver.photo_url} alt={driver.name} className="h-12 w-12 rounded-full object-cover" />
                      ) : (
                        <User className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{driver.name}</p>
                      <p className="text-sm text-gray-500">{driver.vehicle_model} - {driver.license_plate}</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open(`tel:${driver.phone}`)}
                    className="flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    Appeler
                  </Button>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between border-t pt-6">
            <Button asChild variant="outline">
              <Link to={`/taxi/ride/${ride.id}`}>
                Suivre en temps réel
              </Link>
            </Button>
            
            {ride.status === 'pending' && (
              <Button 
                variant="destructive" 
                onClick={cancelRide}
              >
                Annuler la course
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default TaxiRideDetails;
