
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownIcon, ArrowUpIcon, RefreshCw } from "lucide-react";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CashbackTransaction, CashbackTransactionType } from '@/types/wallet';

interface CashbackTransactionsProps {
  userId?: string;
  limit?: number;
}

export default function CashbackTransactions({ userId, limit = 5 }: CashbackTransactionsProps) {
  const [transactions, setTransactions] = useState<CashbackTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "earned" | "used">("all");
  
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulation de l'appel API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Données fictives
        const mockTransactions: CashbackTransaction[] = [
          {
            id: "tr1",
            user_id: userId || "user1",
            amount: 250,
            type: "earn" as CashbackTransactionType,
            description: "Points gagnés pour la commande #12345",
            created_at: new Date().toISOString()
          },
          {
            id: "tr2",
            user_id: userId || "user1",
            amount: 500,
            type: "earn" as CashbackTransactionType,
            description: "Points bonus pour première commande",
            created_at: new Date(Date.now() - 86400000).toISOString() // 1 jour avant
          },
          {
            id: "tr3",
            user_id: userId || "user1",
            amount: 200,
            type: "redeem" as CashbackTransactionType,
            description: "Points utilisés pour une remise",
            created_at: new Date(Date.now() - 172800000).toISOString() // 2 jours avant
          },
          {
            id: "tr4",
            user_id: userId || "user1",
            amount: 150,
            type: "earn" as CashbackTransactionType,
            description: "Points de fidélité mensuels",
            created_at: new Date(Date.now() - 259200000).toISOString() // 3 jours avant
          },
          {
            id: "tr5",
            user_id: userId || "user1",
            amount: 100,
            type: "transfer" as CashbackTransactionType,
            description: "Points reçus d'un ami",
            created_at: new Date(Date.now() - 345600000).toISOString() // 4 jours avant
          },
          {
            id: "tr6",
            user_id: userId || "user1",
            amount: 75,
            type: "redeem" as CashbackTransactionType,
            description: "Points utilisés pour une livraison gratuite",
            created_at: new Date(Date.now() - 432000000).toISOString() // 5 jours avant
          }
        ];
        
        setTransactions(mockTransactions);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Impossible de charger les transactions");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, [userId]);
  
  const filteredTransactions = transactions.filter(transaction => {
    if (activeTab === "all") return true;
    if (activeTab === "earned") return ["earn", "transfer"].includes(transaction.type);
    if (activeTab === "used") return transaction.type === "redeem";
    return true;
  }).slice(0, limit);
  
  const getTransactionIcon = (type: CashbackTransactionType) => {
    switch (type) {
      case "earn":
      case "transfer":
        return <ArrowDownIcon className="h-4 w-4 text-green-500" />;
      case "redeem":
      case "expire":
        return <ArrowUpIcon className="h-4 w-4 text-red-500" />;
      default:
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <Tabs value="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="earned">Gagnées</TabsTrigger>
              <TabsTrigger value="used">Utilisées</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-4 border-b last:border-0">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "all" | "earned" | "used")}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="earned">Gagnées</TabsTrigger>
            <TabsTrigger value="used">Utilisées</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {filteredTransactions.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Aucune transaction à afficher
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between py-4 border-b last:border-0">
              <div className="flex items-center gap-3">
                <div className="bg-muted h-8 w-8 rounded-full flex items-center justify-center">
                  {getTransactionIcon(transaction.type)}
                </div>
                <div>
                  <div className="font-medium text-sm">{transaction.description}</div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(transaction.created_at), "d MMM yyyy 'à' HH:mm", { locale: fr })}
                  </div>
                </div>
              </div>
              <div className={`font-semibold ${["earn", "transfer"].includes(transaction.type) ? "text-green-600" : "text-red-600"}`}>
                {["earn", "transfer"].includes(transaction.type) ? "+" : "-"}{transaction.amount} pts
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
