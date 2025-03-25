
import { useState, useEffect, useCallback } from 'react';
import { loyaltyService } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';
import pb from '@/lib/pocketbase';
import { LoyaltyTier } from '@/types/loyalty';

interface UseLoyaltyProps {
  userId?: string;
}

interface LoyaltyStatus {
  id: string;
  user_id: string;
  points: number;
  lifetime_points: number;
  tier_name: LoyaltyTier;
  points_to_next_tier: number | null;
  created_at: string;
  updated_at: string;
}

export function useLoyalty({ userId }: UseLoyaltyProps = {}) {
  const [status, setStatus] = useState<LoyaltyStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchLoyaltyStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Récupérer l'utilisateur actuel si userId n'est pas fourni
      let currentUserId = userId;
      if (!currentUserId) {
        if (pb.authStore.isValid) {
          currentUserId = pb.authStore.model?.id;
        } else {
          setIsLoading(false);
          return;
        }
      }
      
      // Chercher le statut de fidélité de l'utilisateur
      const response = await loyaltyService.getAll({ user_id: currentUserId });
      
      if (response.error) {
        throw response.error;
      }
      
      if (response.data && response.data.length > 0) {
        setStatus(response.data[0] as unknown as LoyaltyStatus);
      } else {
        // Créer un nouveau statut si aucun n'existe
        const defaultStatus = {
          user_id: currentUserId,
          points: 0,
          lifetime_points: 0,
          tier_name: 'bronze' as LoyaltyTier,
          points_to_next_tier: 100,
          benefits: JSON.stringify(['5% de remise sur la prochaine commande']),
        };
        
        const createResponse = await loyaltyService.create(defaultStatus);
        if (createResponse.error) {
          throw createResponse.error;
        }
        setStatus(createResponse.data as unknown as LoyaltyStatus);
      }
      
    } catch (err) {
      console.error('Erreur lors de la récupération du statut de fidélité:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast({
        title: "Erreur",
        description: "Impossible de charger votre statut de fidélité",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, toast]);

  const addPoints = useCallback(async (pointsToAdd: number, reason: string = 'Achat') => {
    if (!status?.id) {
      await fetchLoyaltyStatus();
      if (!status?.id) return;
    }
    
    try {
      const newPoints = status.points + pointsToAdd;
      const newLifetimePoints = status.lifetime_points + pointsToAdd;
      
      // Déterminer le nouveau niveau
      let newTier = status.tier_name;
      let pointsToNextTier = status.points_to_next_tier;
      
      if (newPoints >= 1000) {
        newTier = 'diamond';
        pointsToNextTier = null;
      } else if (newPoints >= 500) {
        newTier = 'gold';
        pointsToNextTier = 1000 - newPoints;
      } else if (newPoints >= 200) {
        newTier = 'silver';
        pointsToNextTier = 500 - newPoints;
      } else {
        pointsToNextTier = 200 - newPoints;
      }
      
      // Mise à jour du statut
      const response = await loyaltyService.update(status.id, {
        points: newPoints,
        lifetime_points: newLifetimePoints,
        tier_name: newTier,
        points_to_next_tier: pointsToNextTier,
        updated_at: new Date().toISOString()
      });
      
      if (response.error) {
        throw response.error;
      }
      
      setStatus(response.data as unknown as LoyaltyStatus);
      
      // Notification de l'utilisateur
      toast({
        title: "Points ajoutés",
        description: `${pointsToAdd} points ajoutés à votre compte de fidélité (${reason})`,
      });
      
      // Si l'utilisateur a changé de niveau
      if (newTier !== status.tier_name) {
        toast({
          title: "Niveau augmenté!",
          description: `Félicitations! Vous êtes maintenant au niveau ${newTier}`,
          variant: "success"
        });
      }
      
      return response.data;
      
    } catch (err) {
      console.error('Erreur lors de l\'ajout de points:', err);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter des points",
        variant: "destructive",
      });
      return null;
    }
  }, [status, fetchLoyaltyStatus, toast]);

  // Récupérer les points au chargement initial
  useEffect(() => {
    fetchLoyaltyStatus();
  }, [fetchLoyaltyStatus]);

  return {
    status,
    isLoading,
    error,
    fetchLoyaltyStatus,
    addPoints,
  };
}
