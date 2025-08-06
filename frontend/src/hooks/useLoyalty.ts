
import { useState } from 'react';
import apiService from '@/services/api';
import { useToast } from './use-toast';
import { Cashback } from '@/types/wallet';

interface LoyaltyHookOptions {
  userId?: string;
}

type LoyaltyStatus = Partial<Cashback> & {
  points?: number;
  lifetime_points?: number;
  updated_at?: string;
}

export function useLoyalty(options?: LoyaltyHookOptions) {
  const [status, setStatus] = useState<LoyaltyStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const fetchLoyaltyStatus = async () => {
    if (!options?.userId) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch loyalty status from the API
      const { data, error } = await supabase
        .from('loyalty_points')
        .select('*')
        .eq('user_id', options.userId)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Handle benefits which might be stored as a JSON string
        const parsedBenefits = data.benefits && typeof data.benefits === 'string' 
          ? JSON.parse(data.benefits)
          : Array.isArray(data.benefits) 
            ? data.benefits 
            : [];
        
        setStatus({
          ...data,
          benefits: parsedBenefits,
          tier_name: data.tier_name || data.tier,
          tier: data.tier || data.tier_name,
          updated_at: data.updated_at || data.created_at || new Date().toISOString()
        });
      } else {
        // No loyalty record found
        setStatus(null);
      }
    } catch (err: unknown) {
      console.error('Error fetching loyalty status:', err);
      setError(err.message || 'Failed to fetch loyalty status');
    } finally {
      setIsLoading(false);
    }
  };
  
  const addPoints = async (points: number, reason: string = 'Points earned') => {
    if (!options?.userId || !status) {
      console.error('Cannot add points: userId or status is missing');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Add points to the user's balance
      const newPoints = (status.points || 0) + points;
      const newLifetimePoints = (status.lifetime_points || 0) + points;
      
      // Update loyalty status in database
      const { error: updateError } = await supabase
        .from('loyalty_points')
        .update({
          points: newPoints,
          lifetime_points: newLifetimePoints,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', options.userId);
      
      if (updateError) {
        throw updateError;
      }
      
      // Record the transaction
      const { error: transactionError } = await supabase
        .from('loyalty_transactions')
        .insert({
          user_id: options.userId,
          amount: points,
          type: 'earn',
          description: reason,
          created_at: new Date().toISOString()
        });
      
      if (transactionError) {
        console.error('Error recording loyalty transaction:', transactionError);
      }
      
      // Update local state
      setStatus(prev => prev ? {
        ...prev,
        points: newPoints,
        lifetime_points: newLifetimePoints
      } : null);
      
      toast({
        title: "Points ajoutés !",
        description: `${points} points ont été ajoutés à votre compte de fidélité.`,
        variant: "default"
      });
      
      return { success: true };
      
    } catch (err: unknown) {
      console.error('Error adding loyalty points:', err);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter des points de fidélité.",
        variant: "destructive"
      });
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    status,
    isLoading,
    error,
    fetchLoyaltyStatus,
    addPoints
  };
}
