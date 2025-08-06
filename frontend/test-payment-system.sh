#!/bin/bash

echo "🧪 Test du Système de Paiement BantuDelice"
echo "=========================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les résultats
logTest() {
    local test_name="$1"
    local status="$2"
    local message="$3"
    
    if [ "$status" = "OK" ]; then
        echo -e "${GREEN}✅ $test_name: $message${NC}"
    else
        echo -e "${RED}❌ $test_name: $message${NC}"
    fi
}

echo -e "${BLUE}🔍 Vérification des services...${NC}"

# Test 1: Backend accessible
backend_health=$(curl -s -w "%{http_code}" http://localhost:3001/api/health | tail -c 3)
if [ "$backend_health" = "200" ]; then
    logTest "Backend API" "OK" "Service accessible"
else
    logTest "Backend API" "FAIL" "Service non accessible (HTTP $backend_health)"
fi

# Test 2: Frontend accessible
frontend_health=$(curl -s -w "%{http_code}" http://localhost:9595 | tail -c 3)
if [ "$frontend_health" = "200" ]; then
    logTest "Frontend" "OK" "Service accessible"
else
    logTest "Frontend" "FAIL" "Service non accessible (HTTP $frontend_health)"
fi

echo -e "\n${BLUE}💳 Test des APIs de paiement...${NC}"

# Test 3: API MTN Mobile Money
mtn_payment=$(curl -s -w "%{http_code}" -X POST http://localhost:3001/api/payments/process \
  -H "Content-Type: application/json" \
  -d '{"amount": 5000, "method": "MTN_MOBILE_MONEY", "phoneNumber": "242064352209", "orderId": "TEST123", "description": "Test MTN"}' | tail -c 3)

if [ "$mtn_payment" = "200" ] || [ "$mtn_payment" = "201" ]; then
    logTest "API MTN Mobile Money" "OK" "Paiement traité avec succès"
else
    logTest "API MTN Mobile Money" "FAIL" "Erreur HTTP $mtn_payment"
fi

# Test 4: API Paiement à la livraison
cash_payment=$(curl -s -w "%{http_code}" -X POST http://localhost:3001/api/payments/process \
  -H "Content-Type: application/json" \
  -d '{"amount": 5000, "method": "CASH", "orderId": "TEST124", "description": "Test Cash"}' | tail -c 3)

if [ "$cash_payment" = "200" ] || [ "$cash_payment" = "201" ]; then
    logTest "API Paiement à la livraison" "OK" "Paiement traité avec succès"
else
    logTest "API Paiement à la livraison" "FAIL" "Erreur HTTP $cash_payment"
fi

# Test 5: API Carte bancaire
card_payment=$(curl -s -w "%{http_code}" -X POST http://localhost:3001/api/payments/process \
  -H "Content-Type: application/json" \
  -d '{"amount": 5000, "method": "VISA", "orderId": "TEST125", "description": "Test Card"}' | tail -c 3)

if [ "$card_payment" = "200" ] || [ "$card_payment" = "201" ]; then
    logTest "API Carte bancaire" "OK" "Paiement traité avec succès"
else
    logTest "API Carte bancaire" "FAIL" "Erreur HTTP $card_payment"
fi

echo -e "\n${BLUE}🌐 Test des routes frontend...${NC}"

# Test 6: Route restaurants
restaurants_route=$(curl -s -w "%{http_code}" http://localhost:9595/restaurants | tail -c 3)
if [ "$restaurants_route" = "200" ]; then
    logTest "Route /restaurants" "OK" "Page accessible"
else
    logTest "Route /restaurants" "FAIL" "Page non accessible (HTTP $restaurants_route)"
fi

# Test 7: Route checkout
checkout_route=$(curl -s -w "%{http_code}" http://localhost:9595/checkout | tail -c 3)
if [ "$checkout_route" = "200" ]; then
    logTest "Route /checkout" "OK" "Page accessible"
else
    logTest "Route /checkout" "FAIL" "Page non accessible (HTTP $checkout_route)"
fi

# Test 8: Route order-tracking
tracking_route=$(curl -s -w "%{http_code}" http://localhost:9595/order-tracking | tail -c 3)
if [ "$tracking_route" = "200" ]; then
    logTest "Route /order-tracking" "OK" "Page accessible"
else
    logTest "Route /order-tracking" "FAIL" "Page non accessible (HTTP $tracking_route)"
fi

echo -e "\n${BLUE}📊 Résumé des tests...${NC}"

# Compter les succès
success_count=$(grep -c "✅" <<< "$(tail -n +1)")
total_tests=8

echo -e "${GREEN}Tests réussis: $success_count/$total_tests${NC}"

if [ "$success_count" -eq "$total_tests" ]; then
    echo -e "${GREEN}🎉 Tous les tests sont passés ! Le système de paiement fonctionne parfaitement.${NC}"
else
    echo -e "${YELLOW}⚠️  Certains tests ont échoué. Vérifiez les erreurs ci-dessus.${NC}"
fi

echo -e "\n${BLUE}🚀 Instructions de test manuel:${NC}"
echo "1. Allez sur http://localhost:9595/restaurants"
echo "2. Cliquez sur un restaurant"
echo "3. Ajoutez des plats au panier"
echo "4. Cliquez 'Commander maintenant'"
echo "5. Testez les différentes méthodes de paiement"
echo "6. Vérifiez le suivi de commande" 