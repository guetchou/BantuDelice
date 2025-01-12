import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardBarChart from "@/components/DashboardBarChart";
import DashboardChart from "@/components/DashboardChart";
import DashboardCard from "@/components/DashboardCard";
import { 
  Wallet, 
  Award, 
  History as HistoryIcon, 
  Receipt, 
  CreditCard, 
  TrendingUp 
} from "lucide-react";

interface WalletData {
  balance: number;
  currency: string;
}

interface LoyaltyData {
  points: number;
  level: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loyalty, setLoyalty] = useState<LoyaltyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      // Charger les données du portefeuille
      const { data: walletData } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (walletData) {
        setWallet(walletData);
      }

      // Charger les points de fidélité
      const { data: loyaltyData } = await supabase
        .from("loyalty_points")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (loyaltyData) {
        setLoyalty(loyaltyData);
      }

      setLoading(false);
    };

    loadUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Portefeuille électronique */}
        <DashboardCard
          title="Portefeuille"
          value={`${wallet?.balance?.toLocaleString()} ${wallet?.currency || "XAF"}`}
          icon={<Wallet className="w-8 h-8 text-primary" />}
        />

        {/* Points de fidélité */}
        <DashboardCard
          title="Fidélité"
          value={`${loyalty?.points?.toLocaleString()} points`}
          icon={<Award className="w-8 h-8 text-primary" />}
          trend={{ value: loyalty?.points || 0, isPositive: loyalty?.points > 0 }}
        />

        {/* Historique des transactions */}
        <DashboardCard
          title="Transactions"
          value="Historique de vos opérations"
          icon={<HistoryIcon className="w-8 h-8 text-primary" />}
        />

        {/* Factures et reçus */}
        <DashboardCard
          title="Factures"
          value="Gérez vos factures et reçus"
          icon={<Receipt className="w-8 h-8 text-primary" />}
        />

        {/* Cartes de paiement */}
        <DashboardCard
          title="Moyens de paiement"
          value="Gérez vos cartes et méthodes de paiement"
          icon={<CreditCard className="w-8 h-8 text-primary" />}
        />

        {/* Analyses */}
        <DashboardCard
          title="Analyses"
          value="Statistiques et prévisions"
          icon={<TrendingUp className="w-8 h-8 text-primary" />}
        />
      </div>
    </div>
  );
};

export default Dashboard;