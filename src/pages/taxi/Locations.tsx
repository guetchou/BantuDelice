
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SavedLocations from '@/components/taxi/SavedLocations';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const TaxiLocationsPage = () => {
  const navigate = useNavigate();
  
  const handleSelectLocation = (address: string) => {
    toast.success("Adresse sélectionnée");
    navigate(`/taxi/booking?address=${encodeURIComponent(address)}`);
  };
  
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
        <h1 className="text-3xl font-bold">Mes emplacements</h1>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <SavedLocations onSelectLocation={handleSelectLocation} />
      </div>
    </div>
  );
};

export default TaxiLocationsPage;
