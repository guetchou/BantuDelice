
/**
 * Formats a number as currency in FCFA
 * @param amount The amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString()} FCFA`;
};
