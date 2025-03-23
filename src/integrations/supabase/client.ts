
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Vérifier que les variables d'environnement sont définies
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Les variables d\'environnement Supabase ne sont pas configurées.',
    'URL:', supabaseUrl ? 'OK' : 'Manquant',
    'ANON KEY:', supabaseAnonKey ? 'OK' : 'Manquant'
  );
}

// Créer le client Supabase
export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co', // URL de secours en cas de valeur manquante
  supabaseAnonKey || 'placeholder-key', // Clé de secours en cas de valeur manquante
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// Fonctions utilitaires pour utiliser l'API mock si Supabase n'est pas configuré
const isMockMode = !supabaseUrl || !supabaseAnonKey;

export const getSupabaseClient = () => {
  if (isMockMode) {
    console.warn('Utilisation de l\'API mock car Supabase n\'est pas configuré.');
    // Retourne une version mock du client si nécessaire
    return mockClient();
  }
  
  return supabase;
};

// Client mock pour le développement sans Supabase
function mockClient() {
  // Nous conservons l'interface similaire à Supabase mais utilisons des données simulées
  return {
    auth: {
      signInWithPassword: async () => {
        return {
          data: {
            user: {
              id: 'mock-user-id',
              email: 'user@example.com',
              user_metadata: {
                full_name: 'Utilisateur Test'
              }
            },
            session: { access_token: 'mock-token' }
          },
          error: null
        };
      },
      signUp: async () => {
        return {
          data: {
            user: {
              id: 'mock-user-id',
              email: 'user@example.com',
              user_metadata: {
                full_name: 'Nouvel Utilisateur'
              }
            },
            session: { access_token: 'mock-token' }
          },
          error: null
        };
      },
      signOut: async () => {
        return { error: null };
      },
      getUser: async () => {
        return {
          data: {
            user: {
              id: 'mock-user-id',
              email: 'user@example.com',
              user_metadata: {
                full_name: 'Utilisateur Test'
              }
            }
          },
          error: null
        };
      },
      getSession: async () => {
        return {
          data: {
            session: { access_token: 'mock-token' }
          },
          error: null
        };
      },
      onAuthStateChange: () => {
        return {
          data: {
            subscription: {
              unsubscribe: () => {}
            }
          }
        };
      }
    },
    from: () => {
      return {
        select: () => {
          return {
            single: () => Promise.resolve({ data: {}, error: null }),
            eq: () => Promise.resolve({ data: [], error: null }),
            // Ajoutez d'autres méthodes si nécessaire
          };
        }
      };
    }
  };
}
