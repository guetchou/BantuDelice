
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockData } from '@/utils/mockData';

interface DeliveryDriver {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  current_latitude: number;
  current_longitude: number;
  is_available: boolean;
  status: string;
  average_rating: number;
  total_deliveries: number;
  total_earnings: number;
  commission_rate: number;
  created_at: string;
  updated_at: string;
  last_location_update: string;
}

interface DeliveryDriverRatingData {
  id?: string;
  driver_id: string;
  user_id: string;
  order_id: string;
  rating: number;
  comment?: string;
  created_at?: string;
}

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
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Find driver in mock data
        const foundDriver = mockData.delivery_drivers.find(
          d => d.id === driverId
        ) as DeliveryDriver;
        
        if (foundDriver) {
          setDriver(foundDriver);
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
      // Calculate the average rating (overall counts double)
      const finalRating = Math.round(
        (overallRating * 2 + speedRating + politenessRating) / 
        (2 + (speedRating > 0 ? 1 : 0) + (politenessRating > 0 ? 1 : 0))
      );

      // Mock saving the rating
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log('Rating submitted:', {
        driver_id: driverId,
        user_id: mockData.auth.user.id,
        order_id: orderId,
        rating: finalRating,
        comment
      });

      toast({
        title: "Merci pour votre évaluation",
        description: "Votre note a été enregistrée avec succès"
      });

      if (onRatingSubmitted) {
        onRatingSubmitted();
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre évaluation",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!driver) {
    return <div>Chargement des informations du chauffeur...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Évaluer votre livreur</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <p className="text-lg font-medium">{driver.name}</p>
          <p className="text-sm text-gray-500">Livraison #{orderId.substring(0, 8)}</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <p className="font-medium">Note globale</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={`overall-${rating}`}
                  type="button"
                  onClick={() => setOverallRating(rating)}
                  className="focus:outline-none"
                >
                  <StarIcon
                    className={`h-8 w-8 ${
                      rating <= overallRating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-medium">Rapidité</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={`speed-${rating}`}
                  type="button"
                  onClick={() => setSpeedRating(rating)}
                  className="focus:outline-none"
                >
                  <StarIcon
                    className={`h-8 w-8 ${
                      rating <= speedRating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-medium">Politesse</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={`politeness-${rating}`}
                  type="button"
                  onClick={() => setPolitenessRating(rating)}
                  className="focus:outline-none"
                >
                  <StarIcon
                    className={`h-8 w-8 ${
                      rating <= politenessRating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="comment" className="font-medium">
              Commentaire (optionnel)
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partagez votre expérience avec ce livreur..."
              className="h-24"
            />
          </div>

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={submitting || overallRating === 0}
          >
            {submitting ? "Envoi en cours..." : "Soumettre l'évaluation"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryDriverRating;
