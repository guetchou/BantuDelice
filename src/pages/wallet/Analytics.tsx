import { Card } from "@/components/ui/card";
import DashboardChart from "@/components/DashboardChart";
import { Wallet, TrendingUp, CreditCard, ArrowUpRight, ArrowDownLeft } from "lucide-react";

const Analytics = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Analyses financières</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Wallet className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Solde actuel</p>
              <p className="text-2xl font-bold">150,000 XAF</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <TrendingUp className="w-8 h-8 text-emerald-500" />
            <div>
              <p className="text-sm text-muted-foreground">Croissance mensuelle</p>
              <p className="text-2xl font-bold">+15%</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <ArrowDownLeft className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Dépôts ce mois</p>
              <p className="text-2xl font-bold">75,000 XAF</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <ArrowUpRight className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-sm text-muted-foreground">Retraits ce mois</p>
              <p className="text-2xl font-bold">25,000 XAF</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Évolution du solde</h2>
          <DashboardChart />
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Répartition des dépenses</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                <span>Achats</span>
              </div>
              <span className="font-medium">45%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4" />
                <span>Retraits</span>
              </div>
              <span className="font-medium">30%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowDownLeft className="w-4 h-4" />
                <span>Dépôts</span>
              </div>
              <span className="font-medium">25%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;