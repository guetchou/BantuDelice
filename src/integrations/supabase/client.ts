
import { createClient } from '@supabase/supabase-js';

// Environment variables or defaults
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Enhanced Supabase client to handle missing methods
const originalFrom = supabase.from.bind(supabase);

supabase.from = (table) => {
  const result = originalFrom(table);
  
  // Add missing `select` method
  if (!result.select) {
    result.select = function(columns) {
      return {
        ...this,
        data: null,
        error: null,
        // Additional method that would be called after select + filters
        single() {
          return {
            data: null,
            error: null
          };
        },
        // Mock other methods that might be called
        eq() { return this; },
        neq() { return this; },
        gt() { return this; },
        gte() { return this; },
        lt() { return this; },
        lte() { return this; },
        in() { return this; },
        is() { return this; },
        contains() { return this; },
        textSearch(column, query, options) {
          console.log(`Mocked textSearch on column ${column} with query ${query}`);
          return this;
        },
        filter() { return this; },
        or() { return this; },
        order() { return this; },
        limit() { return this; },
        range() { return this; },
        maybeSingle() { return this; }
      };
    };
  }
  
  return result;
};

export default supabase;
