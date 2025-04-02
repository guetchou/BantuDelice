
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Loader2 } from "lucide-react";
import { useBookingForm } from './BookingFormContext';
import LocationSection from '../LocationSection';
import VehicleAndTimeSection from './VehicleAndTimeSection';
import DriverSelectionSection from './DriverSelectionSection';
import PaymentAndContactSection from './PaymentAndContactSection';
import { TaxiDriver } from '@/types/taxi';

interface BookingStepContentProps {
  currentStep: number;
  createdRideId: string | null;
  bookingSuccess: boolean;
  onLocationSelect: (address: string, isPickup: boolean, coordinates?: [number, number]) => void;
  onUseCurrentLocation: () => void;
  onSelectDriver: (driver: TaxiDriver) => void;
  nearbyDrivers?: TaxiDriver[];
}

const BookingStepContent: React.FC<BookingStepContentProps> = ({
  currentStep,
  createdRideId,
  bookingSuccess,
  onLocationSelect,
  onUseCurrentLocation,
  onSelectDriver,
  nearbyDrivers = []
}) => {
  const { formState, updateFormField } = useBookingForm();

  // If booking is successful, show success message
  if (bookingSuccess) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <AlertTitle className="text-green-700">Réservation confirmée</AlertTitle>
        <AlertDescription className="text-green-600">
          <div className="space-y-2">
            <p>Votre course a été réservée avec succès.</p>
            <p className="font-medium">Identifiant de course: {createdRideId}</p>
            <div className="flex justify-center mt-4">
              <div className="animate-spin h-5 w-5 border-2 border-primary border-opacity-50 border-t-primary rounded-full"></div>
            </div>
            <p className="text-center text-sm">Redirection vers le suivi de votre course...</p>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // Render appropriate step content
  return (
    <div>
      {currentStep === 0 && (
        <LocationSection
          pickupAddress={formState.pickupAddress}
          setPickupAddress={(address) => updateFormField('pickupAddress', address)}
          destinationAddress={formState.destinationAddress}
          setDestinationAddress={(address) => updateFormField('destinationAddress', address)}
          onLocationSelect={onLocationSelect}
          onUseCurrentLocation={onUseCurrentLocation}
        />
      )}

      {currentStep === 1 && (
        <VehicleAndTimeSection 
          vehicleType={formState.vehicleType}
          onVehicleTypeChange={(type) => updateFormField('vehicleType', type)}
          pickupTime={formState.pickupTime}
          onPickupTimeChange={(time) => updateFormField('pickupTime', time)}
          scheduledTime={formState.scheduledTime}
          onScheduledTimeChange={(time) => updateFormField('scheduledTime', time)}
          estimatedPrice={formState.estimatedPrice}
          estimatedDistance={formState.estimatedDistance}
          estimatedDuration={formState.estimatedDuration}
        />
      )}

      {currentStep === 2 && (
        <DriverSelectionSection 
          pickupLatitude={formState.pickupCoordinates ? formState.pickupCoordinates[1] : 0}
          pickupLongitude={formState.pickupCoordinates ? formState.pickupCoordinates[0] : 0}
          destinationLatitude={formState.destinationCoordinates ? formState.destinationCoordinates[1] : 0}
          destinationLongitude={formState.destinationCoordinates ? formState.destinationCoordinates[0] : 0}
          vehicleType={formState.vehicleType}
          onSelectDriver={onSelectDriver}
          selectedDriver={formState.selectedDriver}
          availableDrivers={nearbyDrivers}
        />
      )}

      {currentStep === 3 && (
        <PaymentAndContactSection 
          paymentMethod={formState.paymentMethod}
          onPaymentMethodChange={(method) => updateFormField('paymentMethod', method)}
          promoCode={formState.promoCode}
          onPromoCodeChange={(code) => updateFormField('promoCode', code)}
          contactName={formState.contactName}
          onContactNameChange={(name) => updateFormField('contactName', name)}
          contactPhone={formState.contactPhone}
          onContactPhoneChange={(phone) => updateFormField('contactPhone', phone)}
          specialInstructions={formState.specialInstructions}
          onSpecialInstructionsChange={(text) => updateFormField('specialInstructions', text)}
          estimatedPrice={formState.estimatedPrice}
        />
      )}
    </div>
  );
};

export default BookingStepContent;
