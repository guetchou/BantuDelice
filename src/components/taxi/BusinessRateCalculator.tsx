
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Calculator } from "lucide-react";
import { useBusinessRate } from '@/hooks/taxi/useBusinessRate';
import { BusinessRateForm } from './business-rate/BusinessRateForm';
import { RateEstimate } from './business-rate/RateEstimate';

const BusinessRateCalculator = () => {
  const {
    formData,
    showResult,
    handleInputChange,
    handleSliderChange,
    handleVehicleTypeChange,
    handleCalculate,
    handleSubmitRequest,
    getEstimate
  } = useBusinessRate();
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          Calculateur de Tarifs Entreprise
        </CardTitle>
        <CardDescription>
          Estimez les coûts de transport pour votre entreprise et bénéficiez de tarifs préférentiels
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <BusinessRateForm 
          formData={formData}
          handleInputChange={handleInputChange}
          handleSliderChange={handleSliderChange}
          handleVehicleTypeChange={handleVehicleTypeChange}
        />
        
        {showResult && <RateEstimate estimate={getEstimate()} />}
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-3">
        {!showResult ? (
          <Button 
            onClick={handleCalculate} 
            className="w-full sm:w-auto gap-2"
          >
            <Calculator className="h-4 w-4" />
            Calculer une estimation
          </Button>
        ) : (
          <Button 
            onClick={handleSubmitRequest} 
            className="w-full sm:w-auto"
          >
            Demander ce tarif entreprise
          </Button>
        )}
        
        {showResult && (
          <Button 
            variant="outline" 
            onClick={() => showResult = false}
            className="w-full sm:w-auto"
          >
            Modifier les informations
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BusinessRateCalculator;
