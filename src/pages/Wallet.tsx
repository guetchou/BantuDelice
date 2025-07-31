
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet as WalletIcon, User, Truck, CreditCard, History, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Wallet as WalletType, Transaction } from "@/types/wallet";
import { formatCurrency } from "@/utils/formatCurrency";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import DriverWallet from "@/components/delivery/DriverWallet";
import WalletManager from "@/components/payment/WalletManager";

export default function Wallet() {
  usePageTitle({ title: "Portefeuille" });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isDriver, setIsDriver] = useState(false);
  const [driverId, setDriverId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('main');

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate("/auth");
          return;
        }

        // Check if user is a driver
        const { data: driverData } = await supabase
          .from("delivery_drivers")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (driverData) {
          setIsDriver(true);
          setDriverId(driverData.id);
          setActiveTab('driver');
        }

        // Get user wallet
        const { data: walletData, error: walletError } = await supabase
          .from("wallets")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (walletError && walletError.code !== 'PGRST116') {
          throw walletError;
        }

        // If wallet doesn't exist, create one
        if (!walletData) {
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
          setWallet(newWallet as WalletType);
        } else {
          setWallet(walletData as WalletType);
        }

        // Get transactions if wallet exists
        if (walletData) {
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

    fetchWalletData();
  }, [navigate]);

  const getTransactionIcon = (type: string) => {
    switch(type) {
      case 'deposit':
        return <ArrowDownLeft className="h-5 w-5 text-green-500" />;
      case 'payment':
        return <CreditCard className="h-5 w-5 text-blue-500" />;
      case 'withdraw':
        return <ArrowUpRight className="h-5 w-5 text-red-500" />;
      case 'refund':
        return <CreditCard className="h-5 w-5 text-purple-500" />;
      default:
        return <History className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center gap-4 mb-8">
          <WalletIcon className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Portefeuille</h1>
        </div>
        
        <div className="h-40 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center gap-4 mb-8">
        <WalletIcon className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Portefeuille</h1>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="main">
            <User className="h-4 w-4 mr-2" />
            Client
          </TabsTrigger>
          {isDriver && (
            <TabsTrigger value="driver">
              <Truck className="h-4 w-4 mr-2" />
              Livreur
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="main">
          <WalletManager />
        </TabsContent>
        
        {isDriver && driverId && (
          <TabsContent value="driver">
            <DriverWallet driverId={driverId} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
