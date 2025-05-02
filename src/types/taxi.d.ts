
export interface BusinessRateEstimate {
  baseDiscount: number;
  volumeDiscount: number;
  totalDiscount: number;
  standardRate: number;
  businessRate: number;
  monthlySavings: number;
  annualSavings: number;
}

export interface BusinessRateFormData {
  companyName: string;
  contactEmail: string;
  monthlyRides: number;
  averageDistance: number;
  vehicleType: string;
}
