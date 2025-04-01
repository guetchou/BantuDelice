
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Cashback } from '@/types/wallet';

interface LoyaltyContextType {
  loyaltyPoints: Cashback | null;
  isLoading: boolean;
  error: string | null;
  refetchLoyaltyPoints: () => Promise<void>;
}

const LoyaltyContext = createContext<LoyaltyContextType | undefined>(undefined);

export function LoyaltyProvider({ children }: { children: ReactNode }) {
  const [loyaltyPoints, setLoyaltyPoints] = useState<Cashback | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchLoyaltyPoints = async () => {
    try {
      const { data } = await supabase.auth.getUser();
      
      if (!data.user) {
        setLoyaltyPoints(null);
        return;
      }

      let { data: loyaltyData, error } = await supabase
        .from('loyalty_points')
        .select('*')
        .eq('user_id', data.user.id)
        .maybeSingle();

      if (error) throw error;

      // Si aucune entrée n'existe, on en crée une
      if (!loyaltyData) {
        const { data: newLoyaltyPoints, error: insertError } = await supabase
          .from('loyalty_points')
          .insert([
            { 
              user_id: data.user.id,
              points: 0,
              balance: 0,
              tier_name: 'Bronze',
              tier: 'bronze',
              tier_progress: 0,
              points_to_next_tier: 1000,
              benefits: ['Accès aux récompenses de base']
            }
          ])
          .select()
          .single();

        if (insertError) throw insertError;
        loyaltyData = newLoyaltyPoints;
      }

      if (loyaltyData) {
        const parsedBenefits = loyaltyData.benefits && typeof loyaltyData.benefits === 'string' 
          ? JSON.parse(loyaltyData.benefits)
          : Array.isArray(loyaltyData.benefits) 
            ? loyaltyData.benefits 
            : [];

        setLoyaltyPoints({
          ...loyaltyData,
          benefits: parsedBenefits.map((benefit: any) => String(benefit))
        } as Cashback);
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
