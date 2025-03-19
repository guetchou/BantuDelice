
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Grid, History, PiggyBank, Zap, ArrowLeftRight, RefreshCcw, ChevronLeft } from "lucide-react";
import CashbackStatus from "@/components/cashback/CashbackStatus";
import CashbackTransactions from "@/components/cashback/CashbackTransactions";
import CashbackLeaderboard from "@/components/cashback/CashbackLeaderboard";
import CashbackTransfer from "@/components/cashback/CashbackTransfer";
import RefundRequest from "@/components/cashback/RefundRequest";
import { Link } from "react-router-dom";
import { Cashback } from "@/types/wallet";

const CashbackPage = () => {
  const [loading, setLoading] = useState(true);
  const [cashback, setCashback] = useState<Cashback | null>(null);
  const [activeTab, setActiveTab] = useState('status');
  const [showRefundPage, setShowRefundPage] = useState(false);

  useEffect(() => {
    const fetchCashbackData = async () => {
      try {
        setLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock Cashback data
        const mockCashback: Cashback = {
          id: "cb-123",
          user_id: "user-123",
          balance: 7500,
          lifetime_earned: 12000,
          tier: 'silver',
          tier_progress: 70, // 70% progress to gold
          last_updated: new Date().toISOString(),
          created_at: new Date().toISOString()
        };
        
        setCashback(mockCashback);
      } catch (error) {
        console.error("Error fetching cashback data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCashbackData();
  }, []);

  const refreshCashback = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock updated cashback
      const updatedCashback: Cashback = {
        ...cashback!,
        balance: cashback ? cashback.balance + 100 : 7600, // Add some points for testing
        last_updated: new Date().toISOString()
      };
      
      setCashback(updatedCashback);
    } catch (error) {
      console.error("Error refreshing cashback:", error);
    } finally {
      setLoading(false);
    }
  };

  if (showRefundPage) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 mb-4"
            onClick={() => setShowRefundPage(false)}
          >
            <ChevronLeft className="h-4 w-4" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold mb-2">Demande de Remboursement</h1>
          <p className="text-muted-foreground">
            Vous pouvez demander un remboursement pour une commande récente
          </p>
        </div>
        
        <div className="grid gap-6">
          <RefundRequest 
            orderId="order-123456"
            paymentId="payment-789012"
            orderAmount={12500}
            onRequestComplete={() => setShowRefundPage(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Mon Cashback</h1>
          <p className="text-muted-foreground">
            Gagnez et utilisez votre cashback sur BuntuDelice
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
          onClick={refreshCashback}
          disabled={loading}
        >
          {loading ? (
            <span className="animate-spin">
              <RefreshCcw className="h-4 w-4" />
            </span>
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
          Actualiser
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="status" className="flex items-center gap-2">
            <PiggyBank className="h-4 w-4" />
            <span className="hidden sm:inline">Status</span>
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Transactions</span>
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Classement</span>
          </TabsTrigger>
          <TabsTrigger value="transfer" className="flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4" />
            <span className="hidden sm:inline">Transfert</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="space-y-6">
          <CashbackStatus />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              className="flex items-center justify-center gap-2"
              onClick={() => setActiveTab('transactions')}
            >
              <History className="h-4 w-4" />
              Voir mes transactions
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center justify-center gap-2"
              onClick={() => setShowRefundPage(true)}
            >
              <RefreshCcw className="h-4 w-4" />
              Demander un remboursement
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <CashbackTransactions limit={10} />
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <CashbackLeaderboard limit={10} />
        </TabsContent>

        <TabsContent value="transfer" className="space-y-6">
          <CashbackTransfer 
            cashback={cashback} 
            onTransferComplete={refreshCashback}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CashbackPage;
