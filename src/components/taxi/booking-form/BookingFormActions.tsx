
import React from 'react';
import { Button } from "@/components/ui/button";

interface BookingFormActionsProps {
  currentStep: number;
  totalSteps: number;
  loading: boolean;
  canProceed: boolean;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSubmit: () => void;
}

const BookingFormActions: React.FC<BookingFormActionsProps> = ({
  currentStep,
  totalSteps,
  loading,
  canProceed,
  onPrevStep,
  onNextStep,
  onSubmit
}) => {
  return (
    <div className="flex justify-between border-t pt-6">
      {currentStep > 1 && (
        <Button
          variant="outline"
          onClick={onPrevStep}
          disabled={loading}
        >
          Retour
        </Button>
      )}
      
      {currentStep < totalSteps ? (
        <Button
          onClick={onNextStep}
          disabled={!canProceed || loading}
          className={currentStep === 1 ? "w-full" : ""}
        >
          {loading ? "Chargement..." : "Continuer"}
        </Button>
      ) : (
        <Button
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? "Chargement..." : "Confirmer la réservation"}
        </Button>
      )}
    </div>
  );
};

export default BookingFormActions;
