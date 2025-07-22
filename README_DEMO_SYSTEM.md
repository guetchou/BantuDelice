# 🎯 Système de Données de Démonstration - bantudelice

## 🚀 Vue d'ensemble

Ce système inspiré d'**Odoo** permet aux administrateurs de gérer des données de démonstration réelles connectées au backend Supabase. Il offre une interface complète pour créer, modifier, supprimer et synchroniser des données de démonstration avec les vraies tables de l'application.

## ✨ Fonctionnalités Principales

### 🔧 Gestion CRUD Complète
- ✅ **Création** de nouvelles données de démonstration
- ✅ **Lecture** et affichage des données existantes
- ✅ **Mise à jour** des informations
- ✅ **Suppression** sécurisée avec confirmation

### 🎛️ Actions en Masse
- ✅ **Activer tout** : Change le statut de tous les éléments à 'active'
- ✅ **Désactiver tout** : Change le statut de tous les éléments à 'inactive'
- ✅ **Supprimer tout** : Supprime toutes les données de démonstration

### 🔄 Synchronisation Backend
- ✅ **Connexion Supabase** réelle
- ✅ **Synchronisation** avec les vraies tables
- ✅ **Gestion des erreurs** robuste
- ✅ **Validation** des données

### 📊 Types de Données Supportés
- 🏪 **Restaurants** : Informations complètes des restaurants
- 👥 **Utilisateurs** : Profils utilisateurs de démonstration
- 📦 **Commandes** : Commandes de test
- 🚗 **Livreurs** : Chauffeurs et livreurs
- ⭐ **Avis** : Évaluations et commentaires
- 🎁 **Promotions** : Codes de réduction et offres

## 🛠️ Installation et Configuration

### 1. Prérequis
```bash
# Node.js 18+ requis
node --version

# Dépendances installées
npm install
```

### 2. Configuration Supabase
```env
# Variables d'environnement
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Initialisation de la Base de Données
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

## 🎮 Utilisation

### Accès au Gestionnaire
```
URL : /admin/demo-data-manager
Rôle requis : Administrateur
```

### Workflow Typique

1. **Connexion** en tant qu'administrateur
2. **Navigation** vers `/admin/demo-data-manager`
3. **Insertion** des données pré-configurées
4. **Modification** des données selon les besoins
5. **Synchronisation** avec les vraies tables
6. **Test** de l'application avec les données de démonstration

## 📁 Structure des Fichiers

```
frontend/src/
├── pages/admin/
│   └── DemoDataManager.tsx          # Interface principale
├── services/
│   └── demoDataService.ts           # Service backend
├── lib/
│   └── supabase-init.sql            # Script d'initialisation
└── docs/
    └── DEMO_DATA_SYSTEM.md          # Documentation complète
```

## 🔧 API du Service

### Méthodes Principales

```typescript
// Charger toutes les données
const data = await demoDataService.loadAllDemoData();

// Charger par type
const restaurants = await demoDataService.loadDemoDataByType('restaurant');

// Créer une nouvelle donnée
const newItem = await demoDataService.createDemoData({
  type: 'restaurant',
  name: 'Nouveau Restaurant',
  description: 'Description',
  status: 'active',
  data: { /* données spécifiques */ }
});

// Mettre à jour
const updatedItem = await demoDataService.updateDemoData(id, updates);

// Supprimer
const success = await demoDataService.deleteDemoData(id);

// Actions en masse
const success = await demoDataService.bulkUpdateStatus(ids, 'active');
const success = await demoDataService.bulkDelete(ids);

// Synchronisation
const success = await demoDataService.syncWithRealTables();
```

## 🎨 Interface Utilisateur

### Fonctionnalités UI

- ✅ **Design Responsive** : Compatible mobile et desktop
- ✅ **Animations** : Feedback visuel pour les actions
- ✅ **Notifications** : Toast messages pour les confirmations
- ✅ **Chargement** : États de chargement avec spinners
- ✅ **Validation** : Validation des formulaires
- ✅ **Confirmation** : Dialogs de confirmation pour les actions destructives

### Composants Utilisés

- **Table** : Affichage des données en tableau
- **Dialog** : Modales pour création/édition
- **AlertDialog** : Confirmations de suppression
- **Select** : Filtres par type
- **Badge** : Indicateurs de statut
- **Button** : Actions principales

## 🔐 Sécurité

### Contrôle d'Accès
- Seuls les **administrateurs** peuvent accéder
- **Redirection automatique** si non autorisé
- **Politiques RLS** sur la base de données

### Validation
- Validation des types de données
- Vérification des statuts autorisés
- Sanitisation des entrées utilisateur

## 📊 Données Pré-configurées

### Restaurants
- **Délices Congolais** : Cuisine traditionnelle congolaise
- **Mami Wata** : Restaurant de fruits de mer
- **Le Poulet Moambe** : Spécialiste du poulet moambe

### Utilisateurs
- John Doe, Marie Ngouabi, Pierre Mabiala

### Livreurs
- Jean-Baptiste Kimbouala, Marie-Louise Nzila, André Mpassi

### Promotions
- Offre de Bienvenue (20% de réduction)
- Livraison Gratuite

## 🐛 Dépannage

### Problèmes Courants

1. **Erreur de connexion Supabase**
   ```bash
   # Vérifiez les variables d'environnement
   echo $VITE_SUPABASE_URL
   echo $VITE_SUPABASE_ANON_KEY
   ```

2. **Permissions insuffisantes**
   ```sql
   -- Vérifiez les politiques RLS
   SELECT * FROM pg_policies WHERE tablename = 'demo_data';
   ```

3. **Données non synchronisées**
   ```typescript
   // Vérifiez le statut des données
   const activeData = await demoDataService.loadAllDemoData();
   console.log('Données actives:', activeData.filter(d => d.status === 'active'));
   ```

### Logs de Debug

```typescript
// Activer les logs détaillés
console.log('Données chargées:', demoData);
console.log('Erreur de synchronisation:', error);
```

## 🚀 Déploiement

### Build de Production
```bash
npm run build
```

### Variables d'Environnement
```env
# Production
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key

# Développement
VITE_SUPABASE_URL=https://your-dev-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-dev-anon-key
```

## 📈 Évolutions Futures

### Fonctionnalités Prévues
- [ ] **Import/Export** de données de démonstration
- [ ] **Templates** de données pré-configurées
- [ ] **Versioning** des données de démonstration
- [ ] **API REST** pour la gestion externe
- [ ] **Webhooks** pour les événements de synchronisation

### Améliorations Techniques
- [ ] **Cache** pour améliorer les performances
- [ ] **Pagination** pour les grandes quantités de données
- [ ] **Recherche avancée** et filtres complexes
- [ ] **Audit trail** pour tracer les modifications
- [ ] **Backup automatique** des données de démonstration

## 🤝 Contribution

### Développement Local
```bash
# Cloner le projet
git clone <repository-url>

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Accéder au gestionnaire
# http://localhost:9595/admin/demo-data-manager
```

### Tests
```bash
# Tests unitaires
npm run test

# Tests d'intégration
npm run test:integration

# Build de test
npm run build
```

## 📚 Documentation

- [Documentation complète](./src/docs/DEMO_DATA_SYSTEM.md)
- [API Reference](./src/services/demoDataService.ts)
- [Configuration Supabase](./src/lib/supabase-init.sql)

## 📞 Support

Pour toute question ou problème :
- 📧 Email : support@bantudelice.com
- 🐛 Issues : [GitHub Issues](https://github.com/bantudelice/issues)
- 📖 Documentation : [Wiki](https://github.com/bantudelice/wiki)

---

**Développé avec ❤️ pour bantudelice**

*Système inspiré d'Odoo pour une gestion efficace des données de démonstration* 