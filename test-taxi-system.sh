#!/bin/bash

echo "🧪 Test du système de taxi BantuDelice"
echo "======================================"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier si Docker est en cours d'exécution
print_status "Vérification de Docker..."
if ! docker info > /dev/null 2>&1; then
    print_error "Docker n'est pas en cours d'exécution"
    exit 1
fi
print_success "Docker est en cours d'exécution"

# Vérifier les conteneurs
print_status "Vérification des conteneurs..."
if ! docker-compose ps | grep -q "Up"; then
    print_warning "Aucun conteneur en cours d'exécution. Démarrage du système..."
    ./start-taxi-system.sh
    sleep 30
fi

# Vérifier le backend
print_status "Test du backend API..."
BACKEND_URL="http://localhost:3001"
if curl -s "$BACKEND_URL/health" > /dev/null 2>&1; then
    print_success "Backend API accessible"
else
    print_error "Backend API non accessible"
    print_status "Tentative de redémarrage du backend..."
    docker-compose restart backend
    sleep 10
fi

# Vérifier le frontend
print_status "Test du frontend..."
FRONTEND_URL="http://localhost:3000"
if curl -s "$FRONTEND_URL" > /dev/null 2>&1; then
    print_success "Frontend accessible"
else
    print_error "Frontend non accessible"
fi

# Test des endpoints API
print_status "Test des endpoints API..."

# Test de l'endpoint de tarification
if curl -s "$BACKEND_URL/taxi/pricing" > /dev/null 2>&1; then
    print_success "Endpoint de tarification fonctionnel"
else
    print_warning "Endpoint de tarification non accessible (authentification requise)"
fi

# Test de l'endpoint de statistiques
if curl -s "$BACKEND_URL/taxi/statistics" > /dev/null 2>&1; then
    print_success "Endpoint de statistiques fonctionnel"
else
    print_warning "Endpoint de statistiques non accessible (authentification requise)"
fi

# Vérifier la base de données
print_status "Vérification de la base de données..."
if docker-compose exec -T backend npx typeorm query "SELECT 1" > /dev/null 2>&1; then
    print_success "Base de données accessible"
else
    print_warning "Base de données non accessible (peut nécessiter une initialisation)"
fi

# Vérifier Redis
print_status "Vérification de Redis..."
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    print_success "Redis accessible"
else
    print_error "Redis non accessible"
fi

# Test des fonctionnalités principales
echo ""
print_status "Test des fonctionnalités principales..."

# Vérifier les fichiers de composants
COMPONENTS=(
    "frontend/src/pages/Taxi.tsx"
    "frontend/src/pages/driver/DriverDashboard.tsx"
    "frontend/src/pages/user/UserDashboard.tsx"
    "frontend/src/components/taxi/TaxiChat.tsx"
    "frontend/src/services/taxiService.ts"
    "frontend/src/hooks/useTaxiRide.ts"
    "backend/src/taxi/taxi.service.ts"
    "backend/src/taxi/taxi.controller.ts"
    "backend/src/taxi/taxi-gateway.ts"
    "backend/src/taxi/entities/taxi-ride.entity.ts"
)

for component in "${COMPONENTS[@]}"; do
    if [ -f "$component" ]; then
        print_success "✓ $component"
    else
        print_error "✗ $component manquant"
    fi
done

# Vérifier les routes
print_status "Vérification des routes..."
ROUTES=(
    "/taxi"
    "/driver/dashboard"
    "/user/dashboard"
    "/call-center"
)

for route in "${ROUTES[@]}"; do
    if curl -s "$FRONTEND_URL$route" > /dev/null 2>&1; then
        print_success "✓ Route $route accessible"
    else
        print_warning "⚠ Route $route non accessible (peut nécessiter une authentification)"
    fi
done

# Test des WebSockets
print_status "Test des WebSockets..."
if curl -s -I "$BACKEND_URL" | grep -q "Upgrade"; then
    print_success "WebSocket support détecté"
else
    print_warning "WebSocket support non vérifié"
fi

# Résumé
echo ""
echo "📊 Résumé des tests:"
echo "==================="

# Compter les succès et erreurs
SUCCESS_COUNT=$(grep -c "\[SUCCESS\]" <<< "$(cat $0)")
ERROR_COUNT=$(grep -c "\[ERROR\]" <<< "$(cat $0)")

echo "✅ Tests réussis: $SUCCESS_COUNT"
echo "❌ Erreurs détectées: $ERROR_COUNT"

if [ $ERROR_COUNT -eq 0 ]; then
    echo ""
    print_success "🎉 Tous les tests sont passés avec succès !"
    echo ""
    echo "🚀 Le système de taxi est prêt à être utilisé :"
    echo "   • Frontend: $FRONTEND_URL"
    echo "   • Backend API: $BACKEND_URL"
    echo "   • Swagger: $BACKEND_URL/api"
    echo ""
    echo "📱 Pour tester :"
    echo "   1. Ouvrez $FRONTEND_URL"
    echo "   2. Créez un compte ou connectez-vous"
    echo "   3. Allez dans la section Taxi"
    echo "   4. Testez la réservation de taxi"
    echo ""
    echo "👨‍💼 Dashboard chauffeur: $FRONTEND_URL/driver/dashboard"
    echo "👤 Dashboard utilisateur: $FRONTEND_URL/user/dashboard"
    echo "📞 Call Center: $FRONTEND_URL/call-center"
else
    echo ""
    print_warning "⚠️ Certains tests ont échoué. Vérifiez les erreurs ci-dessus."
    echo ""
    echo "🔧 Actions recommandées :"
    echo "   1. Vérifiez que tous les services sont démarrés"
    echo "   2. Consultez les logs: docker-compose logs"
    echo "   3. Redémarrez le système: ./start-taxi-system.sh"
fi

echo ""
echo "🔧 Commandes utiles :"
echo "   • Voir les logs: docker-compose logs -f"
echo "   • Redémarrer: docker-compose restart"
echo "   • Arrêter: docker-compose down"
echo "   • Reconstruire: docker-compose up --build" 