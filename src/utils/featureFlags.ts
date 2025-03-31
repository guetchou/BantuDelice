
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
        const { data, error } = await supabase
          .from('feature_flags')
          .select('enabled')
          .eq('name', featureName)
          .single();

        if (error) {
          console.warn(`Erreur lors de la récupération du feature flag '${featureName}':`, error);
          // Utiliser la valeur par défaut en cas d'erreur
          setIsEnabled(defaultFeatures[featureName] || false);
        } else if (data) {
          setIsEnabled(data.enabled);
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

export default useFeature;
