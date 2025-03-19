
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Award, Coins, Gift, ArrowUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/formatCurrency";
import { Cashback, CashbackTier } from "@/types/wallet";
import { useToast } from "@/hooks/use-toast";

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

const CashbackStatus = () => {
  const [cashback, setCashback] = useState<Cashback | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCashbackStatus = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setLoading(false);
          return;
        }

        // First check if the cashback table exists and the user has an entry
        const { data, error } = await supabase
          .from('cashback')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        // If user doesn't have cashback entry, create one
        if (!data) {
          const { data: newCashback, error: createError } = await supabase
            .from('cashback')
            .insert({
              user_id: user.id,
              balance: 0,
              lifetime_earned: 0,
              tier: 'bronze',
              tier_progress: 0,
              last_updated: new Date().toISOString(),
              created_at: new Date().toISOString()
            })
            .select()
            .single();

          if (createError) throw createError;
          setCashback(newCashback as Cashback);
        } else {
          setCashback(data as Cashback);
        }
      } catch (error) {
        console.error("Error fetching cashback status:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger votre statut de cashback",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCashbackStatus();
  }, []);

  const getNextTier = (currentTier: string): CashbackTier | null => {
    if (currentTier === 'bronze') return tierDetails.silver;
    if (currentTier === 'silver') return tierDetails.gold;
    return null;
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'gold':
        return <Award className="h-8 w-8 text-yellow-500" />;
      case 'silver':
        return <Award className="h-8 w-8 text-gray-400" />;
      default:
        return <Award className="h-8 w-8 text-amber-500" />;
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="h-48 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!cashback) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center p-4">
            <p>Connectez-vous pour voir votre statut de cashback</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const nextTier = getNextTier(cashback.tier);
  const currentTierDetails = tierDetails[cashback.tier];

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">Cashback & Fidélité</CardTitle>
          <Badge 
            variant="outline" 
            className={`${currentTierDetails.color} text-white px-3 py-1 capitalize`}
          >
            Niveau {cashback.tier}
          </Badge>
        </div>
        <CardDescription>
          Gagnez du cashback à chaque commande et accédez à des avantages exclusifs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${currentTierDetails.color}`}>
            <Coins className="h-8 w-8 text-white" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Cashback disponible</p>
            <p className="text-2xl font-semibold">{formatCurrency(cashback.balance)}</p>
          </div>
        </div>

        {nextTier && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progression vers {nextTier.name}</span>
              <span>{formatCurrency(nextTier.minimum_points - cashback.lifetime_earned)} restants</span>
            </div>
            <Progress value={cashback.tier_progress} className={currentTierDetails.color} />
            <p className="text-xs text-muted-foreground">
              {formatCurrency(cashback.lifetime_earned)} / {formatCurrency(nextTier.minimum_points)} pour atteindre le niveau {nextTier.name}
            </p>
          </div>
        )}

        <div className="space-y-3 pt-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Avantages de votre niveau
          </h4>
          <ul className="space-y-2">
            {currentTierDetails.benefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <div className={`h-2 w-2 rounded-full ${currentTierDetails.color}`}></div>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-2">
          <p className="text-sm text-muted-foreground">
            Total gagné à vie: {formatCurrency(cashback.lifetime_earned)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CashbackStatus;
