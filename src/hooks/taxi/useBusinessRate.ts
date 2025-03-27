
import { useState } from 'react';
import { useTaxiPricing } from '@/hooks/useTaxiPricing';
import { toast } from 'sonner';
import { TaxiVehicleType } from '@/types/taxi';

interface BusinessRateFormData {
  companyName: string;
  employeeCount: number;
  averageDistance: number;
  estimatedMonthlyRides: number;
  vehicleType: TaxiVehicleType;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
}

interface BusinessRateEstimate {
  formattedTotal: string;
  perRideDiscount: number;
  monthlyRides: number;
  vehicleType: string;
}

export function useBusinessRate() {
  const { calculateBusinessRateEstimate } = useTaxiPricing();
  
  const [formData, setFormData] = useState<BusinessRateFormData>({
    companyName: '',
    employeeCount: 10,
    averageDistance: 12,
    estimatedMonthlyRides: 20,
    vehicleType: 'comfort',
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
      vehicleType: value as TaxiVehicleType
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
  
  const getEstimate = (): BusinessRateEstimate => {
    const result = calculateBusinessRateEstimate(
      formData.averageDistance,
      formData.vehicleType,
      formData.employeeCount,
      formData.estimatedMonthlyRides
    );
    
    return {
      formattedTotal: result.formattedTotal,
      perRideDiscount: result.perRideDiscount,
      monthlyRides: formData.estimatedMonthlyRides,
      vehicleType: formData.vehicleType
    };
  };
  
  return {
    formData,
    showResult,
    handleInputChange,
    handleSliderChange,
    handleVehicleTypeChange,
    handleCalculate,
    handleSubmitRequest,
    getEstimate
  };
}
