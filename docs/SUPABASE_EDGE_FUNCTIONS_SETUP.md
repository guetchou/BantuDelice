# Configuration des Edge Functions Supabase

## 🔧 **Variables d'environnement pour les Edge Functions**

### 1. **Configuration via Dashboard Supabase**

1. **Allez dans votre dashboard Supabase**
2. **Settings → Edge Functions**
3. **Ajoutez les variables d'environnement :**

```bash
# Mapbox Configuration
MAPBOX_ACCESS_TOKEN=pk.votre_cle_api_mapbox_ici

# Autres variables utiles
MAPBOX_STYLE=mapbox://styles/mapbox/streets-v12
MAPBOX_LANGUAGE=fr
MAPBOX_COUNTRY=CG
```

### 2. **Configuration via CLI Supabase**

```bash
# Installer Supabase CLI si pas déjà fait
npm install -g supabase

# Se connecter à votre projet
supabase login
supabase link --project-ref votre-project-ref

# Définir les variables d'environnement
supabase secrets set MAPBOX_ACCESS_TOKEN=pk.votre_cle_api_mapbox_ici
supabase secrets set MAPBOX_STYLE=mapbox://styles/mapbox/streets-v12
```

### 3. **Configuration via fichier .env**

Créez un fichier `.env` dans le dossier `supabase/functions/` :

```bash
# supabase/functions/.env
MAPBOX_ACCESS_TOKEN=pk.votre_cle_api_mapbox_ici
MAPBOX_STYLE=mapbox://styles/mapbox/streets-v12
MAPBOX_LANGUAGE=fr
MAPBOX_COUNTRY=CG
```

## 🚀 **Déploiement des Edge Functions**

### 1. **Déployer avec les variables d'environnement**

```bash
# Déployer toutes les fonctions
supabase functions deploy

# Ou déployer une fonction spécifique
supabase functions deploy ridesharing-geolocation
```

### 2. **Vérifier les variables d'environnement**

```bash
# Lister les secrets
supabase secrets list

# Vérifier une variable spécifique
supabase secrets get MAPBOX_ACCESS_TOKEN
```

## 📝 **Exemple d'utilisation dans les Edge Functions**

### **Géolocalisation générale**
```typescript
// supabase/functions/geolocation/index.ts
const mapboxToken = Deno.env.get('MAPBOX_ACCESS_TOKEN')
if (!mapboxToken) {
  throw new Error('MAPBOX_ACCESS_TOKEN not configured')
}

// Utiliser la clé API
const response = await fetch(
  `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${mapboxToken}`
)
```

### **Taxi géolocalisation**
```typescript
// supabase/functions/taxi-geolocation/index.ts
const mapboxToken = Deno.env.get('MAPBOX_ACCESS_TOKEN')
if (!mapboxToken) {
  throw new Error('MAPBOX_ACCESS_TOKEN not configured')
}

// Calculer un itinéraire
const response = await fetch(
  `https://api.mapbox.com/directions/v5/mapbox/driving/${fromLng},${fromLat};${toLng},${toLat}?geometries=geojson&access_token=${mapboxToken}`
)
```

### **Covoiturage géolocalisation**
```typescript
// supabase/functions/ridesharing-geolocation/index.ts
const mapboxToken = Deno.env.get('MAPBOX_ACCESS_TOKEN')
if (!mapboxToken) {
  throw new Error('MAPBOX_ACCESS_TOKEN not configured')
}

// Rechercher des trajets à proximité
const nearbyRides = await getNearbyRides(lat, lng, radius)
```

## 🔒 **Sécurité**

### 1. **Restrictions de domaine (recommandé)**
Dans votre dashboard Mapbox :
- Allez dans "Access tokens"
- Ajoutez des restrictions de domaine
- Limitez à votre domaine Supabase

### 2. **Permissions minimales**
Configurez votre token avec seulement les permissions nécessaires :
- `styles:read` - Pour les cartes
- `geocoding:read` - Pour le géocodage
- `directions:read` - Pour les itinéraires

## 📊 **Monitoring**

### 1. **Surveiller l'utilisation**
- Dashboard Mapbox → Usage
- Surveillez les requêtes par fonction
- Alertez en cas de dépassement

### 2. **Logs des Edge Functions**
```bash
# Voir les logs en temps réel
supabase functions logs ridesharing-geolocation --follow

# Voir les logs d'une fonction spécifique
supabase functions logs taxi-geolocation
```

## 🛠️ **Dépannage**

### **Erreurs courantes**

1. **"MAPBOX_ACCESS_TOKEN not configured"**
   ```bash
   # Vérifier la variable
   supabase secrets get MAPBOX_ACCESS_TOKEN
   
   # Redéfinir si nécessaire
   supabase secrets set MAPBOX_ACCESS_TOKEN=pk.votre_nouvelle_cle
   ```

2. **"Access token is invalid"**
   - Vérifiez que la clé API est correcte
   - Vérifiez les permissions de la clé
   - Vérifiez les restrictions de domaine

3. **"Rate limit exceeded"**
   - Surveillez votre utilisation dans le dashboard Mapbox
   - Considérez mettre en cache les résultats
   - Optimisez les requêtes

### **Test des Edge Functions**

```bash
# Tester localement
supabase functions serve

# Tester une fonction spécifique
curl -X POST http://localhost:54321/functions/v1/ridesharing-geolocation/nearby-rides \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"lat": -4.2634, "lng": 15.2429, "radius": 5}'
```

## 💡 **Bonnes pratiques**

1. **Utilisez des variables d'environnement** pour toutes les clés API
2. **Testez localement** avant de déployer
3. **Surveillez l'utilisation** de Mapbox
4. **Mettez en cache** les résultats fréquemment utilisés
5. **Gérez les erreurs** gracieusement
6. **Documentez** vos variables d'environnement

## 🔄 **Mise à jour des variables**

```bash
# Mettre à jour une variable
supabase secrets set MAPBOX_ACCESS_TOKEN=pk.nouvelle_cle

# Redéployer les fonctions
supabase functions deploy

# Vérifier la mise à jour
supabase secrets list
``` 