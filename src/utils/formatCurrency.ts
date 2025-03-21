
/**
 * Format a number as currency
 * @param amount The amount to format
 * @param currency The currency code (default: 'XAF')
 * @param locale The locale (default: 'fr-CG')
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number, 
  currency: string = 'XAF', 
  locale: string = 'fr-CG'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a number as currency without the currency symbol
 * @param amount The amount to format
 * @param locale The locale (default: 'fr-CG')
 * @returns Formatted number string
 */
export function formatNumberWithCommas(
  amount: number,
  locale: string = 'fr-CG'
): string {
  return new Intl.NumberFormat(locale).format(amount);
}
