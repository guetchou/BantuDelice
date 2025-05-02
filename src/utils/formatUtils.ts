
/**
 * Format a price for display
 * @param price Price in cents
 * @returns Formatted price string
 */
export const formatPrice = (price: number): string => {
  return (price / 100).toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0
  });
};

/**
 * Calculate price change statistics
 * @param oldPrice Original price
 * @param newPrice New price
 * @returns Statistics about the price change
 */
export const priceChangeStats = (oldPrice: number, newPrice: number) => {
  const absoluteDifference = newPrice - oldPrice;
  const percentageDifference = oldPrice > 0 ? (absoluteDifference / oldPrice) * 100 : 0;
  const isIncrease = newPrice > oldPrice;
  const potentialRevenueIncrease = isIncrease ? absoluteDifference : 0;
  
  return {
    absoluteDifference,
    percentageDifference,
    isIncrease,
    potentialRevenueIncrease
  };
};
