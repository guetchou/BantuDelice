
import { PaymentMethod, TaxiVehicleType } from '@/types/taxi';
import { paymentApi } from '@/integrations/api/payments';

export interface PromoCodeValidation {
  valid: boolean;
  discount: number;
  discount_type?: 'percentage' | 'fixed_amount' | 'free_ride';
  message: string;
  expiresAt?: string;
  final_amount?: number;
}

export interface PromoCode {
  code: string;
  description: string;
  discount: number;
  type: 'percentage' | 'fixed_amount' | 'free_ride';
  minOrderValue?: number;
  maxUses?: number;
  expiresAt?: string;
  restrictedToUsers?: string[];
  restrictedToVehicleTypes?: TaxiVehicleType[];
}

// Local database of promo codes for offline validation
const PROMO_CODES: Record<string, PromoCode> = {
  'BIENVENUE': { 
    code: 'BIENVENUE', 
    discount: 0.2, 
    type: 'percentage',
    description: 'Bénéficiez de 20% sur votre première course',
    maxUses: 1
  },
  'WEEKEND': { 
    code: 'WEEKEND', 
    discount: 0.15, 
    type: 'percentage',
    description: '15% de réduction le weekend',
    expiresAt: '2025-12-31T23:59:59Z'
  },
  'FIDELE': { 
    code: 'FIDELE', 
    discount: 0.1, 
    type: 'percentage',
    description: '10% pour nos clients fidèles',
    minOrderValue: 5000
  },
  'BUSINESS': { 
    code: 'BUSINESS', 
    discount: 0.25, 
    type: 'percentage',
    description: '25% pour les courses professionnelles',
    restrictedToVehicleTypes: ['comfort', 'premium']
  },
  'FREESHIP': {
    code: 'FREESHIP',
    discount: 1.0,
    type: 'free_ride',
    description: 'Course offerte'
  },
  '1000FCFA': {
    code: '1000FCFA',
    discount: 1000,
    type: 'fixed_amount',
    description: '1000 FCFA de réduction sur votre course',
    minOrderValue: 3000
  }
};

/**
 * Validates a promo code and returns discount information
 * @param code Promo code to validate
 * @param amount Order amount (optional)
 * @param userId User ID (optional)
 * @param vehicleType Vehicle type (optional)
 * @returns Validation result
 */
export async function validatePromoCode(
  code: string,
  amount?: number,
  userId?: string,
  vehicleType?: TaxiVehicleType
): Promise<PromoCodeValidation> {
  // If connectivity available, use the API
  try {
    if (navigator.onLine && amount) {
      const response = await paymentApi.validatePromoCode(code, amount, vehicleType);
      return {
        valid: response.valid,
        discount: response.discount,
        discount_type: response.discount_type,
        message: response.message,
        final_amount: response.final_amount
      };
    }
  } catch (error) {
    console.warn('API promo code validation failed, using offline validation', error);
  }
  
  // Fallback to local validation
  return new Promise((resolve) => {
    setTimeout(() => {
      // Check if code exists
      const promoCode = PROMO_CODES[code];
      
      if (!promoCode) {
        resolve({
          valid: false,
          discount: 0,
          message: 'Code promo invalide'
        });
        return;
      }
      
      // Check if code has expired
      if (promoCode.expiresAt && new Date(promoCode.expiresAt) < new Date()) {
        resolve({
          valid: false,
          discount: 0,
          message: 'Ce code promo a expiré',
          expiresAt: promoCode.expiresAt
        });
        return;
      }
      
      // Check minimum order amount
      if (promoCode.minOrderValue && amount && amount < promoCode.minOrderValue) {
        resolve({
          valid: false,
          discount: 0,
          message: `Commande minimum de ${promoCode.minOrderValue} FCFA requise`
        });
        return;
      }
      
      // Check user restrictions
      if (promoCode.restrictedToUsers && 
          userId && 
          !promoCode.restrictedToUsers.includes(userId)) {
        resolve({
          valid: false,
          discount: 0,
          message: 'Ce code n\'est pas disponible pour votre compte'
        });
        return;
      }
      
      // Check vehicle type restrictions
      if (promoCode.restrictedToVehicleTypes && 
          vehicleType && 
          !promoCode.restrictedToVehicleTypes.includes(vehicleType)) {
        resolve({
          valid: false,
          discount: 0,
          message: `Ce code est valable uniquement pour ${promoCode.restrictedToVehicleTypes.join(', ')}`
        });
        return;
      }
      
      // Calculate final amount if possible
      let finalAmount: number | undefined = undefined;
      if (amount) {
        finalAmount = applyPromoCode(amount, promoCode);
      }
      
      // The code is valid
      resolve({
        valid: true,
        discount: promoCode.discount,
        discount_type: promoCode.type,
        message: `Code '${code}' appliqué avec succès: ${promoCode.description}`,
        expiresAt: promoCode.expiresAt,
        final_amount: finalAmount
      });
    }, 500); // Simulate API delay
  });
}

/**
 * Applies a promo code to an amount
 * @param amount Initial amount
 * @param promoCode Promo code object
 * @returns Amount after applying the promo code
 */
export function applyPromoCode(amount: number, promoCode: PromoCode): number {
  if (!promoCode) return amount;
  
  switch (promoCode.type) {
    case 'percentage':
      return Math.round(amount * (1 - promoCode.discount));
    
    case 'fixed_amount':
      return Math.max(0, amount - promoCode.discount);
    
    case 'free_ride':
      // Completely free, return 0
      return 0;
    
    default:
      return amount;
  }
}

/**
 * Retrieves promo code details
 * @param code Promo code
 * @returns Promo code details or null if not found
 */
export function getPromoCodeDetails(code: string): PromoCode | null {
  return PROMO_CODES[code] || null;
}

/**
 * Formats a promo code discount for display
 * @param promoCode Validated promo code
 * @returns Formatted discount string
 */
export function formatPromoDiscount(
  discountType: 'percentage' | 'fixed_amount' | 'free_ride',
  discountValue: number
): string {
  switch (discountType) {
    case 'percentage':
      return `${Math.round(discountValue * 100)}%`;
    case 'fixed_amount':
      return `${discountValue} FCFA`;
    case 'free_ride':
      return `Course gratuite`;
    default:
      return '';
  }
}
