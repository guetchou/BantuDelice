
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import DeliveryMap from "@/components/DeliveryMap";
import {
  Bike,
  Package,
  History,
  MapPin,
  TrendingUp,
  Clock
} from "lucide-react";

interface DeliveryStats {
  totalDeliveries: number;
  averageRating: number;
  currentStatus: string;
}

const DeliveryDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DeliveryStats | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Impossible d'obtenir votre position");
        }
      );
    }

    const loadDeliveryStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate("/auth");
          return;
        }

        const { data: driverData, error } = await supabase
          .from("delivery_drivers")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (!driverData) {
          toast.error("Profil de livreur non trouvé");
          return;
        }

        setStats({
          totalDeliveries: driverData.total_deliveries || 0,
          averageRating: driverData.average_rating || 0,
          currentStatus: driverData.status || 'unavailable',
        });
      } catch (error) {
        console.error("Error loading delivery stats:", error);
        toast.error("Erreur lors du chargement des statistiques");
      } finally {
        setLoading(false);
      }
    };

    loadDeliveryStats();
  }, [navigate]);

  const updateLocation = async () => {
    if (!currentLocation) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("delivery_drivers")
        .update({
          current_latitude: currentLocation.latitude,
          current_longitude: currentLocation.longitude,
          last_location_update: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (error) throw error;
      toast.success("Position mise à jour");
    } catch (error) {
      console.error("Error updating location:", error);
      toast.error("Erreur lors de la mise à jour de la position");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord livreur</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Current Status */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Bike className="w-8 h-8 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Statut</h2>
              <p className="text-2xl font-bold capitalize">{stats?.currentStatus}</p>
            </div>
          </div>
        </Card>

        {/* Total Deliveries */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Package className="w-8 h-8 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Livraisons totales</h2>
              <p className="text-2xl font-bold">{stats?.totalDeliveries}</p>
            </div>
          </div>
        </Card>

        {/* Average Rating */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <TrendingUp className="w-8 h-8 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Note moyenne</h2>
              <p className="text-2xl font-bold">{stats?.averageRating.toFixed(1)}/5</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Map Section */}
      <Card className="mt-8 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Position actuelle</h2>
          <Button onClick={updateLocation} className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Mettre à jour la position
          </Button>
        </div>
        {currentLocation && (
          <DeliveryMap
            latitude={currentLocation.latitude}
            longitude={currentLocation.longitude}
          />
        )}
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Button
          variant="outline"
          className="h-auto py-6"
          onClick={() => navigate("/delivery/history")}
        >
          <History className="w-6 h-6 mr-2" />
          Historique des livraisons
        </Button>
        <Button
          variant="outline"
          className="h-auto py-6"
          onClick={() => navigate("/delivery/schedule")}
        >
          <Clock className="w-6 h-6 mr-2" />
          Planning des livraisons
        </Button>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
