
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names into a single string using clsx and tailwind-merge
 * This is useful for conditionally applying classes in components
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
