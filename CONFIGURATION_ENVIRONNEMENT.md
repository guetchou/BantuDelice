# Configuration d'Environnement - BantuDelice

## 🎯 Vue d'ensemble

Ce document explique comment configurer les URLs et les variables d'environnement pour que l'application fonctionne correctement en développement et en production.

## ❌ Problème Résolu

**Avant** : Le frontend tentait de se connecter à `localhost:3001` même en production, causant des erreurs :
- `WebSocket connection failed`
- `API notifications et stats échouent`
- `ERR_NETWORK_IO_SUSPENDED`

**Après** : Configuration dynamique selon l'environnement avec URLs appropriées.

## 🏗️ Architecture de Configuration

### 1. Fichier de Configuration Centralisé

```typescript
// frontend/src/config/environment.ts
export const environment = {
  mode: import.meta.env.MODE || 'development',
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production',
  
  api: {
    baseUrl: (() => {
      if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
      }
      
      if (import.meta.env.MODE === 'development') {
        return 'http://localhost:3001/api';
      }
      
      return 'https://api.bantudelice.com/api';
    })(),
  },
  
  websocket: {
    url: (() => {
      if (import.meta.env.VITE_WS_URL) {
        return import.meta.env.VITE_WS_URL;
      }
      
      if (import.meta.env.MODE === 'development') {
        return 'ws://localhost:9595';
      }
      
      return 'wss://api.bantudelice.com/ws';
    })(),
  }
};
```

### 2. Client API Centralisé

```typescript
// frontend/src/services/apiClient.ts
class ApiClient {
  private baseUrl: string;
  
  constructor() {
    this.baseUrl = environment.api.baseUrl;
  }
  
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    // Gestion d'erreurs, retry, timeout...
  }
}
```

## 🔧 Configuration par Environnement

### Développement

**URLs par défaut :**
- API : `http://localhost:3001/api`
- WebSocket : `ws://localhost:9595`
- App : `http://localhost:9595`

**Variables d'environnement :**
```bash
# frontend/.env.development
VITE_MODE=development
VITE_API_URL=http://localhost:3001/api
VITE_WS_URL=ws://localhost:9595
VITE_APP_URL=http://localhost:9595
VITE_DEBUG=true
VITE_LOG_LEVEL=debug
```

### Production

**URLs par défaut :**
- API : `https://api.bantudelice.com/api`
- WebSocket : `wss://api.bantudelice.com/ws`
- App : `https://bantudelice.com`

**Variables d'environnement :**
```bash
# frontend/.env.production
VITE_MODE=production
VITE_API_URL=https://api.bantudelice.com/api
VITE_WS_URL=wss://api.bantudelice.com/ws
VITE_APP_URL=https://bantudelice.com
VITE_DEBUG=false
VITE_LOG_LEVEL=error
```

## 🚀 Déploiement

### Script Automatisé

```bash
# Exécuter le script de déploiement
./scripts/deploy-production.sh
```

**Ce script :**
1. ✅ Configure les variables d'environnement
2. ✅ Teste la connectivité
3. ✅ Build le frontend pour la production
4. ✅ Génère la configuration Nginx
5. ✅ Crée un rapport de déploiement

### Configuration Nginx

```nginx
server {
    listen 443 ssl http2;
    server_name bantudelice.com;
    
    # API Proxy
    location /api/ {
        proxy_pass https://api.bantudelice.com/api/;
        proxy_set_header Host $host;
        # Configuration CORS...
    }
    
    # WebSocket Proxy
    location /ws/ {
        proxy_pass wss://api.bantudelice.com/ws/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
    
    # Frontend
    location / {
        root /var/www/bantudelice;
        try_files $uri $uri/ /index.html;
    }
}
```

## 🧪 Tests de Configuration

### Script de Test

```bash
# Tester la configuration
node test-environnement-config.mjs
```

**Résultats attendus :**
```
📋 Test 1: Développement
API Base URL: http://localhost:3001/api
WebSocket URL: ws://localhost:9595

📋 Test 2: Production
API Base URL: https://api.bantudelice.com/api
WebSocket URL: wss://api.bantudelice.com/ws
```

### Tests de Connectivité

```bash
# Test API
curl https://api.bantudelice.com/api/health

# Test Frontend
curl https://bantudelice.com

# Test WebSocket
wscat -c wss://api.bantudelice.com/ws
```

## 🔍 Debug et Monitoring

### Logs de Debug

```typescript
// Activé en développement
if (environment.debug.apiLogging) {
  console.log(`🌐 API Request: ${url}`);
  console.log(`✅ API Success:`, data);
  console.log(`❌ API Error:`, error);
}
```

### Métriques de Performance

```typescript
// Dans ColisApiContext
const metrics = {
  requestCount: 0,
  cacheHits: 0,
  cacheMisses: 0,
  hitRate: 0
};
```

## 🛠️ Résolution de Problèmes

### Erreurs Courantes

1. **WebSocket Connection Failed**
   ```bash
   # Vérifier la configuration WebSocket
   echo $VITE_WS_URL
   # Doit être wss:// en production
   ```

2. **API Not Found (404)**
   ```bash
   # Vérifier l'URL de l'API
   curl $VITE_API_URL/health
   # Doit retourner une réponse
   ```

3. **CORS Errors**
   ```nginx
   # Ajouter dans Nginx
   add_header Access-Control-Allow-Origin *;
   add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
   ```

### Checklist de Déploiement

- [ ] Backend déployé et accessible
- [ ] Variables d'environnement configurées
- [ ] Frontend buildé pour la production
- [ ] Nginx configuré avec proxy
- [ ] Certificats SSL installés
- [ ] Tests de connectivité passés
- [ ] Monitoring configuré

## 📊 Avantages de cette Configuration

### ✅ Avantages

1. **Séparation claire** entre dev et prod
2. **URLs dynamiques** selon l'environnement
3. **Gestion d'erreurs** robuste
4. **Retry automatique** en cas d'échec
5. **Logs détaillés** en développement
6. **Performance optimisée** en production
7. **Déploiement automatisé**

### 🔧 Fonctionnalités

- **Auto-refresh** configurable
- **Cache intelligent** avec invalidation
- **Timeout** et retry automatiques
- **Gestion CORS** automatique
- **Monitoring** des performances
- **Debug** facilité

## 🎯 Résultat Final

**Avant :**
```
❌ WebSocket connection failed
❌ API notifications échouent
❌ ERR_NETWORK_IO_SUSPENDED
```

**Après :**
```
✅ Configuration dynamique selon l'environnement
✅ URLs appropriées en dev et prod
✅ Gestion d'erreurs robuste
✅ Déploiement automatisé
✅ Monitoring et debug
```

## 📞 Support

Pour toute question sur la configuration :

1. Consultez `deployment-report.md`
2. Vérifiez les logs du serveur
3. Testez la connectivité avec les scripts fournis
4. Utilisez le mode debug en développement

---

**Configuration validée et testée ! 🎉** 