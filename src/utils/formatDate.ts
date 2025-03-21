
import { format, formatDistance, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Formats a date string to a readable date format
 * @param dateString ISO date string
 * @param formatString Format string to use
 * @returns Formatted date string
 */
export const formatDate = (dateString: string, formatString: string = 'dd MMM yyyy'): string => {
  try {
    return format(parseISO(dateString), formatString, { locale: fr });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Returns a relative time string (e.g. "5 minutes ago")
 * @param dateString ISO date string
 * @returns Relative time string
 */
export const timeAgo = (dateString: string): string => {
  try {
    return formatDistance(parseISO(dateString), new Date(), { 
      addSuffix: true,
      locale: fr
    });
  } catch (error) {
    console.error('Error calculating time ago:', error);
    return dateString;
  }
};

/**
 * Formats a date string to a time format (e.g. "14:30")
 * @param dateString ISO date string
 * @returns Formatted time string
 */
export const formatTime = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'HH:mm', { locale: fr });
  } catch (error) {
    console.error('Error formatting time:', error);
    return dateString;
  }
};

/**
 * Formats a date string to display both date and time
 * @param dateString ISO date string
 * @returns Formatted date and time string
 */
export const formatDateTime = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'dd MMM yyyy HH:mm', { locale: fr });
  } catch (error) {
    console.error('Error formatting date time:', error);
    return dateString;
  }
};
