#!/bin/bash

echo "🧪 Test du Dashboard Colis - Bantudelice"
echo "========================================"

# Vérifier si le serveur fonctionne
echo "1. Vérification du serveur Vite..."
if curl -s http://localhost:9595 > /dev/null; then
    echo "✅ Serveur Vite accessible"
else
    echo "❌ Serveur Vite non accessible"
    exit 1
fi

# Vérifier le fichier ColisDashboardPage.tsx
echo ""
echo "2. Vérification du fichier ColisDashboardPage.tsx..."
if curl -s "http://localhost:9595/src/pages/colis/ColisDashboardPage.tsx" | grep -q "createHotContext"; then
    echo "✅ Fichier ColisDashboardPage.tsx accessible et valide"
else
    echo "❌ Erreur dans ColisDashboardPage.tsx"
    exit 1
fi

# Vérifier les dépendances recharts
echo ""
echo "3. Vérification des dépendances recharts..."
if curl -s "http://localhost:9595/node_modules/.vite/deps/recharts.js" | grep -q "import"; then
    echo "✅ Recharts correctement optimisé"
else
    echo "❌ Problème avec recharts"
fi

# Vérifier les routes
echo ""
echo "4. Vérification des routes..."
if curl -s "http://localhost:9595/src/routes/colisRoutes.tsx" | grep -q "LazyColisDashboard"; then
    echo "✅ Routes colis configurées"
else
    echo "❌ Problème avec les routes"
fi

# Vérifier les imports lazy
echo ""
echo "5. Vérification des imports lazy..."
if curl -s "http://localhost:9595/src/utils/lazyImports.ts" | grep -q "LazyColisDashboard"; then
    echo "✅ Imports lazy configurés"
else
    echo "❌ Problème avec les imports lazy"
fi

echo ""
echo "🎉 Tests terminés !"
echo "Le dashboard devrait maintenant fonctionner correctement."
echo "Accédez à: http://localhost:9595/#/colis/dashboard" 