#!/bin/bash

# Script de test automatique des Edge Functions en production
# Usage: ./scripts/test-production-functions.sh

echo "🧪 Test automatique des Edge Functions en production"
echo "=================================================="

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Obtenir l'URL du projet
PROJECT_URL=$(supabase projects list | grep $(supabase status --output json | jq -r '.project_ref') | awk '{print $2}')

if [ -z "$PROJECT_URL" ]; then
    echo -e "${RED}❌ Impossible de récupérer l'URL du projet${NC}"
    exit 1
fi

echo -e "${BLUE}🌐 URL du projet: $PROJECT_URL${NC}"

# Obtenir la clé anon
ANON_KEY=$(supabase secrets get SUPABASE_ANON_KEY 2>/dev/null || echo "YOUR_ANON_KEY")

echo -e "${BLUE}🔑 Test avec la clé anon: ${ANON_KEY:0:20}...${NC}"

# Fonction de test
test_function() {
    local function_name=$1
    local endpoint=$2
    local method=${3:-GET}
    local data=${4:-""}
    
    echo -e "${BLUE}🧪 Test de $function_name...${NC}"
    
    local curl_cmd="curl -X $method \"$PROJECT_URL/functions/v1/$endpoint\""
    curl_cmd="$curl_cmd -H \"Authorization: Bearer $ANON_KEY\""
    
    if [ "$method" = "POST" ]; then
        curl_cmd="$curl_cmd -H \"Content-Type: application/json\""
    fi
    
    if [ ! -z "$data" ]; then
        curl_cmd="$curl_cmd -d '$data'"
    fi
    
    curl_cmd="$curl_cmd -s"
    
    local response=$(eval $curl_cmd)
    local status=$?
    
    if [ $status -eq 0 ]; then
        echo -e "${GREEN}✅ $function_name: OK${NC}"
        echo "Réponse: $response" | head -c 200
        echo "..."
    else
        echo -e "${RED}❌ $function_name: ERREUR${NC}"
        echo "Erreur: $response"
    fi
    
    echo ""
}

# Tests des fonctions
echo -e "${YELLOW}🚀 Démarrage des tests...${NC}"
echo ""

# Test géolocalisation
test_function "Géolocalisation" "geolocation/geocode" "POST" '{"address": "Brazzaville, Congo"}'

# Test géocodage inverse
test_function "Géocodage inverse" "geolocation/reverse-geocode" "POST" '{"coordinates": [15.2429, -4.2634]}'

# Test restaurants à proximité
test_function "Restaurants à proximité" "geolocation/nearby-restaurants?lat=-4.2634&lng=15.2429&radius=5"

# Test zones de livraison
test_function "Zones de livraison" "geolocation/delivery-zones"

# Test chauffeurs à proximité
test_function "Chauffeurs à proximité" "taxi-geolocation/nearby-drivers?lat=-4.2634&lng=15.2429&radius=2"

# Test calcul d'itinéraire taxi
test_function "Calcul d'itinéraire taxi" "taxi-geolocation/route?fromLat=-4.2634&fromLng=15.2429&toLat=-4.2000&toLng=15.3000"

# Test trajets à proximité
test_function "Trajets à proximité" "ridesharing-geolocation/nearby-rides?lat=-4.2634&lng=15.2429&radius=5"

# Test estimation de livraison
test_function "Estimation de livraison" "delivery-geolocation/estimate" "POST" '{"pickup": [15.2429, -4.2634], "delivery": [15.3000, -4.2000]}'

echo -e "${GREEN}🎉 Tests terminés !${NC}"
echo ""
echo -e "${BLUE}📊 Résumé:${NC}"
echo "• Toutes les fonctions ont été testées"
echo "• Vérifiez les réponses ci-dessus pour les erreurs"
echo "• Consultez les logs pour plus de détails: supabase functions logs"
echo ""
echo -e "${YELLOW}🔗 Liens utiles:${NC}"
echo "• Dashboard Supabase: https://supabase.com/dashboard"
echo "• Dashboard Mapbox: https://account.mapbox.com/"
echo "• Logs des fonctions: supabase functions logs --follow" 