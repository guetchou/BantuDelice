#!/bin/bash

echo "🔍 Diagnostic Vite - Bantudelice Frontend"
echo "=========================================="

# Vérifier si le serveur fonctionne
echo "1. Vérification du serveur Vite..."
if curl -s http://localhost:9595 > /dev/null; then
    echo "✅ Serveur Vite accessible sur http://localhost:9595"
else
    echo "❌ Serveur Vite non accessible"
    exit 1
fi

# Vérifier les dépendances critiques
echo ""
echo "2. Vérification des dépendances optimisées..."

deps=("recharts.js" "date-fns.js" "react.js" "react-dom.js")

for dep in "${deps[@]}"; do
    if curl -s "http://localhost:9595/node_modules/.vite/deps/$dep" > /dev/null; then
        echo "✅ $dep - OK"
    else
        echo "❌ $dep - ERREUR"
    fi
done

# Vérifier les pages critiques
echo ""
echo "3. Vérification des pages critiques..."

pages=(
    "src/pages/colis/ColisDashboardPage.tsx"
    "src/utils/lazyImports.ts"
    "src/routes/colisRoutes.tsx"
)

for page in "${pages[@]}"; do
    if curl -s "http://localhost:9595/$page" > /dev/null; then
        echo "✅ $page - OK"
    else
        echo "❌ $page - ERREUR"
    fi
done

# Vérifier les chunks
echo ""
echo "4. Vérification des chunks optimisés..."
if ls node_modules/.vite/deps/chunk-*.js > /dev/null 2>&1; then
    echo "✅ Chunks optimisés détectés"
    echo "   Nombre de chunks: $(ls node_modules/.vite/deps/chunk-*.js | wc -l)"
else
    echo "❌ Aucun chunk optimisé détecté"
fi

echo ""
echo "5. Informations système..."
echo "   Port utilisé: 9595"
echo "   Host: 0.0.0.0"
echo "   Mode: développement"
echo "   Cache Vite: $(du -sh node_modules/.vite 2>/dev/null | cut -f1 || echo 'N/A')"

echo ""
echo "🎉 Diagnostic terminé !"
echo "Si toutes les vérifications sont OK, votre application devrait fonctionner correctement." 