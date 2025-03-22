
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TableExistenceOptions {
  tables: string[];
}

export function useTableExistence({ tables }: TableExistenceOptions) {
  const [tableExists, setTableExists] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTables = async () => {
      try {
        setLoading(true);
        const results: Record<string, boolean> = {};

        for (const table of tables) {
          try {
            // Vérifier simplement si on peut accéder à la table, sans s'inquiéter du résultat exact
            const { error } = await supabase
              .from(table)
              .select('*', { count: 'exact', head: true });
              
            results[table] = !error;
          } catch (err) {
            console.error(`Error checking table ${table}:`, err);
            results[table] = false;
          }
        }

        setTableExists(results);
      } catch (error) {
        console.error('Error checking tables:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkTables();
  }, [tables]);

  return {
    tableExists,
    loading,
    isTableLoading: loading,
    exists: (table: string) => tableExists[table] || false
  };
}
