
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { WalletSummary, Transaction } from "@/types/wallet";
import { ArrowUpRight, ArrowDownLeft, DollarSign, BarChart4 } from 'lucide-react';
import { formatCurrency } from "@/utils/formatters";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface DriverWalletProps {
  driverId?: string;
}

interface DriverWalletData {
  id: string;
  driver_id: string;
  balance: number;
  currency: string;
  created_at: string;
  updated_at: string;
  commission_rate?: number;
  total_earnings?: number;
}

interface DriverTransactionData {
  id: string;
  driver_wallet_id: string;
  amount: number;
  type: 'earning' | 'withdrawal' | 'bonus' | 'fee' | 'withdraw' | 'deposit' | 'payment' | 'commission';
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  description?: string;
  reference_number?: string;
}

export default function DriverWallet({ driverId }: DriverWalletProps) {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<DriverWalletData | null>(null);
  const [transactions, setTransactions] = useState<DriverTransactionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<WalletSummary>({
    total_earnings: 0,
    total_withdrawals: 0,
    current_balance: 0,
    available_balance: 0,
    pending_earnings: 0,
  });
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const driver_id = driverId || user?.id;
        if (!driver_id) return;
        
        // Fetch wallet
        const { data: walletData, error: walletError } = await supabase
          .from('driver_wallets')
          .select('*')
          .eq('driver_id', driver_id)
          .single();
          
        if (walletError && walletError.code !== 'PGRST116') {
          throw walletError;
        }
        
        let wallet_id = null;
        if (walletData) {
          setWallet(walletData);
          wallet_id = walletData.id;
          
          // Update summary with wallet balance
          setSummary(prevSummary => ({
            ...prevSummary,
            current_balance: walletData.balance,
            available_balance: walletData.balance,
            total_earnings: walletData.total_earnings || 0,
          }));
        } else {
          // Create a new wallet if one doesn't exist
          const { data: newWallet, error: newWalletError } = await supabase
            .from('driver_wallets')
            .insert({
              driver_id,
              balance: 0,
              currency: 'XAF',
              commission_rate: 0.15,
              total_earnings: 0
            })
            .select()
            .single();
            
          if (newWalletError) throw newWalletError;
          
          setWallet(newWallet);
          wallet_id = newWallet.id;
        }
        
        // Fetch transactions once we have a wallet_id
        if (wallet_id) {
          const { data: transactionsData, error: transactionsError } = await supabase
            .from('driver_transactions')
            .select('*')
            .eq('driver_wallet_id', wallet_id)
            .order('created_at', { ascending: false });
            
          if (transactionsError) throw transactionsError;
          
          setTransactions(transactionsData);
          
          // Calculate summary from transactions
          calculateSummary(transactionsData, walletData?.balance || 0);
        }
      } catch (error) {
        console.error('Error fetching wallet data:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données du portefeuille",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchWalletData();
  }, [driverId, user?.id]);
  
  const calculateSummary = (transactions: DriverTransactionData[], balance: number) => {
    let totalEarnings = 0;
    let totalWithdrawals = 0;
    let pendingEarnings = 0;
    
    transactions.forEach(transaction => {
      if (transaction.type === 'earning' || transaction.type === 'bonus') {
        if (transaction.status === 'completed') {
          totalEarnings += transaction.amount;
        } else if (transaction.status === 'pending') {
          pendingEarnings += transaction.amount;
        }
      } else if (transaction.type === 'withdrawal' || transaction.type === 'withdraw') {
        if (transaction.status === 'completed') {
          totalWithdrawals += transaction.amount;
        }
      }
    });
    
    setSummary({
      total_earnings: totalEarnings,
      total_withdrawals: totalWithdrawals,
      current_balance: balance,
      available_balance: balance,
      pending_earnings: pendingEarnings,
      balance: balance  // Add this for WalletSummary compatibility
    });
  };
  
  const handleWithdrawal = async () => {
    if (!wallet || !wallet.id) {
      toast({
        title: "Erreur",
        description: "Portefeuille non disponible",
        variant: "destructive",
      });
      return;
    }
    
    if (summary.available_balance <= 0) {
      toast({
        title: "Erreur",
        description: "Solde insuffisant pour effectuer un retrait",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // In a real application, this would open a withdrawal form or redirect to a withdrawal page
      toast({
        title: "Demande de retrait",
        description: "Veuillez compléter votre demande de retrait",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de traiter la demande de retrait",
        variant: "destructive",
      });
    }
  };
  
  const getTransactionIcon = (type: string) => {
    if (type === 'earning' || type === 'bonus' || type === 'deposit') {
      return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
    }
    return <ArrowUpRight className="h-4 w-4 text-red-500" />;
  };
  
  const getTransactionTitle = (transaction: DriverTransactionData) => {
    if (transaction.description) return transaction.description;
    
    switch (transaction.type) {
      case 'earning':
        return 'Gain de livraison';
      case 'bonus':
        return 'Bonus';
      case 'commission':
        return 'Commission';
      case 'fee':
        return 'Frais';
      case 'withdrawal':
      case 'withdraw':
        return 'Retrait';
      case 'deposit':
        return 'Dépôt';
      case 'payment':
        return 'Paiement';
      default:
        return transaction.type;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Portefeuille Chauffeur</CardTitle>
          <CardDescription>
            Gérez vos gains, retraits et transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary/10 rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Solde disponible</div>
              <div className="text-2xl font-bold">{formatCurrency(summary.available_balance)}</div>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Gains en attente</div>
              <div className="text-2xl font-bold">{formatCurrency(summary.pending_earnings)}</div>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Total des gains</div>
              <div className="text-2xl font-bold">{formatCurrency(summary.total_earnings)}</div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleWithdrawal} disabled={summary.available_balance <= 0}>
            Effectuer un retrait
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="earnings">Gains</TabsTrigger>
              <TabsTrigger value="withdrawals">Retraits</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune transaction à afficher
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="bg-muted h-8 w-8 rounded-full flex items-center justify-center">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{getTransactionTitle(transaction)}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(transaction.created_at).toLocaleDateString()} • {transaction.status}
                          </div>
                        </div>
                      </div>
                      <div className={`font-semibold ${transaction.type === 'earning' || transaction.type === 'bonus' || transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'earning' || transaction.type === 'bonus' || transaction.type === 'deposit' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="earnings" className="mt-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : transactions.filter(t => t.type === 'earning' || t.type === 'bonus').length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun gain à afficher
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions
                    .filter(t => t.type === 'earning' || t.type === 'bonus')
                    .map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="bg-muted h-8 w-8 rounded-full flex items-center justify-center">
                            <ArrowDownLeft className="h-4 w-4 text-green-500" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{getTransactionTitle(transaction)}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(transaction.created_at).toLocaleDateString()} • {transaction.status}
                            </div>
                          </div>
                        </div>
                        <div className="font-semibold text-green-600">
                          +{formatCurrency(transaction.amount)}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="withdrawals" className="mt-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : transactions.filter(t => t.type === 'withdrawal' || t.type === 'withdraw').length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun retrait à afficher
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions
                    .filter(t => t.type === 'withdrawal' || t.type === 'withdraw')
                    .map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="bg-muted h-8 w-8 rounded-full flex items-center justify-center">
                            <ArrowUpRight className="h-4 w-4 text-red-500" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{getTransactionTitle(transaction)}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(transaction.created_at).toLocaleDateString()} • {transaction.status}
                            </div>
                          </div>
                        </div>
                        <div className="font-semibold text-red-600">
                          -{formatCurrency(transaction.amount)}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
