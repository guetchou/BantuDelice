
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CircleDollarSign, Clock, TrendingUp, Info, Zap } from 'lucide-react';
import { formatPrice } from './booking-form/bookingFormUtils';

interface PriceEstimationProps {
  estimatedPrice: number;
  distance?: number;
}

const PriceEstimation: React.FC<PriceEstimationProps> = ({ 
  estimatedPrice,
  distance
}) => {
  // Calculer le temps de trajet estimé (3 minutes par km en moyenne)
  const estimatedDuration = distance ? Math.round(distance * 3) : null;
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Estimation du prix</h3>
        <p className="text-sm text-gray-500">
          Voici une estimation du prix de votre trajet basée sur la distance et le type de véhicule.
        </p>
      </div>
      
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-green-700">
                <CircleDollarSign className="h-5 w-5" />
                <span className="font-medium">Prix estimé</span>
              </div>
              <div className="text-2xl font-bold text-green-800">
                {formatPrice(estimatedPrice)}
              </div>
            </div>
            
            {distance && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-green-700">
                  <TrendingUp className="h-5 w-5" />
                  <span className="font-medium">Distance</span>
                </div>
                <div className="text-2xl font-bold text-green-800">
                  {distance} km
                </div>
              </div>
            )}
            
            {estimatedDuration && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-green-700">
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">Durée estimée</span>
                </div>
                <div className="text-2xl font-bold text-green-800">
                  {estimatedDuration} min
                </div>
              </div>
            )}
          </div>
          
          {/* Options de paiement */}
          <div className="mt-4 pt-4 border-t border-green-200">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-green-700 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-700">
                <p>
                  Ce prix est une estimation et peut varier légèrement en fonction des conditions 
                  de circulation et du trajet exact.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PriceEstimation;
