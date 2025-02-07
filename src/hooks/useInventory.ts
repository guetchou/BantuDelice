
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface InventoryLevel {
  id: string;
  menu_item_id: string;
  current_stock: number;
  reserved_stock: number;
  min_stock_level: number;
}

export const useInventory = (restaurantId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: inventoryLevels, isLoading } = useQuery({
    queryKey: ['inventory', restaurantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_levels')
        .select(`
          *,
          menu_items(id, name)
        `)
        .eq('menu_items.restaurant_id', restaurantId);

      if (error) throw error;
      return data;
    }
  });

  const updateStockMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string, quantity: number }) => {
      const { data, error } = await supabase
        .from('inventory_levels')
        .update({ current_stock: quantity })
        .eq('menu_item_id', itemId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast({
        title: "Stock mis à jour",
        description: "Le niveau de stock a été mis à jour avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le stock",
        variant: "destructive",
      });
    }
  });

  return {
    inventoryLevels,
    isLoading,
    updateStock: updateStockMutation.mutate,
  };
};
