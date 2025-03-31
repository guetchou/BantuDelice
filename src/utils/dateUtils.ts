
import { format, formatDistance, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Format a date string to a readable format
 * @param dateString ISO date string
 * @param formatStr Format string for date-fns
 * @returns Formatted date string
 */
export const formatDate = (dateString: string, formatStr: string = 'dd/MM/yyyy'): string => {
  try {
    const date = parseISO(dateString);
    return format(date, formatStr, { locale: fr });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Get relative time (e.g., "2 hours ago")
 * @param dateString ISO date string
 * @returns Relative time string
 */
export const getRelativeTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return formatDistance(date, new Date(), { 
      addSuffix: true,
      locale: fr 
    });
  } catch (error) {
    console.error('Error getting relative time:', error);
    return dateString;
  }
};

/**
 * Format time from a date string (e.g., "14:30")
 * @param dateString ISO date string
 * @returns Time string
 */
export const formatTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'HH:mm', { locale: fr });
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
};

/**
 * Check if a date is today
 * @param dateString ISO date string
 * @returns Boolean indicating if date is today
 */
export const isToday = (dateString: string): boolean => {
  try {
    const date = parseISO(dateString);
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  } catch (error) {
    console.error('Error checking if date is today:', error);
    return false;
  }
};

/**
 * Format a weekday name from a date string
 * @param dateString ISO date string
 * @returns Weekday name
 */
export const formatWeekday = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'EEEE', { locale: fr });
  } catch (error) {
    console.error('Error formatting weekday:', error);
    return '';
  }
};

export default {
  formatDate,
  getRelativeTime,
  formatTime,
  isToday,
  formatWeekday
};
