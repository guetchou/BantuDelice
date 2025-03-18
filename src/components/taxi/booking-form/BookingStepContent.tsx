
import React from 'react';
import LocationSection from '../LocationSection';
import RideSharing from '../RideSharing';
import NearbyDrivers from '../NearbyDrivers';
import PriceEstimation from '../PriceEstimation';
import EnhancedVehicleSection from '../EnhancedVehicleSection';
import EnhancedPickupTimeSection from '../EnhancedPickupTimeSection';
import EnhancedPaymentSection from '../EnhancedPaymentSection';
import BookingExtras from '../BookingExtras';
import { Separator } from "@/components/ui/separator";
import { useBookingForm } from './BookingFormContext';

interface BookingStepContentProps {
  currentStep: number;
  createdRideId: string | null;
  onLocationSelect: (address: string, isPickup: boolean) => void;
  onUseCurrentLocation: () => void;
  onSelectDriver: (driver: any) => void;
}

const BookingStepContent: React.FC<BookingStepContentProps> = ({
  currentStep,
  createdRideId,
  onLocationSelect,
  onUseCurrentLocation,
  onSelectDriver
}) => {
  const { 
    formState, 
    estimatedPrice, 
    updateFormState, 
    handleSharingEnabled,
    getDistanceEstimate
  } = useBookingForm();

  // Render different content based on current step
  switch (currentStep) {
    case 1: // Location
      return (
        <LocationSection
          pickupAddress={formState.pickupAddress}
          setPickupAddress={(val) => updateFormState({ pickupAddress: val })}
          destinationAddress={formState.destinationAddress}
          setDestinationAddress={(val) => updateFormState({ destinationAddress: val })}
          onLocationSelect={onLocationSelect}
          onUseCurrentLocation={onUseCurrentLocation}
        />
      );
    case 2: // Vehicle Selection
      return (
        <div className="space-y-6">
          <EnhancedVehicleSection
            selectedVehicleType={formState.vehicleType}
            onVehicleSelect={(val) => updateFormState({ vehicleType: val })}
          />
          
          <Separator />
          
          <RideSharing
            rideId={createdRideId}
            onSharingEnabled={handleSharingEnabled}
            initialPrice={estimatedPrice}
          />
          
          {formState.pickupLatitude && formState.destinationLatitude && (
            <PriceEstimation 
              estimatedPrice={estimatedPrice} 
              distance={getDistanceEstimate() || undefined}
            />
          )}
        </div>
      );
    case 3: // Time and Payment
      return (
        <div className="space-y-6">
          <EnhancedPickupTimeSection
            pickupTime={formState.pickupTime}
            scheduledTime={formState.scheduledTime}
            onPickupTimeChange={(val) => updateFormState({ pickupTime: val })}
            onScheduledTimeChange={(val) => updateFormState({ scheduledTime: val })}
          />
          
          <Separator />
          
          <EnhancedPaymentSection
            paymentMethod={formState.paymentMethod}
            onPaymentMethodChange={(val) => updateFormState({ paymentMethod: val })}
            estimatedPrice={estimatedPrice}
          />
          
          <BookingExtras
            specialInstructions={formState.specialInstructions}
            promoCode={formState.promoCode}
            onSpecialInstructionsChange={(val) => updateFormState({ specialInstructions: val })}
            onPromoCodeChange={(val) => updateFormState({ promoCode: val })}
            onApplyPromoCode={() => {
              if (formState.promoCode) {
                // Implementation for promo code validation would go here
              }
            }}
          />
        </div>
      );
    case 4: // Driver Selection
      return createdRideId ? (
        <div className="space-y-6">
          <NearbyDrivers
            pickupLatitude={formState.pickupLatitude!}
            pickupLongitude={formState.pickupLongitude!}
            destinationLatitude={formState.destinationLatitude!}
            destinationLongitude={formState.destinationLongitude!}
            vehicleType={formState.vehicleType}
            onSelectDriver={onSelectDriver}
            rideId={createdRideId}
          />
          
          <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
            <p className="text-sm text-blue-700">
              Si vous ne sélectionnez pas de chauffeur, le système en attribuera un automatiquement.
            </p>
          </div>
        </div>
      ) : (
        <div>Une erreur est survenue lors de la création de la course.</div>
      );
    default:
      return null;
  }
};

export default BookingStepContent;
