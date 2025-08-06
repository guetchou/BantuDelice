#!/bin/bash

# Test Complet des Fonctionnalités BantuDelice
# Vérifie l'authentification, les APIs, le tracking et le dashboard

BASE_URL="http://localhost:3001/api"
FRONTEND_URL="http://localhost:9595"

# Couleurs pour les logs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

log() {
    echo -e "${1}${2}${NC}"
}

logTest() {
    local testName="$1"
    local success="$2"
    local details="$3"
    
    if [ "$success" = "true" ]; then
        log "${GREEN}✅ PASS${NC} $testName"
    else
        log "${RED}❌ FAIL${NC} $testName"
    fi
    
    if [ -n "$details" ]; then
        log "${YELLOW}   $details${NC}"
    fi
}

testAPI() {
    local endpoint="$1"
    local method="${2:-GET}"
    local body="$3"
    
    if [ "$method" = "POST" ] && [ -n "$body" ]; then
        response=$(curl -s -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$body" "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "%{http_code}" "$BASE_URL$endpoint")
    fi
    
    http_code="${response: -3}"
    body="${response%???}"
    
    if [ "$http_code" = "200" ]; then
        echo "true"
    else
        echo "false"
    fi
}

testFrontend() {
    local path="$1"
    local response=$(curl -s -w "%{http_code}" "$FRONTEND_URL$path")
    local http_code="${response: -3}"
    
    if [ "$http_code" = "200" ]; then
        echo "true"
    else
        echo "false"
    fi
}

echo -e "${BOLD}🚀 Test Complet des Fonctionnalités BantuDelice${NC}"
echo "============================================================"

# Test 1: Santé du Backend
echo -e "\n${BOLD}📊 Test 1: Santé du Backend${NC}"
health_success=$(testAPI "/colis/health")
logTest "Backend Health Check" "$health_success" "Service opérationnel"

# Test 2: API Notifications
echo -e "\n${BOLD}📱 Test 2: API Notifications${NC}"
notifications_success=$(testAPI "/colis/notifications")
logTest "Notifications API" "$notifications_success" "Notifications récupérées"

# Test 3: API Statistiques
echo -e "\n${BOLD}📈 Test 3: API Statistiques${NC}"
stats_success=$(testAPI "/colis/stats")
logTest "Statistiques API" "$stats_success" "Statistiques récupérées"

# Test 4: API Expéditions
echo -e "\n${BOLD}📦 Test 4: API Expéditions${NC}"
expeditions_success=$(testAPI "/colis/expeditions")
logTest "Expéditions API" "$expeditions_success" "Expéditions récupérées"

# Test 5: API Tracking
echo -e "\n${BOLD}📍 Test 5: API Tracking${NC}"
tracking_success=$(testAPI "/tracking/BD123456")
logTest "Tracking API" "$tracking_success" "Tracking fonctionnel"

# Test 6: API Historique Tracking
echo -e "\n${BOLD}📋 Test 6: API Historique Tracking${NC}"
history_success=$(testAPI "/tracking/BD123456/history")
logTest "Historique Tracking API" "$history_success" "Historique récupéré"

# Test 7: API Paiements
echo -e "\n${BOLD}💳 Test 7: API Paiements${NC}"
payment_body='{"amount": 5000, "method": "mtn_momo", "phone": "242064352209"}'
payment_success=$(testAPI "/payments/process" "POST" "$payment_body")
logTest "Paiements API" "$payment_success" "Paiements traités"

# Test 8: Frontend - Page d'accueil
echo -e "\n${BOLD}🌐 Test 8: Frontend - Page d'accueil${NC}"
home_success=$(testFrontend "/")
logTest "Page d'accueil" "$home_success" "Page accessible"

# Test 9: Frontend - Page Colis
echo -e "\n${BOLD}📦 Test 9: Frontend - Page Colis${NC}"
colis_success=$(testFrontend "/colis")
logTest "Page Colis" "$colis_success" "Page accessible"

# Test 10: Frontend - Page Auth
echo -e "\n${BOLD}🔐 Test 10: Frontend - Page Auth${NC}"
auth_success=$(testFrontend "/colis/auth")
logTest "Page Auth" "$auth_success" "Page accessible"

# Test 11: Frontend - Dashboard
echo -e "\n${BOLD}📊 Test 11: Frontend - Dashboard${NC}"
dashboard_success=$(testFrontend "/colis/dashboard")
logTest "Dashboard" "$dashboard_success" "Page accessible"

# Test 12: Frontend - Expédition
echo -e "\n${BOLD}🚚 Test 12: Frontend - Expédition${NC}"
expedition_success=$(testFrontend "/colis/expedition")
logTest "Page Expédition" "$expedition_success" "Page accessible"

# Résumé
echo -e "\n============================================================"
echo -e "${BOLD}📋 Résumé des Tests${NC}"
echo "============================================================"

total_tests=12
passed_tests=0

for test in "$health_success" "$notifications_success" "$stats_success" "$expeditions_success" "$tracking_success" "$history_success" "$payment_success" "$home_success" "$colis_success" "$auth_success" "$dashboard_success" "$expedition_success"; do
    if [ "$test" = "true" ]; then
        ((passed_tests++))
    fi
done

success_rate=$(echo "scale=1; $passed_tests * 100 / $total_tests" | bc)

echo -e "Tests réussis: ${GREEN}$passed_tests/$total_tests ($success_rate%)${NC}"

if [ "$passed_tests" -eq "$total_tests" ]; then
    echo -e "${GREEN}🎉 Toutes les fonctionnalités fonctionnent correctement !${NC}"
else
    echo -e "${YELLOW}⚠️  Certaines fonctionnalités nécessitent une attention${NC}"
fi

echo -e "\n${BOLD}🔧 Recommandations:${NC}"
if [ "$health_success" != "true" ]; then
    echo -e "${YELLOW}   - Vérifier que le backend est démarré sur le port 3001${NC}"
fi
if [ "$home_success" != "true" ]; then
    echo -e "${YELLOW}   - Vérifier que le frontend est démarré sur le port 9595${NC}"
fi
if [ "$tracking_success" != "true" ]; then
    echo -e "${YELLOW}   - Vérifier la configuration des routes de tracking${NC}"
fi
if [ "$payment_success" != "true" ]; then
    echo -e "${YELLOW}   - Vérifier la configuration des paiements${NC}"
fi 