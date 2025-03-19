
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Send, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Cashback } from "@/types/wallet";

const CashbackTransfer = ({ 
  cashback,
  onTransferComplete
}: { 
  cashback: Cashback | null,
  onTransferComplete?: () => void
}) => {
  const [receiverEmail, setReceiverEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleTransfer = async () => {
    try {
      setError(null);
      setLoading(true);
      
      if (!cashback) {
        throw new Error("Informations de cashback non disponibles");
      }
      
      // Validate inputs
      if (!receiverEmail || !amount) {
        throw new Error("Veuillez remplir tous les champs obligatoires");
      }
      
      const amountValue = parseFloat(amount);
      if (isNaN(amountValue) || amountValue <= 0) {
        throw new Error("Montant invalide");
      }
      
      if (amountValue > cashback.balance) {
        throw new Error("Solde insuffisant");
      }
      
      if (amountValue > cashback.balance * 0.5) {
        throw new Error("Vous ne pouvez pas transférer plus de 50% de votre solde");
      }
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Utilisateur non connecté");
      }
      
      // Find the receiver by email
      const { data: receiverData, error: receiverError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', receiverEmail)
        .single();
        
      if (receiverError || !receiverData) {
        throw new Error("Destinataire introuvable");
      }
      
      const receiverId = receiverData.id;
      
      // Check if receiver has cashback entry, create one if not
      const { data: receiverCashback, error: cashbackError } = await supabase
        .from('cashback')
        .select('id')
        .eq('user_id', receiverId)
        .maybeSingle();
        
      if (!receiverCashback) {
        await supabase
          .from('cashback')
          .insert({
            user_id: receiverId,
            balance: 0,
            lifetime_earned: 0,
            tier: 'bronze',
            tier_progress: 0,
            last_updated: new Date().toISOString(),
            created_at: new Date().toISOString()
          });
      }
      
      // Create transfer record
      const { data: transfer, error: transferError } = await supabase
        .from('cashback_transfers')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          amount: amountValue,
          status: 'pending',
          description: description || 'Transfert de cashback',
          created_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (transferError) throw transferError;
      
      // Update sender's cashback balance
      await supabase
        .from('cashback')
        .update({ 
          balance: cashback.balance - amountValue,
          last_updated: new Date().toISOString()
        })
        .eq('user_id', user.id);
        
      // Update receiver's cashback balance
      await supabase
        .from('cashback')
        .update({ 
          balance: supabase.rpc('increment', { x: amountValue }),
          last_updated: new Date().toISOString()
        })
        .eq('user_id', receiverId);
        
      // Add transaction records
      await supabase
        .from('cashback_transactions')
        .insert([
          {
            user_id: user.id,
            amount: amountValue,
            type: 'transferred',
            reference_id: transfer.id,
            reference_type: 'transfer',
            receiver_id: receiverId,
            description: description || 'Transfert de cashback',
            created_at: new Date().toISOString()
          },
          {
            user_id: receiverId,
            amount: amountValue,
            type: 'received',
            reference_id: transfer.id,
            reference_type: 'transfer',
            sender_id: user.id,
            description: description || 'Transfert de cashback',
            created_at: new Date().toISOString()
          }
        ]);
        
      // Update transfer status
      await supabase
        .from('cashback_transfers')
        .update({ status: 'completed' })
        .eq('id', transfer.id);
        
      toast({
        title: "Transfert réussi",
        description: `Vous avez transféré ${formatCurrency(amountValue)} à ${receiverEmail}`,
      });
      
      // Reset form
      setReceiverEmail('');
      setAmount('');
      setDescription('');
      
      // Call completion callback
      if (onTransferComplete) {
        onTransferComplete();
      }
      
    } catch (error) {
      setError(error instanceof Error ? error.message : "Une erreur est survenue");
      console.error("Cashback transfer error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Transférer du Cashback</CardTitle>
        <CardDescription>
          Partagez votre cashback avec vos amis et votre famille
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="receiver">Email du destinataire</Label>
          <Input
            id="receiver"
            type="email"
            placeholder="exemple@email.com"
            value={receiverEmail}
            onChange={(e) => setReceiverEmail(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amount">Montant à transférer</Label>
          <Input
            id="amount"
            type="number"
            placeholder="1000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {cashback && (
            <p className="text-xs text-muted-foreground">
              Max: {formatCurrency(cashback.balance * 0.5)} (50% de votre solde)
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description (optionnelle)</Label>
          <Input
            id="description"
            placeholder="Raison du transfert"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleTransfer}
          disabled={loading || !cashback || cashback.balance <= 0}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Traitement...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Transférer
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CashbackTransfer;
