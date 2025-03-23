
import { PromoCodeValidation } from './types';
import { VALID_PROMO_CODES } from './constants';

// Vérifie si un code promo est valide
export async function validatePromoCode(code: string): Promise<PromoCodeValidation> {
  // Simuler un appel API pour vérifier le code promo
  return new Promise((resolve) => {
    setTimeout(() => {
      const discount = VALID_PROMO_CODES[code] || 0;
      resolve({
        valid: discount > 0,
        discount
      });
    }, 500);
  });
}
