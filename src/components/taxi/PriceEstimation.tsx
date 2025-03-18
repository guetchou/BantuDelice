
import React from 'react';
import { TrendingUp } from "lucide-react";

interface PriceEstimationProps {
  estimatedPrice: number;
  distance?: number;
}

const PriceEstimation = ({ estimatedPrice, distance }: PriceEstimationProps) => {
  if (!estimatedPrice) return null;
  
  return (
    <div className="bg-green-50 p-3 rounded-md border border-green-200">
      {distance && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700">Distance estimée:</span>
          <span className="font-semibold">{distance.toFixed(1)} km</span>
        </div>
      )}
      <div className="flex justify-between items-center mt-1">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <span className="text-sm text-gray-700">Prix estimé:</span>
        </div>
        <span className="font-semibold text-lg text-primary">
          {estimatedPrice} FCFA
        </span>
      </div>
    </div>
  );
};

export default PriceEstimation;
