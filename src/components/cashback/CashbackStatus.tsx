
import { useEffect } from 'react';
import { useLoyalty } from '@/hooks/useLoyalty';
import { Award, Crown, Gift } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Cashback, CashbackTier } from '@/types/wallet';

interface LoyaltyStatusProps {
  userId?: string;
  showDetailedInfo?: boolean;
}

export default function LoyaltyStatus({ userId, showDetailedInfo = true }: LoyaltyStatusProps) {
  const { status, isLoading, error, fetchLoyaltyStatus } = useLoyalty({ userId });

  useEffect(() => {
    fetchLoyaltyStatus();
  }, [fetchLoyaltyStatus, userId]);

  const tierDetails: Record<string, CashbackTier> = {
    bronze: {
      name: 'bronze',
      minimum_points: 0,
      cashback_rate: 0.05, // 5%
      benefits: ['5% de cashback sur chaque commande', 'Accès aux offres promotionnelles'],
      icon: 'Award',
      color: 'bg-amber-500'
    },
    silver: {
      name: 'silver',
      minimum_points: 5000,
      cashback_rate: 0.07, // 7%
      benefits: [
        '7% de cashback sur chaque commande', 
        'Accès aux offres promotionnelles',
        'Livraison gratuite une fois par mois'
      ],
      icon: 'Award',
      color: 'bg-gray-400'
    },
    gold: {
      name: 'gold',
      minimum_points: 15000,
      cashback_rate: 0.1, // 10%
      benefits: [
        '10% de cashback sur chaque commande',
        'Accès aux offres promotionnelles',
        'Livraison gratuite une fois par semaine',
        'Accès prioritaire aux nouveaux restaurants'
      ],
      icon: 'Award',
      color: 'bg-yellow-500'
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-2 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </Card>
    );
  }

  if (error || !status) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          {error ? 
            "Impossible de charger votre statut de fidélité" : 
            "Connectez-vous pour voir votre statut de fidélité"}
        </div>
      </Card>
    );
  }

  // Create a properly typed Cashback object from the status
  const cashbackStatus: Cashback = {
    id: status.id || '',
    user_id: status.user_id || '',
    balance: status.balance || 0,
    lifetime_earned: status.lifetime_earned || status.lifetime_points || 0,
    tier: status.tier || status.level || 'bronze',
    tier_name: status.tier_name || status.tier || status.level || 'bronze',
    tier_progress: status.tier_progress || 0,
    points_to_next_tier: status.points_to_next_tier || 0,
    benefits: Array.isArray(status.benefits) 
      ? status.benefits 
      : typeof status.benefits === 'string' 
        ? JSON.parse(status.benefits) 
        : [],
    last_updated: status.updated_at || status.last_updated || new Date().toISOString(),
    created_at: status.created_at || new Date().toISOString(),
    points: status.points || 0,
    lifetime_points: status.lifetime_points || 0,
  };

  const getTierIcon = () => {
    switch (cashbackStatus.tier_name.toLowerCase()) {
      case 'diamond':
        return <Crown className="h-8 w-8 text-purple-500" />;
      case 'gold':
        return <Award className="h-8 w-8 text-yellow-500" />;
      case 'silver':
        return <Award className="h-8 w-8 text-gray-400" />;
      default:
        return <Award className="h-8 w-8 text-orange-500" />;
    }
  };

  const getTierColor = () => {
    const currentTier = tierDetails[cashbackStatus.tier_name.toLowerCase()] || tierDetails.bronze;
    return currentTier.color;
  };

  const getProgress = () => {
    if (!cashbackStatus.points_to_next_tier) return 100;
    const totalPointsNeeded = (status.points || 0) + cashbackStatus.points_to_next_tier;
    return ((status.points || 0) / totalPointsNeeded) * 100;
  };

  const currentTier = tierDetails[cashbackStatus.tier_name.toLowerCase()] || tierDetails.bronze;
  const nextTierName = cashbackStatus.tier_name.toLowerCase() === 'bronze' ? 'silver' : 
                     cashbackStatus.tier_name.toLowerCase() === 'silver' ? 'gold' : null;
  const nextTier = nextTierName ? tierDetails[nextTierName] : null;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-6">
        {getTierIcon()}
        <div>
          <h2 className="text-xl font-bold">Niveau {cashbackStatus.tier_name}</h2>
          <p className="text-sm text-gray-500">
            {status.points} points accumulés
          </p>
        </div>
      </div>

      {cashbackStatus.points_to_next_tier && nextTier && (
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span>Progression vers le niveau suivant</span>
            <span>{cashbackStatus.points_to_next_tier} points restants</span>
          </div>
          <Progress value={getProgress()} className={getTierColor()} />
          <div className="text-xs text-gray-500">
            {status.points || 0}/{nextTier.minimum_points} points pour atteindre le niveau {nextTier.name}
          </div>
        </div>
      )}

      {showDetailedInfo && cashbackStatus.benefits && cashbackStatus.benefits.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Vos avantages
          </h3>
          <ul className="space-y-2">
            {cashbackStatus.benefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <span className={`h-2 w-2 rounded-full ${getTierColor()}`} />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 pt-6 border-t">
        <p className="text-sm text-gray-500">
          Points accumulés depuis le début : {status.lifetime_points || cashbackStatus.lifetime_earned || 0}
        </p>
      </div>
    </Card>
  );
}
