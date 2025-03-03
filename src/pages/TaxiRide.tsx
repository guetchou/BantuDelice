
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, MessageSquare, Star } from "lucide-react";
import { Steps, Step } from "@/components/ui/steps";

export default function TaxiRide() {
  const { rideId } = useParams();
  const [activeStep, setActiveStep] = useState(1);
  
  const handleNextStep = () => {
    if (activeStep < 3) {
      setActiveStep(activeStep + 1);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-center">Course de Taxi</h1>
      <p className="text-muted-foreground text-center mb-8">ID de course: {rideId}</p>
      
      <div className="max-w-3xl mx-auto mb-8">
        <Steps activeStep={activeStep}>
          <Step>Chauffeur assigné</Step>
          <Step>En route</Step>
          <Step>Arrivée</Step>
        </Steps>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Détails de votre course</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Prise en charge</p>
                      <p className="font-medium">123 Avenue de la Paix, Brazzaville</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Destination</p>
                      <p className="font-medium">45 Boulevard des Armées, Brazzaville</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 mr-2 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Heure estimée d'arrivée</p>
                      <p className="font-medium">14:30</p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                      <span className="text-primary font-bold">JD</span>
                    </div>
                    <div>
                      <h3 className="font-bold">Jean Dupont</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm ml-1">4.0</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">Toyota Corolla - TG 1234 CD</p>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Phone className="h-4 w-4 mr-2" /> Appeler
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-2" /> Message
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Paiement</h3>
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">Course</span>
                  <span>4,500 XAF</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">Taxe</span>
                  <span>500 XAF</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>5,000 XAF</span>
                </div>
              </div>
              
              {activeStep < 3 ? (
                <Button onClick={handleNextStep} className="w-full">
                  {activeStep === 1 ? "Chauffeur en route" : "Arrivé à destination"}
                </Button>
              ) : (
                <Button variant="default" className="w-full">
                  Évaluer la course
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
