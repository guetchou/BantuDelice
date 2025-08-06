import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiService from "@/services/api";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const DietaryPreferences = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: preferences, isLoading: preferencesLoading } = useQuery({
    queryKey: ['dietaryRestrictions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dietary_restrictions')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await apiService.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('profiles')
        .select('dietary_preferences')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (preferences: string[]) => {
      const { data: { user } } = await apiService.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { error } = await supabase
        .from('profiles')
        .update({ dietary_preferences: preferences })
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Préférences mises à jour",
        description: "Vos préférences alimentaires ont été mises à jour avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour vos préférences.",
        variant: "destructive"
      });
    }
  });

  const handlePreferenceChange = (id: string, checked: boolean) => {
    const currentPreferences = profile?.dietary_preferences || [];
    const newPreferences = checked
      ? [...currentPreferences, id]
      : currentPreferences.filter(p => p !== id);
    
    updatePreferencesMutation.mutate(newPreferences);
  };

  if (preferencesLoading || profileLoading) {
    return <div>Chargement des préférences...</div>;
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Préférences alimentaires</h3>
      <div className="space-y-4">
        {preferences?.map((preference) => (
          <div key={preference.id} className="flex items-start space-x-3">
            <Checkbox
              id={preference.id}
              checked={(profile?.dietary_preferences || []).includes(preference.id)}
              onCheckedChange={(checked) => handlePreferenceChange(preference.id, checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor={preference.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {preference.name}
              </label>
              {preference.description && (
                <p className="text-sm text-muted-foreground">
                  {preference.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default DietaryPreferences;