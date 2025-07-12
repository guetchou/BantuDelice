
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookingFormProvider } from './BookingFormContext';
import BookingStepContent from './BookingStepContent';
import BookingSummary from './BookingSummary';
import { useBookingFormHandler } from './useBookingFormHandler';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BookingFormLayout: React.FC = () => {
  const {
    currentStep,
    loading,
    createdRideId,
    selectedDriver,
    bookingSuccess,
    handleNextStep,
    handlePrevStep,
    handleLocationSelect,
    handleUseCurrentLocation,
    handleSelectDriver,
    handleSubmit,
    validateCurrentStep
  } = useBookingFormHandler();
  
  // Déterminer le libellé du bouton suivant
  const getNextButtonLabel = () => {
    if (currentStep === 4) return "Confirmer la réservation";
    return "Continuer";
  };
  
  // Définir les titres des étapes
  const stepTitles = [
    "Trajet",
    "Véhicule",
    "Détails",
    "Chauffeur"
  ];
  
  // Calculer la progression en pourcentage
  const progressPercentage = (currentStep / 4) * 100;
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Formulaire principal */}
      <div className="lg:col-span-2">
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex justify-between items-center">
              <span>{stepTitles[currentStep - 1]}</span>
              <span className="text-sm font-normal text-muted-foreground">
                Étape {currentStep} sur 4
              </span>
            </CardTitle>
            <Progress value={progressPercentage} className="h-2 mt-2" />
          </CardHeader>
          
          <CardContent>
            <BookingStepContent
              currentStep={currentStep}
              createdRideId={createdRideId}
              onLocationSelect={handleLocationSelect}
              onUseCurrentLocation={handleUseCurrentLocation}
              onSelectDriver={handleSelectDriver}
              bookingSuccess={bookingSuccess}
            />
          </CardContent>
          
          {!bookingSuccess && (
            <CardFooter className="flex justify-between pt-2">
              {currentStep > 1 ? (
                <Button 
                  onClick={handlePrevStep} 
                  variant="outline"
                  disabled={loading}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>
              ) : (
                <div></div> // Placeholder pour maintenir l'alignement flex
              )}
              
              {currentStep < 4 ? (
                <Button 
                  onClick={handleNextStep}
                  disabled={loading || !validateCurrentStep()}
                >
                  {getNextButtonLabel()}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={loading || !selectedDriver}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Confirmer la réservation
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </CardFooter>
          )}
        </Card>
      </div>
      
      {/* Résumé de la réservation */}
      <div className="lg:col-span-1">
        <BookingSummary 
          currentStep={currentStep}
          selectedDriver={selectedDriver}
        />
      </div>
    </div>
  );
};

// Composant parent avec le contexte
export const BookingForm: React.FC = () => {
  return (
    <BookingFormProvider>
      <BookingFormLayout />
    </BookingFormProvider>
  );
};

export default BookingForm;
