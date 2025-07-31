
import { Card } from "@/components/ui/card";
import { Clock, AlertTriangle } from "lucide-react";

interface RestaurantClosedProps {
  restaurantName: string;
  reason?: string;
  reopenTime?: string;
}

const RestaurantClosed = ({ restaurantName, reason, reopenTime }: RestaurantClosedProps) => {
  const formatReopenDate = () => {
    if (!reopenTime) return "Prochainement";
    
    try {
      const date = new Date(reopenTime);
      return date.toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return reopenTime;
    }
  };
  
  return (
    <Card className="bg-red-50 border-red-200 p-4 text-red-800">
      <div className="flex gap-3">
        <AlertTriangle className="h-6 w-6 flex-shrink-0 text-red-600" />
        <div>
          <h3 className="font-semibold mb-1">{restaurantName} est actuellement fermé</h3>
          <p className="text-sm text-red-700">{reason || "Vous ne pouvez pas commander pour le moment."}</p>
          
          {reopenTime && (
            <div className="flex items-center gap-2 mt-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>Réouverture prévue le {formatReopenDate()}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default RestaurantClosed;
