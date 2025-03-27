
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { Label } from "@/components/ui/label";

interface RatingFormProps {
  onSubmit: (rating: number, comment: string) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const RatingForm: React.FC<RatingFormProps> = ({ onSubmit, onCancel, isSubmitting }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    onSubmit(rating, comment);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Évaluer votre course</h3>
      
      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="focus:outline-none"
          >
            <Star
              className={`h-8 w-8 ${
                rating >= star ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="comment">Commentaire (optionnel)</Label>
        <Textarea
          id="comment"
          placeholder="Partagez votre expérience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button
          className="flex-1"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <span className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"></span>
              Envoi...
            </span>
          ) : (
            "Envoyer"
          )}
        </Button>
      </div>
    </div>
  );
};
