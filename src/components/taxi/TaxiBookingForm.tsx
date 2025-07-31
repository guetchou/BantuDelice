
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Car } from "lucide-react";
import StepIndicator from './StepIndicator';
import { BookingFormProvider } from './booking-form/BookingFormContext';
import BookingFormActions from './booking-form/BookingFormActions';
import BookingStepContent from './booking-form/BookingStepContent';
import { useBookingFormHandler } from './booking-form/useBookingFormHandler';

export default function TaxiBookingForm() {
  const {
    currentStep,
    loading,
    createdRideId,
    bookingSuccess,
    handleNextStep,
    handlePrevStep,
    handleLocationSelect,
    handleUseCurrentLocation,
    handleSelectDriver,
    handleSubmit,
    validateCurrentStep
  } = useBookingFormHandler();

  return (
    <BookingFormProvider>
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-primary" />
            Réservation de taxi
          </CardTitle>
          <CardDescription>
            Remplissez le formulaire ci-dessous pour réserver votre course
          </CardDescription>
          
          {!bookingSuccess && (
            <StepIndicator currentStep={currentStep} totalSteps={4} />
          )}
        </CardHeader>
        
        <CardContent>
          <BookingStepContent
            currentStep={currentStep}
            createdRideId={createdRideId}
            bookingSuccess={bookingSuccess}
            onLocationSelect={handleLocationSelect}
            onUseCurrentLocation={handleUseCurrentLocation}
            onSelectDriver={handleSelectDriver}
          />
        </CardContent>
        
        {!bookingSuccess && (
          <CardFooter>
            <BookingFormActions
              currentStep={currentStep}
              totalSteps={4}
              loading={loading}
              canProceed={validateCurrentStep()}
              onPrevStep={handlePrevStep}
              onNextStep={handleNextStep}
              onSubmit={handleSubmit}
            />
          </CardFooter>
        )}
      </Card>
    </BookingFormProvider>
  );
}
