
import { AlertTriangle } from 'lucide-react';

interface RestaurantClosedProps {
  restaurantName: string;
  reason?: string;
  reopenTime?: string;
}

const RestaurantClosed = ({ restaurantName, reason, reopenTime }: RestaurantClosedProps) => {
  const formatReopenTime = (timeString?: string) => {
    if (!timeString) return null;
    try {
      const date = new Date(timeString);
      return date.toLocaleString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return null;
    }
  };

  const formattedReopenTime = formatReopenTime(reopenTime);

  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-md flex items-start">
      <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
      <div>
        <h3 className="font-semibold">Restaurant temporairement fermé</h3>
        <p className="text-sm">
          {restaurantName} est actuellement fermé{reason ? ` - ${reason}` : ''}.
        </p>
        {formattedReopenTime && (
          <p className="text-sm mt-1">
            Réouverture prévue le {formattedReopenTime}.
          </p>
        )}
      </div>
    </div>
  );
};

export default RestaurantClosed;
