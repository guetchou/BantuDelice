import { useState } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import type { DetailedRestaurantReview } from '@/types/restaurantReview';

interface RatingProps {
  orderId: string;
  restaurantId: string;
  onRatingSubmitted?: () => void;
}

export default function DeliveryRating({ orderId, restaurantId, onRatingSubmitted }: RatingProps) {
  const [ratings, setRatings] = useState({
    overall: 0,
    food_quality: 0,
    service: 0,
    delivery: 0,
    value: 0
  });
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleRatingChange = (type: keyof typeof ratings, value: number) => {
    setRatings(prev => ({ ...prev, [type]: value }));
  };

  const submitRating = async () => {
    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour laisser un avis",
          variant: "destructive",
        });
        return;
      }

      const reviewData: Partial<DetailedRestaurantReview> = {
        restaurant_id: restaurantId,
        user_id: user.id,
        order_id: orderId,
        overall_rating: ratings.overall,
        food_quality_rating: ratings.food_quality,
        service_rating: ratings.service,
        delivery_rating: ratings.delivery,
        value_rating: ratings.value,
        review_text: reviewText || null,
        verified_purchase: true
      };

      const { error } = await supabase
        .from('detailed_restaurant_reviews')
        .insert([reviewData]);

      if (error) throw error;

      toast({
        title: "Merci !",
        description: "Votre avis a été enregistré avec succès",
      });

      if (onRatingSubmitted) {
        onRatingSubmitted();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de votre avis",
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
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Évaluez votre expérience</h3>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Note globale</span>
            <RatingStars
              value={ratings.overall}
              onChange={(value) => handleRatingChange('overall', value)}
            />
          </div>

          <div className="flex justify-between items-center">
            <span>Qualité de la nourriture</span>
            <RatingStars
              value={ratings.food_quality}
              onChange={(value) => handleRatingChange('food_quality', value)}
            />
          </div>

          <div className="flex justify-between items-center">
            <span>Service</span>
            <RatingStars
              value={ratings.service}
              onChange={(value) => handleRatingChange('service', value)}
            />
          </div>

          <div className="flex justify-between items-center">
            <span>Livraison</span>
            <RatingStars
              value={ratings.delivery}
              onChange={(value) => handleRatingChange('delivery', value)}
            />
          </div>

          <div className="flex justify-between items-center">
            <span>Rapport qualité/prix</span>
            <RatingStars
              value={ratings.value}
              onChange={(value) => handleRatingChange('value', value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="review" className="block text-sm font-medium">
            Commentaire (optionnel)
          </label>
          <Textarea
            id="review"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Partagez votre expérience..."
            className="h-32"
          />
        </div>

        <Button
          onClick={submitRating}
          disabled={isSubmitting || !ratings.overall}
          className="w-full"
        >
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer mon avis'}
        </Button>
      </div>
    </Card>
  );
}
