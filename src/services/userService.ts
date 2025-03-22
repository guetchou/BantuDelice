
import { mockData } from '@/utils/mockData';
import { User, UserCreateRequest, UserRole, UserStatus, UserUpdateRequest } from '@/types/user';
import { toast } from 'sonner';

// Utilisateurs en mémoire pour le mock
let users = mockData.users || [];

// Si aucun superadmin n'existe, on en crée un par défaut
if (!users.some(user => user.role === 'superadmin')) {
  users.push({
    id: 'super-1',
    email: 'superadmin@example.com',
    password: 'admin123', // Ne serait jamais stocké en clair dans un vrai système
    first_name: 'Super',
    last_name: 'Admin',
    role: 'superadmin',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
}

export const userService = {
  // Récupérer tous les utilisateurs
  getUsers: async (): Promise<User[]> => {
    // Simulation d'appel API
    await new Promise(resolve => setTimeout(resolve, 500));
    return users.map(({ password, ...user }) => user);
  },

  // Récupérer un utilisateur par ID
  getUserById: async (id: string): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const user = users.find(u => u.id === id);
    if (!user) return null;
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // Créer un nouvel utilisateur
  createUser: async (userData: UserCreateRequest): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Vérifier si l'email existe déjà
    if (users.some(u => u.email === userData.email)) {
      toast.error("Un utilisateur avec cet email existe déjà");
      throw new Error("Un utilisateur avec cet email existe déjà");
    }

    const now = new Date().toISOString();
    const newUser = {
      id: `user-${Date.now()}`,
      email: userData.email,
      password: userData.password, // Dans un vrai système, ce serait hashé
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      role: userData.role || 'user',
      status: 'active' as UserStatus,
      created_at: now,
      updated_at: now,
      phone: userData.phone || ''
    };

    users.push(newUser);
    
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  // Mettre à jour un utilisateur
  updateUser: async (id: string, userData: UserUpdateRequest): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const index = users.findIndex(u => u.id === id);
    if (index === -1) {
      toast.error("Utilisateur non trouvé");
      return null;
    }

    const updatedUser = {
      ...users[index],
      ...userData,
      updated_at: new Date().toISOString()
    };

    users[index] = updatedUser;
    
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  },

  // Supprimer un utilisateur
  deleteUser: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const initialLength = users.length;
    users = users.filter(u => u.id !== id);
    
    return users.length < initialLength;
  },

  // Vérifier les identifiants d'un utilisateur
  authenticate: async (email: string, password: string): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return null;
    
    // Mettre à jour la dernière connexion
    const index = users.findIndex(u => u.id === user.id);
    users[index] = {
      ...users[index],
      last_login: new Date().toISOString()
    };
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // Vérifier si un utilisateur est un superadmin
  isSuperAdmin: (user: User | null): boolean => {
    return user?.role === 'superadmin';
  },

  // Vérifier si un utilisateur est un admin
  isAdmin: (user: User | null): boolean => {
    return user?.role === 'admin' || user?.role === 'superadmin';
  }
};
