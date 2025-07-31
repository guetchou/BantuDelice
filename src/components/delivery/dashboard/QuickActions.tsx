
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Route, MessageSquare, Settings } from 'lucide-react';

interface QuickActionsProps {
  onOptimizationClick: () => void;
}

const QuickActions = ({ onOptimizationClick }: QuickActionsProps) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Actions rapides</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="flex flex-col h-24 items-center justify-center"
            onClick={onOptimizationClick}
          >
            <Route className="h-8 w-8 mb-2" />
            <span>Optimisation</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col h-24 items-center justify-center"
            onClick={() => window.location.href = '/delivery/messages'}
          >
            <MessageSquare className="h-8 w-8 mb-2" />
            <span>Messages</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col h-24 items-center justify-center"
            onClick={() => window.location.href = '/settings'}
          >
            <Settings className="h-8 w-8 mb-2" />
            <span>Paramètres</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col h-24 items-center justify-center"
            onClick={() => navigator.geolocation.getCurrentPosition(
              position => alert(`Position: ${position.coords.latitude}, ${position.coords.longitude}`),
              error => alert(`Erreur: ${error.message}`)
            )}
          >
            <MapPin className="h-8 w-8 mb-2" />
            <span>Position</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
