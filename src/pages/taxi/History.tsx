
import React from 'react';
import { Card } from "@/components/ui/card";
import TaxiHistoryView from '@/components/taxi/TaxiHistoryView';

const TaxiHistoryPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Historique des courses</h1>
      <div className="max-w-3xl mx-auto">
        <TaxiHistoryView />
      </div>
    </div>
  );
};

export default TaxiHistoryPage;
