#!/bin/bash

# Script pour configurer Mapbox API dans les Edge Functions Supabase
# Usage: ./scripts/setup-mapbox-edge-functions.sh

echo "🔧 Configuration de Mapbox API dans les Edge Functions Supabase"

# Vérifier si Supabase CLI est installé
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI n'est pas installé"
    echo "Installez-le avec: npm install -g supabase"
    exit 1
fi

# Demander la clé API Mapbox
read -p "🔑 Entrez votre clé API Mapbox (pk.xxx...): " MAPBOX_TOKEN

if [ -z "$MAPBOX_TOKEN" ]; then
    echo "❌ Clé API Mapbox requise"
    exit 1
fi

# Vérifier le format de la clé
if [[ ! $MAPBOX_TOKEN =~ ^pk\..* ]]; then
    echo "❌ Format de clé API invalide. Doit commencer par 'pk.'"
    exit 1
fi

echo "✅ Format de clé API valide"

# Configurer les variables d'environnement
echo "📝 Configuration des variables d'environnement..."

# Définir la clé API Mapbox
supabase secrets set MAPBOX_ACCESS_TOKEN="$MAPBOX_TOKEN"

# Autres variables utiles
supabase secrets set MAPBOX_STYLE="mapbox://styles/mapbox/streets-v12"
supabase secrets set MAPBOX_LANGUAGE="fr"
supabase secrets set MAPBOX_COUNTRY="CG"

echo "✅ Variables d'environnement configurées"

# Vérifier la configuration
echo "🔍 Vérification de la configuration..."
supabase secrets list | grep MAPBOX

echo ""
echo "🚀 Déploiement des Edge Functions..."

# Déployer toutes les fonctions
supabase functions deploy

echo ""
echo "✅ Configuration terminée !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Testez vos Edge Functions"
echo "2. Surveillez l'utilisation dans votre dashboard Mapbox"
echo "3. Configurez les restrictions de domaine si nécessaire"
echo ""
echo "🔗 Liens utiles :"
echo "- Dashboard Mapbox: https://account.mapbox.com/"
echo "- Dashboard Supabase: https://supabase.com/dashboard"
echo "- Documentation Mapbox: https://docs.mapbox.com/" 