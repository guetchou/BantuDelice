
import React from 'react';
import { Card } from "@/components/ui/card";
import {
  Bike,
  Package,
  TrendingUp,
  Shield,
  Wallet
} from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalDeliveries: number;
    averageRating: number;
    currentStatus: string;
    verificationStatus?: string;
    wallet?: {
      balance: number;
      pendingAmount: number;
    };
  } | null;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  if (!stats) return null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {/* Wallet Summary If Available */}
      {stats?.wallet && (
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Wallet className="w-8 h-8 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Solde disponible</h2>
              <p className="text-2xl font-bold">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(stats.wallet.balance)}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Verification Status */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Shield className="w-8 h-8 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">Vérification</h2>
            <p className={`text-xl font-bold ${
              stats?.verificationStatus === 'verified' ? 'text-green-600' :
              stats?.verificationStatus === 'pending' ? 'text-amber-600' :
              'text-red-600'
            }`}>
              {stats?.verificationStatus === 'verified' ? 'Vérifié' :
               stats?.verificationStatus === 'pending' ? 'En attente' :
               'Non vérifié'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StatsCards;
