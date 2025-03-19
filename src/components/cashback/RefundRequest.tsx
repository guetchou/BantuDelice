
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatCurrency } from "@/utils/formatCurrency";
import { supabase } from "@/integrations/supabase/client";

interface RefundRequestProps {
  orderId: string;
  paymentId: string;
  orderAmount: number;
  onRequestComplete?: () => void;
}

const RefundRequest = ({ 
  orderId, 
  paymentId, 
  orderAmount,
  onRequestComplete 
}: RefundRequestProps) => {
  const [reason, setReason] = useState('');
  const [refundType, setRefundType] = useState<'original_payment' | 'wallet_credit' | 'cashback'>('original_payment');
  const [amount, setAmount] = useState(orderAmount.toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleRefundRequest = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Validation
      if (!reason) {
        throw new Error("Veuillez indiquer la raison du remboursement");
      }
      
      const refundAmount = parseFloat(amount);
      if (isNaN(refundAmount) || refundAmount <= 0) {
        throw new Error("Montant invalide");
      }
      
      if (refundAmount > orderAmount) {
        throw new Error("Le montant ne peut pas dépasser le montant de la commande");
      }
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Utilisateur non connecté");
      }
      
      // Create refund request
      const { data: refund, error: refundError } = await supabase
        .from('refunds')
        .insert({
          payment_id: paymentId,
          order_id: orderId,
          amount: refundAmount,
          reason,
          status: 'pending',
          refund_type: refundType,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (refundError) throw refundError;
      
      toast({
        title: "Demande envoyée",
        description: "Votre demande de remboursement a été enregistrée et sera traitée sous peu.",
      });
      
      // Reset form
      setReason('');
      setAmount(orderAmount.toString());
      
      // Call completion callback
      if (onRequestComplete) {
        onRequestComplete();
      }
      
    } catch (error) {
      setError(error instanceof Error ? error.message : "Une erreur est survenue");
      console.error("Refund request error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Demande de Remboursement</CardTitle>
        <CardDescription>
          Veuillez indiquer la raison et le montant de votre remboursement
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
          <Label htmlFor="amount">Montant à rembourser</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Montant maximum: {formatCurrency(orderAmount)}
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="reason">Raison du remboursement</Label>
          <Textarea
            id="reason"
            placeholder="Veuillez expliquer le problème rencontré..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Type de remboursement</Label>
          <RadioGroup value={refundType} onValueChange={(value) => setRefundType(value as any)}>
            <div className="flex items-center space-x-2 border rounded-lg p-3">
              <RadioGroupItem value="original_payment" id="original_payment" />
              <Label htmlFor="original_payment" className="cursor-pointer flex-1">
                Moyen de paiement initial
              </Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-3">
              <RadioGroupItem value="wallet_credit" id="wallet_credit" />
              <Label htmlFor="wallet_credit" className="cursor-pointer flex-1">
                Crédit portefeuille BuntuDelice
              </Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-3">
              <RadioGroupItem value="cashback" id="cashback" />
              <Label htmlFor="cashback" className="cursor-pointer flex-1">
                Cashback (+10% offerts)
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleRefundRequest}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Traitement...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Demander un remboursement
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RefundRequest;
