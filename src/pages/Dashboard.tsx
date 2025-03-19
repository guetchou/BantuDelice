
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import DashboardCard from "@/components/DashboardCard";
import DashboardChart from "@/components/DashboardChart";
import DashboardBarChart from "@/components/DashboardBarChart";
import {
  Wallet,
  CreditCard,
  Award,
  History,
  Receipt,
  TrendingUp
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashboardCard 
          title="Mon Portefeuille"
          value="25,650 XAF"
          icon={<Wallet className="h-7 w-7" />}
          trend={{ value: 12, isPositive: true }}
        />
        <DashboardCard 
          title="Points Fidélité"
          value="2,340 pts"
          icon={<Award className="h-7 w-7" />}
          trend={{ value: 8, isPositive: true }}
        />
        <DashboardCard 
          title="Commandes"
          value="16"
          icon={<Receipt className="h-7 w-7" />}
          trend={{ value: 4, isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <DashboardChart />
        <DashboardBarChart />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 glass-effect hover-scale animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <History className="h-8 w-8 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Historique</h2>
              <p className="text-sm text-muted-foreground">
                Activités récentes
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

        <Card className="p-6 glass-effect hover-scale animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <CreditCard className="h-8 w-8 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Paiements</h2>
              <p className="text-sm text-muted-foreground">
                Gérer vos méthodes de paiement
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

        <Card className="p-6 glass-effect hover-scale animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <TrendingUp className="h-8 w-8 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Analyses</h2>
              <p className="text-sm text-muted-foreground">
                Statistiques et rapports
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
