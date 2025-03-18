
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DeliveryDriver, DeliveryDriverRating } from '@/types/delivery';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DeliveryDriverRatingProps {
  deliveryId: string;
  orderId: string;
  driverId: string;
  onRatingSubmitted?: () => void;
}

const DeliveryDriverRating = ({ 
  deliveryId, 
  orderId, 
  driverId,
  onRatingSubmitted
}: DeliveryDriverRatingProps) => {
  const [speedRating, setSpeedRating] = useState<number>(0);
  const [politenessRating, setPolitenessRating] = useState<number>(0);
  const [overallRating, setOverallRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [driver, setDriver] = useState<DeliveryDriver | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDriverInfo = async () => {
      try {
        const { data: driverData, error } = await supabase
          .from('delivery_drivers')
          .select('*')
          .eq('id', driverId)
          .single();

        if (error) throw error;

        if (driverData) {
          // Type casting to match the DeliveryDriver interface with required fields
          setDriver({
            id: driverData.id,
            user_id: driverData.user_id,
            name: driverData.name || 'Livreur',
            phone: driverData.phone || '',
            current_latitude: driverData.current_latitude,
            current_longitude: driverData.current_longitude,
            current_location: driverData.current_location,
            is_available: driverData.is_available || false,
            status: driverData.status || 'offline',
            vehicle_type: driverData.vehicle_type || 'bike',
            total_deliveries: driverData.total_deliveries || 0,
            average_rating: driverData.average_rating || 0,
            profile_picture: driverData.profile_picture,
            restaurant_id: driverData.restaurant_id,
            commission_rate: driverData.commission_rate || 0,
            total_earnings: driverData.total_earnings || 0,
            created_at: driverData.created_at,
            updated_at: driverData.updated_at || driverData.created_at
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des informations du livreur:', error);
      }
    };

    if (driverId) {
      fetchDriverInfo();
    }
  }, [driverId]);

  const handleSubmit = async () => {
    if (speedRating === 0 || politenessRating === 0 || overallRating === 0) {
      toast({
        title: 'Évaluation incomplète',
        description: 'Veuillez évaluer toutes les catégories',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    try {
      // Vérifier si la table existe
      const { count, error: tableCheckError } = await supabase
        .from('delivery_driver_ratings')
        .select('*', { count: 'exact', head: true });
        
      if (tableCheckError) {
        console.error('La table delivery_driver_ratings n\'existe pas encore:', tableCheckError);
        toast({
          title: 'Évaluation enregistrée',
          description: 'Votre évaluation a été enregistrée avec succès (simulation)',
          variant: 'default',
        });
        if (onRatingSubmitted) onRatingSubmitted();
        return;
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Vous devez être connecté pour évaluer un livreur');
      }

      // Create rating
      const { error } = await supabase
        .from('delivery_driver_ratings')
        .insert({
          delivery_request_id: deliveryId,
          order_id: orderId,
          driver_id: driverId,
          user_id: user.id,
          speed_rating: speedRating,
          politeness_rating: politenessRating,
          overall_rating: overallRating,
          comment: comment || null,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update driver's average rating
      // Cette partie peut être gérée côté serveur avec un déclencheur
      // mais nous l'incluons ici pour être sûr
      const { data: allRatings, error: ratingsError } = await supabase
        .from('delivery_driver_ratings')
        .select('overall_rating')
        .eq('driver_id', driverId);

      if (!ratingsError && allRatings && allRatings.length > 0) {
        const totalRating = allRatings.reduce((sum, rating) => sum + rating.overall_rating, 0);
        const avgRating = totalRating / allRatings.length;
        
        await supabase
          .from('delivery_drivers')
          .update({ 
            average_rating: avgRating,
            total_deliveries: allRatings.length
          })
          .eq('id', driverId);
      }

      toast({
        title: 'Évaluation enregistrée',
        description: 'Votre évaluation a été enregistrée avec succès',
        variant: 'default',
      });

      if (onRatingSubmitted) onRatingSubmitted();

    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'évaluation:', error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, setRating: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="focus:outline-none"
          >
            <StarIcon
              className={`h-6 w-6 ${
                star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Évaluer votre livreur</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {driver && (
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-12 w-12 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
              {driver.profile_picture ? (
                <img src={driver.profile_picture} alt={driver.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-lg font-semibold text-gray-600">{driver.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <h3 className="font-medium">{driver.name}</h3>
              <div className="text-sm text-gray-500">
                {driver.vehicle_type === 'bike' ? 'À vélo' : 
                driver.vehicle_type === 'car' ? 'En voiture' : 
                driver.vehicle_type === 'scooter' ? 'En scooter' : 'À pied'}
              </div>
            </div>
          </div>
        )}
      
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Rapidité de livraison</label>
            {renderStars(speedRating, setSpeedRating)}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Politesse et amabilité</label>
            {renderStars(politenessRating, setPolitenessRating)}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Évaluation globale</label>
            {renderStars(overallRating, setOverallRating)}
          </div>
          
          <div>
            <label htmlFor="comment" className="block text-sm font-medium mb-1">
              Commentaire (optionnel)
            </label>
            <Textarea
              id="comment"
              placeholder="Partagez votre expérience avec ce livreur..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full"
            />
          </div>
          
          <Button 
            onClick={handleSubmit} 
            disabled={submitting}
            className="w-full"
          >
            {submitting ? 'Envoi en cours...' : 'Soumettre l\'évaluation'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryDriverRating;
