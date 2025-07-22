# 🚀 Configuration rapide Mapbox API

## ✅ **Vous avez raison !** 

Pour les **Edge Functions **, vous devez configurer la clé API Mapbox dans les variables d'environnement , pas dans le frontend.

## 🔧 **Configuration en 3 étapes**

### **1. Obtenir votre clé API Mapbox**
- Allez sur [mapbox.com](https://www.mapbox.com/)
- Créez un compte et générez un token d'accès
- Copiez la clé qui commence par `pk.`

### **2. Configurer dans  Dashboard**
1. **Dashboard ** → **Settings** → **Edge Functions**
2. **Ajoutez la variable :**
   ```
   MAPBOX_ACCESS_TOKEN=pk.votre_cle_api_mapbox_ici
   ```

### **3. Ou via CLI **
```bash
# Installer  CLI
npm install -g 

# Se connecter à votre projet
 login
 link --project-ref votre-project-ref

# Configurer la clé API
 secrets set MAPBOX_ACCESS_TOKEN=pk.votre_cle_api_mapbox_ici

# Déployer les fonctions
 functions deploy
```

## 📝 **Utilisation dans les Edge Functions**

Les Edge Functions utilisent déjà votre clé API :

```typescript
// Dans vos Edge Functions
const mapboxToken = Deno.env.get('MAPBOX_ACCESS_TOKEN')
if (!mapboxToken) {
  throw new Error('MAPBOX_ACCESS_TOKEN not configured')
}

// Utiliser la clé API
const response = await fetch(
  `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${mapboxToken}`
)
```

## 🎯 **Avantages de cette approche**

- ✅ **Sécurisé** : La clé API n'est jamais exposée côté client
- ✅ **Centralisé** : Une seule configuration pour toutes les fonctions
- ✅ **Flexible** : Peut changer sans redéployer le frontend
- ✅ **Monitoring** : Contrôle total sur l'utilisation

## 🔍 **Vérification**

```bash
# Vérifier que la clé est configurée
 secrets list | grep MAPBOX

# Tester une fonction
curl -X POST https://votre-project..co/functions/v1/geolocation/geocode \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"address": "Brazzaville, Congo"}'
```

## 🚀 **C'est tout !**

Une fois configurée, toutes vos Edge Functions utiliseront automatiquement votre clé API Mapbox pour :
- Géocodage d'adresses
- Calcul d'itinéraires
- Recherche de lieux
- Et plus encore ! 