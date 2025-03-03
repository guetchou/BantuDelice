
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Steps, Step } from "@/components/ui/steps";
import { MapPin, User, Clock, Car } from "lucide-react";

export default function TaxiRide() {
  const { rideId } = useParams<{ rideId: string }>();
  const [currentStep, setCurrentStep] = useState(0);
  const [driver, setDriver] = useState({
    name: "Jean Dupont",
    rating: 4.8,
    vehicle: "Toyota Camry",
    plate: "AB-123-CD"
  });
  const [eta, setEta] = useState("5 min");

  useEffect(() => {
    // Simuler la progression d'une course
    const timer1 = setTimeout(() => setCurrentStep(1), 3000);
    const timer2 = setTimeout(() => setCurrentStep(2), 6000);
    const timer3 = setTimeout(() => setCurrentStep(3), 9000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Détails de votre course</h1>
      <p className="text-muted-foreground mb-8">ID de course: {rideId}</p>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Statut de votre course</h2>
            
            <Steps activeStep={currentStep} className="mb-8">
              <Step icon={Car}>Recherche d'un chauffeur</Step>
              <Step icon={User}>Chauffeur en route</Step>
              <Step icon={MapPin}>En chemin vers la destination</Step>
              <Step icon={Clock}>Course terminée</Step>
            </Steps>
            
            {currentStep >= 1 && (
              <div className="border p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Votre chauffeur</h3>
                <div className="flex items-center gap-4">
                  <div className="bg-gray-200 w-12 h-12 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">{driver.name}</p>
                    <p className="text-sm text-muted-foreground">⭐ {driver.rating}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm">Véhicule: {driver.vehicle}</p>
                  <p className="text-sm">Plaque: {driver.plate}</p>
                  {currentStep === 1 && <p className="text-sm font-medium mt-2">Arrive dans: {eta}</p>}
                </div>
              </div>
            )}
          </Card>
          
          <Button 
            variant={currentStep === 3 ? "default" : "outline"} 
            className="w-full"
            disabled={currentStep < 3}
          >
            {currentStep === 3 ? "Évaluer votre course" : "Course en cours..."}
          </Button>
        </div>
        
        <Card className="p-6 h-[300px] flex items-center justify-center bg-gray-50">
          <p className="text-center text-muted-foreground">
            [Carte de suivi en temps réel]
          </p>
        </Card>
      </div>
    </div>
  );
}
