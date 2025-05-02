
import { TaxiVehicleType, PaymentMethod } from '@/types/taxi';

export interface PricingFactors {
  basePrice: number;
  perKmRate: number;
  perMinuteRate: number;
  vehicleTypeMultiplier: Record<TaxiVehicleType, number>;
  timeOfDayFactor: (hour: number) => number;
  weatherFactor: (condition: string) => number;
  specialEventFactor: (date: Date) => number;
  subscriptionDiscountRate: (subscriptionId: string | null) => number;
}

export interface PriceEstimate {
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  totalBeforeTax: number;
  tax: number;
  total: number;
  currency: string;
  breakdown: {
    base: number;
    distance: number;
    time: number;
    vehicleType: number;
    timeOfDay: number;
    weather: number;
    discount: number;
    tax: number;
  };
  formattedTotal: string;
}

export interface PriceRange {
  min: number;
  max: number;
  typical: number;
  formattedRange: string;
  formattedTypical: string;
}

export interface BusinessRateEstimate {
  monthlyTotal: number;
  perRideDiscount: number;
  estimatedSavings: number;
  formattedTotal: string;
  formattedSavings: string;
  minimumRidesForDiscount: number;
  baseDiscount: number;
  volumeDiscount: number;
  totalDiscount: number;
  standardRate: number;
  businessRate: number;
  monthlySavings: number;
  annualSavings: number;
}

export interface SubscriptionDiscount {
  discountPercentage: number;
  monthlyLimit: number;
  remainingRides: number;
  applicableVehicleTypes: TaxiVehicleType[];
}

export interface BusinessRateCalculatorProps {
  formData: BusinessRateFormData;
  showResult: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSliderChange: (value: number) => void;
  handleVehicleTypeChange: (value: string) => void;
  handleCalculate: () => void;
  handleSubmitRequest: () => void;
  getEstimate: () => void;
  isLoading: boolean;
  businessRateEstimate: BusinessRateEstimate;
}
