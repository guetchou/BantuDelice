import React from 'react';
import TaxiBookingForm from '@/components/taxi/TaxiBookingForm';

const TaxiBookingPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Réserver un taxi</h1>
      <TaxiBookingForm />
    </div>
  );
};

export default TaxiBookingPage;