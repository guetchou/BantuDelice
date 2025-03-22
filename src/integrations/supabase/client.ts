
/**
 * Supabase client implementation with mock functionality
 * 
 * This is a mock implementation to avoid dependency on Supabase environment variables
 * while still providing the expected interface for components that use Supabase.
 */

// Create a mock client that simulates the Supabase client interface
export const supabase = {
  auth: {
    getUser: async () => {
      console.log('Mock: getUser called');
      return { 
        data: { 
          user: null 
        }, 
        error: null 
      };
    },
    getSession: async () => {
      console.log('Mock: getSession called');
      return { 
        data: { 
          session: null 
        }, 
        error: null 
      };
    },
    signInWithPassword: async (credentials) => {
      console.log('Mock: signInWithPassword called', credentials);
      return { 
        data: { 
          user: null, 
          session: null 
        }, 
        error: null 
      };
    },
    signOut: async () => {
      console.log('Mock: signOut called');
      return { 
        error: null 
      };
    },
    onAuthStateChange: (callback) => {
      console.log('Mock: onAuthStateChange called');
      // Return an object with an unsubscribe method to satisfy the interface
      return { 
        data: { 
          subscription: { 
            unsubscribe: () => {} 
          } 
        }
      };
    },
    resetPasswordForEmail: async (email) => {
      console.log('Mock: resetPasswordForEmail called', email);
      return { 
        data: {}, 
        error: null 
      };
    }
  },
  from: (table) => {
    console.log(`Mock: accessing table "${table}"`);
    return {
      select: (columns) => {
        console.log(`Mock: select "${columns}" from "${table}"`);
        return {
          eq: (field, value) => {
            console.log(`Mock: where ${field} = ${value}`);
            return {
              single: async () => {
                console.log(`Mock: returning single result from "${table}"`);
                return { data: null, error: null };
              },
              maybeSingle: async () => {
                console.log(`Mock: returning maybe single result from "${table}"`);
                return { data: null, error: null };
              },
              order: (column, { ascending }) => {
                console.log(`Mock: order by ${column} ${ascending ? 'ASC' : 'DESC'}`);
                return {
                  limit: (limit) => {
                    console.log(`Mock: limit ${limit}`);
                    return {
                      then: (callback) => callback({ data: [], error: null })
                    };
                  },
                  then: (callback) => callback({ data: [], error: null })
                };
              },
              then: (callback) => callback({ data: [], error: null })
            };
          },
          textSearch: (field, value) => {
            console.log(`Mock: text search on ${field} for "${value}"`);
            return {
              eq: (field, value) => {
                console.log(`Mock: where ${field} = ${value}`);
                return {
                  order: (column, { ascending }) => {
                    console.log(`Mock: order by ${column} ${ascending ? 'ASC' : 'DESC'}`);
                    return {
                      then: (callback) => callback({ data: [], error: null })
                    };
                  },
                  then: (callback) => callback({ data: [], error: null })
                };
              },
              order: (column, { ascending }) => {
                console.log(`Mock: order by ${column} ${ascending ? 'ASC' : 'DESC'}`);
                return {
                  then: (callback) => callback({ data: [], error: null })
                };
              },
              then: (callback) => callback({ data: [], error: null })
            };
          },
          order: (column, { ascending }) => {
            console.log(`Mock: order by ${column} ${ascending ? 'ASC' : 'DESC'}`);
            return {
              eq: (field, value) => {
                console.log(`Mock: where ${field} = ${value}`);
                return {
                  then: (callback) => callback({ data: [], error: null })
                };
              },
              then: (callback) => callback({ data: [], error: null })
            };
          },
          then: (callback) => callback({ data: [], error: null })
        };
      },
      insert: (records) => {
        console.log(`Mock: insert into "${table}"`, records);
        return {
          select: (columns) => {
            console.log(`Mock: return columns "${columns}" after insert`);
            return {
              single: async () => {
                console.log(`Mock: returning single result after insert`);
                return { data: records[0], error: null };
              },
              then: (callback) => callback({ data: records, error: null })
            };
          },
          then: (callback) => callback({ data: null, error: null })
        };
      },
      update: (updates) => {
        console.log(`Mock: update "${table}"`, updates);
        return {
          eq: (field, value) => {
            console.log(`Mock: where ${field} = ${value}`);
            return {
              then: (callback) => callback({ data: null, error: null })
            };
          },
          then: (callback) => callback({ data: null, error: null })
        };
      },
      upsert: (records) => {
        console.log(`Mock: upsert into "${table}"`, records);
        return {
          select: (columns) => {
            console.log(`Mock: return columns "${columns}" after upsert`);
            return {
              then: (callback) => callback({ data: records, error: null })
            };
          },
          then: (callback) => callback({ data: null, error: null })
        };
      },
      delete: () => {
        console.log(`Mock: delete from "${table}"`);
        return {
          eq: (field, value) => {
            console.log(`Mock: where ${field} = ${value}`);
            return {
              then: (callback) => callback({ data: null, error: null })
            };
          },
          then: (callback) => callback({ data: null, error: null })
        };
      }
    };
  },
  channel: (name) => {
    console.log(`Mock: create channel "${name}"`);
    return {
      on: (event, config, callback) => {
        console.log(`Mock: subscribe to ${event} on channel "${name}"`, config);
        return {
          subscribe: (callback2) => {
            console.log(`Mock: subscribed to channel "${name}"`);
            if (callback2) callback2();
            return this;
          }
        };
      },
      subscribe: () => {
        console.log(`Mock: subscribed to channel "${name}"`);
        return {
          unsubscribe: () => {
            console.log(`Mock: unsubscribed from channel "${name}"`);
          }
        };
      }
    };
  },
  removeChannel: (channel) => {
    console.log('Mock: remove channel');
    return Promise.resolve();
  }
};

// Add this to ensure the TypeScript compiler is happy with our mock
if (typeof window !== 'undefined') {
  // No polyfills needed for our mock
}
