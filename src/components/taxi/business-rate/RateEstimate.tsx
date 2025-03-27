
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface RateEstimateProps {
  estimate: {
    formattedTotal: string;
    perRideDiscount: number;
    monthlyRides: number;
    vehicleType: string;
  };
}

export const RateEstimate: React.FC<RateEstimateProps> = ({ estimate }) => {
  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Estimation mensuelle</h3>
            <span className="text-2xl font-bold text-primary">{estimate.formattedTotal}</span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span>Remise par course</span>
              <span className="font-medium">{estimate.perRideDiscount.toFixed(0)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Nombre de courses mensuelles</span>
              <span className="font-medium">{estimate.monthlyRides}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Type de véhicule</span>
              <span className="font-medium capitalize">{estimate.vehicleType}</span>
            </div>
          </div>
          
          <div className="pt-2 text-sm text-gray-500">
            <p>* Cette estimation est basée sur les informations fournies et peut varier en fonction des conditions réelles d'utilisation.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
