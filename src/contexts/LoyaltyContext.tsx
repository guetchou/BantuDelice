import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LoyaltyPoints {
  points: number;
  tier_name: string;
  points_to_next_tier: number;
  benefits: string[];
}

interface LoyaltyContextType {
  loyalty: LoyaltyPoints | null;
  isLoading: boolean;
  error: Error | null;
}

const LoyaltyContext = createContext<LoyaltyContextType | undefined>(undefined);

export function LoyaltyProvider({ children }: { children: React.ReactNode }) {
  const [loyalty, setLoyalty] = useState<LoyaltyPoints | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLoyaltyPoints = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('loyalty_points')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          const loyaltyData: LoyaltyPoints = {
            points: data.points,
            tier_name: data.tier_name,
            points_to_next_tier: data.points_to_next_tier,
            benefits: Array.isArray(data.benefits) ? data.benefits : []
          };
          setLoyalty(loyaltyData);
        }
      } catch (error) {
        console.error('Error fetching loyalty points:', error);
        setError(error as Error);
        toast({
          title: "Erreur",
          description: "Impossible de charger vos points de fidélité",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoyaltyPoints();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'loyalty_points'
        },
        (payload) => {
          console.log('Loyalty points change received:', payload);
          fetchLoyaltyPoints();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <LoyaltyContext.Provider value={{ loyalty, isLoading, error }}>
      {children}
    </LoyaltyContext.Provider>
  );
}

export const useLoyalty = () => {
  const context = useContext(LoyaltyContext);
  if (context === undefined) {
    throw new Error('useLoyalty must be used within a LoyaltyProvider');
  }
  return context;
};