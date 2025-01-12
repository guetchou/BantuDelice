import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Wallet,
  CreditCard,
  Award,
  History,
  Receipt,
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
  const { toast } = useToast();
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
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Wallet className="w-8 h-8 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Portefeuille</h2>
              <p className="text-2xl font-bold">
                {wallet?.balance?.toLocaleString()} {wallet?.currency || "XAF"}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Button className="w-full" onClick={() => navigate("/wallet/deposit")}>
              Déposer
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/wallet/withdraw")}
            >
              Retirer
            </Button>
          </div>
        </Card>

        {/* Points de fidélité */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Award className="w-8 h-8 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Fidélité</h2>
              <p className="text-2xl font-bold">
                {loyalty?.points?.toLocaleString()} points
              </p>
              <p className="text-sm text-muted-foreground">
                Niveau: {loyalty?.level}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/loyalty/rewards")}
          >
            Voir les récompenses
          </Button>
        </Card>

        {/* Historique des transactions */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <History className="w-8 h-8 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Transactions</h2>
              <p className="text-sm text-muted-foreground">
                Historique de vos opérations
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/transactions")}
          >
            Voir l'historique
          </Button>
        </Card>

        {/* Factures et reçus */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Receipt className="w-8 h-8 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Factures</h2>
              <p className="text-sm text-muted-foreground">
                Gérez vos factures et reçus
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/invoices")}
          >
            Voir les factures
          </Button>
        </Card>

        {/* Cartes de paiement */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <CreditCard className="w-8 h-8 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Moyens de paiement</h2>
              <p className="text-sm text-muted-foreground">
                Gérez vos cartes et méthodes de paiement
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/payment-methods")}
          >
            Gérer les cartes
          </Button>
        </Card>

        {/* Analyses */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <TrendingUp className="w-8 h-8 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Analyses</h2>
              <p className="text-sm text-muted-foreground">
                Statistiques et prévisions
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/analytics")}
          >
            Voir les analyses
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;