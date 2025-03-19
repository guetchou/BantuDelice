
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/utils/formatCurrency";
import { DriverWallet as DriverWalletType, DriverTransaction, WalletSummary } from "@/types/wallet";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";

interface DriverWalletProps {
  driverId: string;
}

const DriverWallet = ({ driverId }: DriverWalletProps) => {
  const [loading, setLoading] = useState(true);
  const [walletData, setWalletData] = useState<DriverWalletType | null>(null);
  const [transactions, setTransactions] = useState<DriverTransaction[]>([]);
  const [summary, setSummary] = useState<WalletSummary | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, [driverId]);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      
      // Get driver wallet
      const { data: walletData, error: walletError } = await supabase
        .from("driver_wallets")
        .select("*")
        .eq("driver_id", driverId)
        .maybeSingle();

      if (walletError) throw walletError;
      
      if (walletData) {
        setWalletData(walletData as DriverWalletType);
        
        // Get transactions
        const { data: transactionsData, error: transactionsError } = await supabase
          .from("driver_transactions")
          .select("*")
          .eq("wallet_id", walletData.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (transactionsError) throw transactionsError;
        
        setTransactions(transactionsData as DriverTransaction[]);
        
        // Calculate summary
        const pendingAmount = transactionsData
          ?.filter(t => t.status === 'pending')
          .reduce((sum, t) => sum + t.amount, 0) || 0;
          
        setSummary({
          balance: walletData.balance,
          totalEarnings: walletData.total_earnings,
          pendingAmount,
          lastTransactions: transactionsData as DriverTransaction[]
        });
      }
    } catch (error) {
      console.error("Error fetching driver wallet:", error);
      toast.error("Erreur lors du chargement du portefeuille");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    try {
      setWithdrawLoading(true);
      
      if (!walletData) {
        toast.error("Portefeuille non trouvé");
        return;
      }
      
      const amount = parseFloat(withdrawAmount);
      
      if (isNaN(amount) || amount <= 0) {
        toast.error("Veuillez saisir un montant valide");
        return;
      }
      
      if (amount > walletData.balance) {
        toast.error("Solde insuffisant");
        return;
      }
      
      // Create withdrawal transaction
      const { error: transactionError } = await supabase
        .from("driver_transactions")
        .insert({
          wallet_id: walletData.id,
          amount,
          type: "withdraw",
          status: "pending",
          description: "Retrait de fonds",
        });

      if (transactionError) throw transactionError;
      
      // Update wallet balance
      const { error: walletError } = await supabase
        .from("driver_wallets")
        .update({ 
          balance: walletData.balance - amount,
          updated_at: new Date().toISOString()
        })
        .eq("id", walletData.id);

      if (walletError) throw walletError;
      
      toast.success("Demande de retrait envoyée avec succès");
      setWithdrawAmount("");
      fetchWalletData();
      
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      toast.error("Erreur lors du traitement du retrait");
    } finally {
      setWithdrawLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!walletData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-6">
            <p className="text-muted-foreground">Aucun portefeuille associé à ce livreur</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Solde disponible
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(walletData.balance)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Gains totaux
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(walletData.total_earnings)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Commission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{walletData.commission_rate}%</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="transactions">
        <TabsList className="mb-4">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="withdraw">Effectuer un retrait</TabsTrigger>
          <TabsTrigger value="settings">Paramètres de paiement</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Historique des transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">Aucune transaction à afficher</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map(transaction => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {transaction.type === 'withdraw' ? (
                            <ArrowUpRight className="h-5 w-5 text-red-500" />
                          ) : transaction.type === 'deposit' || transaction.type === 'payment' ? (
                            <ArrowDownLeft className="h-5 w-5 text-green-500" />
                          ) : transaction.type === 'commission' ? (
                            <TrendingUp className="h-5 w-5 text-amber-500" />
                          ) : transaction.status === 'pending' ? (
                            <Clock className="h-5 w-5 text-amber-500" />
                          ) : (
                            <Wallet className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {transaction.description || transaction.type}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(transaction.created_at).toLocaleDateString()} - {transaction.status}
                          </div>
                        </div>
                      </div>
                      <div className={`text-lg font-medium ${
                        transaction.type === 'withdraw' || transaction.type === 'commission' 
                          ? 'text-red-600' 
                          : 'text-green-600'
                      }`}>
                        {transaction.type === 'withdraw' || transaction.type === 'commission' ? '-' : '+'}
                        {formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="withdraw">
          <Card>
            <CardHeader>
              <CardTitle>Effectuer un retrait</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-1">Solde disponible</div>
                  <div className="text-2xl font-bold">{formatCurrency(walletData.balance)}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">Montant à retirer</div>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Saisir le montant"
                  />
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">Méthode de retrait</div>
                  <select className="w-full p-2 border rounded-md">
                    <option value="mobile_money">Mobile Money</option>
                    <option value="bank_transfer">Virement bancaire</option>
                  </select>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleWithdraw}
                  disabled={withdrawLoading || !withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > walletData.balance}
                >
                  {withdrawLoading ? 'Traitement...' : 'Demander un retrait'}
                </Button>
                
                <div className="text-xs text-muted-foreground mt-2">
                  Les retraits sont traités dans un délai de 1-2 jours ouvrables.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de paiement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-1">Méthode de paiement préférée</div>
                  <select className="w-full p-2 border rounded-md">
                    <option value="mobile_money">Mobile Money</option>
                    <option value="bank_transfer">Virement bancaire</option>
                  </select>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">Numéro Mobile Money</div>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="Saisir votre numéro"
                    defaultValue={walletData.payout_details?.phone_number || ''}
                  />
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">Jour de paiement préféré</div>
                  <select className="w-full p-2 border rounded-md">
                    <option value="monday">Lundi</option>
                    <option value="tuesday">Mardi</option>
                    <option value="wednesday">Mercredi</option>
                    <option value="thursday">Jeudi</option>
                    <option value="friday">Vendredi</option>
                  </select>
                </div>
                
                <Button className="w-full">Sauvegarder les paramètres</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DriverWallet;
