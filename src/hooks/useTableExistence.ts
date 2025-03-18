
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface TableExistenceResult {
  exists: boolean;
  isLoading: boolean;
  error: Error | null;
}

export const useTableExistence = (tableName: string): TableExistenceResult => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['table-existence', tableName],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.rpc('check_table_exists', {
          table_name: tableName
        });

        if (error) throw error;
        
        return data > 0;
      } catch (err) {
        console.error(`Erreur lors de la vérification de l'existence de la table ${tableName}:`, err);
        return false;
      }
    },
    meta: {
      errorMessage: `Impossible de vérifier l'existence de la table ${tableName}`
    }
  });

  return {
    exists: !!data,
    isLoading,
    error: error as Error | null
  };
};
