
import { toast } from 'sonner';

export function useFeatureAvailability() {
  const checkFeatureAvailability = (featureName: string): boolean => {
    // Liste des fonctionnalités complètement implémentées
    const availableFeatures = ['taxi-booking'];
    
    const isAvailable = availableFeatures.includes(featureName);
    
    if (!isAvailable) {
      toast.info(`La fonctionnalité "${featureName}" est en cours de développement`, {
        description: "Cette fonctionnalité sera bientôt disponible!"
      });
    }
    
    return isAvailable;
  };
  
  return {
    checkFeatureAvailability
  };
}
