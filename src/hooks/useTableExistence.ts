
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TableExistenceOptions {
  refreshInterval?: number;
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
        // Check if a query to the table returns a valid response or an error
        const { count, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });

        if (isMounted) {
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
