
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DriverWallet, DriverTransaction, WalletSummary } from '@/types/wallet';
import { DeliveryDriver } from '@/types/delivery';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Calendar } from '@/components/ui/calendar';
import { ArrowUpRight, ArrowDownLeft, Clock, Wallet, CreditCard, Calendar as CalendarIcon, Download, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { formatCurrency } from '@/utils/formatCurrency';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface DriverWalletProps {
  driverId: string;
  isAdmin?: boolean;
}

export default function DriverWallet({ driverId, isAdmin = false }: DriverWalletProps) {
  const [wallet, setWallet] = useState<DriverWallet | null>(null);
  const [driver, setDriver] = useState<DeliveryDriver | null>(null);
  const [transactions, setTransactions] = useState<DriverTransaction[]>([]);
  const [walletSummary, setWalletSummary] = useState<WalletSummary>({
    balance: 0,
    totalEarnings: 0,
    pendingAmount: 0,
    lastTransactions: []
  });
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [withdrawDate, setWithdrawDate] = useState<Date | undefined>(new Date());
  const [withdrawMethod, setWithdrawMethod] = useState<string>('mobile_money');
  const [withdrawDetailsOpen, setWithdrawDetailsOpen] = useState(false);
  const [withdrawAccount, setWithdrawAccount] = useState<string>('');
  const [isScheduling, setIsScheduling] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, [driverId]);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      
      // Fetch driver info
      const { data: driverData, error: driverError } = await supabase
        .from('delivery_drivers')
        .select('*')
        .eq('id', driverId)
        .single();
      
      if (driverError) throw driverError;
      setDriver(driverData as DeliveryDriver);
      
      // Fetch or create wallet
      let { data: walletData, error: walletError } = await supabase
        .from('driver_wallets')
        .select('*')
        .eq('driver_id', driverId)
        .single();
      
      if (walletError && walletError.code === 'PGRST116') {
        // Wallet doesn't exist, create one
        const { data: newWallet, error: createError } = await supabase
          .from('driver_wallets')
          .insert({
            driver_id: driverId,
            balance: 0,
            total_earnings: 0,
            commission_rate: driverData.commission_rate || 0.15,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (createError) throw createError;
        walletData = newWallet;
      } else if (walletError) {
        throw walletError;
      }
      
      setWallet(walletData as DriverWallet);
      
      // Fetch wallet transactions
      const { data: transactionData, error: transactionError } = await supabase
        .from('driver_transactions')
        .select('*')
        .eq('wallet_id', walletData.id)
        .order('created_at', { ascending: false });
      
      if (transactionError) throw transactionError;
      setTransactions(transactionData as DriverTransaction[]);
      
      // Calculate pending amount
      const pendingAmount = transactionData
        .filter(t => t.status === 'pending' && t.type === 'withdraw')
        .reduce((sum, t) => sum + t.amount, 0);
      
      setWalletSummary({
        balance: walletData.balance,
        totalEarnings: walletData.total_earnings,
        pendingAmount,
        lastTransactions: transactionData.slice(0, 5) as DriverTransaction[]
      });
      
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast.error('Erreur lors du chargement des données du portefeuille');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawal = async () => {
    try {
      if (!wallet) return;
      
      const amount = parseFloat(withdrawAmount);
      if (isNaN(amount) || amount <= 0) {
        toast.error('Veuillez entrer un montant valide');
        return;
      }
      
      if (amount > wallet.balance) {
        toast.error('Montant de retrait supérieur au solde disponible');
        return;
      }
      
      if (!withdrawAccount) {
        toast.error('Veuillez entrer un compte de retrait');
        return;
      }
      
      const isScheduled = isScheduling && withdrawDate && withdrawDate > new Date();
      const transactionType: DriverTransaction = {
        id: '',
        wallet_id: wallet.id,
        amount: amount,
        type: 'withdraw',
        status: isScheduled ? 'scheduled' : 'pending',
        description: `Retrait vers ${withdrawMethod}`,
        payment_method: withdrawMethod,
        scheduled_date: isScheduled ? withdrawDate.toISOString() : undefined,
        created_at: new Date().toISOString(),
        payout_details: {
          account: withdrawAccount
        }
      };
      
      // Insert transaction record
      const { data: transaction, error: transactionError } = await supabase
        .from('driver_transactions')
        .insert({
          wallet_id: wallet.id,
          amount: amount,
          type: 'withdraw',
          status: isScheduled ? 'scheduled' : 'pending',
          description: `Retrait vers ${withdrawMethod}`,
          payment_method: withdrawMethod,
          scheduled_date: isScheduled ? withdrawDate.toISOString() : null,
          payout_details: { account: withdrawAccount }
        })
        .select()
        .single();
      
      if (transactionError) throw transactionError;
      
      // Update wallet balance if immediate withdrawal
      if (!isScheduled) {
        const { error: walletError } = await supabase
          .from('driver_wallets')
          .update({
            balance: wallet.balance - amount,
            updated_at: new Date().toISOString()
          })
          .eq('id', wallet.id);
        
        if (walletError) throw walletError;
      }
      
      // Refresh data
      fetchWalletData();
      
      toast.success(isScheduled ? 'Retrait programmé avec succès' : 'Retrait initié avec succès');
      setWithdrawAmount('');
      setWithdrawAccount('');
      setWithdrawDetailsOpen(false);
      setIsScheduling(false);
      
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      toast.error('Erreur lors du traitement du retrait');
    }
  };

  const getTransactionIcon = (type: string) => {
    switch(type) {
      case 'payment':
        return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case 'withdraw':
        return <ArrowDownLeft className="h-4 w-4 text-red-500" />;
      case 'commission':
        return <CreditCard className="h-4 w-4 text-orange-500" />;
      case 'bonus':
        return <Wallet className="h-4 w-4 text-blue-500" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getTransactionStatusBadge = (status: string) => {
    switch(status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Complété</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">En attente</Badge>;
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Programmé</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700">Échoué</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const cancelScheduledWithdrawal = async (transactionId: string) => {
    try {
      const { error } = await supabase
        .from('driver_transactions')
        .delete()
        .eq('id', transactionId);
      
      if (error) throw error;
      
      toast.success('Retrait programmé annulé');
      fetchWalletData();
    } catch (error) {
      console.error('Error cancelling scheduled withdrawal:', error);
      toast.error('Erreur lors de l\'annulation du retrait programmé');
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Portefeuille</CardTitle>
          <CardDescription>Chargement...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!wallet) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Portefeuille</CardTitle>
          <CardDescription>Aucun portefeuille trouvé</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={fetchWalletData}>Créer un portefeuille</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Portefeuille du livreur</span>
          {driver && (
            <Badge variant="outline" className={driver.verification_status === 'verified' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}>
              {driver.verification_status === 'verified' ? 'Vérifié' : 'En attente de vérification'}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Gérez vos gains et retraits
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Solde disponible</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(wallet.balance)}</div>
              <p className="text-xs text-muted-foreground mt-1">Disponible pour retrait</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Gains totaux</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(wallet.total_earnings)}</div>
              <p className="text-xs text-muted-foreground mt-1">Commission: {(wallet.commission_rate * 100).toFixed(0)}%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">En attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(walletSummary.pendingAmount)}</div>
              <p className="text-xs text-muted-foreground mt-1">Retraits en traitement</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Détails du compte</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Retrait</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Effectuer un retrait</DialogTitle>
                <DialogDescription>
                  Solde disponible: {formatCurrency(wallet.balance)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Montant</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="method">Méthode de paiement</Label>
                  <Select value={withdrawMethod} onValueChange={setWithdrawMethod}>
                    <SelectTrigger id="method">
                      <SelectValue placeholder="Sélectionner une méthode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mobile_money">Mobile Money</SelectItem>
                      <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
                      <SelectItem value="cash">Espèces</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="account">Détails du compte</Label>
                  </div>
                  <Input
                    id="account"
                    value={withdrawAccount}
                    onChange={(e) => setWithdrawAccount(e.target.value)}
                    placeholder={withdrawMethod === 'mobile_money' ? "Numéro de téléphone" : 
                               withdrawMethod === 'bank_transfer' ? "IBAN / Numéro de compte" : "Nom du destinataire"}
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="schedule"
                    checked={isScheduling}
                    onChange={() => setIsScheduling(!isScheduling)}
                    className="rounded text-primary"
                  />
                  <Label htmlFor="schedule" className="text-sm cursor-pointer">Programmer pour plus tard</Label>
                </div>

                {isScheduling && (
                  <div className="space-y-2 pt-2">
                    <Label>Date de retrait</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {withdrawDate ? format(withdrawDate, 'PPP') : <span>Choisir une date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={withdrawDate}
                          onSelect={setWithdrawDate}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setWithdrawDetailsOpen(false)}>Annuler</Button>
                <Button onClick={handleWithdrawal} disabled={parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > wallet.balance}>
                  {isScheduling ? 'Programmer le retrait' : 'Retirer maintenant'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Toutes les transactions</TabsTrigger>
            <TabsTrigger value="payments">Paiements</TabsTrigger>
            <TabsTrigger value="withdrawals">Retraits</TabsTrigger>
            <TabsTrigger value="scheduled">Programmés</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-4">
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucune transaction à afficher
              </div>
            ) : (
              <div className="space-y-2">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <div className="font-medium">{transaction.description || `Transaction ${transaction.type}`}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(transaction.created_at), 'dd MMM yyyy, HH:mm')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`text-right ${transaction.type === 'withdraw' ? 'text-red-600' : 'text-green-600'}`}>
                        {transaction.type === 'withdraw' ? '-' : '+'}
                        {formatCurrency(transaction.amount)}
                      </div>
                      <div>
                        {getTransactionStatusBadge(transaction.status)}
                      </div>
                      
                      {transaction.status === 'scheduled' && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => cancelScheduledWithdrawal(transaction.id)}>
                              Annuler
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="payments" className="space-y-4 mt-4">
            {transactions.filter(t => t.type === 'payment' || t.type === 'bonus').length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucun paiement à afficher
              </div>
            ) : (
              <div className="space-y-2">
                {transactions
                  .filter(t => t.type === 'payment' || t.type === 'bonus')
                  .map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <div className="font-medium">{transaction.description || `Paiement`}</div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(transaction.created_at), 'dd MMM yyyy, HH:mm')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right text-green-600">
                          +{formatCurrency(transaction.amount)}
                        </div>
                        <div>
                          {getTransactionStatusBadge(transaction.status)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="withdrawals" className="space-y-4 mt-4">
            {transactions.filter(t => t.type === 'withdraw' && t.status !== 'scheduled').length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucun retrait à afficher
              </div>
            ) : (
              <div className="space-y-2">
                {transactions
                  .filter(t => t.type === 'withdraw' && t.status !== 'scheduled')
                  .map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          <ArrowDownLeft className="h-4 w-4 text-red-500" />
                        </div>
                        <div>
                          <div className="font-medium">{transaction.description || `Retrait`}</div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(transaction.created_at), 'dd MMM yyyy, HH:mm')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right text-red-600">
                          -{formatCurrency(transaction.amount)}
                        </div>
                        <div>
                          {getTransactionStatusBadge(transaction.status)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-4 mt-4">
            {transactions.filter(t => t.status === 'scheduled').length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucun retrait programmé
              </div>
            ) : (
              <div className="space-y-2">
                {transactions
                  .filter(t => t.status === 'scheduled')
                  .map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          <Clock className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                          <div className="font-medium">{transaction.description || `Retrait programmé`}</div>
                          <div className="text-xs text-muted-foreground">
                            {transaction.scheduled_date && format(new Date(transaction.scheduled_date), 'dd MMM yyyy')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right text-red-600">
                          -{formatCurrency(transaction.amount)}
                        </div>
                        <div>
                          {getTransactionStatusBadge(transaction.status)}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => cancelScheduledWithdrawal(transaction.id)}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="border-t pt-4 flex justify-between">
        <Button variant="outline" onClick={fetchWalletData}>
          Actualiser
        </Button>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Relevé
        </Button>
      </CardFooter>
    </Card>
  );
}
