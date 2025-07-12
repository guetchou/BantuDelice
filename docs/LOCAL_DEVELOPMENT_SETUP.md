# 🛠️ Configuration locale pour le développement

## 📁 **Structure des fichiers**

```
supabase/
├── functions/
│   ├── .env                    # Variables locales (ignoré par git)
│   ├── .env.example           # Exemple de configuration
│   ├── geolocation/
│   ├── taxi-geolocation/
│   ├── ridesharing-geolocation/
│   └── delivery-geolocation/
└── ...
```

## 🔧 **Configuration locale**

### **1. Créer le fichier `.env` local**

Créez le fichier `supabase/functions/.env` :

```bash
# Mapbox Configuration
MAPBOX_ACCESS_TOKEN=pk.votre_cle_api_mapbox_ici
MAPBOX_STYLE=mapbox://styles/mapbox/streets-v12
MAPBOX_LANGUAGE=fr
MAPBOX_COUNTRY=CG

# Supabase Configuration (développement local)
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0

# Autres configurations
NODE_ENV=development
```

### **2. Démarrer Supabase localement**

```bash
# Démarrer Supabase en local
supabase start

# Les variables d'environnement sont automatiquement chargées
```

### **3. Servir les Edge Functions**

```bash
# Option 1: Avec le fichier .env automatique
supabase functions serve

# Option 2: Avec un fichier .env spécifique
supabase functions serve --env-file ./supabase/functions/.env

# Option 3: Avec des variables inline
supabase functions serve --env-file <(echo "MAPBOX_ACCESS_TOKEN=pk.votre_cle")
```

## 🚀 **Développement et test**

### **1. Tester les Edge Functions localement**

```bash
# Tester la géolocalisation
curl -X POST http://localhost:54321/functions/v1/geolocation/geocode \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0" \
  -H "Content-Type: application/json" \
  -d '{"address": "Brazzaville, Congo"}'

# Tester le covoiturage
curl -X GET "http://localhost:54321/functions/v1/ridesharing-geolocation/nearby-rides?lat=-4.2634&lng=15.2429&radius=5" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
```

### **2. Voir les logs en temps réel**

```bash
# Logs de toutes les fonctions
supabase functions logs --follow

# Logs d'une fonction spécifique
supabase functions logs ridesharing-geolocation --follow
```

### **3. Debugger les variables d'environnement**

Ajoutez ce code dans vos Edge Functions pour debugger :

```typescript
// Debug des variables d'environnement
console.log('MAPBOX_ACCESS_TOKEN:', Deno.env.get('MAPBOX_ACCESS_TOKEN') ? '✅ Configuré' : '❌ Non configuré')
console.log('SUPABASE_URL:', Deno.env.get('SUPABASE_URL'))
```

## 🔄 **Workflow de développement**

### **1. Développement local**
```bash
# 1. Démarrer Supabase
supabase start

# 2. Servir les fonctions
supabase functions serve

# 3. Tester vos modifications
curl -X POST http://localhost:54321/functions/v1/votre-fonction/endpoint
```

### **2. Déploiement en production**
```bash
# 1. Configurer les secrets de production
supabase secrets set MAPBOX_ACCESS_TOKEN=pk.votre_cle_production

# 2. Déployer
supabase functions deploy

# 3. Vérifier
supabase secrets list
```

## 🛠️ **Scripts utiles**

### **Script de démarrage rapide**
```bash
#!/bin/bash
# scripts/dev-start.sh

echo "🚀 Démarrage de l'environnement de développement..."

# Vérifier que .env existe
if [ ! -f "supabase/functions/.env" ]; then
    echo "❌ Fichier supabase/functions/.env manquant"
    echo "Copiez supabase/functions/.env.example vers .env et configurez vos variables"
    exit 1
fi

# Démarrer Supabase
echo "📦 Démarrage de Supabase..."
supabase start

# Servir les fonctions
echo "🔧 Démarrage des Edge Functions..."
supabase functions serve &

echo "✅ Environnement de développement prêt !"
echo "📝 Logs: supabase functions logs --follow"
echo "🌐 Dashboard: http://localhost:54323"
```

### **Script de test**
```bash
#!/bin/bash
# scripts/test-functions.sh

echo "🧪 Test des Edge Functions..."

# Test géolocalisation
echo "📍 Test géolocalisation..."
curl -X POST http://localhost:54321/functions/v1/geolocation/geocode \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0" \
  -H "Content-Type: application/json" \
  -d '{"address": "Brazzaville, Congo"}' \
  -s | jq '.'

# Test covoiturage
echo "🚗 Test covoiturage..."
curl -X GET "http://localhost:54321/functions/v1/ridesharing-geolocation/nearby-rides?lat=-4.2634&lng=15.2429&radius=5" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0" \
  -s | jq '.'

echo "✅ Tests terminés !"
```

## 🔒 **Sécurité**

### **1. Fichier .env ignoré**
```bash
# .gitignore
supabase/functions/.env
```

### **2. Variables sensibles**
- Ne jamais commiter le fichier `.env`
- Utiliser `.env.example` pour la documentation
- Utiliser des clés différentes pour dev/prod

### **3. Validation des variables**
```typescript
// Dans vos Edge Functions
const requiredEnvVars = ['MAPBOX_ACCESS_TOKEN', 'SUPABASE_URL']
for (const envVar of requiredEnvVars) {
  if (!Deno.env.get(envVar)) {
    throw new Error(`Variable d'environnement requise: ${envVar}`)
  }
}
```

## 🚨 **Dépannage**

### **Erreurs courantes**

1. **"MAPBOX_ACCESS_TOKEN not configured"**
   ```bash
   # Vérifier le fichier .env
   cat supabase/functions/.env
   
   # Redémarrer Supabase
   supabase stop && supabase start
   ```

2. **"Function not found"**
   ```bash
   # Vérifier que les fonctions sont servies
   supabase functions serve
   
   # Vérifier les logs
   supabase functions logs
   ```

3. **"Connection refused"**
   ```bash
   # Vérifier que Supabase est démarré
   supabase status
   
   # Redémarrer si nécessaire
   supabase restart
   ```

## 📋 **Checklist de configuration**

- [ ] Créer `supabase/functions/.env`
- [ ] Configurer `MAPBOX_ACCESS_TOKEN`
- [ ] Démarrer Supabase localement
- [ ] Tester les Edge Functions
- [ ] Vérifier les logs
- [ ] Configurer les secrets de production

## 🎯 **Résumé**

1. **Développement local** : Utilisez `supabase/functions/.env`
2. **Production** : Utilisez `supabase secrets set`
3. **Test** : Utilisez `supabase functions serve`
4. **Debug** : Utilisez `supabase functions logs` 