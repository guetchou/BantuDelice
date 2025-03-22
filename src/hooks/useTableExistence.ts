
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TableExistenceOptions {
  tableName: string;
  schema?: string;
}

interface UseTableExistenceResult {
  exists: boolean;
  loading: boolean;
  error: Error | null;
}

export const useTableExistence = (
  options: TableExistenceOptions | string
): UseTableExistenceResult => {
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Handle both string and options object
  const tableName = typeof options === 'string' 
    ? options 
    : options.tableName;
  
  const schema = typeof options === 'string' 
    ? 'public' 
    : options.schema || 'public';

  useEffect(() => {
    const checkTableExistence = async () => {
      try {
        setLoading(true);
        
        // Query the information_schema.tables to check if the table exists
        const { data, error } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', schema)
          .eq('table_name', tableName)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        // Table exists if data is not null
        setExists(!!data);
      } catch (err) {
        console.error(`Error checking if table ${tableName} exists:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
        
        // Fallback behavior: assume table exists if error occurs
        // This is to prevent breaking existing functionality
        setExists(true);
      } finally {
        setLoading(false);
      }
    };
    
    checkTableExistence();
  }, [tableName, schema]);
  
  return { exists, loading, error };
};

export default useTableExistence;
