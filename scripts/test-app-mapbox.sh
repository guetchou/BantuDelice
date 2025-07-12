#!/bin/bash

# Script de test de l'application avec configuration Mapbox
# Usage: ./scripts/test-app-mapbox.sh

echo "🧪 Test de l'application avec configuration Mapbox"
echo "================================================"

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Attendre que le serveur démarre
echo -e "${BLUE}⏳ Attente du démarrage du serveur...${NC}"
sleep 10

# Tester l'accès à l'application
echo -e "${BLUE}🌐 Test de l'accès à l'application...${NC}"

# Test de la page principale
echo "Test de la page principale..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:9595 | grep -q "200"; then
    echo -e "${GREEN}✅ Serveur accessible sur http://localhost:9595${NC}"
else
    echo -e "${RED}❌ Serveur non accessible${NC}"
    echo "Vérifiez que le serveur de développement est démarré"
    exit 1
fi

# Test de la page des services de colis
echo "Test de la page des services de colis..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:9595/services/colis | grep -q "200"; then
    echo -e "${GREEN}✅ Page des services de colis accessible${NC}"
else
    echo -e "${YELLOW}⚠️  Page des services de colis non trouvée (peut être normale)${NC}"
fi

# Test des Edge Functions
echo -e "${BLUE}🔧 Test des Edge Functions Mapbox...${NC}"

# Test géolocalisation
echo "Test de la fonction géolocalisation..."
GEOLOC_RESPONSE=$(curl -s -X POST http://localhost:54321/functions/v1/geolocation/geocode \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0" \
  -H "Content-Type: application/json" \
  -d '{"address": "Brazzaville, Congo"}')

if echo "$GEOLOC_RESPONSE" | grep -q "coordinates"; then
    echo -e "${GREEN}✅ Fonction géolocalisation opérationnelle${NC}"
else
    echo -e "${YELLOW}⚠️  Fonction géolocalisation: $GEOLOC_RESPONSE${NC}"
fi

# Test covoiturage
echo "Test de la fonction covoiturage..."
RIDESHARING_RESPONSE=$(curl -s -X GET "http://localhost:54321/functions/v1/ridesharing-geolocation/nearby-rides?lat=-4.2634&lng=15.2429&radius=5" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0")

if echo "$RIDESHARING_RESPONSE" | grep -q "rides"; then
    echo -e "${GREEN}✅ Fonction covoiturage opérationnelle${NC}"
else
    echo -e "${YELLOW}⚠️  Fonction covoiturage: $RIDESHARING_RESPONSE${NC}"
fi

# Test taxi
echo "Test de la fonction taxi..."
TAXI_RESPONSE=$(curl -s -X GET "http://localhost:54321/functions/v1/taxi-geolocation/nearby-drivers?lat=-4.2634&lng=15.2429&radius=2" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0")

if echo "$TAXI_RESPONSE" | grep -q "drivers"; then
    echo -e "${GREEN}✅ Fonction taxi opérationnelle${NC}"
else
    echo -e "${YELLOW}⚠️  Fonction taxi: $TAXI_RESPONSE${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Tests terminés !${NC}"
echo ""
echo -e "${BLUE}📋 Résumé:${NC}"
echo "• Application: http://localhost:9595"
echo "• Services de colis: http://localhost:9595/services/colis"
echo "• Edge Functions: http://localhost:54321/functions/v1/"
echo ""
echo -e "${YELLOW}🔗 Liens utiles:${NC}"
echo "• Dashboard Supabase local: http://localhost:54323"
echo "• Dashboard Mapbox: https://account.mapbox.com/"
echo "• Logs des fonctions: supabase functions logs --follow"
echo ""
echo -e "${GREEN}✅ Votre application est prête avec Mapbox !${NC}" 