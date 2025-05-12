
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Calculator } from "lucide-react";
import { BusinessRateForm } from './business-rate/BusinessRateForm';
import { RateEstimate } from './business-rate/RateEstimate';
import { BusinessRateEstimate, BusinessRateFormData } from '@/types/taxi';

// mock useBusinessRate hook to replace the original hook with issues
const useBusinessRate = () => {
  const [formData, setFormData] = useState<BusinessRateFormData>({
    companyName: '',
    contactEmail: '',
    monthlyRides: 50,
    averageDistance: 10,
    vehicleType: 'standard'
  });
  
  const [showResult, setShowResult] = useState(false);
  const [businessRateEstimate, setBusinessRateEstimate] = useState<BusinessRateEstimate>({
    baseDiscount: 10,
    volumeDiscount: 5,
    totalDiscount: 15,
    standardRate: 1000,
    businessRate: 850,
    monthlySavings: 7500,
    annualSavings: 90000,
    formattedTotal: '850 FCFA',
    perRideDiscount: 150,
    monthlyRides: 50,
    vehicleType: 'standard'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSliderChange = (value: number) => {
    setFormData(prev => ({
      ...prev,
      monthlyRides: value
    }));
  };

  const handleVehicleTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      vehicleType: value
    }));
  };

  const handleCalculate = () => {
    // In a real application, this would call an API
    // For now, just show the result
    setShowResult(true);
  };

  const handleSubmitRequest = () => {
    // This would submit the business rate request
    alert('Demande de tarif entreprise envoyée !');
  };

  const getEstimate = (): BusinessRateEstimate => {
    return businessRateEstimate;
  };

  return {
    formData,
    showResult,
    handleInputChange,
    handleSliderChange,
    handleVehicleTypeChange,
    handleCalculate,
    handleSubmitRequest,
    getEstimate,
    isLoading: false,
    businessRateEstimate
  };
};

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
            onClick={() => setShowResult(false)}
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
