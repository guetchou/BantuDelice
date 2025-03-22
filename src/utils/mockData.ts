
/**
 * Mock data for development and testing
 */

export const mockData = {
  auth: {
    user: {
      id: 'mock-user-id',
      email: 'user@example.com',
      user_metadata: {
        full_name: 'John Doe'
      }
    }
  },
  mockApi: {
    auth: {
      getUser: async () => {
        return { 
          data: { 
            user: {
              id: 'mock-user-id',
              email: 'user@example.com',
              user_metadata: {
                full_name: 'Mock User'
              }
            } 
          }, 
          error: null 
        };
      },
      getSession: async () => {
        return { 
          data: { 
            session: {
              access_token: 'mock-token',
              expires_at: Date.now() + 3600000
            }
          }, 
          error: null 
        };
      },
      signInWithPassword: async (credentials: any) => {
        console.log('Mock: signInWithPassword called', credentials);
        return { 
          data: { 
            user: {
              id: 'mock-user-id',
              email: credentials.email,
              user_metadata: {
                full_name: 'Mock User'
              }
            }, 
            session: {
              access_token: 'mock-token'
            }
          }, 
          error: null 
        };
      },
      signUp: async (credentials: any) => {
        console.log('Mock: signUp called', credentials);
        return { 
          data: { 
            user: {
              id: 'mock-user-id',
              email: credentials.email,
              user_metadata: credentials.options?.data || {}
            },
            session: {
              access_token: 'mock-token'
            }
          }, 
          error: null 
        };
      },
      signOut: async () => {
        console.log('Mock: signOut called');
        return { error: null };
      }
    }
  }
};
