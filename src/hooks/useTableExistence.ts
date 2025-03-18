
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
        // First try using RPC function if it exists
        try {
          const { data, error: rpcError } = await supabase.rpc('check_table_exists', {
            table_name: tableName
          });
          
          if (!rpcError && data !== null) {
            setExists(data > 0);
            return;
          }
        } catch (rpcErr) {
          // RPC function doesn't exist, continue with fallback approach
          console.log('RPC check_table_exists not available, using fallback approach');
        }
        
        // Fallback approach: Check if a query to the table works
        try {
          // This approach will only work if the table has an 'id' column
          const { error: fallbackError } = await supabase
            .from(tableName as any)
            .select('id')
            .limit(1);

          if (fallbackError && fallbackError.code === '42P01') {
            // Error code for undefined_table
            setExists(false);
          } else {
            setExists(true);
          }
        } catch (fallbackErr) {
          console.error(`Fallback check for table '${tableName}' failed:`, fallbackErr);
          setExists(false);
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
