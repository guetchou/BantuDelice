import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import apiService from "@/services/api";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Transaction } from "@/types/wallet";

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data: { user } } = await apiService.auth.getUser();
        if (!user) return;

        const { data: wallet } = await supabase
          .from("wallets")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (!wallet) return;

        const { data } = await supabase
          .from("transactions")
          .select("*")
          .eq("wallet_id", wallet.id)
          .order("created_at", { ascending: false });

        if (data) setTransactions(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Historique des transactions</h1>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <Card key={transaction.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {transaction.type === "deposit" ? (
                  <ArrowDownLeft className="w-8 h-8 text-green-500" />
                ) : (
                  <ArrowUpRight className="w-8 h-8 text-red-500" />
                )}
                <div>
                  <p className="font-medium">
                    {transaction.type === "deposit" ? "Dépôt" : "Retrait"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${
                  transaction.type === "deposit" ? "text-green-500" : "text-red-500"
                }`}>
                  {transaction.type === "deposit" ? "+" : "-"}
                  {transaction.amount.toLocaleString()} XAF
                </p>
                <p className="text-sm text-muted-foreground">
                  {transaction.status}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Transactions;
