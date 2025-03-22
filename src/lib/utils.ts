
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a price value
 * @param price Price to format
 * @param locale Locale to use for formatting
 * @param currency Currency code
 * @returns Formatted price string
 */
export function formatPrice(
  price: number, 
  locale: string = 'fr-FR', 
  currency: string = 'FCFA'
): string {
  return new Intl.NumberFormat(locale, { 
    style: 'currency', 
    currency,
    currencyDisplay: 'narrowSymbol',
  }).format(price);
}

/**
 * Format a date
 * @param date Date to format
 * @param locale Locale to use for formatting
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date, 
  locale: string = 'fr-FR'
): string {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  
  return new Intl.DateTimeFormat(locale, options).format(
    typeof date === 'string' ? new Date(date) : date
  );
}

/**
 * Truncate text to a specified length
 * @param text Text to truncate
 * @param maxLength Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
