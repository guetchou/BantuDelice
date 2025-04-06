
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownLeft, CreditCard, Send, Gift } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { CashbackTransaction, CashbackTransactionType } from "@/types/wallet";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Define a mapping from backend types to our CashbackTransactionType
const mapTransactionType = (type: string): CashbackTransactionType => {
  const map: Record<string, CashbackTransactionType> = {
    'earned': 'earn',
    'used': 'redeem',
    'transferred': 'redeem',
    'received': 'earn',
    'refunded': 'earn',
    'expired': 'expire'
  };
  return map[type] || 'earn';
};

const CashbackTransactions = ({ limit = 5 }: { limit?: number }) => {
  const [transactions, setTransactions] = useState<CashbackTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock user ID
        const userId = "user-123";

        // Simulation de données - in a real app, this would come from your API
        const simulatedData: CashbackTransaction[] = [
          {
            id: '1',
            user_id: userId,
            amount: 500,
            type: 'earn',
            reference_id: 'order-123',
            reference_type: 'order',
            description: 'Cashback pour commande #123',
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            user_id: userId,
            amount: 200,
            type: 'redeem',
            reference_id: 'order-124',
            reference_type: 'order',
            description: 'Utilisé pour commande #124',
            created_at: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: '3',
            user_id: userId,
            amount: 300,
            type: 'earn',
            sender_id: 'user-456',
            reference_type: 'transfer',
            description: 'Reçu de Marie',
            created_at: new Date(Date.now() - 172800000).toISOString()
          },
          {
            id: '4',
            user_id: userId,
            amount: 150,
            type: 'redeem',
            receiver_id: 'user-789',
            reference_type: 'transfer',
            description: 'Envoyé à Amadou',
            created_at: new Date(Date.now() - 259200000).toISOString()
          },
          {
            id: '5',
            user_id: userId,
            amount: 100,
            type: 'earn',
            reference_id: 'promotion-123',
            reference_type: 'promotion',
            description: 'Bonus fidélité',
            created_at: new Date(Date.now() - 345600000).toISOString()
          },
          {
            id: '6',
            user_id: userId,
            amount: 75,
            type: 'earn',
            reference_id: 'refund-123',
            reference_type: 'refund',
            description: 'Remboursement commande annulée',
            created_at: new Date(Date.now() - 432000000).toISOString()
          }
        ];

        setTransactions(showAll ? simulatedData : simulatedData.slice(0, limit));
      } catch (error) {
        console.error("Error fetching cashback transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [showAll, limit]);

  const getTransactionIcon = (type: CashbackTransactionType, referenceType?: string) => {
    if (type === 'earn' && referenceType === 'transfer') {
      return <Gift className="h-5 w-5 text-purple-500" />;
    } else if (type === 'earn') {
      return <ArrowDownLeft className="h-5 w-5 text-green-500" />;
    } else if (type === 'redeem' && referenceType === 'transfer') {
      return <Send className="h-5 w-5 text-indigo-500" />;
    } else if (type === 'redeem') {
      return <CreditCard className="h-5 w-5 text-amber-500" />;
    } else if (type === 'expire') {
      return <ArrowUpRight className="h-5 w-5 text-red-500" />;
    } else {
      return <CreditCard className="h-5 w-5" />;
    }
  };

  const getTransactionColor = (type: CashbackTransactionType) => {
    switch(type) {
      case 'earn':
        return 'text-green-500';
      case 'redeem':
      case 'expire':
        return 'text-red-500';
      default:
        return '';
    }
  };

  const getTransactionPrefix = (type: CashbackTransactionType) => {
    switch(type) {
      case 'earn':
        return '+';
      case 'redeem':
      case 'expire':
        return '-';
      default:
        return '';
    }
  };

  const getTransactionLabel = (type: CashbackTransactionType, referenceType?: string) => {
    if (type === 'earn' && referenceType === 'order') {
      return 'Cashback gagné';
    } else if (type === 'earn' && referenceType === 'transfer') {
      return 'Transfert reçu';
    } else if (type === 'earn' && referenceType === 'refund') {
      return 'Remboursement';
    } else if (type === 'redeem' && referenceType === 'order') {
      return 'Utilisé pour commande';
    } else if (type === 'redeem' && referenceType === 'transfer') {
      return 'Transfert envoyé';
    } else if (type === 'expire') {
      return 'Expiré';
    } else {
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
                      {getTransactionIcon(transaction.type, transaction.reference_type)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{getTransactionLabel(transaction.type, transaction.reference_type)}</p>
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
