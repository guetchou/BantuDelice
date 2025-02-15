
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LoyaltyPoints {
  points: number;
  tier_name: string;
  points_to_next_tier: number | null;
  benefits: string[];
}

interface LoyaltyContextType {
  loyaltyPoints: LoyaltyPoints | null;
  isLoading: boolean;
  error: string | null;
  refetchLoyaltyPoints: () => Promise<void>;
}

const LoyaltyContext = createContext<LoyaltyContextType | undefined>(undefined);

export function LoyaltyProvider({ children }: { children: ReactNode }) {
  const [loyaltyPoints, setLoyaltyPoints] = useState<LoyaltyPoints | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchLoyaltyPoints = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoyaltyPoints(null);
        return;
      }

      let { data, error } = await supabase
        .from('loyalty_points')
        .select('points, tier_name, points_to_next_tier, benefits')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      // Si aucune entrée n'existe, on en crée une
      if (!data) {
        const { data: newLoyaltyPoints, error: insertError } = await supabase
          .from('loyalty_points')
          .insert([
            { 
              user_id: user.id,
              points: 0,
              tier_name: 'Bronze',
              points_to_next_tier: 1000,
              benefits: ['Accès aux récompenses de base']
            }
          ])
          .select('points, tier_name, points_to_next_tier, benefits')
          .single();

        if (insertError) throw insertError;
        data = newLoyaltyPoints;
      }

      if (data) {
        const parsedBenefits = data.benefits && typeof data.benefits === 'string' 
          ? JSON.parse(data.benefits)
          : Array.isArray(data.benefits) 
            ? data.benefits 
            : [];

        setLoyaltyPoints({
          points: data.points,
          tier_name: data.tier_name,
          points_to_next_tier: data.points_to_next_tier,
          benefits: parsedBenefits.map((benefit: any) => String(benefit))
        });
      }
    } catch (err) {
      console.error('Error fetching loyalty points:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast({
        title: "Error",
        description: "Failed to fetch loyalty points",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLoyaltyPoints();

    // Set up real-time subscription
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
    <LoyaltyContext.Provider value={{
      loyaltyPoints,
      isLoading,
      error,
      refetchLoyaltyPoints: fetchLoyaltyPoints
    }}>
      {children}
    </LoyaltyContext.Provider>
  );
}

export function useLoyalty() {
  const context = useContext(LoyaltyContext);
  if (context === undefined) {
    throw new Error('useLoyalty must be used within a LoyaltyProvider');
  }
  return context;
}
