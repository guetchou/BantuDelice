
import pb from '@/lib/pocketbase';

// Cet adaptateur facilite la migration de Supabase vers PocketBase
// en imitant l'interface Supabase pour éviter de casser le code existant
const supabase = {
  auth: {
    getUser: async () => {
      const user = pb.authStore.model;
      return { data: { user } };
    },
    signOut: async () => {
      pb.authStore.clear();
      return { error: null };
    }
  },
  from: (table: string) => {
    return {
      select: () => ({
        eq: () => ({
          order: () => ({
            then: (callback: Function) => {
              // Mock response
              callback({ data: [], error: null });
            }
          })
        })
      }),
      update: () => ({
        eq: () => ({
          then: (callback: Function) => {
            // Mock response
            callback({ data: null, error: null });
          }
        })
      })
    };
  },
  channel: (channel: string) => {
    return {
      on: () => ({
        subscribe: () => {}
      })
    };
  },
  removeChannel: () => {}
};

export { supabase };
