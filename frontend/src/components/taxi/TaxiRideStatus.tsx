
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Ban, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRideStatus } from '@/hooks/taxi/useRideStatus';

// Import sub-components
import { StatusHeader } from './ride-status/StatusHeader';
import { ProgressBar } from './ride-status/ProgressBar';
import { LocationInfo } from './ride-status/LocationInfo';
import { DriverInfo } from './ride-status/DriverInfo';
import { RideDetails } from './ride-status/RideDetails';
import { RatingForm } from './ride-status/RatingForm';
import { FooterActions } from './ride-status/FooterActions';

export default function TaxiRideStatus() {
  const { rideId } = useParams<{ rideId: string }>();
  
  const {
    loading,
    error,
    ride,
    driver,
    isCancelling,
    isRatingSubmitting,
    isRatingOpen,
    openRating,
    closeRating,
    cancelRide,
    submitRating,
    refreshRide,
    contactDriver
  } = useRideStatus(rideId);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshRide();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  if (error) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Ban className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-semibold">Erreur de chargement</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={refreshRide}>Réessayer</Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (loading && !ride) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Chargement des détails de la course...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!ride) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Ban className="h-12 w-12 text-yellow-500 mx-auto" />
            <h2 className="text-xl font-semibold">Course introuvable</h2>
            <p className="text-muted-foreground">Impossible de trouver les détails de cette course</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="pb-2">
        <StatusHeader rideId={ride.id} status={ride.status} />
        <p className="text-sm text-muted-foreground">
          #{ride.id.substring(0, 8)}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-4">
        <ProgressBar status={ride.status} />
        <LocationInfo ride={ride} />
        <Separator />
        
        {driver && ride.status !== 'pending' && ride.status !== 'cancelled' && (
          <DriverInfo 
            driver={driver} 
            onContactDriver={contactDriver} 
          />
        )}
        
        <RideDetails ride={ride} />
        
        {ride.special_instructions && (
          <div className="bg-primary/5 p-3 rounded-md border border-primary/10 text-sm">
            <p className="font-medium mb-1">Instructions spéciales:</p>
            <p>{ride.special_instructions}</p>
          </div>
        )}
        
        {ride.status === 'completed' && isRatingOpen && (
          <RatingForm 
            onSubmit={submitRating}
            onCancel={closeRating}
            isSubmitting={isRatingSubmitting}
          />
        )}
      </CardContent>
      
      <CardFooter>
        <FooterActions 
          status={ride.status}
          paymentStatus={ride.payment_status}
          onCancelRide={cancelRide}
          onOpenRating={openRating}
          isCancelling={isCancelling}
        />
      </CardFooter>
    </Card>
  );
}
