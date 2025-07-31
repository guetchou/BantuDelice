
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

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
          variant="outline" 
          onClick={onPrevStep}
          disabled={loading}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      ) : (
        <div></div> // Placeholder pour l'alignement
      )}

      {!isLastStep ? (
        <Button 
          onClick={onNextStep}
          disabled={loading || !canProceed}
          className="bg-primary hover:bg-primary/90"
        >
          Suivant
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <Button 
          onClick={onSubmit}
          disabled={loading || !canProceed}
          className="bg-green-600 hover:bg-green-700"
        >
          {loading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Traitement...
            </>
          ) : (
            <>
              Confirmer
              <Check className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default BookingFormActions;
