
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Table } from "@/types/restaurant";

export const useRestaurantTables = (restaurantId: string | undefined) => {
  const { data: tables, isLoading, error } = useQuery({
    queryKey: ['restaurant', restaurantId, 'tables'],
    queryFn: async () => {
      if (!restaurantId) throw new Error('Restaurant ID is required');

      const { data, error } = await supabase
        .from('restaurant_tables')
        .select('*')
        .eq('restaurant_id', restaurantId);

      if (error) throw error;
      return data as Table[];
    },
    enabled: !!restaurantId
  });

  return {
    tables,
    isLoading,
    error
  };
};
