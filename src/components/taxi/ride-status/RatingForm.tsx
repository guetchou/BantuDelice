
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

interface RatingFormProps {
  onSubmit: (rating: number, comment: string) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const RatingForm = ({ onSubmit, onCancel, isSubmitting }: RatingFormProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(rating, comment);
  };

  return (
    <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
      <h4 className="font-medium mb-4">Évaluez votre course</h4>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Votre note</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  className={`h-6 w-6 ${
                    (hoveredRating || rating) >= star
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">Commentaire (optionnel)</p>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Partagez votre expérience..."
            className="min-h-[80px]"
          />
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={rating === 0 || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Envoi...' : 'Soumettre'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
};
