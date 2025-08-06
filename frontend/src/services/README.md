# 🔌 Intégration API - BantuDelice Colis

Documentation complète de l'intégration API pour le module Colis.

## 📋 Vue d'ensemble

L'intégration API fournit une couche complète pour communiquer avec le backend, incluant :
- **Service API** avec gestion d'erreurs
- **Hooks personnalisés** avec cache et état
- **Contexte global** pour la synchronisation
- **Gestion d'erreurs** robuste
- **Types TypeScript** complets

## 🏗️ Architecture

```
services/
├── colisApi.ts          # Service principal API
├── index.ts             # Exports centralisés
└── README.md           # Documentation

hooks/
└── useColisApi.ts      # Hooks personnalisés

context/
└── ColisApiContext.tsx # Contexte global

components/colis/
└── ColisApiErrorBoundary.tsx # Gestion d'erreurs
```

## 🚀 Services API

### Service Principal (`colisApi.ts`)

```typescript
import { colisApi } from '@/services/colisApi';

// Créer un colis
const newColis = await colisApi.createColis(colisData);

// Suivre un colis
const tracking = await colisApi.trackColis('BD12345678');

// Calculer un prix
const pricing = await colisApi.calculatePricing(pricingData);
```

### Méthodes Disponibles

| Méthode | Description | Endpoint |
|---------|-------------|----------|
| `createColis()` | Créer un nouveau colis | `POST /colis` |
| `getColis()` | Récupérer un colis | `GET /colis/:id` |
| `updateColis()` | Mettre à jour un colis | `PUT /colis/:id` |
| `deleteColis()` | Supprimer un colis | `DELETE /colis/:id` |
| `listColis()` | Lister les colis | `GET /colis` |
| `trackColis()` | Suivre un colis | `GET /tracking/:id` |
| `calculatePricing()` | Calculer un prix | `POST /tarifs` |
| `getNotifications()` | Récupérer notifications | `GET /notifications` |
| `getStats()` | Récupérer statistiques | `GET /colis/stats` |

## 🎣 Hooks Personnalisés

### Hooks de Base

```typescript
import { useColis, useColisList, useCreateColis } from '@/services';

// Hook pour un colis spécifique
const { data: colis, loading, error } = useColis('BD12345678');

// Hook pour la liste des colis
const { data: colisList, loadMore, refresh } = useColisList({
  page: 1,
  limit: 10,
  status: 'active'
});

// Hook pour créer un colis
const { createColis, loading, error } = useCreateColis();
```

### Hooks avec Cache

```typescript
import { useColisWithCache, useNotificationsWithCache } from '@/services';

// Hook avec cache automatique
const { data: colis, apiStatus, lastSync } = useColisWithCache('BD12345678');

// Hook pour notifications avec cache
const { notifications, refresh } = useNotificationsWithCache();
```

### Hooks Spécialisés

```typescript
import { useTracking, usePricing, usePayment } from '@/services';

// Suivi en temps réel
const { data: tracking, updateTracking } = useTracking('BD12345678');

// Calcul de prix
const { calculatePricing, data: pricing } = usePricing();

// Paiements
const { initiatePayment, checkPaymentStatus } = usePayment();
```

## 🔄 Contexte Global

### Provider

```typescript
import { ColisApiProvider } from '@/services';

function App() {
  return (
    <ColisApiProvider>
      <YourApp />
    </ColisApiProvider>
  );
}
```

### Utilisation du Contexte

```typescript
import { useColisApiContext } from '@/services';

function MyComponent() {
  const { 
    state, 
    syncColis, 
    getCachedColis, 
    clearCache 
  } = useColisApiContext();

  // Synchroniser manuellement
  const handleSync = async () => {
    await syncColis('BD12345678');
  };

  // Vider le cache
  const handleClearCache = () => {
    clearCache();
  };
}
```

## 🛡️ Gestion d'Erreurs

### Error Boundary

```typescript
import { ColisApiErrorBoundary } from '@/services';

function App() {
  return (
    <ColisApiErrorBoundary>
      <YourApp />
    </ColisApiErrorBoundary>
  );
}
```

### Composants d'Erreur

```typescript
import { ColisApiError, ColisApiLoading, ColisApiEmpty } from '@/services';

function MyComponent() {
  if (error) {
    return (
      <ColisApiError 
        error={error} 
        onRetry={handleRetry}
        onDismiss={handleDismiss}
      />
    );
  }

  if (loading) {
    return <ColisApiLoading message="Chargement..." />;
  }

  if (!data) {
    return <ColisApiEmpty title="Aucune donnée" />;
  }
}
```

### Hook de Gestion d'Erreurs

```typescript
import { useApiErrorHandler } from '@/services';

function MyComponent() {
  const { error, isRetrying, handleError, retry, clearError } = useApiErrorHandler();

  const handleApiCall = async () => {
    try {
      await apiCall();
    } catch (err) {
      handleError(err);
    }
  };

  const handleRetry = () => {
    retry(handleApiCall);
  };
}
```

## 📊 Cache et Performance

### Configuration du Cache

```typescript
// Durée de vie du cache (5 minutes par défaut)
const CACHE_DURATION = 5 * 60 * 1000;

// Synchronisation automatique (30 secondes par défaut)
const REFRESH_INTERVAL = 30000;
```

### Statistiques du Cache

```typescript
import { useColisApiContext } from '@/services';

function CacheStats() {
  const { getCacheStats } = useColisApiContext();
  const stats = getCacheStats();

  return (
    <div>
      <p>Hits: {stats.hits}</p>
      <p>Misses: {stats.misses}</p>
      <p>Hit Rate: {stats.hitRate}%</p>
    </div>
  );
}
```

## 🔧 Configuration

### Variables d'Environnement

```env
# URL de l'API
REACT_APP_API_URL=http://localhost:3000/api

# Clé API (optionnelle)
REACT_APP_COLIS_API_KEY=your-api-key

# Mode développement
NODE_ENV=development
```

### Configuration TypeScript

```typescript
// types/api.ts
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface ColisApiData {
  id: string;
  trackingNumber: string;
  status: string;
  // ... autres propriétés
}
```

## 📱 Exemple d'Utilisation Complète

```typescript
import React from 'react';
import { 
  useColisWithCache, 
  useCreateColis, 
  ColisApiError, 
  ColisApiLoading 
} from '@/services';

function ColisTracker() {
  const [trackingNumber, setTrackingNumber] = useState('BD12345678');
  
  // Hook avec cache
  const { data: colis, loading, error } = useColisWithCache(trackingNumber);
  
  // Hook pour création
  const { createColis, loading: createLoading } = useCreateColis();

  const handleCreateColis = async () => {
    try {
      const newColis = await createColis({
        sender: { name: 'Jean', phone: '061234567' },
        recipient: { name: 'Marie', phone: '062345678' },
        package: { type: 'document', weight: 1.5 },
        service: { type: 'standard', insurance: true }
      });
      console.log('Colis créé:', newColis);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (error) {
    return <ColisApiError error={error} />;
  }

  if (loading) {
    return <ColisApiLoading />;
  }

  return (
    <div>
      <input 
        value={trackingNumber}
        onChange={(e) => setTrackingNumber(e.target.value)}
        placeholder="Numéro de suivi"
      />
      
      {colis && (
        <div>
          <h2>Colis: {colis.trackingNumber}</h2>
          <p>Statut: {colis.status}</p>
          <p>Prix: {colis.pricing.totalPrice} FCFA</p>
        </div>
      )}
      
      <button onClick={handleCreateColis} disabled={createLoading}>
        {createLoading ? 'Création...' : 'Créer un colis'}
      </button>
    </div>
  );
}
```

## 🧪 Tests

### Tests des Hooks

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useColis } from '@/services';

test('useColis should fetch colis data', async () => {
  const { result } = renderHook(() => useColis('BD12345678'));

  expect(result.current.loading).toBe(true);

  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  expect(result.current.data).toBeDefined();
  expect(result.current.loading).toBe(false);
});
```

### Tests du Service

```typescript
import { colisApi } from '@/services';

test('colisApi should create colis', async () => {
  const colisData = {
    sender: { name: 'Test', phone: '061234567' },
    recipient: { name: 'Test2', phone: '062345678' },
    package: { type: 'document', weight: 1 },
    service: { type: 'standard', insurance: false }
  };

  const result = await colisApi.createColis(colisData);
  
  expect(result.success).toBe(true);
  expect(result.data.id).toBeDefined();
});
```

## 📈 Métriques et Monitoring

### Métriques Disponibles

- **Taux de succès des requêtes**
- **Temps de réponse moyen**
- **Taux de hit du cache**
- **Nombre de requêtes par minute**
- **Erreurs par type**

### Logs

```typescript
// Logs automatiques dans la console
console.log('[API] Request:', endpoint, data);
console.log('[API] Response:', response);
console.log('[API] Error:', error);
```

## 🔒 Sécurité

### Authentification

```typescript
// Headers automatiques
headers: {
  'Authorization': `Bearer ${apiKey}`,
  'Content-Type': 'application/json'
}
```

### Validation

```typescript
// Validation des données avant envoi
const validateColisData = (data: CreateColisRequest) => {
  if (!data.sender.name) throw new Error('Nom expéditeur requis');
  if (!data.recipient.name) throw new Error('Nom destinataire requis');
  // ... autres validations
};
```

## 🚀 Déploiement

### Production

```bash
# Build de production
npm run build

# Variables d'environnement
REACT_APP_API_URL=https://api.bantudelice.cg
REACT_APP_COLIS_API_KEY=prod-api-key
```

### Développement

```bash
# Serveur de développement
npm run dev

# Variables d'environnement
REACT_APP_API_URL=http://localhost:3000/api
NODE_ENV=development
```

---

**Intégration API 50% Terminée !** 🎉

L'API est maintenant entièrement intégrée avec :
- ✅ Service API complet
- ✅ Hooks personnalisés
- ✅ Contexte global
- ✅ Gestion d'erreurs
- ✅ Cache et performance
- ✅ Types TypeScript
- ✅ Documentation complète 