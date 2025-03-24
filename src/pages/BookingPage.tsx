
import { Card } from "@/components/ui/card";
import { useParams } from "react-router-dom";

export default function BookingPage() {
  const { serviceProviderId } = useParams();

  return (
    <div className="container mx-auto py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Réservation</h1>
        <p className="text-muted-foreground">
          Réservation pour le prestataire ID: {serviceProviderId}
        </p>
        <p className="text-muted-foreground">Cette page est en cours de développement.</p>
      </Card>
    </div>
  );
}
