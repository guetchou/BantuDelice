import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/utils/formatCurrency";
import { Wallet, CreditCard, ReceiptText, PlusCircle, ArrowRightLeft, ChevronRight } from "lucide-react";
import apiService from "@/services/api";
import { toast } from "sonner";
import MobilePayment from '@/components/payment/MobilePayment';
import { Transaction } from "@/types/wallet";

const WalletManager = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isAddingFunds, setIsAddingFunds] = useState(false);
  const [amount, setAmount] = useState("");
  const [walletData, setWalletData] = useState<unknown>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await apiService.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      // Get user wallet
      const { data: walletData, error: walletError } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (walletError) throw walletError;
      
      if (!walletData) {
        // Create wallet if it doesn't exist
        const { data: newWallet, error: createError } = await supabase
          .from("wallets")
          .insert({
            user_id: user.id,
            balance: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) throw createError;
        setWalletData(newWallet);
      } else {
        setWalletData(walletData);
        
        // Get transactions
        const { data: transactionsData, error: transactionsError } = await supabase
          .from("transactions")
          .select("*")
          .eq("wallet_id", walletData.id)
          .order("created_at", { ascending: false });

        if (transactionsError) throw transactionsError;
        setTransactions(transactionsData as Transaction[]);
      }
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      toast.error("Erreur lors du chargement du portefeuille");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFunds = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Veuillez saisir un montant valide");
      return;
    }
    setIsAddingFunds(true);
  };

  const handlePaymentSuccess = async () => {
    try {
      // Update wallet balance
      const newBalance = walletData.balance + parseFloat(amount);
      const { error: walletError } = await supabase
        .from("wallets")
        .update({ 
          balance: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq("id", walletData.id);

      if (walletError) throw walletError;
      
      // Add transaction record
      const { error: transactionError } = await supabase
        .from("transactions")
        .insert({
          wallet_id: walletData.id,
          amount: parseFloat(amount),
          type: "deposit",
          status: "completed",
          description: "Dépôt via Mobile Money",
          created_at: new Date().toISOString(),
        });

      if (transactionError) throw transactionError;
      
      toast.success("Compte rechargé avec succès");
      setIsAddingFunds(false);
      setAmount("");
      fetchWalletData();
      
    } catch (error) {
      console.error("Error adding funds:", error);
      toast.error("Erreur lors du rechargement du compte");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Wallet className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Mon portefeuille</h2>
        </div>
        <Button onClick={() => navigate("/wallet/payment-methods")}>
          Gérer les moyens de paiement
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-80">
              Solde disponible
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(walletData?.balance || 0)}</div>
            <Button 
              variant="outline" 
              className="mt-4 bg-primary-foreground text-primary"
              onClick={() => setActiveTab("add-funds")}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Recharger
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dépenses totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                transactions
                  .filter(t => t.type === 'payment')
                  .reduce((sum, t) => sum + t.amount, 0)
              )}
            </div>
            <Button 
              variant="ghost" 
              className="mt-4 text-sm"
              onClick={() => navigate("/wallet/analytics")}
            >
              Voir les statistiques
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dernières transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length > 0 ? (
              <div className="text-sm space-y-2">
                {transactions.slice(0, 3).map(t => (
                  <div key={t.id} className="flex justify-between">
                    <span>{t.description || t.type}</span>
                    <span className={t.type === 'deposit' ? 'text-green-500' : 'text-red-500'}>
                      {t.type === 'deposit' ? '+' : '-'}{formatCurrency(t.amount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Aucune transaction</p>
            )}
            <Button 
              variant="ghost" 
              className="mt-4 text-sm"
              onClick={() => navigate("/wallet/transactions")}
            >
              Voir toutes les transactions
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="add-funds">Recharger</TabsTrigger>
          <TabsTrigger value="withdraw">Retirer</TabsTrigger>
          <TabsTrigger value="invoices">Factures</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Transactions récentes</CardTitle>
              <CardDescription>
                Historique de vos dernières transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">Aucune transaction à afficher</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.slice(0, 5).map(transaction => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {transaction.type === 'deposit' ? (
                            <PlusCircle className="h-5 w-5 text-green-500" />
                          ) : transaction.type === 'payment' ? (
                            <CreditCard className="h-5 w-5 text-blue-500" />
                          ) : (
                            <ArrowRightLeft className="h-5 w-5 text-amber-500" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {transaction.description || transaction.type}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className={`text-lg font-medium ${
                        transaction.type === 'payment' || transaction.type === 'withdraw' 
                          ? 'text-red-600' 
                          : 'text-green-600'
                      }`}>
                        {transaction.type === 'payment' || transaction.type === 'withdraw' ? '-' : '+'}
                        {formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  ))}

                  <div className="text-center pt-2">
                    <Button variant="outline" onClick={() => navigate("/wallet/transactions")}>
                      Voir toutes les transactions
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="add-funds">
          <Card>
            <CardHeader>
              <CardTitle>Recharger mon compte</CardTitle>
              <CardDescription>
                Ajoutez des fonds à votre portefeuille pour effectuer des paiements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isAddingFunds ? (
                <MobilePayment
                  amount={parseFloat(amount)}
                  description="Recharge de portefeuille"
                  onSuccess={handlePaymentSuccess}
                  onError={() => setIsAddingFunds(false)}
                  savePaymentMethod={true}
                />
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Montant à recharger</label>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Saisir le montant"
                      min="100"
                    />
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={handleAddFunds}
                    disabled={!amount || parseFloat(amount) <= 0}
                  >
                    Continuer
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="withdraw">
          <Card>
            <CardHeader>
              <CardTitle>Retirer des fonds</CardTitle>
              <CardDescription>
                Transférez de l'argent de votre portefeuille vers votre compte bancaire ou Mobile Money
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Solde disponible</label>
                  <div className="text-2xl font-bold">{formatCurrency(walletData?.balance || 0)}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Montant à retirer</label>
                  <Input
                    type="number"
                    placeholder="Saisir le montant"
                    min="100"
                    max={walletData?.balance}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Méthode de retrait</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="mobile_money">Mobile Money</option>
                    <option value="bank_transfer">Virement bancaire</option>
                  </select>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => navigate("/wallet/withdraw")}
                >
                  Retirer des fonds
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Mes factures</CardTitle>
              <CardDescription>
                Consultez et téléchargez vos factures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <ReceiptText className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">Aucune facture à afficher</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => navigate("/wallet/invoices")}
                >
                  Voir toutes les factures
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WalletManager;
