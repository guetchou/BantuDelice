
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a price in cents to a currency string
 */
export function formatPrice(price: number, options: {
  currency?: "USD" | "EUR" | "GBP" | "BDT" | "XOF";
  notation?: Intl.NumberFormatOptions["notation"];
} = {}) {
  const { currency = "XOF", notation = "standard" } = options;

  const currencySymbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    BDT: "৳",
    XOF: "FCFA"
  };

  // Format with the currency symbol
  if (currency === "XOF") {
    // Special formatting for XOF/FCFA
    return `${Math.round(price).toLocaleString()} ${currencySymbols[currency]}`;
  }

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    notation,
  }).format(price);
}

/**
 * Calculate the discount percentage
 */
export function calculateDiscount(originalPrice: number, discountedPrice: number): number {
  if (originalPrice === 0) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}

/**
 * Format a date string
 */
export function formatDate(dateString: string, format: string = "medium"): string {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) return "";
  
  switch (format) {
    case "short":
      return date.toLocaleDateString("fr-FR");
    case "medium":
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    case "long":
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    case "time":
      return date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    case "datetime":
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    default:
      return date.toLocaleDateString("fr-FR");
  }
}
