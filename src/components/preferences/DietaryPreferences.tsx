import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface DietaryRestriction {
  id: string;
  name: string;
  description: string;
}

const DietaryPreferences = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: preferences, isLoading } = useQuery({
    queryKey: ['dietaryPreferences'],
    queryFn: async () => {
      console.log('Fetching dietary preferences');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Récupérer toutes les restrictions alimentaires
      const { data: restrictions } = await supabase
        .from('dietary_restrictions')
        .select('*');

      // Récupérer les préférences de l'utilisateur
      const { data: profile } = await supabase
        .from('profiles')
        .select('dietary_preferences')
        .eq('id', user.id)
        .single();

      return {
        restrictions,
        userPreferences: profile?.dietary_preferences || []
      };
    }
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (newPreferences: string[]) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('profiles')
        .update({ dietary_preferences: newPreferences })
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dietaryPreferences'] });
      toast({
        title: "Préférences mises à jour",
        description: "Vos préférences alimentaires ont été enregistrées",
      });
    }
  });

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-pulse">Chargement des préférences...</div>
      </div>
    );
  }

  const togglePreference = (restrictionName: string) => {
    const currentPreferences = preferences?.userPreferences || [];
    const newPreferences = currentPreferences.includes(restrictionName)
      ? currentPreferences.filter(p => p !== restrictionName)
      : [...currentPreferences, restrictionName];
    
    updatePreferencesMutation.mutate(newPreferences);
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Préférences Alimentaires</h2>
      
      <div className="space-y-4">
        {preferences?.restrictions?.map((restriction: DietaryRestriction) => (
          <div key={restriction.id} className="flex items-start space-x-3">
            <Checkbox
              id={restriction.id}
              checked={preferences.userPreferences.includes(restriction.name)}
              onCheckedChange={() => togglePreference(restriction.name)}
            />
            <div>
              <label
                htmlFor={restriction.id}
                className="font-medium cursor-pointer"
              >
                {restriction.name}
              </label>
              <p className="text-sm text-gray-500">{restriction.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-sm text-gray-500">
        <p>
          Ces préférences nous aident à vous proposer des plats adaptés à vos besoins.
          Vous pouvez les modifier à tout moment.
        </p>
      </div>
    </Card>
  );
};

export default DietaryPreferences;