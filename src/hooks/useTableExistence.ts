
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to check if a table exists in the Supabase database
 */
export const useTableExistence = (tableName: string) => {
  const [exists, setExists] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkTableExists = async () => {
      try {
        setLoading(true);
        // Use the function we created in SQL
        const { data, error: queryError } = await supabase.rpc('check_table_exists', {
          table_name: tableName
        });
        
        if (queryError) {
          // If the function doesn't exist, check using a different approach
          // Try a simple select from the table
          const { error: fallbackError } = await supabase
            .from(tableName)
            .select('id')
            .limit(1);

          if (fallbackError && fallbackError.code === '42P01') {
            // Error code for undefined_table
            setExists(false);
          } else {
            setExists(true);
          }
        } else {
          setExists(data > 0);
        }
      } catch (err) {
        console.error(`Error checking if table '${tableName}' exists:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setExists(false);
      } finally {
        setLoading(false);
      }
    };

    checkTableExists();
  }, [tableName]);

  return { exists, loading, error };
};
