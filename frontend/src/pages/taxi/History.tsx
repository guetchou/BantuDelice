
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import TaxiHistoryView from '@/components/taxi/TaxiHistoryView';
import TaxiNavigationMenu from '@/components/taxi/TaxiNavigationMenu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      
      <TaxiNavigationMenu activeRoute="history" />
      
      <div className="max-w-3xl mx-auto mt-6">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="completed">Terminées</TabsTrigger>
              <TabsTrigger value="canceled">Annulées</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>Filtrer</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Date</span>
              </Button>
            </div>
          </div>
          
          <TabsContent value="all">
            <TaxiHistoryView filterStatus={null} />
          </TabsContent>
          
          <TabsContent value="completed">
            <TaxiHistoryView filterStatus="completed" />
          </TabsContent>
          
          <TabsContent value="canceled">
            <TaxiHistoryView filterStatus="cancelled" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TaxiHistoryPage;
