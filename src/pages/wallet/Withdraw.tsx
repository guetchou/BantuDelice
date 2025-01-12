import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Withdraw = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour effectuer un retrait",
          variant: "destructive",
        });
        return;
      }

      const { data: wallet } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!wallet) {
        toast({
          title: "Erreur",
          description: "Portefeuille non trouvé",
          variant: "destructive",
        });
        return;
      }

      if (wallet.balance < parseInt(amount)) {
        toast({
          title: "Erreur",
          description: "Solde insuffisant",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("transactions")
        .insert({
          wallet_id: wallet.id,
          type: "withdraw",
          amount: parseInt(amount),
          status: "completed",
          description: "Retrait",
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Retrait effectué avec succès",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Erreur lors du retrait:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du retrait",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Retirer de l'argent</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Montant</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Entrez le montant"
            />
          </div>
          <Button
            className="w-full"
            onClick={handleWithdraw}
            disabled={!amount || loading}
          >
            {loading ? "Traitement..." : "Retirer"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Withdraw;