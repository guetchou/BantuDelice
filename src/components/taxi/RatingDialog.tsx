import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RatingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  rideId: string;
}

export default function RatingDialog({ isOpen, onClose, rideId }: RatingDialogProps) {
  const [rating, setRating] = useState(5);
  const [cleanliness, setCleanliness] = useState(5);
  const [punctuality, setPunctuality] = useState(5);
  const [drivingQuality, setDrivingQuality] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [comment, setComment] = useState("");
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      console.log('Submitting rating:', { rideId, rating, cleanliness, punctuality, drivingQuality, communication, comment });
      
      const { error } = await supabase
        .from('taxi_ratings')
        .insert({
          ride_id: rideId,
          rating,
          cleanliness,
          punctuality,
          driving_quality: drivingQuality,
          communication,
          comment
        });

      if (error) throw error;

      toast({
        title: "Note soumise avec succès",
        description: "Merci pour votre évaluation !",
      });

      onClose();
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: "Erreur",
        description: "Impossible de soumettre la note",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Noter votre course</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Note globale ({rating}/10)</Label>
            <Slider
              value={[rating]}
              onValueChange={(value) => setRating(value[0])}
              max={10}
              step={1}
            />
          </div>
          <div className="space-y-2">
            <Label>Propreté ({cleanliness}/10)</Label>
            <Slider
              value={[cleanliness]}
              onValueChange={(value) => setCleanliness(value[0])}
              max={10}
              step={1}
            />
          </div>
          <div className="space-y-2">
            <Label>Ponctualité ({punctuality}/10)</Label>
            <Slider
              value={[punctuality]}
              onValueChange={(value) => setPunctuality(value[0])}
              max={10}
              step={1}
            />
          </div>
          <div className="space-y-2">
            <Label>Qualité de conduite ({drivingQuality}/10)</Label>
            <Slider
              value={[drivingQuality]}
              onValueChange={(value) => setDrivingQuality(value[0])}
              max={10}
              step={1}
            />
          </div>
          <div className="space-y-2">
            <Label>Communication ({communication}/10)</Label>
            <Slider
              value={[communication]}
              onValueChange={(value) => setCommunication(value[0])}
              max={10}
              step={1}
            />
          </div>
          <div className="space-y-2">
            <Label>Commentaire</Label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Laissez un commentaire..."
            />
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={handleSubmit}>Soumettre</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}