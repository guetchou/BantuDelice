
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Package, CircleDollarSign, Star, Truck } from 'lucide-react';

interface StatsProps {
  stats: {
    totalDeliveries?: number;
    averageRating?: number;
    currentStatus?: string;
    verificationStatus?: string;
    wallet?: {
      balance: number;
      pendingAmount: number;
    };
    totalEarnings?: number;
    activeDrivers?: number;
    ordersInProgress?: number;
    averageTime?: number;
    availableZones?: number;
    balance?: number;
    completionRate?: number;
  } | null;
}

const StatsCards = ({ stats }: StatsProps) => {
  if (!stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-300 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    online: 'text-green-500',
    offline: 'text-gray-500',
    busy: 'text-orange-500',
    on_break: 'text-blue-500'
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Livraisons</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalDeliveries || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Livraisons totales
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Evaluation</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.averageRating ? stats.averageRating.toFixed(1) : '0.0'}
          </div>
          <p className="text-xs text-muted-foreground">
            Note moyenne
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Statut</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${stats.currentStatus ? statusColors[stats.currentStatus] || 'text-gray-500' : 'text-gray-500'}`}>
            {stats.currentStatus ? 
              stats.currentStatus.charAt(0).toUpperCase() + stats.currentStatus.slice(1) : 
              'Offline'}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.verificationStatus === 'verified' ? 'Vérifié' : 'Vérification requise'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Solde</CardTitle>
          <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.wallet ? stats.wallet.balance.toLocaleString() : '0'} FCFA
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.wallet && stats.wallet.pendingAmount > 0 
              ? `${stats.wallet.pendingAmount.toLocaleString()} FCFA en attente` 
              : 'Aucun retrait en attente'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
