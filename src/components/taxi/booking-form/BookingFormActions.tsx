
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronsRight, ChevronLeft, Loader2, Check } from 'lucide-react';

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
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex justify-between w-full">
      {!isFirstStep ? (
        <Button
          type="button"
          variant="outline"
          onClick={onPrevStep}
          disabled={loading}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      ) : (
        <div></div> // Empty div to maintain layout with flex justify-between
      )}

      {isLastStep ? (
        <Button
          type="button"
          onClick={onSubmit}
          disabled={loading || !canProceed}
          className="ml-auto"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Traitement en cours...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Confirmer la réservation
            </>
          )}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNextStep}
          disabled={loading || !canProceed}
          className="ml-auto"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Traitement en cours...
            </>
          ) : (
            <>
              Continuer
              <ChevronsRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default BookingFormActions;
