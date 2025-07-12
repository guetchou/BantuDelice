
import { mockApi } from './client';

export const authApi = {
  getUser: async () => {
    const { data, error } = await mockApi.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  login: async (email: string, password: string) => {
    const { data, error } = await mockApi.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return { user: data.user };
  },

  register: async (email: string, password: string, firstName?: string, lastName?: string) => {
    const { data, error } = await mockApi.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName
        }
      }
    });
    if (error) throw error;
    return { user: data.user };
  },

  logout: async () => {
    const { error } = await mockApi.auth.signOut();
    if (error) throw error;
  }
};

export default authApi;
