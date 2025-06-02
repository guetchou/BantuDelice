
/**
 * Format a number to currency display
 * @param value - The number value to format
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number): string => {
  return value.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0
  });
};

/**
 * Format a date to a readable string
 * @param dateString - The date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Calculate price difference with potential revenue impact
 * @param oldPrice - The original price
 * @param newPrice - The new suggested price
 * @returns Object with difference metrics
 */
export const calculatePriceDifference = (oldPrice: number, newPrice: number) => {
  const absoluteDifference = newPrice - oldPrice;
  const percentageDifference = (absoluteDifference / oldPrice) * 100;
  const isIncrease = absoluteDifference > 0;
  const potentialRevenueIncrease = absoluteDifference * 30; // Estimation based on 30 sales

  return {
    absoluteDifference,
    percentageDifference,
    isIncrease,
    potentialRevenueIncrease
  };
};

/**
 * Format a number to percentage display
 * @param value - The number value to format as percentage
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format a number to display with thousand separators
 * @param value - The number value to format
 * @returns Formatted number string
 */
export const formatNumber = (value: number): string => {
  return value.toLocaleString('fr-FR');
};

/**
 * Format a price amount in XAF currency
 * @param value - The price amount to format
 * @returns Formatted price string
 */
export const formatPrice = (value: number): string => {
  return formatCurrency(value);
};

/**
 * Generate detailed price change statistics
 * @param oldPrice - The original price
 * @param newPrice - The new price
 * @returns Price change statistics object
 */
export const priceChangeStats = (oldPrice: number, newPrice: number) => {
  const diff = calculatePriceDifference(oldPrice, newPrice);
  return {
    ...diff,
    formattedOldPrice: formatPrice(oldPrice),
    formattedNewPrice: formatPrice(newPrice),
    formattedDifference: formatPrice(Math.abs(diff.absoluteDifference)),
    changeType: diff.isIncrease ? 'increase' : 'decrease',
    potentialRevenueIncrease: diff.potentialRevenueIncrease
  };
};
