
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bike, Car, Clock, DollarSign, Landmark, Map, Package, ShoppingBag, Users } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";

interface StatsCardsProps {
  stats: {
    totalDeliveries: number;
    totalEarnings: number;
    activeDrivers: number;
    ordersInProgress: number;
    averageTime: number;
    availableZones: number;
    balance: number;
    completionRate: number;
  };
  isLoading: boolean;
}

const StatsCards = ({ stats, isLoading }: StatsCardsProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium bg-gray-200 h-4 w-24 rounded"></CardTitle>
              <div className="h-8 w-8 rounded-full bg-gray-200"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gray-200 h-8 w-16 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Livraisons</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalDeliveries}</div>
          <p className="text-xs text-muted-foreground">
            +{Math.floor(Math.random() * 10) + 1} depuis hier
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Revenus</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalEarnings)}</div>
          <p className="text-xs text-muted-foreground">
            +{formatCurrency(Math.floor(Math.random() * 1000) / 10)} depuis hier
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Livreurs actifs</CardTitle>
          <Bike className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeDrivers}</div>
          <p className="text-xs text-muted-foreground">
            {stats.activeDrivers > 5 ? "Couverture optimale" : "Besoin de livreurs"}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Commandes en cours</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.ordersInProgress}</div>
          <p className="text-xs text-muted-foreground">
            Temps moyen: {stats.averageTime} min
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
