import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Home, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const AddressBook = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newAddress, setNewAddress] = useState("");

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const updateAddressMutation = useMutation({
    mutationFn: async (addresses: string[]) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { error } = await supabase
        .from('profiles')
        .update({ addresses })
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Adresse mise à jour",
        description: "Votre carnet d'adresses a été mis à jour avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'adresse.",
        variant: "destructive"
      });
    }
  });

  const handleAddAddress = () => {
    if (!newAddress.trim()) return;
    
    const addresses = [...(profile?.addresses || []), newAddress];
    updateAddressMutation.mutate(addresses);
    setNewAddress("");
  };

  const handleRemoveAddress = (index: number) => {
    const addresses = (profile?.addresses || []).filter((_, i) => i !== index);
    updateAddressMutation.mutate(addresses);
  };

  if (isLoading) {
    return <div>Chargement du carnet d'adresses...</div>;
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Carnet d'adresses</h3>
      
      <div className="space-y-4 mb-6">
        {(profile?.addresses || []).map((address, index) => (
          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Home className="w-5 h-5 text-muted-foreground" />
              <span>{address}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveAddress(index)}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Ajouter une nouvelle adresse"
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
        />
        <Button onClick={handleAddAddress}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter
        </Button>
      </div>
    </Card>
  );
};

export default AddressBook;