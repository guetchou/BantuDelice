
import pb from '@/lib/pocketbase';

// Authentication functions
export const authService = {
  login: async (email: string, password: string) => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password);
      return { data: authData, error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { data: null, error };
    }
  },
  
  logout: () => {
    pb.authStore.clear();
    return { error: null };
  },
  
  register: async (email: string, password: string, userData: Record<string, any>) => {
    try {
      const data = {
        email,
        password,
        passwordConfirm: password,
        ...userData
      };
      const record = await pb.collection('users').create(data);
      return { data: record, error: null };
    } catch (error) {
      console.error('Registration error:', error);
      return { data: null, error };
    }
  },
  
  getUser: () => {
    const user = pb.authStore.model;
    return { data: { user }, error: null };
  },
  
  resetPassword: async (email: string) => {
    try {
      await pb.collection('users').requestPasswordReset(email);
      return { data: true, error: null };
    } catch (error) {
      console.error('Password reset error:', error);
      return { data: null, error };
    }
  }
};

// Client data functions
export const clientService = {
  getClients: async () => {
    try {
      const records = await pb.collection('clients').getList(1, 50, {
        sort: 'created',
      });
      return { data: records.items, error: null };
    } catch (error) {
      console.error('Error fetching clients:', error);
      return { data: null, error };
    }
  },
  
  getClient: async (id: string) => {
    try {
      const record = await pb.collection('clients').getOne(id);
      return { data: record, error: null };
    } catch (error) {
      console.error('Error fetching client:', error);
      return { data: null, error };
    }
  },
  
  createClient: async (data: Record<string, any>) => {
    try {
      const record = await pb.collection('clients').create(data);
      return { data: record, error: null };
    } catch (error) {
      console.error('Error creating client:', error);
      return { data: null, error };
    }
  },
  
  updateClient: async (id: string, data: Record<string, any>) => {
    try {
      const record = await pb.collection('clients').update(id, data);
      return { data: record, error: null };
    } catch (error) {
      console.error('Error updating client:', error);
      return { data: null, error };
    }
  },
  
  deleteClient: async (id: string) => {
    try {
      await pb.collection('clients').delete(id);
      return { data: true, error: null };
    } catch (error) {
      console.error('Error deleting client:', error);
      return { data: null, error };
    }
  }
};

// General data access function
export const getCollection = (collection: string) => {
  return {
    getList: async (page = 1, perPage = 20, options = {}) => {
      try {
        const records = await pb.collection(collection).getList(page, perPage, options);
        return { data: records.items, error: null, totalItems: records.totalItems };
      } catch (error) {
        console.error(`Error fetching ${collection}:`, error);
        return { data: null, error, totalItems: 0 };
      }
    },
    
    getOne: async (id: string) => {
      try {
        const record = await pb.collection(collection).getOne(id);
        return { data: record, error: null };
      } catch (error) {
        console.error(`Error fetching ${collection} item:`, error);
        return { data: null, error };
      }
    },
    
    create: async (data: Record<string, any>) => {
      try {
        const record = await pb.collection(collection).create(data);
        return { data: record, error: null };
      } catch (error) {
        console.error(`Error creating ${collection} item:`, error);
        return { data: null, error };
      }
    },
    
    update: async (id: string, data: Record<string, any>) => {
      try {
        const record = await pb.collection(collection).update(id, data);
        return { data: record, error: null };
      } catch (error) {
        console.error(`Error updating ${collection} item:`, error);
        return { data: null, error };
      }
    },
    
    delete: async (id: string) => {
      try {
        await pb.collection(collection).delete(id);
        return { data: true, error: null };
      } catch (error) {
        console.error(`Error deleting ${collection} item:`, error);
        return { data: null, error };
      }
    }
  };
};
