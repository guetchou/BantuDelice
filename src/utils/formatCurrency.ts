
/**
 * Formatte un montant en devise avec symbole et séparateurs
 */
export const formatCurrency = (amount: number, locale = 'fr-FR', currency = 'XOF'): string => {
  if (!amount && amount !== 0) return '';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};
