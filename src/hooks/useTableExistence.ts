
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TableExistenceOptions {
  tableName?: string;
}

export const useTableExistence = (tableName: string) => {
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTableExistence = async () => {
      try {
        setLoading(true);
        
        // Try to query the table with limit 0 just to check if it exists
        const { error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true })
          .limit(0);
          
        // If no error, the table exists
        setExists(!error);
      } catch (err) {
        console.error(`Error checking table ${tableName} existence:`, err);
        setExists(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkTableExistence();
  }, [tableName]);

  return { exists, loading };
};
