
/**
 * Formats a number as currency
 * @param amount The amount to format
 * @param currency The currency code (default: EUR)
 * @param locale The locale to use for formatting (default: fr-FR)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number, 
  currency: string = 'EUR', 
  locale: string = 'fr-FR'
): string => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    console.warn('Invalid amount passed to formatCurrency:', amount);
    amount = 0;
  }
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${amount.toFixed(2)} ${currency}`;
  }
};

/**
 * Formats a number as a percentage
 * @param value The value to format (e.g. 0.1 for 10%)
 * @param locale The locale to use for formatting (default: fr-FR)
 * @returns Formatted percentage string
 */
export const formatPercentage = (
  value: number, 
  locale: string = 'fr-FR'
): string => {
  if (typeof value !== 'number' || isNaN(value)) {
    console.warn('Invalid value passed to formatPercentage:', value);
    value = 0;
  }
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value);
  } catch (error) {
    console.error('Error formatting percentage:', error);
    return `${(value * 100).toFixed(1)}%`;
  }
};
