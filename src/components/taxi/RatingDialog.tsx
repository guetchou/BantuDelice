
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Star, Car, Clock, MessageSquare, Shield } from "lucide-react";
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface RatingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rideId: string;
}

const RatingDialog = ({ open, onOpenChange, rideId }: RatingDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [ratings, setRatings] = useState({
    overall: 5,
    cleanliness: 5,
    punctuality: 5,
    driving_quality: 5,
    communication: 5
  });
  const { toast } = useToast();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('taxi_ratings')
        .insert({
          ride_id: rideId,
          rating: ratings.overall,
          cleanliness: ratings.cleanliness,
          punctuality: ratings.punctuality,
          driving_quality: ratings.driving_quality,
          communication: ratings.communication,
          comment: comment
        });

      if (error) throw error;

      toast({
        title: "Évaluation envoyée",
        description: "Merci pour votre retour !"
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'évaluation",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const RatingSection = ({ 
    title, 
    value, 
    onChange, 
    icon 
  }: { 
    title: string; 
    value: number; 
    onChange: (value: number) => void;
    icon: React.ReactNode;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2">
          {icon}
          {title}
        </Label>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-5 h-5 cursor-pointer ${
                star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              }`}
              onClick={() => onChange(star)}
            />
          ))}
        </div>
      </div>
      <Slider
        value={[value]}
        min={1}
        max={5}
        step={1}
        onValueChange={(values) => onChange(values[0])}
        className="w-full"
      />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Évaluer votre course</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <RatingSection
            title="Note globale"
            value={ratings.overall}
            onChange={(value) => setRatings(prev => ({ ...prev, overall: value }))}
            icon={<Star className="w-4 h-4" />}
          />

          <RatingSection
            title="Propreté du véhicule"
            value={ratings.cleanliness}
            onChange={(value) => setRatings(prev => ({ ...prev, cleanliness: value }))}
            icon={<Car className="w-4 h-4" />}
          />

          <RatingSection
            title="Ponctualité"
            value={ratings.punctuality}
            onChange={(value) => setRatings(prev => ({ ...prev, punctuality: value }))}
            icon={<Clock className="w-4 h-4" />}
          />

          <RatingSection
            title="Qualité de conduite"
            value={ratings.driving_quality}
            onChange={(value) => setRatings(prev => ({ ...prev, driving_quality: value }))}
            icon={<Shield className="w-4 h-4" />}
          />

          <RatingSection
            title="Communication"
            value={ratings.communication}
            onChange={(value) => setRatings(prev => ({ ...prev, communication: value }))}
            icon={<MessageSquare className="w-4 h-4" />}
          />

          <div className="space-y-2">
            <Label>Commentaire (optionnel)</Label>
            <Textarea
              placeholder="Partagez votre expérience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="h-24"
            />
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Envoi en cours..." : "Envoyer l'évaluation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingDialog;
