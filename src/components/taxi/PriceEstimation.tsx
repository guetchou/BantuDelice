
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from './booking-form/bookingFormUtils';

interface PriceEstimationProps {
  estimatedPrice: number;
  distance?: number;
  range?: { min: number; max: number };
  breakdown?: string[];
}

const PriceEstimation: React.FC<PriceEstimationProps> = ({
  estimatedPrice,
  distance,
  range,
  breakdown
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Estimation du prix</span>
          {distance && <span className="text-sm font-normal text-muted-foreground">~{distance} km</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-center items-center">
            <div className="text-2xl font-bold text-primary">
              {range ? (
                <span>{formatPrice(range.min)} - {formatPrice(range.max)}</span>
              ) : (
                <span>{formatPrice(estimatedPrice)}</span>
              )}
            </div>
          </div>
          
          {breakdown && breakdown.length > 0 && (
            <div className="mt-4 text-sm space-y-1 text-muted-foreground">
              <p className="text-xs font-medium uppercase tracking-wider mb-2">Détails du prix</p>
              {breakdown.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.split(':')[0]}</span>
                  <span>{item.split(':')[1]}</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-xs text-muted-foreground mt-2">
            <p>Le prix final peut varier selon le trafic et l'itinéraire emprunté.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceEstimation;
