
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
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
      
      // In a real app, here you would call your API to process the transfer
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real application, you would update cashback in your database
      const mockUserId = "user123";
      const mockReceiverId = "user456";
      const mockTransferId = "transfer-" + Date.now();
      
      // Here we would make API calls to update user's cashback balance,
      // update receiver's cashback balance, and create transaction records
      
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
