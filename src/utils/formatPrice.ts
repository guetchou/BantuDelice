
/**
 * Format a price in the local currency format
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export const priceChangeStats = {
  increasedCount: 0,
  decreasedCount: 0,
  unchangedCount: 0,
  totalChange: 0,
  averageChange: 0,
  percentageChange: 0
};
