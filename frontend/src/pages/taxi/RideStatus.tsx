import React from 'react';
import TaxiRideStatus from '@/components/taxi/TaxiRideStatus';

const RideStatusPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Suivi de votre course</h1>
      <TaxiRideStatus />
    </div>
  );
};

export default RideStatusPage;