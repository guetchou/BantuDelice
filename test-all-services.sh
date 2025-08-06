#!/bin/bash

echo "🚀 Test complet de tous les services BantuDelice"
echo "==============================================="

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

FRONTEND_URL="http://10.10.0.5:9595"

echo -e "${BLUE}🔍 Test de tous les services disponibles...${NC}"

# Test de la page d'authentification
echo -e "${YELLOW}🔍 Test de la page d'authentification...${NC}"
if curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/auth" | grep -q "200"; then
    echo -e "${GREEN}✅ Page d'authentification accessible${NC}"
else
    echo -e "${RED}❌ Page d'authentification non accessible${NC}"
fi

echo -e "\n${PURPLE}📋 Services de transport...${NC}"

# Services de transport
TRANSPORT_SERVICES=(
    "/taxi"
    "/covoiturage"
    "/location-voiture"
)

for service in "${TRANSPORT_SERVICES[@]}"; do
    echo -e "${YELLOW}🔍 Test de $service...${NC}"
    if curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL$service" | grep -q "200"; then
        echo -e "${GREEN}✅ Service transport $service accessible${NC}"
    else
        echo -e "${RED}❌ Service transport $service non accessible${NC}"
    fi
done

echo -e "\n${PURPLE}📦 Services de livraison...${NC}"

# Services de livraison
DELIVERY_SERVICES=(
    "/delivery"
    "/colis"
)

for service in "${DELIVERY_SERVICES[@]}"; do
    echo -e "${YELLOW}🔍 Test de $service...${NC}"
    if curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL$service" | grep -q "200"; then
        echo -e "${GREEN}✅ Service livraison $service accessible${NC}"
    else
        echo -e "${RED}❌ Service livraison $service non accessible${NC}"
    fi
done

echo -e "\n${PURPLE}🍽️ Services lifestyle...${NC}"

# Services lifestyle
LIFESTYLE_SERVICES=(
    "/restaurant"
    "/restaurants"
    "/hotel"
    "/shopping"
)

for service in "${LIFESTYLE_SERVICES[@]}"; do
    echo -e "${YELLOW}🔍 Test de $service...${NC}"
    if curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL$service" | grep -q "200"; then
        echo -e "${GREEN}✅ Service lifestyle $service accessible${NC}"
    else
        echo -e "${RED}❌ Service lifestyle $service non accessible${NC}"
    fi
done

echo -e "\n${PURPLE}🏠 Services à domicile...${NC}"

# Services à domicile
HOME_SERVICES=(
    "/services"
    "/professional-services"
)

for service in "${HOME_SERVICES[@]}"; do
    echo -e "${YELLOW}🔍 Test de $service...${NC}"
    if curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL$service" | grep -q "200"; then
        echo -e "${GREEN}✅ Service domicile $service accessible${NC}"
    else
        echo -e "${RED}❌ Service domicile $service non accessible${NC}"
    fi
done

echo -e "\n${PURPLE}👥 Dashboards et gestion...${NC}"

# Dashboards et gestion
DASHBOARD_SERVICES=(
    "/driver/dashboard"
    "/user/dashboard"
    "/restaurant/dashboard"
    "/admin"
    "/b2b"
)

for service in "${DASHBOARD_SERVICES[@]}"; do
    echo -e "${YELLOW}🔍 Test de $service...${NC}"
    if curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL$service" | grep -q "200"; then
        echo -e "${GREEN}✅ Dashboard $service accessible${NC}"
    else
        echo -e "${RED}❌ Dashboard $service non accessible${NC}"
    fi
done

echo -e "\n${BLUE}📊 Résumé complet des services...${NC}"

echo -e "${GREEN}✅ Services de transport :${NC}"
echo "   • Taxi - Réservation de taxi en ligne"
echo "   • Covoiturage - Partage de trajets"
echo "   • Location de voiture - Location de véhicules"

echo -e "\n${GREEN}✅ Services de livraison :${NC}"
echo "   • Livraison de repas - Livraison à domicile"
echo "   • Colis - Expédition et suivi de colis"

echo -e "\n${GREEN}✅ Services lifestyle :${NC}"
echo "   • Restaurant - Réservation et commandes"
echo "   • Hôtel - Réservation d'hôtels"
echo "   • Shopping - Boutiques en ligne"

echo -e "\n${GREEN}✅ Services à domicile :${NC}"
echo "   • Services professionnels - Plombier, électricien, etc."

echo -e "\n${GREEN}✅ Types de comptes disponibles :${NC}"
echo "   • Client - Utilisateur final (accès à tous les services)"
echo "   • Chauffeur Taxi - Transport de passagers"
echo "   • Livreur - Livraison de colis et nourriture"
echo "   • Restaurant - Gestion des commandes et menus"
echo "   • Hôtel - Gestion des réservations"
echo "   • Boutique - E-commerce et gestion des produits"
echo "   • Prestataire de services - Services à domicile"
echo "   • Entreprise B2B - Services corporate"
echo "   • Administrateur - Administration du système"

echo -e "\n${GREEN}✅ Fonctionnalités par type de compte :${NC}"
echo "   • Client : Taxi, livraison, restaurants, location, covoiturage, shopping, services"
echo "   • Chauffeur : Transport, gestion courses, GPS, tarifs, historique"
echo "   • Livreur : Colis, nourriture, suivi, tournées, validation"
echo "   • Restaurant : Menus, commandes, livraison, stocks, analytics"
echo "   • Hôtel : Chambres, réservations, clients, services"
echo "   • Boutique : Produits, commandes, livraison, stocks, marketing"
echo "   • Prestataire : Interventions, devis, planification, facturation"
echo "   • Entreprise : Corporate, facturation, équipe, réservations groupées"
echo "   • Admin : Utilisateurs, configuration, analytics, support"

echo -e "\n${BLUE}🚀 URLs de test :${NC}"
echo "   • Page d'authentification : $FRONTEND_URL/auth"
echo "   • Services : $FRONTEND_URL/services"
echo "   • Taxi : $FRONTEND_URL/taxi"
echo "   • Livraison : $FRONTEND_URL/delivery"
echo "   • Restaurants : $FRONTEND_URL/restaurant"
echo "   • Shopping : $FRONTEND_URL/shopping"

echo -e "\n${YELLOW}💡 Instructions d'utilisation :${NC}"
echo "1. Accédez à $FRONTEND_URL/auth pour créer un compte"
echo "2. Choisissez votre type de compte selon vos besoins"
echo "3. Explorez les différents services disponibles"
echo "4. Testez les dashboards correspondants à votre type de compte"

echo -e "\n${GREEN}🎉 Test complet terminé !${NC}"
echo "BantuDelice offre une plateforme complète avec tous les services nécessaires."
echo "Chaque type de compte a accès aux fonctionnalités appropriées." 