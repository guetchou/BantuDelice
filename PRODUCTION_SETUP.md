# 🚀 Configuration Production Mapbox - Guide Rapide

## ✅ **Je vais configurer votre API Mapbox de production !**

### **Étapes à suivre :**

#### **1. Préparez votre clé API Mapbox**
- Allez sur [mapbox.com](https://www.mapbox.com/)
- Connectez-vous à votre compte
- Copiez votre clé API de production (commence par `pk.`)

#### **2. Exécutez le script de configuration**
```bash
# Rendre le script exécutable
chmod +x scripts/setup-production-mapbox.sh

# Exécuter la configuration
./scripts/setup-production-mapbox.sh
```

#### **3. Suivez les instructions du script**
- Entrez votre clé API Mapbox de production
- Sélectionnez votre projet Supabase
- Le script configurera automatiquement tout !

#### **4. Testez la configuration**
```bash
# Tester toutes les fonctions
chmod +x scripts/test-production-functions.sh
./scripts/test-production-functions.sh
```

## 🔧 **Configuration manuelle (si nécessaire)**

### **Via CLI Supabase :**
```bash
# Configurer la clé API
supabase secrets set MAPBOX_ACCESS_TOKEN=pk.votre_cle_production

# Variables supplémentaires
supabase secrets set MAPBOX_STYLE=mapbox://styles/mapbox/streets-v12
supabase secrets set MAPBOX_LANGUAGE=fr
supabase secrets set MAPBOX_COUNTRY=CG

# Déployer les fonctions
supabase functions deploy
```

### **Via Dashboard Supabase :**
1. Dashboard Supabase → Settings → Edge Functions
2. Ajoutez : `MAPBOX_ACCESS_TOKEN=pk.votre_cle_production`
3. Redéployez les fonctions

## 🧪 **Test rapide**

```bash
# Test géolocalisation
curl -X POST https://votre-project.supabase.co/functions/v1/geolocation/geocode \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"address": "Brazzaville, Congo"}'
```

## ✅ **Vérification**

Après configuration, vous devriez voir :
- ✅ Variables configurées : `supabase secrets list`
- ✅ Fonctions déployées : `supabase functions list`
- ✅ Tests réussis : Réponses JSON valides

## 🎯 **Résultat**

Votre API Mapbox de production sera configurée pour :
- 🗺️ **Géolocalisation** : Géocodage et géocodage inverse
- 🚗 **Taxi** : Chauffeurs à proximité et itinéraires
- 🚙 **Covoiturage** : Trajets à proximité et réservations
- 📦 **Livraison** : Estimations et suivi

**Prêt à utiliser votre API Mapbox de production !** 🚀 