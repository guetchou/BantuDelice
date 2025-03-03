
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Taxi() {
  const navigate = useNavigate();

  const handleBooking = () => {
    // Simuler une réservation
    const rideId = `ride_${Date.now()}`;
    navigate(`/taxi/ride/${rideId}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Service de Taxi</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Réserver un taxi</CardTitle>
            <CardDescription>
              Entrez votre position et votre destination pour réserver un taxi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Position actuelle</label>
                <input 
                  type="text" 
                  placeholder="Entrez votre position" 
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Destination</label>
                <input 
                  type="text" 
                  placeholder="Entrez votre destination" 
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <Button onClick={handleBooking} className="w-full">
                Réserver maintenant
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Pourquoi choisir notre service de taxi</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Chauffeurs professionnels et fiables</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Tarifs transparents sans frais cachés</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Disponible 24/7 dans toute la ville</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Véhicules modernes et confortables</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Paiement facile via l'application</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
