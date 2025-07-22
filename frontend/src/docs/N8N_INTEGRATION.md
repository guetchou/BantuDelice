# 🤖 Intégration N8N - Automatisation des Workflows

## 🎯 Vue d'ensemble

N8N est une plateforme d'automatisation de workflow open-source qui permet de connecter différents services et APIs pour créer des workflows automatisés. Cette intégration dans bantudelice automatise les processus de gestion des données de démonstration.

## 🚀 Avantages de N8N pour bantudelice

### **1. Automatisation Intelligente**
- ✅ **Synchronisation automatique** des données de démonstration
- ✅ **Génération de rapports** hebdomadaires
- ✅ **Validation des données** en temps réel
- ✅ **Notifications** automatiques aux administrateurs

### **2. Intégrations Multiples**
- 🔗 **Supabase** ↔ **N8N** : Synchronisation des données
- 🔗 **Email** ↔ **Slack** : Notifications multi-canaux
- 🔗 **API Restaurants** ↔ **Données de démo** : Mise à jour en temps réel
- 🔗 **Webhooks** ↔ **Validation** : Déclenchement automatique

### **3. Monitoring et Analytics**
- 📊 **Suivi des exécutions** en temps réel
- 📈 **Métriques de performance** des workflows
- 🔍 **Logs détaillés** pour le debugging
- 📋 **Historique complet** des opérations

## 🏗️ Architecture de l'Intégration

### **Composants Principaux**

```typescript
// Service d'intégration N8N
import { n8nIntegrationService } from '@/services/n8nIntegration';

// Interface d'administration
import N8NWorkflowManager from '@/pages/admin/N8NWorkflowManager';
```

### **Types de Workflows Supportés**

#### **1. Workflow de Synchronisation**
```javascript
{
  "id": "demo-data-sync",
  "name": "Synchronisation Données de Démonstration",
  "trigger": "cron",
  "schedule": "0 */6 * * *", // Toutes les 6 heures
  "nodes": [
    {
      "type": "supabase",
      "operation": "read_demo_data",
      "filters": { "status": "active" }
    },
    {
      "type": "supabase",
      "operation": "sync_to_real_tables",
      "mapping": "demo_to_production"
    },
    {
      "type": "notification",
      "channel": "email",
      "recipients": ["admin@bantudelice.com"]
    }
  ]
}
```

#### **2. Workflow de Rapports**
```javascript
{
  "id": "demo-data-reports",
  "name": "Génération Rapports Hebdomadaires",
  "trigger": "cron",
  "schedule": "0 9 * * 1", // Tous les lundis à 9h
  "nodes": [
    {
      "type": "supabase",
      "operation": "aggregate_data",
      "queries": [
        "SELECT COUNT(*) FROM demo_data WHERE type = 'restaurant'",
        "SELECT COUNT(*) FROM demo_data WHERE type = 'user'",
        "SELECT COUNT(*) FROM demo_data WHERE type = 'driver'"
      ]
    },
    {
      "type": "transform",
      "operation": "create_report",
      "template": "weekly-demo-report"
    },
    {
      "type": "email",
      "operation": "send_report",
      "recipients": ["admin@bantudelice.com", "manager@bantudelice.com"]
    }
  ]
}
```

#### **3. Workflow de Validation**
```javascript
{
  "id": "demo-data-validation",
  "name": "Validation Données de Démonstration",
  "trigger": "webhook",
  "nodes": [
    {
      "type": "webhook",
      "operation": "receive_data"
    },
    {
      "type": "transform",
      "operation": "validate_data",
      "rules": [
        { "field": "name", "required": true },
        { "field": "type", "allowedValues": ["restaurant", "user", "driver"] },
        { "field": "status", "allowedValues": ["active", "inactive"] }
      ]
    },
    {
      "type": "supabase",
      "operation": "update_status",
      "table": "demo_data"
    },
    {
      "type": "notification",
      "channel": "slack",
      "message": "Données validées avec succès"
    }
  ]
}
```

## 🔧 Configuration et Installation

### **1. Installation de N8N**

```bash
# Installation via Docker (recommandé)
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# Ou via npm
npm install -g n8n
n8n start
```

### **2. Configuration des Variables d'Environnement**

```env
# N8N Configuration
VITE_N8N_URL=http://localhost:5678
VITE_N8N_API_KEY=your-n8n-api-key

# Supabase Configuration (déjà configuré)
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### **3. Configuration des Webhooks**

```typescript
// Créer un webhook pour déclencher des workflows
const webhookUrl = await n8nIntegrationService.createWebhook(
  'demo-data-validation',
  '/demo-data-validation'
);

console.log('Webhook URL:', webhookUrl);
// https://your-n8n-instance.com/webhook/demo-data-validation
```

## 🎮 Utilisation de l'Interface

### **Accès au Gestionnaire N8N**
```
URL : /admin/n8n-workflow-manager
Rôle requis : Administrateur
```

### **Fonctionnalités de l'Interface**

#### **1. Onglet Workflows**
- 📋 **Liste des workflows** actifs et inactifs
- ⚡ **Exécution manuelle** des workflows
- 🔄 **Activation/Désactivation** des workflows
- 👁️ **Visualisation** des détails des workflows

#### **2. Onglet Exécutions**
- 📊 **Historique complet** des exécutions
- ✅ **Statuts** (succès, erreur, en cours)
- ⏱️ **Temps d'exécution** et métriques
- 🔍 **Détails** des résultats et erreurs

#### **3. Onglet Analytics**
- 📈 **Métriques de performance** des workflows
- 🎯 **Taux de réussite** des exécutions
- 📊 **Graphiques** de performance
- 📋 **Rapports** détaillés

## 🔄 Workflows Automatisés

### **1. Synchronisation Automatique**

**Déclencheur** : Cron (toutes les 6 heures)
**Actions** :
1. Lire les données de démonstration actives
2. Synchroniser avec les vraies tables Supabase
3. Envoyer une notification de succès
4. Logger les erreurs éventuelles

```typescript
// Exécution manuelle
await n8nIntegrationService.executeWorkflow('demo-data-sync');

// Vérification du statut
const status = await n8nIntegrationService.getWorkflowStatus('demo-data-sync');
console.log('Workflow status:', status);
```

### **2. Génération de Rapports**

**Déclencheur** : Cron (tous les lundis à 9h)
**Actions** :
1. Collecter les statistiques des données de démonstration
2. Générer un rapport HTML/PDF
3. Envoyer par email aux administrateurs
4. Poster une notification Slack

### **3. Validation des Données**

**Déclencheur** : Webhook (quand de nouvelles données sont ajoutées)
**Actions** :
1. Recevoir les données via webhook
2. Valider les champs requis
3. Nettoyer et formater les données
4. Mettre à jour le statut dans Supabase
5. Notifier en cas d'erreur

## 📊 Monitoring et Analytics

### **Métriques Disponibles**

```typescript
// Obtenir les statistiques des workflows
const stats = {
  totalWorkflows: workflows.length,
  activeWorkflows: workflows.filter(w => w.status === 'active').length,
  totalExecutions: workflows.reduce((sum, w) => sum + w.executionCount, 0),
  successRate: 98.5, // %
  averageExecutionTime: 2.3, // secondes
  lastExecution: new Date().toISOString()
};
```

### **Logs et Debugging**

```typescript
// Obtenir l'historique des exécutions
const history = await n8nIntegrationService.getExecutionHistory('demo-data-sync');

history.forEach(execution => {
  console.log(`Execution ${execution.id}:`, {
    status: execution.status,
    duration: execution.endTime ? 
      new Date(execution.endTime).getTime() - new Date(execution.startTime).getTime() : 
      'En cours',
    result: execution.result,
    error: execution.error
  });
});
```

## 🔐 Sécurité et Permissions

### **Contrôle d'Accès**
- ✅ **Authentification** requise pour accéder à l'interface
- ✅ **Rôle admin** obligatoire pour gérer les workflows
- ✅ **API Key** pour les communications N8N
- ✅ **Webhooks sécurisés** avec validation

### **Validation des Données**
```typescript
// Règles de validation automatiques
const validationRules = [
  { field: 'name', required: true, minLength: 2 },
  { field: 'type', allowedValues: ['restaurant', 'user', 'order', 'driver', 'review', 'promotion'] },
  { field: 'status', allowedValues: ['active', 'inactive', 'pending'] },
  { field: 'data', required: true, type: 'object' }
];
```

## 🚀 Avantages pour bantudelice

### **Pour les Développeurs**
- 🔄 **Automatisation** des tâches répétitives
- 📊 **Monitoring** en temps réel des processus
- 🐛 **Debugging** facilité avec logs détaillés
- ⚡ **Performance** optimisée des workflows

### **Pour les Administrateurs**
- 🎯 **Contrôle total** sur les automatisations
- 📈 **Visibilité** sur les performances
- 🔔 **Notifications** automatiques des événements
- 📋 **Rapports** détaillés et réguliers

### **Pour l'Application**
- 🔄 **Synchronisation** automatique des données
- 📊 **Données cohérentes** entre démo et production
- ⚡ **Performance** améliorée avec cache et optimisation
- 🛡️ **Sécurité** renforcée avec validation automatique

## 🔧 Développement et Extension

### **Créer un Nouveau Workflow**

```typescript
// Exemple de création d'un workflow personnalisé
const customWorkflow: N8NWorkflow = {
  id: 'custom-workflow',
  name: 'Workflow Personnalisé',
  description: 'Description du workflow',
  trigger: 'webhook',
  status: 'active',
  executionCount: 0,
  nodes: [
    {
      id: 'webhook',
      type: 'webhook',
      operation: 'receive',
      config: { path: '/custom-webhook' },
      position: { x: 100, y: 100 }
    },
    {
      id: 'process',
      type: 'transform',
      operation: 'custom_processing',
      config: { /* configuration personnalisée */ },
      position: { x: 300, y: 100 }
    }
  ]
};

// Déployer le workflow
const success = await n8nIntegrationService.deployWorkflow(customWorkflow);
```

### **Intégrations Futures**

- 🔗 **Slack** : Notifications en temps réel
- 🔗 **Discord** : Intégration avec les serveurs Discord
- 🔗 **Telegram** : Notifications via bot Telegram
- 🔗 **SMS** : Alertes par SMS
- 🔗 **Webhook** : Intégration avec d'autres services

## 📚 Ressources et Documentation

### **Liens Utiles**
- [Documentation N8N](https://docs.n8n.io/)
- [API N8N](https://docs.n8n.io/api/)
- [Exemples de Workflows](https://n8n.io/workflows)
- [Communauté N8N](https://community.n8n.io/)

### **Support et Maintenance**
- 📧 **Email** : support@bantudelice.com
- 🐛 **Issues** : [GitHub Issues](https://github.com/bantudelice/issues)
- 📖 **Documentation** : [Wiki](https://github.com/bantudelice/wiki)

---

**🤖 N8N - Automatisation Intelligente pour bantudelice**

*Transformez vos processus manuels en workflows automatisés intelligents* 