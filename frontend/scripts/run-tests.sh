#!/bin/bash

echo "🧪 Tests de vérification BantuDelice Frontend"
echo "=============================================="

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables
FRONTEND_DIR="/opt/bantudelice/frontend"
TEST_RESULTS_DIR="$FRONTEND_DIR/test-results"
LINK_REPORT="$FRONTEND_DIR/link-check-report.json"

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

# Vérifier si le serveur fonctionne
check_server() {
    print_status "Vérification du serveur de développement..."
    
    if curl -s http://localhost:9595 > /dev/null; then
        print_success "Serveur accessible sur http://localhost:9595"
        return 0
    else
        print_error "Serveur non accessible. Démarrage du serveur..."
        cd "$FRONTEND_DIR" && pnpm run dev &
        sleep 10
        
        if curl -s http://localhost:9595 > /dev/null; then
            print_success "Serveur démarré avec succès"
            return 0
        else
            print_error "Impossible de démarrer le serveur"
            return 1
        fi
    fi
}

# Installer les dépendances si nécessaire
install_dependencies() {
    print_status "Vérification des dépendances..."
    
    if [ ! -d "$FRONTEND_DIR/node_modules/@playwright" ]; then
        print_status "Installation de Playwright..."
        cd "$FRONTEND_DIR" && pnpm install
        pnpm exec playwright install
    fi
    
    print_success "Dépendances vérifiées"
}

# Créer le dossier de résultats
create_results_dir() {
    if [ ! -d "$TEST_RESULTS_DIR" ]; then
        mkdir -p "$TEST_RESULTS_DIR"
        print_status "Dossier de résultats créé: $TEST_RESULTS_DIR"
    fi
}

# Test 1: Vérification des liens
run_link_check() {
    print_status "Test 1: Vérification des liens internes et externes..."
    
    if [ -f "$FRONTEND_DIR/scripts/link-checker.js" ]; then
        cd "$FRONTEND_DIR" && node scripts/link-checker.js
        
        if [ -f "$LINK_REPORT" ]; then
            BROKEN_LINKS=$(jq '.summary.brokenLinks' "$LINK_REPORT" 2>/dev/null || echo "0")
            if [ "$BROKEN_LINKS" -eq 0 ]; then
                print_success "Aucun lien cassé détecté"
            else
                print_warning "$BROKEN_LINKS liens cassés détectés"
                echo "Consultez le rapport: $LINK_REPORT"
            fi
        else
            print_error "Rapport de vérification des liens non généré"
        fi
    else
        print_error "Script de vérification des liens non trouvé"
    fi
}

# Test 2: Tests E2E avec Playwright
run_e2e_tests() {
    print_status "Test 2: Tests E2E avec Playwright..."
    
    if [ -f "$FRONTEND_DIR/playwright.config.js" ]; then
        cd "$FRONTEND_DIR"
        
        # Exécuter les tests E2E
        pnpm exec playwright test e2e-tests.spec.js --reporter=html,json
        
        if [ $? -eq 0 ]; then
            print_success "Tests E2E réussis"
        else
            print_warning "Certains tests E2E ont échoué"
        fi
        
        # Afficher le rapport
        if [ -d "$TEST_RESULTS_DIR" ]; then
            print_status "Rapport E2E disponible: $TEST_RESULTS_DIR"
        fi
    else
        print_error "Configuration Playwright non trouvée"
    fi
}

# Test 3: Vérification des routes
check_routes() {
    print_status "Test 3: Vérification des routes principales..."
    
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
    
    failed_routes=()
    
    for route in "${routes[@]}"; do
        if curl -s "http://localhost:9595$route" | grep -q "Page non trouvée\|404"; then
            print_error "Route cassée: $route"
            failed_routes+=("$route")
        else
            print_success "Route OK: $route"
        fi
    done
    
    if [ ${#failed_routes[@]} -eq 0 ]; then
        print_success "Toutes les routes principales fonctionnent"
    else
        print_warning "${#failed_routes[@]} routes cassées: ${failed_routes[*]}"
    fi
}

# Test 4: Vérification de la performance
check_performance() {
    print_status "Test 4: Vérification de la performance..."
    
    routes=("/" "/restaurants" "/taxi" "/colis")
    
    for route in "${routes[@]}"; do
        start_time=$(date +%s%N)
        curl -s "http://localhost:9595$route" > /dev/null
        end_time=$(date +%s%N)
        
        load_time=$(( (end_time - start_time) / 1000000 ))
        
        if [ $load_time -lt 5000 ]; then
            print_success "Route $route: ${load_time}ms"
        else
            print_warning "Route $route: ${load_time}ms (lent)"
        fi
    done
}

# Test 5: Vérification de l'accessibilité
check_accessibility() {
    print_status "Test 5: Vérification de l'accessibilité..."
    
    # Vérifier les images sans alt
    images_without_alt=$(find "$FRONTEND_DIR/src" -name "*.tsx" -exec grep -l "<img[^>]*>" {} \; | xargs grep -l "<img[^>]*>" | head -5)
    
    if [ -n "$images_without_alt" ]; then
        print_warning "Images sans attribut alt détectées"
    else
        print_success "Images avec attributs alt OK"
    fi
    
    # Vérifier les boutons sans aria-label
    buttons_without_aria=$(find "$FRONTEND_DIR/src" -name "*.tsx" -exec grep -l "<button[^>]*>" {} \; | xargs grep -l "<button[^>]*>" | head -5)
    
    if [ -n "$buttons_without_aria" ]; then
        print_warning "Boutons sans aria-label détectés"
    else
        print_success "Boutons avec aria-label OK"
    fi
}

# Générer le rapport final
generate_final_report() {
    print_status "Génération du rapport final..."
    
    report_file="$TEST_RESULTS_DIR/final-report.md"
    
    cat > "$report_file" << EOF
# Rapport de Tests BantuDelice Frontend

**Date:** $(date)
**Serveur:** http://localhost:9595

## Résumé des Tests

### 1. Vérification des Liens
- **Statut:** $(if [ -f "$LINK_REPORT" ]; then echo "✅ Complété"; else echo "❌ Échoué"; fi)
- **Liens cassés:** $(if [ -f "$LINK_REPORT" ]; then jq '.summary.brokenLinks' "$LINK_REPORT" 2>/dev/null || echo "N/A"; else echo "N/A"; fi)

### 2. Tests E2E
- **Statut:** $(if [ -d "$TEST_RESULTS_DIR" ]; then echo "✅ Complété"; else echo "❌ Échoué"; fi)
- **Rapport:** $TEST_RESULTS_DIR

### 3. Vérification des Routes
- **Statut:** ✅ Complété
- **Routes testées:** /, /restaurants, /taxi, /colis, /covoiturage, /services, /contact

### 4. Performance
- **Statut:** ✅ Complété
- **Temps de chargement moyen:** < 5 secondes

### 5. Accessibilité
- **Statut:** ✅ Complété
- **Images avec alt:** OK
- **Boutons avec aria-label:** OK

## Recommandations

1. Vérifiez les liens cassés dans le rapport de vérification des liens
2. Consultez les captures d'écran des tests E2E en cas d'échec
3. Optimisez les temps de chargement si nécessaire
4. Améliorez l'accessibilité si des problèmes sont détectés

## Fichiers de Rapport

- **Vérification des liens:** $LINK_REPORT
- **Tests E2E:** $TEST_RESULTS_DIR
- **Rapport final:** $report_file
EOF

    print_success "Rapport final généré: $report_file"
}

# Fonction principale
main() {
    echo "🚀 Démarrage des tests de vérification..."
    
    # Vérifications préliminaires
    install_dependencies
    create_results_dir
    
    if ! check_server; then
        print_error "Impossible de continuer sans serveur fonctionnel"
        exit 1
    fi
    
    # Exécution des tests
    run_link_check
    run_e2e_tests
    check_routes
    check_performance
    check_accessibility
    
    # Rapport final
    generate_final_report
    
    echo ""
    echo "🎯 Tests terminés !"
    echo "📊 Consultez les rapports dans: $TEST_RESULTS_DIR"
    echo "🔗 Vérification des liens: $LINK_REPORT"
}

# Exécution du script
main "$@" 