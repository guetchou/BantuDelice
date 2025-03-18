
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Truck, Clock, ThumbsUp } from 'lucide-react';
import type { DeliveryDriver, DeliveryRequest } from '@/types/delivery';

interface DeliveryDriverRatingProps {
  deliveryId: string;
  orderId: string;
  driverId: string;
  onRatingSubmitted?: () => void;
}

const DeliveryDriverRating = ({ deliveryId, orderId, driverId, onRatingSubmitted }: DeliveryDriverRatingProps) => {
  const [ratings, setRatings] = useState({
    speed: 0,
    politeness: 0, 
    overall: 0
  });
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [driverInfo, setDriverInfo] = useState<DeliveryDriver | null>(null);
  const { toast } = useToast();

  // Récupérer les infos du livreur
  useState(() => {
    const fetchDriverInfo = async () => {
      if (!driverId) return;
      
      const { data, error } = await supabase
        .from('delivery_drivers')
        .select('*')
        .eq('id', driverId)
        .single();
        
      if (error) {
        console.error('Erreur lors de la récupération des infos du livreur:', error);
        return;
      }
      
      setDriverInfo(data);
    };
    
    fetchDriverInfo();
  }, [driverId]);

  const handleRatingChange = (type: keyof typeof ratings, value: number) => {
    setRatings(prev => ({ ...prev, [type]: value }));
  };

  const submitRating = async () => {
    try {
      if (ratings.overall === 0) {
        toast({
          title: "Note requise",
          description: "Veuillez attribuer une note globale",
          variant: "destructive",
        });
        return;
      }
      
      setIsSubmitting(true);
      
      // Récupérer l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour noter un livreur",
          variant: "destructive",
        });
        return;
      }

      // Enregistrer la notation
      const { error } = await supabase
        .from('delivery_driver_ratings')
        .insert([
          {
            delivery_request_id: deliveryId,
            order_id: orderId,
            driver_id: driverId,
            user_id: user.id,
            speed_rating: ratings.speed,
            politeness_rating: ratings.politeness,
            overall_rating: ratings.overall,
            comment: comment || null
          }
        ]);

      if (error) throw error;

      // Mettre à jour la note moyenne du livreur
      if (driverInfo) {
        const newTotalDeliveries = driverInfo.total_deliveries + 1;
        const newAverageRating = 
          ((driverInfo.average_rating * driverInfo.total_deliveries) + ratings.overall) / 
          newTotalDeliveries;
          
        await supabase
          .from('delivery_drivers')
          .update({ 
            average_rating: newAverageRating,
            total_deliveries: newTotalDeliveries
          })
          .eq('id', driverId);
      }

      toast({
        title: "Merci pour votre avis !",
        description: "Votre notation a été enregistrée avec succès",
      });

      if (onRatingSubmitted) {
        onRatingSubmitted();
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notation:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre notation",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
          <Star
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
      <CardHeader>
        <CardTitle>Évaluer votre livreur</CardTitle>
        <CardDescription>
          Aidez-nous à améliorer notre service de livraison en notant votre expérience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <span>Rapidité de livraison</span>
            </div>
            <RatingStars
              value={ratings.speed}
              onChange={(value) => handleRatingChange('speed', value)}
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-5 w-5 text-green-500" />
              <span>Politesse et professionnalisme</span>
            </div>
            <RatingStars
              value={ratings.politeness}
              onChange={(value) => handleRatingChange('politeness', value)}
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span>Note globale</span>
            </div>
            <RatingStars
              value={ratings.overall}
              onChange={(value) => handleRatingChange('overall', value)}
            />
          </div>

          <div className="pt-4">
            <label className="block text-sm font-medium mb-2">
              Commentaire (optionnel)
            </label>
            <Textarea
              placeholder="Partagez votre expérience avec ce livreur..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={submitRating} 
          disabled={isSubmitting || ratings.overall === 0}
          className="w-full"
        >
          {isSubmitting ? 'Envoi en cours...' : 'Soumettre mon évaluation'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DeliveryDriverRating;
