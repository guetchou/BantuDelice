
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, MessageSquare, Phone, Plus, Settings, UserPlus } from "lucide-react";

interface QuickActionsProps {
  onAddDriver: () => void;
  onSetupZones: () => void;
  onViewRequests: () => void;
}

const QuickActions = ({ onAddDriver, onSetupZones, onViewRequests }: QuickActionsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions rapides</CardTitle>
        <CardDescription>
          Accédez rapidement aux outils de gestion
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button 
          variant="outline" 
          className="justify-start" 
          onClick={onAddDriver}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Ajouter un livreur
        </Button>
        
        <Button 
          variant="outline" 
          className="justify-start"
          onClick={onSetupZones}
        >
          <MapPin className="mr-2 h-4 w-4" />
          Configurer les zones
        </Button>
        
        <Button 
          variant="outline" 
          className="justify-start"
          onClick={onViewRequests}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Voir les demandes en attente
        </Button>
        
        <Button 
          variant="outline" 
          className="justify-start"
        >
          <Settings className="mr-2 h-4 w-4" />
          Paramètres
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
