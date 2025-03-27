
import { PromoCodeValidation } from './types';
import { VALID_PROMO_CODES } from './constants';

interface PromoCode {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed_amount' | 'free_delivery';
  minOrderValue?: number;
  maxUses?: number;
  expiresAt?: string;
  restrictedToUsers?: string[];
  restrictedToVehicleTypes?: string[];
  description?: string;
}

// Base de données simulée des codes promo
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
    type: 'free_delivery',
    description: 'Frais de service offerts'
  },
  '10FCFA': {
    code: '10FCFA',
    discount: 1000,
    type: 'fixed_amount',
    description: '1000 FCFA de réduction sur votre course',
    minOrderValue: 3000
  }
};

/**
 * Vérifie si un code promo est valide
 * @param code Code promo à vérifier
 * @param orderValue Valeur de la commande (optionnel)
 * @param userId ID de l'utilisateur (optionnel)
 * @param vehicleType Type de véhicule (optionnel)
 * @returns Résultat de la validation
 */
export async function validatePromoCode(
  code: string,
  orderValue?: number,
  userId?: string,
  vehicleType?: string
): Promise<PromoCodeValidation> {
  // Simuler un appel API pour vérifier le code promo
  return new Promise((resolve) => {
    setTimeout(() => {
      // Vérifier si le code existe
      const promoCode = PROMO_CODES[code];
      
      if (!promoCode) {
        resolve({
          valid: false,
          discount: 0,
          message: 'Code promo invalide'
        });
        return;
      }
      
      // Vérifier si le code a expiré
      if (promoCode.expiresAt && new Date(promoCode.expiresAt) < new Date()) {
        resolve({
          valid: false,
          discount: 0,
          message: 'Ce code promo a expiré',
          expiresAt: promoCode.expiresAt
        });
        return;
      }
      
      // Vérifier le montant minimum de commande
      if (promoCode.minOrderValue && orderValue && orderValue < promoCode.minOrderValue) {
        resolve({
          valid: false,
          discount: 0,
          message: `Commande minimum de ${promoCode.minOrderValue} FCFA requise`
        });
        return;
      }
      
      // Vérifier les restrictions d'utilisateurs
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
      
      // Vérifier les restrictions de type de véhicule
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
      
      // Le code est valide
      resolve({
        valid: true,
        discount: promoCode.discount,
        message: `Code '${code}' appliqué avec succès: ${promoCode.description}`,
        expiresAt: promoCode.expiresAt
      });
    }, 500);
  });
}

/**
 * Applique un code promo à un montant
 * @param amount Montant initial
 * @param promoCode Code promo validé
 * @returns Montant après application du code promo
 */
export function applyPromoCode(amount: number, promoCode: PromoCode): number {
  if (!promoCode) return amount;
  
  switch (promoCode.type) {
    case 'percentage':
      return Math.round(amount * (1 - promoCode.discount));
    
    case 'fixed_amount':
      return Math.max(0, amount - promoCode.discount);
    
    case 'free_delivery':
      // Ici, on pourrait avoir une logique pour retirer les frais de service
      // Pour simplifier, on considère que les frais de service sont de 500 FCFA
      return Math.max(0, amount - 500);
    
    default:
      return amount;
  }
}

/**
 * Récupère les détails d'un code promo
 * @param code Code promo
 * @returns Détails du code promo ou null si inexistant
 */
export function getPromoCodeDetails(code: string): PromoCode | null {
  return PROMO_CODES[code] || null;
}
