
/**
 * Formats a date string into a time format (HH:MM)
 * @param dateString ISO date string to format
 * @returns Formatted time string or null if invalid
 */
export function formatTimeString(dateString: string | null): string | null {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}
