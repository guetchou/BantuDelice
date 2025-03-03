
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Car } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export default function Taxi() {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Réservation de Taxi</h1>
      
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-6 w-6 text-primary" />
              Réservez votre taxi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Adresse de prise en charge</label>
                  <div className="flex items-center border rounded-md p-3 bg-muted/50">
                    <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                    <input 
                      type="text" 
                      placeholder="Votre localisation" 
                      className="bg-transparent w-full outline-none"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Destination</label>
                  <div className="flex items-center border rounded-md p-3 bg-muted/50">
                    <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                    <input 
                      type="text" 
                      placeholder="Votre destination" 
                      className="bg-transparent w-full outline-none"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Date et heure</label>
                  <div className="flex items-center border rounded-md p-3 bg-muted/50">
                    <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                    <input 
                      type="datetime-local" 
                      className="bg-transparent w-full outline-none"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Type de véhicule</label>
                  <select className="w-full border rounded-md p-3 bg-muted/50">
                    <option>Standard</option>
                    <option>Premium</option>
                    <option>Van</option>
                  </select>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                size="lg" 
                onClick={() => navigate(`/taxi/ride/${Math.random().toString(36).substring(7)}`)}
              >
                Réserver maintenant
              </Button>
              
              <p className="text-sm text-muted-foreground text-center">
                En cliquant sur Réserver, vous acceptez nos Conditions d'utilisation
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
