
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
            is_available: driverData.is_available,
            status: driverData.status,
            average_rating: driverData.average_rating,
            total_deliveries: driverData.total_deliveries,
            total_earnings: driverData.total_earnings,
            commission_rate: driverData.commission_rate,
            created_at: driverData.created_at,
            updated_at: driverData.updated_at,
            last_location_update: driverData.last_location_update
          });
        }
      } catch (error) {
        console.error('Error fetching driver data:', error);
      }
    };

    fetchDriverInfo();
  }, [driverId]);

  const handleSubmit = async () => {
    if (overallRating === 0) {
      toast({
        title: "Note requise",
        description: "Veuillez donner une note globale au livreur",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        toast({
          title: "Erreur d'authentification",
          description: "Vous devez être connecté pour évaluer un livreur",
          variant: "destructive"
        });
        return;
      }
      
      // Calculate the average rating (overall counts double)
      const finalRating = Math.round(
        (overallRating * 2 + speedRating + politenessRating) / 
        (2 + (speedRating > 0 ? 1 : 0) + (politenessRating > 0 ? 1 : 0))
      );

      const ratingData: Partial<DeliveryDriverRating> = {
        driver_id: driverId,
        user_id: userData.user.id,
        order_id: orderId,
        rating: finalRating,
        comment: comment || undefined
      };

      const { error } = await supabase
        .from('delivery_driver_ratings')
        .insert([ratingData]);

      if (error) throw error;

      // Update the driver's average rating
      await supabase.rpc('update_driver_rating', { 
        driver_id: driverId 
      }).catch(err => {
        console.error('Error updating driver rating:', err);
      });

      toast({
        title: "Merci pour votre évaluation",
        description: "Votre avis nous aide à améliorer notre service de livraison"
      });

      if (onRatingSubmitted) {
        onRatingSubmitted();
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre évaluation",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const RatingStars = ({ value, onChange }: { value: number; onChange: (value: number) => void }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="focus:outline-none"
        >
          <StarIcon
            className={`h-6 w-6 ${
              star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Évaluer votre livreur</CardTitle>
      </CardHeader>
      <CardContent>
        {driver && (
          <div className="flex items-center mb-4 p-3 bg-muted/20 rounded-lg">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              {driver.profile_picture ? (
                <img 
                  src={driver.profile_picture} 
                  alt={driver.name} 
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <span className="text-lg font-medium text-primary">
                  {driver.name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h4 className="font-medium">{driver.name}</h4>
              <p className="text-sm text-muted-foreground">Livreur</p>
            </div>
          </div>
        )}

        <div className="space-y-4 mt-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Note globale</span>
              <RatingStars 
                value={overallRating} 
                onChange={setOverallRating} 
              />
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Rapidité</span>
              <RatingStars 
                value={speedRating} 
                onChange={setSpeedRating} 
              />
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Courtoisie</span>
              <RatingStars 
                value={politenessRating} 
                onChange={setPolitenessRating} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="comment" className="block text-sm font-medium">
              Commentaire (optionnel)
            </label>
            <Textarea
              id="comment"
              placeholder="Partagez votre expérience de livraison..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="resize-none h-24"
            />
          </div>
          
          <Button 
            onClick={handleSubmit} 
            disabled={submitting || overallRating === 0}
            className="w-full"
          >
            {submitting ? "Envoi en cours..." : "Envoyer l'évaluation"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryDriverRating;
