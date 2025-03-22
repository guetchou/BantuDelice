
import { createClient } from '@supabase/supabase-js';

// Environment variables or defaults
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Enhanced Supabase client to handle missing methods
const originalFrom = supabase.from.bind(supabase);

supabase.from = (table) => {
  const result = originalFrom(table);
  
  // Add missing `select` method if it doesn't exist
  if (!result.select) {
    result.select = function(columns) {
      const baseResult = {
        ...this,
        data: null,
        error: null,
        
        // Chaining methods
        single() {
          console.log(`Mock single() called on table ${table}`);
          return { data: null, error: null };
        },
        
        eq(field, value) {
          console.log(`Mock eq() called with ${field}=${value} on table ${table}`);
          return this;
        },
        
        neq(field, value) {
          console.log(`Mock neq() called with ${field}!=${value} on table ${table}`);
          return this;
        },
        
        gt(field, value) {
          console.log(`Mock gt() called with ${field}>${value} on table ${table}`);
          return this;
        },
        
        gte(field, value) {
          console.log(`Mock gte() called with ${field}>=${value} on table ${table}`);
          return this;
        },
        
        lt(field, value) {
          console.log(`Mock lt() called with ${field}<${value} on table ${table}`);
          return this;
        },
        
        lte(field, value) {
          console.log(`Mock lte() called with ${field}<=${value} on table ${table}`);
          return this;
        },
        
        in(field, values) {
          console.log(`Mock in() called with ${field} in [${values}] on table ${table}`);
          return this;
        },
        
        is(field, value) {
          console.log(`Mock is() called with ${field} is ${value} on table ${table}`);
          return this;
        },
        
        contains(field, value) {
          console.log(`Mock contains() called with ${field} contains ${value} on table ${table}`);
          return this;
        },
        
        textSearch(column, query, options) {
          console.log(`Mocked textSearch on column ${column} with query ${query}`);
          return this;
        },
        
        filter(column, operator, value) {
          console.log(`Mock filter() called with ${column} ${operator} ${value} on table ${table}`);
          return this;
        },
        
        or(filters) {
          console.log(`Mock or() called with filters on table ${table}`);
          return this;
        },
        
        order(column, options) {
          console.log(`Mock order() called with ${column} on table ${table}`);
          return this;
        },
        
        limit(count) {
          console.log(`Mock limit() called with ${count} on table ${table}`);
          return this;
        },
        
        range(from, to) {
          console.log(`Mock range() called with ${from}-${to} on table ${table}`);
          return this;
        },
        
        maybeSingle() {
          console.log(`Mock maybeSingle() called on table ${table}`);
          return { data: null, error: null };
        },
        
        then(callback) {
          console.log(`Mock then() called on table ${table}`);
          const result = { data: [], error: null };
          return callback(result);
        }
      };
      
      return baseResult;
    };
  }
  
  // Ensure the count method exists
  if (!result.count) {
    result.count = function() {
      return Promise.resolve({ data: 0, error: null, count: 0 });
    };
  }
  
  // Add textSearch method if it doesn't exist
  if (!result.textSearch) {
    result.textSearch = function(column, query, options = {}) {
      console.log(`Mock textSearch called with ${column} for ${query}`);
      return this;
    };
  }
  
  // Add handling for Promise methods
  const originalResult = { ...result };
  
  // Ensure select returns a proper Promise with select method
  if (typeof originalResult.select === 'function') {
    const originalSelect = originalResult.select;
    originalResult.select = function(...args) {
      const selectResult = originalSelect.apply(this, args);
      
      // Ensure select result has select method
      if (selectResult && !selectResult.select) {
        selectResult.select = function(columns) {
          console.log(`Mock nested select called with ${columns}`);
          return this;
        };
      }
      
      return selectResult;
    };
  }
  
  return originalResult;
};

// Add patch for single method to handle promise chain
const originalSingle = supabase.from().single;
if (originalSingle) {
  supabase.from().single = function() {
    const result = originalSingle.apply(this);
    if (result && !result.select) {
      result.select = function(columns) {
        console.log(`Mock select in single called with ${columns}`);
        return this;
      };
    }
    return result;
  };
}

export default supabase;
