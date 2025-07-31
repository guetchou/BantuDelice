import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Award, Gift, Crown } from "lucide-react";

interface LoyaltyPoints {
  points: number;
  level: string;
}

const rewards = [
  {
    id: 1,
    name: "Réduction de 10%",
    points: 100,
    description: "Sur votre prochaine commande",
    icon: <Gift className="w-8 h-8" />,
  },
  {
    id: 2,
    name: "Livraison gratuite",
    points: 200,
    description: "Pour votre prochaine commande",
    icon: <Crown className="w-8 h-8" />,
  },
  {
    id: 3,
    name: "Bon d'achat de 5000 XAF",
    points: 500,
    description: "Utilisable sur tout le site",
    icon: <Award className="w-8 h-8" />,
  },
];

const Rewards = () => {
  const { toast } = useToast();
  const [loyaltyPoints, setLoyaltyPoints] = useState<LoyaltyPoints | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoyaltyPoints = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from("loyalty_points")
          .select("*")
          .eq("user_id", user.id)
          .single();

        setLoyaltyPoints(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des points:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoyaltyPoints();
  }, []);

  const handleRedeemReward = async (reward: typeof rewards[0]) => {
    try {
      if (!loyaltyPoints || loyaltyPoints.points < reward.points) {
        toast({
          title: "Points insuffisants",
          description: "Vous n'avez pas assez de points pour cette récompense",
          variant: "destructive",
        });
        return;
      }

      // Logique de rédemption à implémenter
      toast({
        title: "Succès",
        description: "Récompense obtenue avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la rédemption:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Récompenses</h1>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Award className="w-12 h-12 text-primary" />
            <div>
              <p className="text-lg font-medium">Vos points</p>
              <p className="text-3xl font-bold">{loyaltyPoints?.points || 0}</p>
              <p className="text-sm text-muted-foreground">
                Niveau: {loyaltyPoints?.level || "Bronze"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => (
          <Card key={reward.id} className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 text-primary">{reward.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{reward.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {reward.description}
              </p>
              <p className="text-lg font-bold mb-4">{reward.points} points</p>
              <Button
                onClick={() => handleRedeemReward(reward)}
                disabled={!loyaltyPoints || loyaltyPoints.points < reward.points}
              >
                Échanger
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Rewards;