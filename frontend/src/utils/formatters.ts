
/**
 * Format a number as a currency string
 * @param value The value to format
 * @param currency The currency code (default: XAF)
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, currency: string = 'XAF'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

/**
 * Format a date to a readable string
 * @param date The date to format
 * @param format The format to use (default: dd/MM/yyyy)
 * @returns Formatted date string
 */
export function formatDate(date: string | Date, format: string = 'dd/MM/yyyy'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('fr-FR');
}

/**
 * Format a distance in kilometers
 * @param km The distance in kilometers
 * @returns Formatted distance string
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

/**
 * Format a duration in minutes
 * @param minutes The duration in minutes
 * @returns Formatted duration string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours} h ${mins} min` : `${hours} h`;
}

/**
 * Format a phone number for display
 * @param phone The phone number to format
 * @returns Formatted phone number
 */
export function formatPhoneNumber(phone: string): string {
  // Basic formatting for Congolese numbers
  if (phone.startsWith('+242') && phone.length >= 12) {
    return `+242 ${phone.substring(4, 7)} ${phone.substring(7, 10)} ${phone.substring(10)}`;
  }
  return phone;
}
