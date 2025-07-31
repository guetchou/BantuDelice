
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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

/**
 * Format a date according to the specified format
 */
export function formatDate(dateString: string, formatStyle: 'short' | 'medium' | 'long' = 'medium'): string {
  try {
    const date = new Date(dateString);
    
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: formatStyle === 'short' ? '2-digit' : 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    if (formatStyle === 'short') {
      delete options.year;
    }
    
    return new Intl.DateTimeFormat('fr-FR', options).format(date);
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString;
  }
}
