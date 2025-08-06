
import { useState, useEffect } from 'react';
import apiService from '@/services/api';

// Types des fonctionnalités
export type FeatureFlag = 
  | 'referral_program' 
  | 'influencer_campaigns'
  | 'delivery_tracking'
  | 'ride_sharing'
  | 'premium_restaurants'
  | 'specialized_services'
  | 'professional_services';

// État initial par défaut (pour le développement local)
const defaultFeatures: Record<FeatureFlag, boolean> = {
  referral_program: true,
  influencer_campaigns: true,
  delivery_tracking: true,
  ride_sharing: true,
  premium_restaurants: true,
  specialized_services: true,
  professional_services: true
};

// Hook pour vérifier si une fonctionnalité est activée
export const useFeature = (featureName: FeatureFlag): boolean => {
  const [isEnabled, setIsEnabled] = useState<boolean>(defaultFeatures[featureName] || false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFeatureFlag = async () => {
      try {
        // Utiliser apiService au lieu de supabase
        const response = await apiService.getFeatureFlags();
        const featureFlag = response.find((flag: unknown) => flag.name === featureName);
        
        if (featureFlag) {
          setIsEnabled(featureFlag.enabled);
        } else {
          // Utiliser la valeur par défaut si le flag n'est pas trouvé
          setIsEnabled(defaultFeatures[featureName] || false);
        }
      } catch (error) {
        console.error(`Erreur lors de la vérification du feature flag '${featureName}':`, error);
        setIsEnabled(defaultFeatures[featureName] || false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatureFlag();
  }, [featureName]);

  return isEnabled;
};

// Hook pour gérer tous les feature flags
export const useFeatureFlags = () => {
  const [featureFlags, setFeatureFlags] = useState<Record<FeatureFlag, boolean>>(defaultFeatures);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAllFeatureFlags = async () => {
      try {
        const response = await apiService.getFeatureFlags();
        const flagsMap: Record<FeatureFlag, boolean> = { ...defaultFeatures };
        
        response.forEach((flag: unknown) => {
          if (flag.name in defaultFeatures) {
            flagsMap[flag.name as FeatureFlag] = flag.enabled;
          }
        });
        
        setFeatureFlags(flagsMap);
      } catch (error) {
        console.error('Erreur lors de la récupération des feature flags:', error);
        // Utiliser les valeurs par défaut en cas d'erreur
        setFeatureFlags(defaultFeatures);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllFeatureFlags();
  }, []);

  return { featureFlags, isLoading };
};

export default useFeature;
