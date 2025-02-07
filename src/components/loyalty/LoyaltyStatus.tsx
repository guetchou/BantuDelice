
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Award, Star, Trophy } from "lucide-react";

export const LoyaltyStatus = () => {
  const { data: loyalty } = useQuery({
    queryKey: ['loyalty'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data, error } = await supabase
        .from('loyalty_points')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  if (!loyalty) return null;

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Diamond':
        return <Trophy className="w-6 h-6 text-blue-500" />;
      case 'Gold':
        return <Award className="w-6 h-6 text-yellow-500" />;
      case 'Silver':
        return <Star className="w-6 h-6 text-gray-400" />;
      default:
        return <Star className="w-6 h-6 text-orange-500" />;
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="flex items-center gap-4 mb-4">
        {getTierIcon(loyalty.tier_name)}
        <div>
          <h3 className="text-lg font-bold">{loyalty.tier_name}</h3>
          <p className="text-sm text-gray-600">{loyalty.points} points</p>
        </div>
      </div>
      
      {loyalty.points_to_next_tier && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            {loyalty.points_to_next_tier} points jusqu'au prochain niveau
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all"
              style={{
                width: `${(loyalty.points / (loyalty.points + loyalty.points_to_next_tier)) * 100}%`
              }}
            />
          </div>
        </div>
      )}

      <div className="mt-4">
        <h4 className="font-semibold mb-2">Avantages actuels :</h4>
        <ul className="list-disc list-inside text-sm space-y-1">
          {(loyalty.benefits || []).map((benefit: string, index: number) => (
            <li key={index} className="text-gray-600">{benefit}</li>
          ))}
        </ul>
      </div>
    </Card>
  );
};
