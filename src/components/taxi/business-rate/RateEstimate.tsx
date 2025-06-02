
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, Calculator, Wallet } from 'lucide-react';
import { BusinessRateEstimate } from '@/types/globalTypes';

interface RateEstimateProps {
  estimate: BusinessRateEstimate;
}

export const RateEstimate = ({ estimate }: RateEstimateProps) => {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Estimation de votre tarif entreprise
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-2xl font-bold text-primary">{estimate.totalDiscount}%</div>
            <div className="text-sm text-gray-600">Réduction totale</div>
          </div>
          
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-2xl font-bold text-green-600">{estimate.formattedTotal}</div>
            <div className="text-sm text-gray-600">Prix par course</div>
          </div>
          
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{estimate.monthlySavings} FCFA</div>
            <div className="text-sm text-gray-600">Économies mensuelles</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Tarif standard :</span>
            <span className="line-through text-gray-500">{estimate.standardRate} FCFA</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Remise base :</span>
            <Badge variant="secondary">-{estimate.baseDiscount}%</Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Remise volume :</span>
            <Badge variant="secondary">-{estimate.volumeDiscount}%</Badge>
          </div>
          
          <hr className="my-2" />
          
          <div className="flex justify-between items-center font-semibold">
            <span>Votre tarif entreprise :</span>
            <span className="text-lg text-primary">{estimate.businessRate} FCFA</span>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 text-green-800 font-medium mb-2">
            <Wallet className="h-4 w-4" />
            Économies annuelles projetées
          </div>
          <div className="text-2xl font-bold text-green-900">{estimate.annualSavings.toLocaleString()} FCFA</div>
          <div className="text-sm text-green-700">
            Basé sur {estimate.monthlyRides} courses par mois
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
