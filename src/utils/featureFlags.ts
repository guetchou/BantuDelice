
// Feature flags management for progressive activation of features
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FeatureFlag = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'core' | 'marketing' | 'payment' | 'delivery' | 'restaurant' | 'user';
};

// Default feature flags configuration
const defaultFeatureFlags: FeatureFlag[] = [
  {
    id: 'premium_subscription',
    name: 'Abonnements Premium',
    description: 'Abonnements Premium pour restaurants et livreurs',
    enabled: true,
    category: 'marketing'
  },
  {
    id: 'referral_program',
    name: 'Programme de parrainage',
    description: 'Programme de parrainage pour les utilisateurs',
    enabled: true,
    category: 'marketing'
  },
  {
    id: 'influencer_campaigns',
    name: 'Campagnes influenceurs',
    description: 'Collaboration avec des influenceurs',
    enabled: true,
    category: 'marketing'
  },
  {
    id: 'wallet_management',
    name: 'Gestion du portefeuille',
    description: 'Gestion des portefeuilles utilisateurs et transactions',
    enabled: true,
    category: 'payment'
  },
  {
    id: 'mobile_money',
    name: 'Paiement Mobile Money',
    description: 'Paiements via Orange Money et MTN MoMo',
    enabled: true,
    category: 'payment'
  },
  {
    id: 'loyalty_points',
    name: 'Programme de fidélité',
    description: 'Points de fidélité et récompenses',
    enabled: true,
    category: 'user'
  },
];

// Create the feature flags store with persistence
interface FeatureFlagsState {
  flags: FeatureFlag[];
  isEnabled: (flagId: string) => boolean;
  setFlagEnabled: (flagId: string, enabled: boolean) => void;
  resetToDefaults: () => void;
}

export const useFeatureFlags = create<FeatureFlagsState>()(
  persist(
    (set, get) => ({
      flags: defaultFeatureFlags,
      
      isEnabled: (flagId: string) => {
        const flag = get().flags.find(f => f.id === flagId);
        return flag ? flag.enabled : false;
      },
      
      setFlagEnabled: (flagId: string, enabled: boolean) => {
        set(state => ({
          flags: state.flags.map(flag => 
            flag.id === flagId ? { ...flag, enabled } : flag
          )
        }));
      },
      
      resetToDefaults: () => {
        set({ flags: defaultFeatureFlags });
      }
    }),
    {
      name: 'buntudelice-feature-flags',
    }
  )
);

// Hook to check if a feature is enabled
export const useFeature = (flagId: string) => {
  return useFeatureFlags(state => state.isEnabled(flagId));
};
