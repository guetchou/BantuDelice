
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Format a date for display
 * @param dateString ISO date string
 * @param formatString Format pattern (default: 'dd/MM/yyyy')
 * @returns Formatted date string
 */
export const formatDate = (dateString?: string, formatString: string = 'dd/MM/yyyy'): string => {
  if (!dateString) return 'N/A';
  
  try {
    return format(parseISO(dateString), formatString, { locale: fr });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Format a time for display
 * @param timeString ISO datetime string
 * @param formatString Format pattern (default: 'HH:mm')
 * @returns Formatted time string
 */
export const formatTime = (timeString?: string, formatString: string = 'HH:mm'): string => {
  if (!timeString) return 'N/A';
  
  try {
    return format(parseISO(timeString), formatString, { locale: fr });
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Invalid time';
  }
};

/**
 * Format a datetime for display
 * @param datetimeString ISO datetime string
 * @param formatString Format pattern (default: 'dd/MM/yyyy HH:mm')
 * @returns Formatted datetime string
 */
export const formatDateTime = (datetimeString?: string, formatString: string = 'dd/MM/yyyy HH:mm'): string => {
  if (!datetimeString) return 'N/A';
  
  try {
    return format(parseISO(datetimeString), formatString, { locale: fr });
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return 'Invalid datetime';
  }
};
