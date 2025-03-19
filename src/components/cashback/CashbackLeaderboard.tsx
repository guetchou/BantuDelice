
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Award, Medal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/formatCurrency";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Cashback } from '@/types/payment';

interface LeaderboardUser {
  user_id: string;
  full_name: string;
  avatar_url?: string;
  lifetime_earned: number;
  tier: string;
  rank: number;
}

// Créez cette table dans Supabase ou utilisez une autre qui existe
const CASHBACK_TABLE = 'cashbacks';
const PROFILES_TABLE = 'profiles';

const CashbackLeaderboard = ({ limit = 10 }: { limit?: number }) => {
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setCurrentUserId(user.id);
        }

        // Simulation de données en attendant que la table soit créée
        const simulatedData: LeaderboardUser[] = [
          {
            user_id: '1',
            full_name: 'Amadou Diallo',
            avatar_url: '',
            lifetime_earned: 15000,
            tier: 'gold',
            rank: 1
          },
          {
            user_id: '2',
            full_name: 'Fatou Sow',
            avatar_url: '',
            lifetime_earned: 12500,
            tier: 'gold',
            rank: 2
          },
          {
            user_id: '3',
            full_name: 'Ibrahim Touré',
            avatar_url: '',
            lifetime_earned: 10000,
            tier: 'silver',
            rank: 3
          },
          {
            user_id: '4',
            full_name: 'Marie Diop',
            avatar_url: '',
            lifetime_earned: 7500,
            tier: 'silver',
            rank: 4
          },
          {
            user_id: '5',
            full_name: 'Jean Ndoye',
            avatar_url: '',
            lifetime_earned: 5000,
            tier: 'bronze',
            rank: 5
          }
        ];

        // Une fois que la table est créée dans Supabase, décommenter ce code
        /*
        const { data, error } = await supabase
          .from(CASHBACK_TABLE)
          .select(`
            user_id,
            lifetime_earned,
            tier,
            profiles:user_id (
              full_name,
              avatar_url
            )
          `)
          .order('lifetime_earned', { ascending: false })
          .limit(limit);

        if (error) throw error;

        // Transform data to include name and profile info
        const formattedData = data.map((item, index) => ({
          user_id: item.user_id,
          full_name: item.profiles?.full_name || 'Utilisateur BuntuDelice',
          avatar_url: item.profiles?.avatar_url,
          lifetime_earned: item.lifetime_earned,
          tier: item.tier,
          rank: index + 1
        }));

        setLeaders(formattedData as LeaderboardUser[]);
        */

        setLeaders(simulatedData);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [limit]);

  const getRankIcon = (rank: number) => {
    switch(rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />;
      default:
        return <span className="w-5 text-center font-medium">{rank}</span>;
    }
  };

  const getTierColorClass = (tier: string) => {
    switch(tier) {
      case 'gold':
        return 'bg-yellow-500';
      case 'silver':
        return 'bg-gray-400';
      default:
        return 'bg-amber-500';
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

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Meilleurs Cashbackers
        </CardTitle>
        <CardDescription>
          Les utilisateurs qui ont gagné le plus de cashback
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {leaders.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            Aucun utilisateur à afficher
          </div>
        ) : (
          <div className="space-y-2">
            {leaders.map((leader) => (
              <div 
                key={leader.user_id} 
                className={`flex items-center justify-between p-3 border rounded-lg ${
                  leader.user_id === currentUserId ? 'bg-muted/50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8">
                    {getRankIcon(leader.rank)}
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={leader.avatar_url || ''} alt={leader.full_name} />
                    <AvatarFallback>
                      {leader.full_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">
                      {leader.full_name}
                      {leader.user_id === currentUserId && " (Vous)"}
                    </p>
                    <div className="flex items-center gap-1">
                      <span 
                        className={`inline-block h-2 w-2 rounded-full ${getTierColorClass(leader.tier)}`}
                      ></span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {leader.tier}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="font-semibold">
                  {formatCurrency(leader.lifetime_earned)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CashbackLeaderboard;
