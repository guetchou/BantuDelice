
import { useState, useEffect } from 'react';
import { supabase } from '@/config/supabase';

interface UseTableExistenceResult {
  exists: boolean;
  loading: boolean;
  error: Error | null;
}

/**
 * A hook to check if a table exists in the database
 * 
 * @param tableName The name of the table to check
 * @returns An object with exists, loading, and error properties
 */
export function useTableExistence(tableName: string): UseTableExistenceResult {
  const [exists, setExists] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function checkTableExists() {
      try {
        setLoading(true);
        // This query will return an empty array if the table doesn't exist
        // but won't throw an error
        const { data, error: queryError } = await supabase
          .rpc('check_table_existence', { table_name: tableName });

        if (queryError) {
          console.error('Error checking table existence:', queryError);
          setError(queryError);
          return;
        }
        
        setExists(data === true);
      } catch (err) {
        console.error('Error in useTableExistence:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    checkTableExists();
  }, [tableName]);

  return { exists, loading, error };
}

/**
 * Creates a new table if it doesn't exist
 * 
 * @param tableName The name of the table to create
 * @param columns The columns definition for the table
 * @returns A promise that resolves when the table is created or rejects with an error
 */
export async function createTableIfNotExists(
  tableName: string, 
  columns: Record<string, string>
): Promise<{ success: boolean; message: string }> {
  try {
    // First check if table exists
    const { data, error } = await supabase
      .rpc('check_table_existence', { table_name: tableName });

    if (error) {
      console.error(`Error checking if ${tableName} exists:`, error);
      return { success: false, message: error.message };
    }

    // If table already exists, return early
    if (data === true) {
      return { success: true, message: `Table ${tableName} already exists` };
    }

    // Build the column definitions
    const columnDefinitions = Object.entries(columns)
      .map(([name, type]) => `"${name}" ${type}`)
      .join(', ');

    // Execute create table SQL
    const { error: createError } = await supabase
      .rpc('execute_sql', { 
        sql_query: `CREATE TABLE IF NOT EXISTS "${tableName}" (${columnDefinitions})` 
      });

    if (createError) {
      console.error(`Error creating table ${tableName}:`, createError);
      return { success: false, message: createError.message };
    }

    console.log(`Table ${tableName} created successfully`);
    return { success: true, message: `Table ${tableName} created successfully` };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(`Unexpected error creating table ${tableName}:`, err);
    return { success: false, message: errorMessage };
  }
}
