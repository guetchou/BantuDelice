
import { useState, useEffect } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Award, Coins, ArrowUpDown, RefreshCw, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Cashback as CashbackType } from "@/types/wallet";
import CashbackStatus from "@/components/cashback/CashbackStatus";
import CashbackTransactions from "@/components/cashback/CashbackTransactions";
import CashbackTransfer from "@/components/cashback/CashbackTransfer";
import CashbackLeaderboard from "@/components/cashback/CashbackLeaderboard";
import { ShareSocial } from "@/components/sharing/ShareSocial";

export default function Cashback() {
  usePageTitle({ title: "Cashback & Fidélité" });
  const [cashback, setCashback] = useState<CashbackType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCashbackData = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setLoading(false);
          return;
        }

        // Check if the cashback table exists and the user has an entry
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
          setCashback(newCashback as CashbackType);
        } else {
          setCashback(data as CashbackType);
        }
      } catch (error) {
        console.error("Error fetching cashback data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCashbackData();

    // Set up real-time subscription for cashback updates
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cashback'
        },
        (payload) => {
          console.log('Cashback change received:', payload);
          fetchCashbackData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleTransferComplete = () => {
    // Refresh cashback data after transfer
    const fetchCashbackData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from('cashback')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (data) {
          setCashback(data as CashbackType);
        }
      } catch (error) {
        console.error("Error refreshing cashback data:", error);
      }
    };

    fetchCashbackData();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Coins className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Cashback & Fidélité</h1>
        </div>
        <ShareSocial 
          title="Mon cashback BuntuDelice" 
          text={cashback ? `J'ai gagné ${cashback.balance} FCFA de cashback sur BuntuDelice! Rejoignez-moi pour profiter de réductions et avantages.` : "Programme de cashback BuntuDelice"}
          url={window.location.href}
        />
      </div>

      <Tabs defaultValue="status" className="w-full">
        <TabsList className="mb-6 grid w-full md:grid-cols-4 grid-cols-2">
          <TabsTrigger value="status" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            <span className="hidden md:inline">Mon Statut</span>
            <span className="md:hidden">Statut</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            <span className="hidden md:inline">Historique</span>
            <span className="md:hidden">Historique</span>
          </TabsTrigger>
          <TabsTrigger value="transfer" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            <span className="hidden md:inline">Transferts</span>
            <span className="md:hidden">Transferts</span>
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            <span className="hidden md:inline">Classement</span>
            <span className="md:hidden">Top</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="status">
          <div className="grid grid-cols-1 gap-6">
            <CashbackStatus />
          </div>
        </TabsContent>

        <TabsContent value="history">
          <ScrollArea className="h-[600px] pr-4">
            <CashbackTransactions />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="transfer">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CashbackTransfer 
              cashback={cashback} 
              onTransferComplete={handleTransferComplete} 
            />
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Avantages du partage</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Invitez vos amis</h4>
                    <p className="text-sm text-muted-foreground">
                      Partagez votre cashback avec vos proches et gagnez encore plus de points de fidélité.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Coins className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Bonus de parrainage</h4>
                    <p className="text-sm text-muted-foreground">
                      Recevez 500 FCFA de cashback supplémentaire pour chaque ami qui s'inscrit avec votre code.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Crown className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Progressez plus vite</h4>
                    <p className="text-sm text-muted-foreground">
                      Les transferts comptent pour votre progression vers les niveaux supérieurs de fidélité.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard">
          <CashbackLeaderboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
