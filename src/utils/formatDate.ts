
import { format, formatDistance, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Format a date string into a user-friendly format
 * @param dateString ISO date string
 * @param formatString Format string (default: 'dd MMM yyyy à HH:mm')
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string, 
  formatString: string = 'dd MMM yyyy à HH:mm'
): string {
  try {
    return format(parseISO(dateString), formatString, { locale: fr });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

/**
 * Get relative time from a date string (e.g., "il y a 3 minutes")
 * @param dateString ISO date string
 * @param baseDate Base date to compare against (default: new Date())
 * @returns Relative time string
 */
export function getRelativeTime(
  dateString: string, 
  baseDate: Date = new Date()
): string {
  try {
    return formatDistance(parseISO(dateString), baseDate, {
      addSuffix: true,
      locale: fr
    });
  } catch (error) {
    console.error('Error getting relative time:', error);
    return dateString;
  }
}

/**
 * Format a date for input fields
 * @param dateString ISO date string
 * @returns Date formatted as YYYY-MM-DD
 */
export function formatDateForInput(dateString: string): string {
  try {
    return format(parseISO(dateString), 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error formatting date for input:', error);
    return '';
  }
}

/**
 * Format a time for input fields
 * @param dateString ISO date string
 * @returns Time formatted as HH:MM
 */
export function formatTimeForInput(dateString: string): string {
  try {
    return format(parseISO(dateString), 'HH:mm');
  } catch (error) {
    console.error('Error formatting time for input:', error);
    return '';
  }
}
