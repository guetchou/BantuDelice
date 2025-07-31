
import { formatCurrency } from '@/utils/formatters';

interface PromoCode {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  validUntil: Date;
  minimumAmount?: number;
  maximumDiscount?: number;
  applicableVehicles?: string[];
  limitedUseCount?: number;
  currentUseCount?: number;
}

interface PromoCodeResult {
  isValid: boolean;
  discount: number;
  formattedDiscount: string;
  message: string;
  appliedCode?: PromoCode;
}

/**
 * Liste des codes promo disponibles (normalement stockés en base de données)
 */
const availablePromoCodes: PromoCode[] = [
  {
    code: 'WELCOME',
    discountType: 'percentage',
    discountValue: 20,
    validUntil: new Date('2024-12-31'),
    minimumAmount: 5000,
    maximumDiscount: 10000,
    limitedUseCount: 1
  },
  {
    code: 'WEEKEND',
    discountType: 'percentage',
    discountValue: 15,
    validUntil: new Date('2024-12-31'),
    applicableVehicles: ['comfort', 'premium'],
    currentUseCount: 0
  },
  {
    code: 'PREMIUM',
    discountType: 'fixed',
    discountValue: 5000,
    validUntil: new Date('2024-12-31'),
    minimumAmount: 15000,
    applicableVehicles: ['premium']
  }
];

/**
 * Valide un code promo et calcule la remise applicable
 * @param code Code promo à valider
 * @param amount Montant de la commande
 * @param vehicleType Type de véhicule (optionnel)
 * @param userId ID de l'utilisateur (optionnel)
 * @returns Résultat de la validation
 */
export function validatePromoCode(
  code: string,
  amount: number,
  vehicleType?: string,
  userId?: string
): PromoCodeResult {
  // Convertir le code en majuscules pour une comparaison insensible à la casse
  const normalizedCode = code.toUpperCase();
  
  // Rechercher le code promo dans la liste des codes disponibles
  const promoCode = availablePromoCodes.find(promo => promo.code === normalizedCode);
  
  // Si le code n'existe pas
  if (!promoCode) {
    return {
      isValid: false,
      discount: 0,
      formattedDiscount: formatCurrency(0),
      message: 'Code promo invalide'
    };
  }
  
  // Vérifier la date de validité
  if (new Date() > promoCode.validUntil) {
    return {
      isValid: false,
      discount: 0,
      formattedDiscount: formatCurrency(0),
      message: 'Ce code promo a expiré'
    };
  }
  
  // Vérifier si le code est limité à certains types de véhicules
  if (promoCode.applicableVehicles && 
      vehicleType && 
      !promoCode.applicableVehicles.includes(vehicleType)) {
    return {
      isValid: false,
      discount: 0,
      formattedDiscount: formatCurrency(0),
      message: `Ce code est valable uniquement pour les véhicules : ${promoCode.applicableVehicles.join(', ')}`
    };
  }
  
  // Vérifier le montant minimum
  if (promoCode.minimumAmount && amount < promoCode.minimumAmount) {
    return {
      isValid: false,
      discount: 0,
      formattedDiscount: formatCurrency(0),
      message: `Montant minimum requis : ${formatCurrency(promoCode.minimumAmount)}`
    };
  }
  
  // Vérifier le nombre d'utilisations (dans un cas réel, cela nécessiterait une vérification en base de données)
  if (promoCode.limitedUseCount && 
      promoCode.currentUseCount !== undefined && 
      promoCode.currentUseCount >= promoCode.limitedUseCount) {
    return {
      isValid: false,
      discount: 0,
      formattedDiscount: formatCurrency(0),
      message: 'Ce code promo a déjà été utilisé'
    };
  }
  
  // Calculer la remise
  let discount = 0;
  if (promoCode.discountType === 'percentage') {
    discount = (amount * promoCode.discountValue) / 100;
    
    // Appliquer la remise maximale si définie
    if (promoCode.maximumDiscount && discount > promoCode.maximumDiscount) {
      discount = promoCode.maximumDiscount;
    }
  } else { // fixed
    discount = promoCode.discountValue;
    
    // La remise fixe ne peut pas dépasser le montant total
    if (discount > amount) {
      discount = amount;
    }
  }
  
  return {
    isValid: true,
    discount,
    formattedDiscount: formatCurrency(discount),
    message: `Remise appliquée : ${formatCurrency(discount)}`,
    appliedCode: promoCode
  };
}
