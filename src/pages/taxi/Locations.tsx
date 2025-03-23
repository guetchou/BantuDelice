
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SavedLocations from '@/components/taxi/SavedLocations';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import TaxiNavigationMenu from '@/components/taxi/TaxiNavigationMenu';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TaxiLocationsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
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
      
      <TaxiNavigationMenu activeRoute="locations" />
      
      <div className="max-w-3xl mx-auto mt-6">
        <div className="flex items-center mb-6 gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Rechercher un emplacement..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="home">Domicile</TabsTrigger>
            <TabsTrigger value="work">Travail</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <SavedLocations 
              onSelectLocation={handleSelectLocation} 
              filter={searchTerm}
              locationType="all"
            />
          </TabsContent>
          
          <TabsContent value="home">
            <SavedLocations 
              onSelectLocation={handleSelectLocation} 
              filter={searchTerm}
              locationType="home"
            />
          </TabsContent>
          
          <TabsContent value="work">
            <SavedLocations 
              onSelectLocation={handleSelectLocation} 
              filter={searchTerm}
              locationType="work"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TaxiLocationsPage;
