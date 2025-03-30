
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TableExistenceOptions {
  refreshInterval?: number;
}

export interface MultiTableExistenceOptions extends TableExistenceOptions {
  tables: string[];
}

export function useTableExistence(tableName: string, options?: TableExistenceOptions) {
  const [exists, setExists] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let timer: NodeJS.Timeout | null = null;

    const checkTableExists = async () => {
      if (!isMounted) return;
      setLoading(true);
      setError(null);

      try {
        // Using a simpler approach to check if the table exists
        const { error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true })
          .limit(1);

        if (isMounted) {
          // If there's no error, the table exists
          setExists(error ? false : true);
        }
      } catch (err) {
        if (isMounted) {
          setExists(false);
          setError(err instanceof Error ? err.message : 'Unknown error checking table existence');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Initial check
    checkTableExists();

    // Set up periodic checks if requested
    if (options?.refreshInterval) {
      timer = setInterval(checkTableExists, options.refreshInterval);
    }

    return () => {
      isMounted = false;
      if (timer) clearInterval(timer);
    };
  }, [tableName, options?.refreshInterval]);

  return { exists, loading, error };
}

export function useMultiTableExistence(options: MultiTableExistenceOptions) {
  const [tableStatus, setTableStatus] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let timer: NodeJS.Timeout | null = null;

    const checkTablesExist = async () => {
      if (!isMounted) return;
      setLoading(true);
      setError(null);

      try {
        const results: Record<string, boolean> = {};

        for (const table of options.tables) {
          const { error } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true })
            .limit(1);

          results[table] = !error;
        }

        if (isMounted) {
          setTableStatus(results);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error checking tables existence');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Initial check
    checkTablesExist();

    // Set up periodic checks if requested
    if (options?.refreshInterval) {
      timer = setInterval(checkTablesExist, options.refreshInterval);
    }

    return () => {
      isMounted = false;
      if (timer) clearInterval(timer);
    };
  }, [options.tables, options.refreshInterval]);

  return { tableStatus, loading, error, allExist: Object.values(tableStatus).every(Boolean) };
}
