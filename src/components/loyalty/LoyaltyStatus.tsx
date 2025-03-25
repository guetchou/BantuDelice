
import { useEffect } from 'react';
import { useLoyalty } from '@/hooks/useLoyalty';
import { Award, Crown, Gift } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface LoyaltyStatusProps {
  userId?: string;
  showDetailedInfo?: boolean;
}

export default function LoyaltyStatus({ userId, showDetailedInfo = true }: LoyaltyStatusProps) {
  const { status, isLoading, error, fetchLoyaltyStatus } = useLoyalty({ userId });

  useEffect(() => {
    fetchLoyaltyStatus();
  }, [fetchLoyaltyStatus, userId]);

  const parseBenefits = (benefits: any): string[] => {
    if (Array.isArray(benefits)) return benefits;
    if (typeof benefits === 'string') {
      try {
        const parsed = JSON.parse(benefits);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
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

  const getTierIcon = () => {
    switch (status.tier_name) {
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
    switch (status.tier_name) {
      case 'diamond':
        return 'bg-purple-500';
      case 'gold':
        return 'bg-yellow-500';
      case 'silver':
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

  const benefits = parseBenefits(status.benefits);

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

      {showDetailedInfo && (
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Vos avantages
          </h3>
          <ul className="space-y-2">
            {benefits.map((benefit, index) => (
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
          Points accumulés depuis le début : {status.lifetime_points}
        </p>
      </div>
    </Card>
  );
}
