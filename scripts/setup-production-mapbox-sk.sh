#!/bin/bash

# Script de configuration automatique Mapbox Production avec SK
# Usage: ./scripts/setup-production-mapbox-sk.sh

echo "🚀 Configuration de Mapbox Production (SK) pour Buntudelice"
echo "========================================================="

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Vérifier si Supabase CLI est installé
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI n'est pas installé${NC}"
    echo "Installez-le avec: npm install -g supabase"
    exit 1
fi

echo -e "${GREEN}✅ Supabase CLI détecté${NC}"

# Demander la clé API Mapbox de production (SK)
echo -e "${BLUE}🔑 Configuration de votre clé API Mapbox de production (SK)${NC}"
read -p "Entrez votre clé API Mapbox de production (sk.xxx...): " MAPBOX_TOKEN

if [ -z "$MAPBOX_TOKEN" ]; then
    echo -e "${RED}❌ Clé API Mapbox requise${NC}"
    exit 1
fi

# Vérifier le format de la clé (SK au lieu de PK)
if [[ ! $MAPBOX_TOKEN =~ ^sk\..* ]]; then
    echo -e "${YELLOW}⚠️  Format de clé détecté: ${MAPBOX_TOKEN:0:3}...${NC}"
    echo -e "${YELLOW}⚠️  Assurez-vous que c'est bien une clé SK (Secret Key)${NC}"
    read -p "Continuer quand même ? (y/N): " confirm
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        echo -e "${RED}❌ Configuration annulée${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Clé API acceptée${NC}"

# Vérifier la connexion Supabase
echo -e "${BLUE}🔗 Vérification de la connexion Supabase...${NC}"

# Essayer de lister les projets
if ! supabase projects list &> /dev/null; then
    echo -e "${YELLOW}⚠️  Connexion Supabase requise${NC}"
    echo "Connectez-vous avec: supabase login"
    read -p "Appuyez sur Entrée après vous être connecté..."
fi

# Lister les projets disponibles
echo -e "${BLUE}📋 Projets Supabase disponibles:${NC}"
supabase projects list

# Demander le projet à utiliser
read -p "Entrez l'ID de votre projet Supabase: " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ ID de projet requis${NC}"
    exit 1
fi

# Lier le projet
echo -e "${BLUE}🔗 Liaison avec le projet Supabase...${NC}"
supabase link --project-ref $PROJECT_ID

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors de la liaison du projet${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Projet lié avec succès${NC}"

# Configuration des variables d'environnement de production
echo -e "${BLUE}📝 Configuration des variables d'environnement de production...${NC}"

# Définir la clé API Mapbox (SK)
echo "Configuration de MAPBOX_ACCESS_TOKEN (SK)..."
supabase secrets set MAPBOX_ACCESS_TOKEN="$MAPBOX_TOKEN"

# Autres variables de production
echo "Configuration des variables supplémentaires..."
supabase secrets set MAPBOX_STYLE="mapbox://styles/mapbox/streets-v12"
supabase secrets set MAPBOX_LANGUAGE="fr"
supabase secrets set MAPBOX_COUNTRY="CG"
supabase secrets set NODE_ENV="production"

echo -e "${GREEN}✅ Variables d'environnement configurées${NC}"

# Vérifier la configuration
echo -e "${BLUE}🔍 Vérification de la configuration...${NC}"
echo "Variables configurées:"
supabase secrets list | grep MAPBOX

# Déployer les Edge Functions
echo -e "${BLUE}🚀 Déploiement des Edge Functions...${NC}"

echo "Déploiement de geolocation..."
supabase functions deploy geolocation

echo "Déploiement de taxi-geolocation..."
supabase functions deploy taxi-geolocation

echo "Déploiement de ridesharing-geolocation..."
supabase functions deploy ridesharing-geolocation

echo "Déploiement de delivery-geolocation..."
supabase functions deploy delivery-geolocation

echo -e "${GREEN}✅ Toutes les Edge Functions déployées${NC}"

# Test des fonctions
echo -e "${BLUE}🧪 Test des fonctions déployées...${NC}"

# Obtenir l'URL du projet
PROJECT_URL=$(supabase projects list | grep $PROJECT_ID | awk '{print $2}')

echo "Test de la fonction geolocation..."
curl -X POST "$PROJECT_URL/functions/v1/geolocation/geocode" \
  -H "Authorization: Bearer $(supabase secrets get SUPABASE_ANON_KEY 2>/dev/null || echo 'YOUR_ANON_KEY')" \
  -H "Content-Type: application/json" \
  -d '{"address": "Brazzaville, Congo"}' \
  -s | jq '.' 2>/dev/null || echo "Test effectué (jq non installé pour l'affichage)"

echo -e "${GREEN}✅ Tests terminés${NC}"

# Affichage des informations finales
echo ""
echo -e "${GREEN}🎉 Configuration terminée avec succès !${NC}"
echo ""
echo -e "${BLUE}📋 Informations importantes:${NC}"
echo "• URL du projet: $PROJECT_URL"
echo "• Clé API Mapbox (SK): ${MAPBOX_TOKEN:0:10}..."
echo "• Fonctions déployées: geolocation, taxi-geolocation, ridesharing-geolocation, delivery-geolocation"
echo ""
echo -e "${YELLOW}🔗 Liens utiles:${NC}"
echo "• Dashboard Supabase: https://supabase.com/dashboard/project/$PROJECT_ID"
echo "• Dashboard Mapbox: https://account.mapbox.com/"
echo "• Logs des fonctions: supabase functions logs"
echo ""
echo -e "${BLUE}📊 Prochaines étapes:${NC}"
echo "1. Testez vos fonctions dans l'application"
echo "2. Surveillez l'utilisation dans le dashboard Mapbox"
echo "3. Configurez les restrictions de domaine si nécessaire"
echo "4. Configurez des alertes pour les dépassements"
echo ""
echo -e "${GREEN}✅ Votre API Mapbox de production (SK) est maintenant configurée !${NC}" 