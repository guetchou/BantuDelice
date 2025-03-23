
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Building2, Users, Car, CalendarDays, Calculator } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTaxiPricing } from '@/hooks/useTaxiPricing';
import { toast } from 'sonner';

const BusinessRateCalculator = () => {
  const { calculateBusinessRateEstimate } = useTaxiPricing();
  
  const [formData, setFormData] = useState({
    companyName: '',
    employeeCount: 10,
    averageDistance: 12,
    estimatedMonthlyRides: 20,
    vehicleType: 'comfort' as 'standard' | 'comfort' | 'premium' | 'van',
    contactPerson: '',
    contactEmail: '',
    contactPhone: ''
  });
  
  const [showResult, setShowResult] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSliderChange = (name: string, value: number[]) => {
    setFormData(prev => ({
      ...prev,
      [name]: value[0]
    }));
  };
  
  const handleVehicleTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      vehicleType: value as 'standard' | 'comfort' | 'premium' | 'van'
    }));
  };
  
  const handleCalculate = () => {
    if (!formData.companyName || !formData.contactPerson || !formData.contactEmail) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    setShowResult(true);
  };
  
  const handleSubmitRequest = () => {
    toast.success("Votre demande de tarif entreprise a été envoyée", {
      description: "Notre équipe commerciale vous contactera sous 24h"
    });
    setShowResult(false);
    setFormData({
      companyName: '',
      employeeCount: 10,
      averageDistance: 12,
      estimatedMonthlyRides: 20,
      vehicleType: 'comfort',
      contactPerson: '',
      contactEmail: '',
      contactPhone: ''
    });
  };
  
  const estimate = calculateBusinessRateEstimate(
    formData.averageDistance,
    formData.vehicleType,
    formData.employeeCount,
    formData.estimatedMonthlyRides
  );
  
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
        <div className="space-y-4">
          <div>
            <Label htmlFor="companyName">Nom de l'entreprise *</Label>
            <Input 
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              placeholder="Entrez le nom de votre entreprise"
              className="mt-1"
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="employeeCount">Nombre d'employés</Label>
              <span className="text-sm text-gray-500">{formData.employeeCount}</span>
            </div>
            <div className="flex items-center gap-4">
              <Users className="text-gray-400 h-4 w-4" />
              <Slider
                id="employeeCount"
                value={[formData.employeeCount]}
                min={5}
                max={500}
                step={5}
                onValueChange={(value) => handleSliderChange('employeeCount', value)}
                className="flex-1"
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="averageDistance">Distance moyenne par trajet (km)</Label>
              <span className="text-sm text-gray-500">{formData.averageDistance} km</span>
            </div>
            <div className="flex items-center gap-4">
              <Car className="text-gray-400 h-4 w-4" />
              <Slider
                id="averageDistance"
                value={[formData.averageDistance]}
                min={2}
                max={50}
                step={1}
                onValueChange={(value) => handleSliderChange('averageDistance', value)}
                className="flex-1"
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="estimatedMonthlyRides">Nombre estimé de courses par mois</Label>
              <span className="text-sm text-gray-500">{formData.estimatedMonthlyRides}</span>
            </div>
            <div className="flex items-center gap-4">
              <CalendarDays className="text-gray-400 h-4 w-4" />
              <Slider
                id="estimatedMonthlyRides"
                value={[formData.estimatedMonthlyRides]}
                min={5}
                max={200}
                step={5}
                onValueChange={(value) => handleSliderChange('estimatedMonthlyRides', value)}
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Type de véhicule préféré</Label>
            <RadioGroup 
              value={formData.vehicleType}
              onValueChange={handleVehicleTypeChange}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2 border rounded-lg p-3">
                <RadioGroupItem value="standard" id="standard" />
                <Label htmlFor="standard" className="flex-1">Standard</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3">
                <RadioGroupItem value="comfort" id="comfort" />
                <Label htmlFor="comfort" className="flex-1">Confort</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3">
                <RadioGroupItem value="premium" id="premium" />
                <Label htmlFor="premium" className="flex-1">Premium</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3">
                <RadioGroupItem value="van" id="van" />
                <Label htmlFor="van" className="flex-1">Van</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div>
              <Label htmlFor="contactPerson">Personne à contacter *</Label>
              <Input 
                id="contactPerson"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                placeholder="Nom et prénom"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="contactEmail">Email professionnel *</Label>
              <Input 
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleInputChange}
                placeholder="email@entreprise.com"
                className="mt-1"
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="contactPhone">Téléphone</Label>
              <Input 
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                placeholder="Numéro de téléphone"
                className="mt-1"
              />
            </div>
          </div>
        </div>
        
        {showResult && (
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
                    <span className="font-medium">{formData.estimatedMonthlyRides}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Type de véhicule</span>
                    <span className="font-medium capitalize">{formData.vehicleType}</span>
                  </div>
                </div>
                
                <div className="pt-2 text-sm text-gray-500">
                  <p>* Cette estimation est basée sur les informations fournies et peut varier en fonction des conditions réelles d'utilisation.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
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
