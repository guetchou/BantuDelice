
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownLeft, CreditCard, Send, Gift } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/formatCurrency";
import { CashbackTransaction } from "@/types/wallet";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const CashbackTransactions = ({ limit = 5 }: { limit?: number }) => {
  const [transactions, setTransactions] = useState<CashbackTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setLoading(false);
          return;
        }

        const query = supabase
          .from('cashback_transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (!showAll) {
          query.limit(limit);
        }

        const { data, error } = await query;

        if (error) throw error;
        setTransactions(data as CashbackTransaction[]);
      } catch (error) {
        console.error("Error fetching cashback transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [showAll, limit]);

  const getTransactionIcon = (type: string) => {
    switch(type) {
      case 'earned':
        return <ArrowDownLeft className="h-5 w-5 text-green-500" />;
      case 'used':
        return <CreditCard className="h-5 w-5 text-amber-500" />;
      case 'transferred':
        return <Send className="h-5 w-5 text-indigo-500" />;
      case 'received':
        return <Gift className="h-5 w-5 text-purple-500" />;
      case 'refunded':
        return <ArrowDownLeft className="h-5 w-5 text-blue-500" />;
      case 'expired':
        return <ArrowUpRight className="h-5 w-5 text-red-500" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch(type) {
      case 'earned':
      case 'received':
      case 'refunded':
        return 'text-green-500';
      case 'used':
      case 'transferred':
      case 'expired':
        return 'text-red-500';
      default:
        return '';
    }
  };

  const getTransactionPrefix = (type: string) => {
    switch(type) {
      case 'earned':
      case 'received':
      case 'refunded':
        return '+';
      case 'used':
      case 'transferred':
      case 'expired':
        return '-';
      default:
        return '';
    }
  };

  const getTransactionLabel = (type: string) => {
    switch(type) {
      case 'earned':
        return 'Cashback gagné';
      case 'used':
        return 'Utilisé pour commande';
      case 'transferred':
        return 'Transfert envoyé';
      case 'received':
        return 'Transfert reçu';
      case 'refunded':
        return 'Remboursement';
      case 'expired':
        return 'Expiré';
      default:
        return type;
    }
  };

  if (loading && transactions.length === 0) {
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
        <CardTitle className="text-xl font-semibold">Historique des Transactions</CardTitle>
        <CardDescription>
          Suivez vos transactions de cashback et transferts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {transactions.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            Aucune transaction à afficher
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-full">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{getTransactionLabel(transaction.type)}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(transaction.created_at), 'dd MMM yyyy', { locale: fr })}
                      </p>
                    </div>
                  </div>
                  <div className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                    {getTransactionPrefix(transaction.type)}
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
            
            {!showAll && transactions.length >= limit && (
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setShowAll(true)}
              >
                Voir tout l'historique
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CashbackTransactions;
