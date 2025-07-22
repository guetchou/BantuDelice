# Guide d'Authentification bantudelice

## Vue d'ensemble

L'authentification de bantudelice utilise  pour gérer les utilisateurs, les sessions et les autorisations. Le système inclut :

- **Connexion/Inscription** avec email et mot de passe
- **Gestion des profils utilisateur** avec métadonnées personnalisées
- **Protection des routes** pour les pages privées
- **Historique des commandes** lié à l'utilisateur
- **Interface utilisateur moderne** avec design glassmorphism

## Configuration 

### 1. Créer un projet 

1. Allez sur [.com](https://.com)
2. Créez un nouveau projet
3. Notez votre URL de projet et votre clé anonyme

### 2. Configuration des variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
#  Configuration
VITE__URL=https://your-project-ref..co
VITE__ANON_KEY=your-anon-key-here

# Backend API (optionnel)
VITE_API_URL=http://localhost:6465

# Autres configurations
VITE_APP_NAME=bantudelice
VITE_APP_VERSION=1.0.0
```

### 3. Configuration de la base de données

Exécutez ces requêtes SQL dans l'éditeur SQL de  :

```sql
-- Table des utilisateurs (étend la table auth.users de )
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des commandes
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurant_id INTEGER,
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  delivery_address TEXT,
  delivery_phone TEXT,
  delivery_name TEXT,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) pour les profils utilisateur
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS pour les commandes
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Fonction pour créer automatiquement un profil utilisateur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, first_name, last_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'firstName', NEW.raw_user_meta_data->>'lastName');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement un profil
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Utilisation de l'Authentification

### Pages d'Authentification

- **`/auth`** - Page de connexion/inscription
- **`/profile`** - Profil utilisateur (protégé)
- **`/orders`** - Historique des commandes (protégé)

### Hooks Disponibles

#### `useAuth()` - Hook principal d'authentification

```typescript
import { useAuth } from '@/hooks/use';

const { user, loading, signIn, signUp, signOut, updateProfile } = useAuth();
```

**Propriétés :**
- `user` - Utilisateur connecté ou null
- `loading` - État de chargement
- `isAuthenticated` - Booléen indiquant si l'utilisateur est connecté

**Méthodes :**
- `signIn(email, password)` - Connexion
- `signUp(email, password, userData)` - Inscription
- `signOut()` - Déconnexion
- `updateProfile(updates)` - Mise à jour du profil
- `resetPassword(email)` - Réinitialisation du mot de passe

### Protection des Routes

Utilisez le composant `ProtectedRoute` pour protéger les pages :

```typescript
import ProtectedRoute from '@/components/ProtectedRoute';

// Route protégée (nécessite une authentification)
<ProtectedRoute>
  <PrivatePage />
</ProtectedRoute>

// Route publique (redirige si connecté)
<ProtectedRoute requireAuth={false}>
  <AuthPage />
</ProtectedRoute>
```

### Interface Utilisateur

#### Navbar avec Authentification

La navbar affiche automatiquement :
- **Bouton "Se connecter"** si l'utilisateur n'est pas connecté
- **Menu utilisateur** avec profil, commandes et déconnexion si connecté

#### Composants Disponibles

1. **`AuthPage`** - Page de connexion/inscription complète
2. **`UserProfile`** - Gestion du profil utilisateur
3. **`UserOrders`** - Historique des commandes
4. **`ProtectedRoute`** - Protection des routes

## Fonctionnalités Avancées

### Métadonnées Utilisateur

Les utilisateurs peuvent stocker des informations supplémentaires :

```typescript
// Lors de l'inscription
const userData = {
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890',
  address: '123 Main St'
};

await signUp(email, password, userData);
```

### Gestion des Sessions

Les sessions sont automatiquement :
- **Persistées** dans le localStorage
- **Rafraîchies** automatiquement
- **Détectées** au chargement de l'application

### Sécurité

- **Row Level Security (RLS)** activé sur toutes les tables
- **Politiques d'accès** restrictives
- **Validation** côté client et serveur
- **Protection CSRF** intégrée

## Dépannage

### Erreurs Courantes

1. **"Missing  environment variables"**
   - Vérifiez que votre fichier `.env` est correctement configuré
   - Redémarrez le serveur de développement

2. **"Error signing in"**
   - Vérifiez que l'utilisateur existe dans 
   - Vérifiez que l'email est confirmé (si requis)

3. **"Error loading orders"**
   - Vérifiez que les tables sont créées dans 
   - Vérifiez que les politiques RLS sont correctes

### Debug

Activez les logs de debug dans la console du navigateur :

```typescript
// Dans src/integrations//client.ts
console.log(' URL:', Url);
console.log('User:', user);
```

## Prochaines Étapes

1. **Configuration de l'email** pour les confirmations
2. **Intégration OAuth** (Google, Facebook, etc.)
3. **Gestion des rôles** (admin, restaurant, etc.)
4. **Notifications push** pour les commandes
5. **Analytics** des utilisateurs

## Support

Pour toute question ou problème :
1. Vérifiez la documentation 
2. Consultez les logs de la console
3. Vérifiez la configuration de votre projet  