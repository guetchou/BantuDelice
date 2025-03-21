
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to check if a table exists in the database
 * @param tableName Name of the table to check
 * @returns Object containing existence state and loading state
 */
export function useTableExistence(tableName: string) {
  const [exists, setExists] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkTableExistence = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Attempt to query the table with a limit of 0 to just check existence
        const { count, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });
          
        // If there's no error, the table exists
        setExists(error ? false : true);
        
        if (error && error.code !== 'PGRST116') {
          console.error(`Error checking table ${tableName}:`, error);
          setError(error.message);
        }
      } catch (err) {
        console.error(`Error checking table ${tableName}:`, err);
        setError('Failed to check table existence');
        setExists(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkTableExistence();
  }, [tableName]);

  return { exists, isLoading, error };
}

export default useTableExistence;
