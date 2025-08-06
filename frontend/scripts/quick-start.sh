#!/bin/bash

echo "🚀 BANTUDELICE - DÉMARRAGE RAPIDE"
echo "=================================="

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_status() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    print_error "Ce script doit être exécuté depuis le répertoire frontend/"
    exit 1
fi

print_status "Vérification de l'environnement..."

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js n'est pas installé"
    exit 1
fi

NODE_VERSION=$(node --version)
print_success "Node.js $NODE_VERSION détecté"

# Vérifier npm
if ! command -v npm &> /dev/null; then
    print_error "npm n'est pas installé"
    exit 1
fi

print_success "npm détecté"

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    print_status "Installation des dépendances..."
    npm install
    if [ $? -eq 0 ]; then
        print_success "Dépendances installées"
    else
        print_error "Erreur lors de l'installation des dépendances"
        exit 1
    fi
else
    print_success "Dépendances déjà installées"
fi

# Vérifier la qualité du code
print_status "Vérification de la qualité du code..."

LINT_OUTPUT=$(npm run lint 2>&1)
LINT_EXIT_CODE=$?

if [ $LINT_EXIT_CODE -eq 0 ]; then
    print_success "Code qualité OK"
else
    ERROR_COUNT=$(echo "$LINT_OUTPUT" | grep -c "error" || echo "0")
    WARNING_COUNT=$(echo "$LINT_OUTPUT" | grep -c "warning" || echo "0")
    
    print_warning "Problèmes détectés: $ERROR_COUNT erreurs, $WARNING_COUNT warnings"
    
    if [ $ERROR_COUNT -gt 150 ]; then
        print_error "Trop d'erreurs détectées. Lancement de la correction automatique..."
        node scripts/fix-types.js
    fi
fi

# Vérifier la compilation
print_status "Vérification de la compilation..."

BUILD_OUTPUT=$(npm run build 2>&1)
BUILD_EXIT_CODE=$?

if [ $BUILD_EXIT_CODE -eq 0 ]; then
    print_success "Compilation réussie"
else
    print_error "Erreur de compilation"
    echo "$BUILD_OUTPUT"
    exit 1
fi

# Lancer les tests
print_status "Lancement des tests..."

if npm test &> /dev/null; then
    print_success "Tests passés"
else
    print_warning "Tests non configurés ou échoués"
fi

# Afficher les métriques finales
print_status "Métriques finales:"

if [ $LINT_EXIT_CODE -eq 0 ]; then
    print_success "✅ Qualité du code: EXCELLENTE"
else
    print_warning "⚠️  Qualité du code: À AMÉLIORER ($ERROR_COUNT erreurs, $WARNING_COUNT warnings)"
fi

print_success "✅ Compilation: RÉUSSIE"
print_success "✅ Environnement: PRÊT"

echo ""
echo "🎯 PROCHAINES ÉTAPES:"
echo "===================="
echo "1. Démarrer le serveur de développement: npm run dev"
echo "2. Ouvrir http://localhost:5173 dans votre navigateur"
echo "3. Consulter le guide de maintenance: scripts/maintenance-guide.md"
echo "4. Utiliser les scripts d'optimisation si nécessaire:"
echo "   - node scripts/fix-types.js (correction automatique)"
echo "   - node scripts/optimize-hooks.js (optimisation des hooks)"
echo "   - node scripts/finalize-optimization.js (validation complète)"

echo ""
print_success "🚀 BantuDelice est prêt pour le développement !"

# Option pour démarrer automatiquement le serveur
read -p "Voulez-vous démarrer le serveur de développement maintenant ? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Démarrage du serveur de développement..."
    npm run dev
fi 