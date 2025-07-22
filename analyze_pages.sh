#!/bin/bash

echo "📊 ANALYSE COMPLÈTE DES PAGES ET ROUTES BANTUDELICE"
echo "===================================================="
echo ""

# Compter les pages dans chaque dossier
echo "📁 PAGES PAR CATÉGORIE"
echo "----------------------"

# Pages principales (fichiers .tsx dans /pages)
MAIN_PAGES=$(find frontend/src/pages -maxdepth 1 -name "*.tsx" | wc -l)
echo "Pages principales : $MAIN_PAGES"

# Pages colis
COLIS_PAGES=$(find frontend/src/pages/colis -name "*.tsx" | wc -l)
echo "Pages colis : $COLIS_PAGES"

# Pages admin
ADMIN_PAGES=$(find frontend/src/pages/admin -name "*.tsx" | wc -l)
echo "Pages admin : $ADMIN_PAGES"

# Pages auth
AUTH_PAGES=$(find frontend/src/pages/auth -name "*.tsx" | wc -l)
echo "Pages auth : $AUTH_PAGES"

# Pages taxi
TAXI_PAGES=$(find frontend/src/pages/taxi -name "*.tsx" | wc -l)
echo "Pages taxi : $TAXI_PAGES"

# Pages wallet
WALLET_PAGES=$(find frontend/src/pages/wallet -name "*.tsx" | wc -l)
echo "Pages wallet : $WALLET_PAGES"

# Pages explorer
EXPLORER_PAGES=$(find frontend/src/pages/explorer -name "*.tsx" | wc -l)
echo "Pages explorer : $EXPLORER_PAGES"

# Pages delivery
DELIVERY_PAGES=$(find frontend/src/pages/delivery -name "*.tsx" 2>/dev/null | wc -l)
echo "Pages delivery : $DELIVERY_PAGES"

# Pages restaurants
RESTAURANT_PAGES=$(find frontend/src/pages/restaurants -name "*.tsx" 2>/dev/null | wc -l)
echo "Pages restaurants : $RESTAURANT_PAGES"

# Pages Wallet (majuscule)
WALLET_CAPS_PAGES=$(find frontend/src/pages/Wallet -name "*.tsx" 2>/dev/null | wc -l)
echo "Pages Wallet (majuscule) : $WALLET_CAPS_PAGES"

# Autres dossiers
OTHER_PAGES=$(find frontend/src/pages -type d -mindepth 1 -maxdepth 1 | grep -v "colis\|admin\|auth\|taxi\|wallet\|explorer\|delivery\|restaurants\|Wallet" | wc -l)
echo "Autres dossiers de pages : $OTHER_PAGES"

echo ""
echo "📋 LISTE DÉTAILLÉE DES PAGES"
echo "----------------------------"

echo ""
echo "🏠 PAGES PRINCIPALES ($MAIN_PAGES pages)"
echo "----------------------------------------"
find frontend/src/pages -maxdepth 1 -name "*.tsx" | while read file; do
    filename=$(basename "$file" .tsx)
    echo "  - $filename.tsx"
done

echo ""
echo "📦 PAGES COLIS ($COLIS_PAGES pages)"
echo "-----------------------------------"
find frontend/src/pages/colis -name "*.tsx" | while read file; do
    filename=$(basename "$file" .tsx)
    echo "  - $filename.tsx"
done

echo ""
echo "👨‍💼 PAGES ADMIN ($ADMIN_PAGES pages)"
echo "-----------------------------------"
find frontend/src/pages/admin -name "*.tsx" | while read file; do
    filename=$(basename "$file" .tsx)
    echo "  - $filename.tsx"
done

echo ""
echo "🔐 PAGES AUTH ($AUTH_PAGES pages)"
echo "--------------------------------"
find frontend/src/pages/auth -name "*.tsx" | while read file; do
    filename=$(basename "$file" .tsx)
    echo "  - $filename.tsx"
done

echo ""
echo "🚕 PAGES TAXI ($TAXI_PAGES pages)"
echo "--------------------------------"
find frontend/src/pages/taxi -name "*.tsx" | while read file; do
    filename=$(basename "$file" .tsx)
    echo "  - $filename.tsx"
done

echo ""
echo "💰 PAGES WALLET ($WALLET_PAGES pages)"
echo "------------------------------------"
find frontend/src/pages/wallet -name "*.tsx" | while read file; do
    filename=$(basename "$file" .tsx)
    echo "  - $filename.tsx"
done

echo ""
echo "🔍 PAGES EXPLORER ($EXPLORER_PAGES pages)"
echo "----------------------------------------"
find frontend/src/pages/explorer -name "*.tsx" | while read file; do
    filename=$(basename "$file" .tsx)
    echo "  - $filename.tsx"
done

echo ""
echo "📊 ANALYSE DES ROUTES"
echo "--------------------"

# Compter les routes dans mainRoutes.tsx
ROUTES_COUNT=$(grep -c "{ path:" frontend/src/routes/mainRoutes.tsx)
echo "Routes définies dans mainRoutes.tsx : $ROUTES_COUNT"

# Compter les imports de pages
IMPORTS_COUNT=$(grep -c "import.*from.*@/pages" frontend/src/routes/mainRoutes.tsx)
echo "Imports de pages dans mainRoutes.tsx : $IMPORTS_COUNT"

echo ""
echo "🎯 CORRESPONDANCE PAGES ↔ ROUTES"
echo "--------------------------------"

# Vérifier si chaque page a une route
echo "Pages avec routes :"
find frontend/src/pages -name "*.tsx" | while read file; do
    filename=$(basename "$file" .tsx)
    if grep -q "$filename" frontend/src/routes/mainRoutes.tsx; then
        echo "  ✅ $filename.tsx - Route trouvée"
    else
        echo "  ❌ $filename.tsx - Aucune route"
    fi
done

echo ""
echo "📈 STATISTIQUES FINALES"
echo "----------------------"

TOTAL_PAGES=$((MAIN_PAGES + COLIS_PAGES + ADMIN_PAGES + AUTH_PAGES + TAXI_PAGES + WALLET_PAGES + EXPLORER_PAGES + DELIVERY_PAGES + RESTAURANT_PAGES + WALLET_CAPS_PAGES))

echo "Total des pages : $TOTAL_PAGES"
echo "Total des routes : $ROUTES_COUNT"
echo "Total des imports : $IMPORTS_COUNT"

if [ $TOTAL_PAGES -eq $ROUTES_COUNT ]; then
    echo "✅ Parfait ! Nombre de pages = nombre de routes"
elif [ $TOTAL_PAGES -gt $ROUTES_COUNT ]; then
    echo "⚠️  Plus de pages que de routes ($TOTAL_PAGES > $ROUTES_COUNT)"
else
    echo "⚠️  Plus de routes que de pages ($ROUTES_COUNT > $TOTAL_PAGES)"
fi 