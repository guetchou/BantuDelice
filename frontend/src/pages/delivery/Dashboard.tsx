
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import DriverWallet from "@/components/delivery/DriverWallet";
import DriverVerification from "@/components/delivery/DriverVerification";
import RouteOptimization from "@/components/delivery/RouteOptimization";
import { DeliveryDriver } from "@/types/delivery";
import StatsCards from "@/components/delivery/dashboard/StatsCards";
import LocationMap from "@/components/delivery/dashboard/LocationMap";
import QuickActions from "@/components/delivery/dashboard/QuickActions";

const DeliveryDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<{
    totalDeliveries: number;
    averageRating: number;
    currentStatus: string;
    verificationStatus?: string;
    wallet?: {
      balance: number;
      pendingAmount: number;
    };
  } | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [driver, setDriver] = useState<DeliveryDriver | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

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

    loadDeliveryStats();
  }, [navigate]);

  const loadDeliveryStats = async () => {
    try {
      setLoading(true);
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

      setDriver(driverData as DeliveryDriver);

      // Get wallet data
      const { data: walletData } = await supabase
        .from("driver_wallets")
        .select("*")
        .eq("driver_id", driverData.id)
        .maybeSingle();

      // Get pending transactions
      let pendingAmount = 0;
      if (walletData) {
        const { data: transactions } = await supabase
          .from("driver_transactions")
          .select("*")
          .eq("wallet_id", walletData.id)
          .eq("status", "pending")
          .eq("type", "withdraw");
          
        if (transactions) {
          pendingAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
        }
      }

      setStats({
        totalDeliveries: driverData.total_deliveries || 0,
        averageRating: driverData.average_rating || 0,
        currentStatus: driverData.status || 'offline',
        verificationStatus: driverData.verification_status,
        wallet: walletData ? {
          balance: walletData.balance || 0,
          pendingAmount
        } : undefined
      });
    } catch (error) {
      console.error("Error loading delivery stats:", error);
      toast.error("Erreur lors du chargement des statistiques");
    } finally {
      setLoading(false);
    }
  };

  const updateLocation = async () => {
    if (!currentLocation || !driver) return;

    try {
      const { error } = await supabase
        .from("delivery_drivers")
        .update({
          current_latitude: currentLocation.latitude,
          current_longitude: currentLocation.longitude,
          last_location_update: new Date().toISOString(),
        })
        .eq("id", driver.id);

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

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="wallet">Portefeuille</TabsTrigger>
          <TabsTrigger value="verification">Vérification</TabsTrigger>
          <TabsTrigger value="optimization">Optimisation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <StatsCards stats={stats} />
          
          <LocationMap 
            currentLocation={currentLocation} 
            onUpdateLocation={updateLocation} 
          />
          
          <QuickActions 
            onOptimizationClick={() => setActiveTab('optimization')} 
          />
        </TabsContent>

        <TabsContent value="wallet">
          {driver && <DriverWallet driverId={driver.id} />}
        </TabsContent>

        <TabsContent value="verification">
          {driver && <DriverVerification driverId={driver.id} />}
        </TabsContent>

        <TabsContent value="optimization">
          {driver && <RouteOptimization driverId={driver.id} />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeliveryDashboard;
