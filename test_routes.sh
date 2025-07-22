#!/bin/bash

echo "🔍 TEST DE TOUTES LES ROUTES BANTUDELICE"
echo "========================================"
echo ""

BASE_URL="http://10.10.0.5:9595"

# Fonction pour tester une route
test_route() {
    local route=$1
    local description=$2
    local response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$route")
    
    if [ "$response" = "200" ]; then
        echo "✅ $route - $description (HTTP $response)"
    else
        echo "❌ $route - $description (HTTP $response)"
    fi
}

echo "🏠 ROUTES PRINCIPALES"
echo "---------------------"
test_route "/" "Page d'accueil"
test_route "/services" "Services"
test_route "/restaurants" "Restaurants"
test_route "/contact" "Contact"
test_route "/profile" "Profil"
test_route "/about" "À propos"
test_route "/blog" "Blog"
test_route "/careers" "Carrières"
test_route "/partners" "Partenaires"
test_route "/availability" "Disponibilité"
test_route "/professional-services" "Services professionnels"
test_route "/covoiturage" "Covoiturage"

echo ""
echo "🚚 ROUTES LIVRAISON"
echo "-------------------"
test_route "/delivery" "Livraison"
test_route "/delivery/map" "Carte de livraison"
test_route "/order" "Commande"

echo ""
echo "🚕 ROUTES TAXI"
echo "--------------"
test_route "/taxi" "Taxi"
test_route "/taxi/booking" "Réservation taxi"
test_route "/taxi/history" "Historique taxi"
test_route "/taxi/locations" "Emplacements taxi"
test_route "/taxi/subscription" "Abonnement taxi"
test_route "/taxi/business" "Taxi business"
test_route "/taxi/vehicle-comparison" "Comparaison véhicules"
test_route "/taxi/ride-status" "Statut course"
test_route "/taxis" "Alias taxi"

echo ""
echo "🔐 ROUTES AUTHENTIFICATION"
echo "---------------------------"
test_route "/auth" "Authentification"
test_route "/auth/login" "Connexion"
test_route "/auth/register" "Inscription"
test_route "/auth/profile" "Profil auth"

echo ""
echo "👨‍💼 ROUTES ADMIN"
echo "----------------"
test_route "/admin" "Admin"
test_route "/admin/login" "Connexion admin"
test_route "/admin/dashboard" "Dashboard admin"
test_route "/admin/users" "Utilisateurs admin"
test_route "/admin/user-credentials" "Identifiants utilisateurs"
test_route "/admin/feature-flags" "Flags de fonctionnalités"
test_route "/admin/profile" "Profil admin"
test_route "/admin/settings" "Paramètres admin"
test_route "/admin/demo-data-manager" "Gestionnaire données démo"
test_route "/admin/n8n-workflow-manager" "Gestionnaire workflows N8N"

echo ""
echo "💰 ROUTES WALLET"
echo "---------------"
test_route "/wallet" "Wallet"
test_route "/wallet/overview" "Vue d'ensemble wallet"
test_route "/wallet/deposit" "Dépôt"
test_route "/wallet/withdraw" "Retrait"
test_route "/wallet/transactions" "Transactions"
test_route "/wallet/invoices" "Factures"
test_route "/wallet/payment-methods" "Méthodes de paiement"
test_route "/wallet/analytics" "Analytics wallet"

echo ""
echo "📦 ROUTES COLIS"
echo "---------------"
test_route "/colis" "Landing page colis"
test_route "/colis/tarifs" "Tarifs colis"
test_route "/colis/expedier" "Expédier colis"
test_route "/colis/historique" "Historique colis"
test_route "/colis/api" "API colis"
test_route "/colis/dashboard" "Dashboard colis"
test_route "/colis/tracking" "Suivi colis"
test_route "/colis/tarif" "Tarif colis"
test_route "/services/colis" "Service colis"

echo ""
echo "🔍 ROUTES EXPLORER"
echo "------------------"
test_route "/explorer/trend1" "Tendance 1"
test_route "/explorer/trend2" "Tendance 2"
test_route "/explorer/trend3" "Tendance 3"
test_route "/explorer/trend4" "Tendance 4"

echo ""
echo "📋 ROUTES DIVERSES"
echo "------------------"
test_route "/search" "Recherche"
test_route "/notifications" "Notifications"
test_route "/cart" "Panier"

echo ""
echo "📊 RÉSUMÉ"
echo "---------"
echo "Routes testées : $(grep -c "test_route" $0)"
echo "Routes 200 OK : $(grep -c "✅" <<< "$(bash $0 2>/dev/null)")"
echo "Routes 404/Erreur : $(grep -c "❌" <<< "$(bash $0 2>/dev/null)")" 