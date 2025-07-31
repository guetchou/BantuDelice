
import { Wallet, CreditCard, ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function WalletOverview() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast({
            title: "Non connecté",
            description: "Veuillez vous connecter pour accéder à votre portefeuille",
            variant: "destructive"
          });
          navigate('/auth');
          return;
        }

        // Récupérer le solde du portefeuille
        const { data: walletData, error: walletError } = await supabase
          .from('wallets')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (walletError && walletError.code !== 'PGRST116') {
          throw walletError;
        }
        
        if (walletData) {
          setBalance(walletData.balance || 0);
        } else {
          // Créer un portefeuille si l'utilisateur n'en a pas
          const { data: newWallet, error: createError } = await supabase
            .from('wallets')
            .insert([
              { user_id: user.id, balance: 0, currency: 'FCFA' }
            ])
            .select('*')
            .single();
            
          if (createError) throw createError;
          if (newWallet) setBalance(0);
        }

        // Récupérer les transactions
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('wallet_transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (transactionsError) throw transactionsError;
        
        setTransactions(transactionsData || []);
      } catch (error: any) {
        console.error('Erreur lors du chargement des données du portefeuille:', error);
        toast({
          title: "Erreur",
          description: error.message || "Impossible de charger les données du portefeuille",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [navigate, toast]);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case 'withdrawal':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case 'payment':
        return <CreditCard className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionColorClass = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'text-green-600';
      case 'withdrawal':
      case 'payment':
        return 'text-red-600';
      default:
        return 'text-gray-800';
    }
  };

  const getFormattedAmount = (type: string, amount: number) => {
    return (type === 'deposit' ? '+' : '-') + amount.toLocaleString() + ' FCFA';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wallet className="mr-2" />
              Mon Portefeuille
            </CardTitle>
            <CardDescription className="text-blue-100">
              Gérez votre argent facilement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-4">
              {loading ? "Chargement..." : `${balance.toLocaleString()} FCFA`}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="secondary"
                className="bg-white text-blue-700 hover:bg-blue-50"
                onClick={() => navigate('/wallet/deposit')}
              >
                Déposer
              </Button>
              <Button 
                variant="outline"
                className="border-white text-white hover:bg-blue-600"
                onClick={() => navigate('/wallet/withdraw')}
              >
                Retirer
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="methods">Méthodes de paiement</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Historique des transactions</CardTitle>
                <CardDescription>
                  Vos 10 dernières transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-center py-8">Chargement des transactions...</p>
                ) : transactions.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">
                    Aucune transaction à afficher
                  </p>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center">
                          <div className="bg-muted p-2 rounded-full mr-3">
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div>
                            <div className="font-medium">{transaction.description}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatDate(transaction.created_at)}
                            </div>
                          </div>
                        </div>
                        <div className={`font-medium ${getTransactionColorClass(transaction.type)}`}>
                          {getFormattedAmount(transaction.type, transaction.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => navigate('/wallet/transactions')}>
                  Voir toutes les transactions
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="methods">
            <Card>
              <CardHeader>
                <CardTitle>Méthodes de paiement</CardTitle>
                <CardDescription>
                  Gérez vos méthodes de paiement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center p-3 border rounded-lg">
                    <div className="bg-muted p-2 rounded-full mr-3">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Mobile Money</div>
                      <div className="text-sm text-muted-foreground">
                        Ajoutez vos numéros de téléphone
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigate('/wallet/payment-methods')}>
                      Gérer
                    </Button>
                  </div>
                  
                  <div className="flex items-center p-3 border rounded-lg">
                    <div className="bg-muted p-2 rounded-full mr-3">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Cartes bancaires</div>
                      <div className="text-sm text-muted-foreground">
                        Ajoutez vos cartes de crédit/débit
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigate('/wallet/payment-methods')}>
                      Gérer
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="default" className="w-full" onClick={() => navigate('/wallet/payment-methods')}>
                  Ajouter une méthode de paiement
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
