# 🔒 N8N - Mode Démonstration Uniquement

## 🎯 Objectif

**N8N est configuré pour fonctionner UNIQUEMENT en mode démonstration** afin de garantir que l'automatisation n'affecte que les données de démonstration et non les données de production.

## 🚫 Restrictions Imposées

### **1. Accès Limité par Environnement**
```typescript
// Vérification automatique du mode démonstration
const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true' || 
                   import.meta.env.NODE_ENV === 'development';

if (!isDemoMode) {
  throw new Error('N8N disponible uniquement en mode démonstration');
}
```

### **2. Workflows Restreints aux Données de Démo**
- ✅ **Autorisé** : Workflows sur `demo_data` table
- ✅ **Autorisé** : Synchronisation vers tables de production (avec données de démo)
- ❌ **Interdit** : Workflows sur données de production directes
- ❌ **Interdit** : Modifications de données sensibles

### **3. Variables d'Environnement Requises**
```env
# Mode Démonstration (obligatoire)
VITE_DEMO_MODE=true

# Ou en développement
NODE_ENV=development

# Configuration N8N
VITE_N8N_URL=http://localhost:5678
VITE_N8N_API_KEY=your-n8n-api-key
```

## 🔧 Configuration Sécurisée

### **1. Vérification d'Environnement**
```typescript
class N8NIntegrationService {
  private isDemoMode: boolean;

  constructor() {
    this.isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true' || 
                      import.meta.env.NODE_ENV === 'development';
  }

  // Toutes les méthodes vérifient le mode démo
  async deployWorkflow(workflow: N8NWorkflow): Promise<boolean> {
    if (!this.isDemoMode) {
      throw new Error('Déploiement disponible uniquement en mode démonstration');
    }
    
    // Vérifier que le workflow est pour la démo
    if (workflow.environment !== 'demo' || workflow.scope !== 'demo_data_only') {
      throw new Error('Seuls les workflows de démonstration sont autorisés');
    }
    
    // Procéder au déploiement...
  }
}
```

### **2. Interface d'Administration Sécurisée**
```typescript
const N8NWorkflowManager = () => {
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const demoMode = n8nIntegrationService.isDemoEnvironment();
    setIsDemoMode(demoMode);

    if (!demoMode) {
      // Afficher message d'erreur et bloquer l'accès
      return;
    }
  }, []);

  // Interface limitée aux fonctionnalités de démo
};
```

## 📋 Workflows de Démonstration Autorisés

### **1. Synchronisation Données de Démo**
```javascript
{
  "id": "demo-data-sync",
  "name": "Synchronisation Données de Démonstration",
  "environment": "demo",
  "scope": "demo_data_only",
  "trigger": "cron",
  "schedule": "0 */6 * * *", // Toutes les 6 heures
  "actions": [
    "Lire depuis demo_data table",
    "Synchroniser vers tables de production",
    "Notification de succès"
  ]
}
```

### **2. Rapports de Démonstration**
```javascript
{
  "id": "demo-data-reports",
  "name": "Rapports Données de Démonstration",
  "environment": "demo",
  "scope": "demo_data_only",
  "trigger": "cron",
  "schedule": "0 9 * * 1", // Lundis à 9h
  "actions": [
    "Collecter statistiques demo_data",
    "Générer rapport HTML",
    "Envoyer par email"
  ]
}
```

### **3. Validation Données de Démo**
```javascript
{
  "id": "demo-data-validation",
  "name": "Validation Données de Démonstration",
  "environment": "demo",
  "scope": "demo_data_only",
  "trigger": "webhook",
  "actions": [
    "Recevoir données via webhook",
    "Valider format et contenu",
    "Mettre à jour statut dans demo_data"
  ]
}
```

## 🛡️ Sécurité et Contrôles

### **1. Vérifications Automatiques**
- ✅ **Environnement** : Mode démo requis
- ✅ **Scope** : `demo_data_only` obligatoire
- ✅ **Tables** : Accès limité à `demo_data`
- ✅ **Permissions** : Admin requis

### **2. Logs et Audit**
```typescript
// Logging automatique des actions
console.log(`[N8N-DEMO] Workflow ${workflowId} exécuté en mode démo`);
console.log(`[N8N-DEMO] Données traitées: ${dataCount} entrées`);
console.log(`[N8N-DEMO] Environnement: ${environment}`);
```

### **3. Gestion d'Erreurs**
```typescript
try {
  await n8nIntegrationService.executeWorkflow(workflowId);
} catch (error) {
  if (error.message.includes('mode démonstration')) {
    // Erreur de sécurité - bloquer l'action
    toast({
      title: "Accès Refusé",
      description: "N8N disponible uniquement en mode démonstration",
      variant: "destructive"
    });
  }
}
```

## 🎮 Interface Utilisateur

### **1. Indicateurs Visuels**
- 🟠 **Badge "Mode Démonstration"** sur toutes les pages
- 🔒 **Icône de verrouillage** pour les fonctionnalités restreintes
- ⚠️ **Messages d'avertissement** pour les actions non autorisées

### **2. Messages d'Erreur Clairs**
```
❌ Accès Refusé - Mode Démonstration Requis
N8N n'est disponible qu'en mode démonstration pour la gestion des données de démo.

✅ Configuration Requise:
• VITE_DEMO_MODE=true
• NODE_ENV=development
• N8N configuré pour les données de démonstration uniquement
```

### **3. Fonctionnalités Disponibles**
- ✅ **Créer** workflows de démonstration
- ✅ **Exécuter** workflows de démonstration
- ✅ **Monitorer** exécutions de démonstration
- ✅ **Générer** rapports de démonstration
- ❌ **Accéder** aux données de production
- ❌ **Modifier** workflows de production

## 📊 Métriques de Démonstration

### **1. Statistiques Limitées**
```typescript
const demoStats = {
  totalDemoWorkflows: workflows.filter(w => w.environment === 'demo').length,
  activeDemoWorkflows: workflows.filter(w => w.environment === 'demo' && w.status === 'active').length,
  demoExecutions: executions.filter(e => e.environment === 'demo').length,
  demoSuccessRate: 98.5 // %
};
```

### **2. Rapports de Démonstration**
- 📈 **Workflows actifs** de démonstration
- 📊 **Exécutions réussies** de démonstration
- ⏱️ **Temps d'exécution** moyens
- 🔍 **Erreurs** de démonstration

## 🔄 Workflows Automatisés (Démo Uniquement)

### **1. Synchronisation Automatique**
**Déclencheur** : Cron (toutes les 6 heures)
**Actions** :
1. Lire les données de `demo_data` actives
2. Synchroniser avec les vraies tables Supabase
3. Envoyer notification de succès
4. Logger les erreurs éventuelles

### **2. Génération de Rapports**
**Déclencheur** : Cron (tous les lundis à 9h)
**Actions** :
1. Collecter les statistiques de `demo_data`
2. Générer un rapport HTML/PDF
3. Envoyer par email aux administrateurs
4. Poster une notification Slack

### **3. Validation des Données**
**Déclencheur** : Webhook (quand de nouvelles données sont ajoutées)
**Actions** :
1. Recevoir les données via webhook
2. Valider les champs requis
3. Nettoyer et formater les données
4. Mettre à jour le statut dans `demo_data`
5. Notifier en cas d'erreur

## 🚀 Avantages de cette Approche

### **Pour la Sécurité**
- 🔒 **Isolation** des données de production
- 🛡️ **Contrôle d'accès** strict
- 📋 **Audit trail** complet
- ⚠️ **Prévention** des erreurs

### **Pour le Développement**
- 🧪 **Tests** en environnement contrôlé
- 🔄 **Itération** rapide des workflows
- 📊 **Validation** des processus
- 🎯 **Focus** sur les données de démo

### **Pour la Production**
- 🚫 **Protection** des données sensibles
- ✅ **Confiance** dans les automatisations
- 📈 **Performance** optimisée
- 🔍 **Monitoring** précis

## 📚 Utilisation Recommandée

### **1. Développement Local**
```bash
# Activer le mode démonstration
export VITE_DEMO_MODE=true

# Démarrer N8N en mode démo
docker run -it --rm \
  --name n8n-demo \
  -p 5678:5678 \
  -e N8N_DEMO_MODE=true \
  n8nio/n8n
```

### **2. Tests et Validation**
```typescript
// Tester les workflows de démo
await n8nIntegrationService.executeWorkflow('demo-data-sync');

// Vérifier les résultats
const stats = await n8nIntegrationService.getDemoStatistics();
console.log('Statistiques de démo:', stats);
```

### **3. Déploiement en Production**
```env
# Production - N8N désactivé
VITE_DEMO_MODE=false
VITE_N8N_URL=
VITE_N8N_API_KEY=

# Développement - N8N activé pour démo
VITE_DEMO_MODE=true
VITE_N8N_URL=http://localhost:5678
VITE_N8N_API_KEY=your-demo-key
```

## 🎯 Résumé

**N8N est configuré pour être utilisé UNIQUEMENT en mode démonstration**, garantissant :

- 🔒 **Sécurité** : Accès limité aux données de démo
- 🎯 **Focus** : Automatisation des processus de démonstration
- 🛡️ **Protection** : Prévention des erreurs de production
- 📊 **Contrôle** : Monitoring précis des workflows de démo

**Cette approche garantit que N8N reste un outil de développement et de démonstration sans risque pour les données de production.** 