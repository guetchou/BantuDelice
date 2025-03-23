
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import TaxiHistoryView from '@/components/taxi/TaxiHistoryView';
import TaxiNavigationMenu from '@/components/taxi/TaxiNavigationMenu';

const TaxiHistoryPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate('/taxi')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Historique des courses</h1>
      </div>
      
      <TaxiNavigationMenu />
      
      <div className="max-w-3xl mx-auto">
        <TaxiHistoryView />
      </div>
    </div>
  );
};

export default TaxiHistoryPage;
