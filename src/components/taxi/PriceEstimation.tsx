
import React from 'react';
import { Card } from "@/components/ui/card";
import { TrendingUp, Route, Clock } from "lucide-react";

interface PriceEstimationProps {
  estimatedPrice: number;
  distance?: number;
}

const PriceEstimation: React.FC<PriceEstimationProps> = ({
  estimatedPrice,
  distance
}) => {
  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} FCFA`;
  };
  
  // Estimate time (roughly 2 minutes per km)
  const estimatedTime = distance ? Math.max(10, Math.round(distance * 2)) : 15;
  
  return (
    <Card className="bg-gray-50 border-gray-200">
      <div className="p-4">
        <h3 className="text-lg font-medium mb-3 flex items-center">
          <TrendingUp className="mr-2 h-5 w-5 text-primary" />
          Estimation du trajet
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-600">
              <Route className="mr-2 h-4 w-4" />
              <span>Distance estimée</span>
            </div>
            <span className="font-medium">
              {distance ? `${distance.toFixed(1)} km` : 'Calcul...'}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-600">
              <Clock className="mr-2 h-4 w-4" />
              <span>Durée estimée</span>
            </div>
            <span className="font-medium">
              {estimatedTime} minutes
            </span>
          </div>
          
          <div className="pt-3 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Prix estimé</span>
              <span className="text-xl font-bold text-primary">
                {formatCurrency(estimatedPrice)}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Le prix peut varier en fonction du trafic et de l'itinéraire exact
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PriceEstimation;
