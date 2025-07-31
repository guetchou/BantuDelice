# 🎯 Système de Données de Démonstration - Inspiré d'Odoo

## 📋 Vue d'ensemble

Le système de données de démonstration de **bantudelice** est inspiré du modèle d'Odoo et permet aux administrateurs de gérer des données de démonstration réelles connectées au backend Supabase. Ce système offre une interface complète pour créer, modifier, supprimer et synchroniser des données de démonstration.

## 🏗️ Architecture

### Composants Principaux

1. **DemoDataManager** (`/admin/demo-data-manager`)
   - Interface d'administration complète
   - Gestion CRUD des données de démonstration
   - Actions en masse
   - Synchronisation avec les vraies tables

2. **DemoDataService** (`/services/demoDataService.ts`)
   - Service backend pour les opérations de base de données
   - Connexion Supabase
   - Gestion des erreurs et validation

3. **Base de Données Supabase**
   - Table `demo_data` pour stocker les données de démonstration
   - Fonctions SQL pour l'initialisation et la synchronisation
   - Politiques de sécurité (RLS)

## 🗄️ Structure de la Base de Données

### Table `demo_data`

```sql
CREATE TABLE public.demo_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('restaurant', 'user', 'order', 'driver', 'review', 'promotion')),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Types de Données Supportés

- **restaurant** : Restaurants avec informations complètes
- **user** : Utilisateurs du système
- **order** : Commandes de démonstration
- **driver** : Livreurs et chauffeurs
- **review** : Avis et évaluations
- **promotion** : Promotions et codes de réduction

## 🚀 Fonctionnalités

### 1. Gestion CRUD Complète

#### Création
```typescript
const newItem = await demoDataService.createDemoData({
  type: 'restaurant',
  name: 'Nouveau Restaurant',
  description: 'Description du restaurant',
  status: 'active',
  data: { /* données spécifiques */ }
});
```

#### Lecture
```typescript
// Toutes les données
const allData = await demoDataService.loadAllDemoData();

// Par type
const restaurants = await demoDataService.loadDemoDataByType('restaurant');
```

#### Mise à jour
```typescript
const updatedItem = await demoDataService.updateDemoData(id, {
  name: 'Nouveau nom',
  status: 'inactive'
});
```

#### Suppression
```typescript
const success = await demoDataService.deleteDemoData(id);
```

### 2. Actions en Masse

- **Activer tout** : Change le statut de tous les éléments à 'active'
- **Désactiver tout** : Change le statut de tous les éléments à 'inactive'
- **Supprimer tout** : Supprime toutes les données de démonstration

### 3. Synchronisation avec les Vraies Tables

Le système peut synchroniser les données de démonstration avec les vraies tables de l'application :

```typescript
const success = await demoDataService.syncWithRealTables();
```

Cette fonction :
- Lit toutes les données de démonstration actives
- Les insère dans les tables correspondantes
- Gère les conflits avec des stratégies UPSERT

### 4. Données Pré-configurées

Le système inclut des données de démonstration pré-configurées :

#### Restaurants
- **Délices Congolais** : Cuisine traditionnelle congolaise
- **Mami Wata** : Restaurant de fruits de mer
- **Le Poulet Moambe** : Spécialiste du poulet moambe

#### Utilisateurs
- John Doe, Marie Ngouabi, Pierre Mabiala

#### Livreurs
- Jean-Baptiste Kimbouala, Marie-Louise Nzila, André Mpassi

#### Promotions
- Offre de Bienvenue (20% de réduction)
- Livraison Gratuite

## 🔧 Configuration

### 1. Initialisation de la Base de Données

Exécutez le script SQL dans l'éditeur Supabase :

```sql
-- Créer la table demo_data
CREATE TABLE IF NOT EXISTS public.demo_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('restaurant', 'user', 'order', 'driver', 'review', 'promotion')),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activer RLS
ALTER TABLE public.demo_data ENABLE ROW LEVEL SECURITY;

-- Politique pour les admins
CREATE POLICY "Admins can manage demo data" ON public.demo_data
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'authenticated'
  );
```

### 2. Variables d'Environnement

Assurez-vous que les variables Supabase sont configurées :

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 🎨 Interface Utilisateur

### Page d'Administration

L'interface offre :

1. **Tableau de bord** avec statistiques
2. **Filtres** par type de données
3. **Actions en masse** (activer/désactiver/supprimer)
4. **Formulaires** de création et édition
5. **Synchronisation** avec les vraies tables

### Fonctionnalités UI

- ✅ **Responsive Design** : Compatible mobile et desktop
- ✅ **Animations** : Feedback visuel pour les actions
- ✅ **Notifications** : Toast messages pour les confirmations
- ✅ **Chargement** : États de chargement avec spinners
- ✅ **Validation** : Validation des formulaires
- ✅ **Confirmation** : Dialogs de confirmation pour les actions destructives

## 🔐 Sécurité

### Contrôle d'Accès

- Seuls les **administrateurs** peuvent accéder au gestionnaire
- **Redirection automatique** si l'utilisateur n'est pas admin
- **Politiques RLS** sur la table demo_data

### Validation des Données

- Validation des types de données
- Vérification des statuts autorisés
- Sanitisation des entrées utilisateur

## 📊 Utilisation

### 1. Accès au Gestionnaire

```
URL : /admin/demo-data-manager
Rôle requis : Administrateur
```

### 2. Workflow Typique

1. **Connexion** en tant qu'administrateur
2. **Navigation** vers `/admin/demo-data-manager`
3. **Insertion** des données pré-configurées
4. **Modification** des données selon les besoins
5. **Synchronisation** avec les vraies tables
6. **Test** de l'application avec les données de démonstration

### 3. Exemples d'Utilisation

#### Ajouter un Restaurant de Démonstration

```typescript
const restaurantData = {
  name: "Restaurant Test",
  description: "Restaurant de test pour démonstration",
  cuisine_type: "Congolais",
  address: "123 Test Street, Brazzaville",
  phone: "+242 123 456 789",
  email: "test@restaurant.com",
  image_url: "/images/restaurants/test.jpg",
  latitude: 4.2634,
  longitude: 15.2429,
  delivery_radius: 10,
  min_order_amount: 2000,
  avg_preparation_time: 30,
  is_open: true,
  opening_hours: { /* horaires */ }
};

await demoDataService.createDemoData({
  type: 'restaurant',
  name: restaurantData.name,
  description: restaurantData.description,
  status: 'active',
  data: restaurantData
});
```

#### Synchroniser avec les Vraies Tables

```typescript
// Synchronise toutes les données actives
const success = await demoDataService.syncWithRealTables();

if (success) {
  console.log('Données synchronisées avec succès');
} else {
  console.error('Erreur lors de la synchronisation');
}
```

## 🐛 Dépannage

### Problèmes Courants

1. **Erreur de connexion Supabase**
   - Vérifiez les variables d'environnement
   - Testez la connexion dans la console Supabase

2. **Permissions insuffisantes**
   - Vérifiez que l'utilisateur a le rôle 'admin'
   - Vérifiez les politiques RLS

3. **Données non synchronisées**
   - Vérifiez que les données ont le statut 'active'
   - Vérifiez les logs d'erreur dans la console

### Logs et Debugging

```typescript
// Activer les logs détaillés
console.log('Données chargées:', demoData);
console.log('Erreur de synchronisation:', error);
```

## 🔄 Maintenance

### Sauvegarde

- Exportez régulièrement les données de démonstration
- Sauvegardez la table `demo_data` avant les mises à jour

### Mise à Jour

- Testez les nouvelles fonctionnalités avec les données de démonstration
- Mettez à jour les données pré-configurées selon les besoins

### Nettoyage

- Supprimez les anciennes données de démonstration
- Archivez les données inactives

## 📈 Évolutions Futures

### Fonctionnalités Prévues

1. **Import/Export** de données de démonstration
2. **Templates** de données pré-configurées
3. **Versioning** des données de démonstration
4. **API REST** pour la gestion externe
5. **Webhooks** pour les événements de synchronisation

### Améliorations Techniques

1. **Cache** pour améliorer les performances
2. **Pagination** pour les grandes quantités de données
3. **Recherche avancée** et filtres complexes
4. **Audit trail** pour tracer les modifications
5. **Backup automatique** des données de démonstration

## 📚 Références

- [Documentation Supabase](https://supabase.com/docs)
- [Guide Odoo](https://www.odoo.com/documentation)
- [React Query](https://tanstack.com/query/latest)
- [Lucide React](https://lucide.dev/guide/packages/lucide-react)

---

**Développé avec ❤️ pour bantudelice** 