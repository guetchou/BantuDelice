import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DeliveryRatingProps {
  orderId: string;
}

const DeliveryRating = ({ orderId }: DeliveryRatingProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Note requise",
        description: "Veuillez attribuer une note à la livraison",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          rating,
          rating_comment: comment
        })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Merci pour votre évaluation",
        description: "Votre avis nous aide à améliorer notre service",
      });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'évaluation:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de votre évaluation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Évaluer la livraison</h2>

      <div className="flex justify-center mb-6">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            onClick={() => setRating(value)}
            className="p-1"
          >
            <Star
              className={`w-8 h-8 ${
                value <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>

      <Textarea
        placeholder="Commentaire (optionnel)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="mb-4"
      />

      <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Envoi en cours..." : "Envoyer l'évaluation"}
      </Button>
    </Card>
  );
};

export default DeliveryRating;