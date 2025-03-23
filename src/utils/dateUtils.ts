
/**
 * Formate une date en format local
 * @param dateString - La chaîne de date à formater
 * @param includeTime - Si l'heure doit être incluse
 * @returns La date formatée
 */
export const formatDate = (dateString?: string, includeTime: boolean = false): string => {
  if (!dateString) return 'Inconnue';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return 'Date invalide';
    }
    
    if (includeTime) {
      return `${date.toLocaleDateString()} à ${date.toLocaleTimeString()}`;
    }
    
    return date.toLocaleDateString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Erreur de format';
  }
};
