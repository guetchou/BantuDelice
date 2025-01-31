import React from 'react';
import TaxiBookingForm from '@/components/taxi/TaxiBookingForm';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertOctagon } from "lucide-react";

const TaxiBookingPage = () => {
  return (
    <div className="container mx-auto py-8">
      <Alert variant="destructive" className="mb-6">
        <AlertOctagon className="h-4 w-4" />
        <AlertDescription>
          La réservation de taxi n'est pas encore prête pour la production
        </AlertDescription>
      </Alert>
      
      <h1 className="text-3xl font-bold text-center mb-8">Réserver un taxi</h1>
      <TaxiBookingForm />
    </div>
  );
};

export default TaxiBookingPage;