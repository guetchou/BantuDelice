
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TableExistenceOptions {
  tableName?: string | string[];
  tables?: string[];
}

export const useTableExistence = (options: string | TableExistenceOptions) => {
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Normalize options format
  const normalizedOptions: TableExistenceOptions = typeof options === 'string' 
    ? { tableName: options } 
    : options;
  
  // Support both tableName and tables for flexibility
  const tables = normalizedOptions.tables || 
                (Array.isArray(normalizedOptions.tableName) 
                  ? normalizedOptions.tableName 
                  : [normalizedOptions.tableName || '']);

  useEffect(() => {
    const checkTableExistence = async () => {
      try {
        setLoading(true);
        
        // Check all specified tables
        const results = await Promise.all(tables.map(async (tableName) => {
          // Skip empty table names
          if (!tableName) return false;
          
          try {
            // Try to query the table with limit 0 just to check if it exists
            const { error } = await supabase
              .from(tableName)
              .select('*', { count: 'exact', head: true })
              .limit(0);
              
            // If no error, the table exists
            return !error;
          } catch (err) {
            console.error(`Error checking table ${tableName} existence:`, err);
            return false;
          }
        }));
        
        // All tables must exist for 'exists' to be true
        setExists(results.every(Boolean) && results.length > 0);
      } catch (err) {
        console.error(`Error checking tables existence:`, err);
        setExists(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkTableExistence();
  }, [tables.join(',')]);

  return { exists, loading };
};
