#!/bin/bash

echo "🔍 Vérification rapide des liens BantuDelice"
echo "============================================"

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Vérifier si le serveur fonctionne
echo "🔌 Vérification du serveur..."
if curl -s http://localhost:9595 > /dev/null; then
    echo -e "${GREEN}✅ Serveur accessible${NC}"
else
    echo -e "${RED}❌ Serveur non accessible${NC}"
    exit 1
fi

# Routes principales à tester
routes=(
    "/"
    "/restaurants"
    "/restaurant"
    "/taxi"
    "/colis"
    "/covoiturage"
    "/services"
    "/contact"
)

echo ""
echo "🔗 Test des routes principales..."

failed_routes=()
success_count=0

for route in "${routes[@]}"; do
    echo -n "Test $route... "
    
    # Test de la route
    if curl -s "http://localhost:9595$route" | grep -q "Page non trouvée\|404\|Not Found"; then
        echo -e "${RED}❌ ERREUR 404${NC}"
        failed_routes+=("$route")
    else
        echo -e "${GREEN}✅ OK${NC}"
        ((success_count++))
    fi
done

echo ""
echo "📊 Résultats:"
echo "  ✅ Routes fonctionnelles: $success_count/${#routes[@]}"
echo "  ❌ Routes cassées: ${#failed_routes[@]}"

if [ ${#failed_routes[@]} -gt 0 ]; then
    echo ""
    echo -e "${YELLOW}🚨 Routes cassées détectées:${NC}"
    for route in "${failed_routes[@]}"; do
        echo "  - $route"
    done
    echo ""
    echo "💡 Solutions:"
    echo "  1. Vérifiez que les routes sont définies dans mainRoutes.tsx"
    echo "  2. Vérifiez que les composants de page existent"
    echo "  3. Vérifiez les imports dans les fichiers de route"
else
    echo ""
    echo -e "${GREEN}🎉 Toutes les routes principales fonctionnent !${NC}"
fi

# Test de performance rapide
echo ""
echo "⚡ Test de performance rapide..."

for route in "/" "/restaurants" "/taxi"; do
    start_time=$(date +%s%N)
    curl -s "http://localhost:9595$route" > /dev/null
    end_time=$(date +%s%N)
    
    load_time=$(( (end_time - start_time) / 1000000 ))
    
    if [ $load_time -lt 3000 ]; then
        echo -e "  ${GREEN}✅ $route: ${load_time}ms${NC}"
    elif [ $load_time -lt 5000 ]; then
        echo -e "  ${YELLOW}⚠️  $route: ${load_time}ms${NC}"
    else
        echo -e "  ${RED}❌ $route: ${load_time}ms (trop lent)${NC}"
    fi
done

echo ""
echo "🎯 Vérification rapide terminée !"
echo "📋 Pour un test complet, exécutez: ./scripts/run-tests.sh" 