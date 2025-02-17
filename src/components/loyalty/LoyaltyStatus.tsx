
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Award, Crown, Gift } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface LoyaltyStatus {
  points: number;
  lifetime_points: number;
  tier_name: string;
  points_to_next_tier: number | null;
  benefits: string[];
}

export default function LoyaltyStatus() {
  const [status, setStatus] = useState<LoyaltyStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLoyaltyStatus();
  }, []);

  const fetchLoyaltyStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('loyalty_points')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setStatus({
          points: data.points,
          lifetime_points: data.lifetime_points,
          tier_name: data.tier_name,
          points_to_next_tier: data.points_to_next_tier,
          benefits: Array.isArray(data.benefits) ? data.benefits : JSON.parse(data.benefits)
        });
      }
    } catch (error) {
      console.error('Error fetching loyalty status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger votre statut de fidélité",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!status) {
    return <div>Connectez-vous pour voir votre statut de fidélité</div>;
  }

  const getTierIcon = () => {
    switch (status.tier_name) {
      case 'Diamond':
        return <Crown className="h-8 w-8 text-purple-500" />;
      case 'Gold':
        return <Award className="h-8 w-8 text-yellow-500" />;
      case 'Silver':
        return <Award className="h-8 w-8 text-gray-400" />;
      default:
        return <Award className="h-8 w-8 text-orange-500" />;
    }
  };

  const getTierColor = () => {
    switch (status.tier_name) {
      case 'Diamond':
        return 'bg-purple-500';
      case 'Gold':
        return 'bg-yellow-500';
      case 'Silver':
        return 'bg-gray-400';
      default:
        return 'bg-orange-500';
    }
  };

  const getProgress = () => {
    if (!status.points_to_next_tier) return 100;
    const totalPointsNeeded = status.points + status.points_to_next_tier;
    return (status.points / totalPointsNeeded) * 100;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-6">
        {getTierIcon()}
        <div>
          <h2 className="text-xl font-bold">Niveau {status.tier_name}</h2>
          <p className="text-sm text-gray-500">
            {status.points} points accumulés
          </p>
        </div>
      </div>

      {status.points_to_next_tier && (
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span>Progression vers le niveau suivant</span>
            <span>{status.points_to_next_tier} points restants</span>
          </div>
          <Progress value={getProgress()} className={getTierColor()} />
        </div>
      )}

      <div className="space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Vos avantages
        </h3>
        <ul className="space-y-2">
          {status.benefits.map((benefit, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <span className={`h-2 w-2 rounded-full ${getTierColor()}`} />
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 pt-6 border-t">
        <p className="text-sm text-gray-500">
          Points accumulés depuis le début : {status.lifetime_points}
        </p>
      </div>
    </Card>
  );
}
