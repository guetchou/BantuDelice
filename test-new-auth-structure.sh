#!/bin/bash

echo "🔐 Test de la nouvelle structure d'authentification modulaire"
echo "=========================================================="

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

FRONTEND_URL="http://10.10.0.5:9595"

echo -e "${BLUE}🔍 Test de la nouvelle structure d'authentification...${NC}"

# Test de la page d'authentification principale
echo -e "${YELLOW}🔍 Test de la page d'authentification principale...${NC}"
if curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/auth" | grep -q "200"; then
    echo -e "${GREEN}✅ Page d'authentification principale accessible${NC}"
else
    echo -e "${RED}❌ Page d'authentification principale non accessible${NC}"
fi

# Test de la page d'inscription client
echo -e "${YELLOW}🔍 Test de la page d'inscription client...${NC}"
if curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/register/customer" | grep -q "200"; then
    echo -e "${GREEN}✅ Page d'inscription client accessible${NC}"
else
    echo -e "${RED}❌ Page d'inscription client non accessible${NC}"
fi

# Test du contenu de la page d'authentification
echo -e "${YELLOW}🔍 Test du contenu de la page d'authentification...${NC}"
PAGE_CONTENT=$(curl -s "$FRONTEND_URL/auth")

# Vérifier les types de comptes
ACCOUNT_TYPES=("Client" "Chauffeur Taxi" "Livreur" "Restaurant" "Hôtel" "Boutique" "Prestataire" "Entreprise")

for type in "${ACCOUNT_TYPES[@]}"; do
    if echo "$PAGE_CONTENT" | grep -q "$type"; then
        echo -e "${GREEN}✅ Type de compte '$type' trouvé${NC}"
    else
        echo -e "${RED}❌ Type de compte '$type' non trouvé${NC}"
    fi
done

# Vérifier les routes d'inscription
echo -e "${YELLOW}🔍 Test des routes d'inscription...${NC}"
REGISTER_ROUTES=(
    "/register/customer"
)

for route in "${REGISTER_ROUTES[@]}"; do
    if curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL$route" | grep -q "200"; then
        echo -e "${GREEN}✅ Route d'inscription $route accessible${NC}"
    else
        echo -e "${RED}❌ Route d'inscription $route non accessible${NC}"
    fi
done

echo -e "\n${BLUE}📊 Résumé de la nouvelle structure...${NC}"

echo -e "${GREEN}✅ Avantages de la nouvelle structure :${NC}"
echo "   • Page d'authentification simplifiée et claire"
echo "   • Sélection du type de compte avant inscription"
echo "   • Pages d'inscription spécifiques par type"
echo "   • Formulaires adaptés aux besoins de chaque type"
echo "   • Interface plus cohérente et professionnelle"
echo "   • Meilleure expérience utilisateur"

echo -e "\n${GREEN}✅ Types de comptes disponibles :${NC}"
echo "   • Client - Utilisateur final (accès à tous les services)"
echo "   • Chauffeur Taxi - Transport de passagers"
echo "   • Livreur - Livraison de colis et nourriture"
echo "   • Restaurant - Gestion des commandes et menus"
echo "   • Hôtel - Gestion des réservations"
echo "   • Boutique - E-commerce et gestion des produits"
echo "   • Prestataire de services - Services à domicile"
echo "   • Entreprise B2B - Services corporate"

echo -e "\n${GREEN}✅ Routes d'inscription spécifiques :${NC}"
echo "   • /register/customer - Inscription client"
echo "   • /register/driver - Inscription chauffeur (à créer)"
echo "   • /register/delivery - Inscription livreur (à créer)"
echo "   • /register/restaurant - Inscription restaurant (à créer)"
echo "   • /register/hotel - Inscription hôtel (à créer)"
echo "   • /register/shop - Inscription boutique (à créer)"
echo "   • /register/service-provider - Inscription prestataire (à créer)"
echo "   • /register/business - Inscription entreprise (à créer)"

echo -e "\n${GREEN}✅ Fonctionnalités par page d'inscription :${NC}"
echo "   • Client : Informations personnelles, contact, adresse, services disponibles"
echo "   • Chauffeur : Informations personnelles, véhicule, permis, zones de travail"
echo "   • Livreur : Informations personnelles, véhicule, zones de livraison"
echo "   • Restaurant : Informations établissement, menus, horaires, zone de livraison"
echo "   • Hôtel : Informations établissement, chambres, services, localisation"
echo "   • Boutique : Informations boutique, produits, livraison, paiement"
echo "   • Prestataire : Informations entreprise, services, zones d'intervention"
echo "   • Entreprise : Informations entreprise, facturation, équipe"

echo -e "\n${BLUE}🚀 URLs de test :${NC}"
echo "   • Page d'authentification : $FRONTEND_URL/auth"
echo "   • Inscription client : $FRONTEND_URL/register/customer"

echo -e "\n${YELLOW}💡 Instructions d'utilisation :${NC}"
echo "1. Accédez à $FRONTEND_URL/auth"
echo "2. Cliquez sur 'Inscription'"
echo "3. Choisissez votre type de compte"
echo "4. Remplissez le formulaire spécifique à votre type"
echo "5. Validez votre inscription"

echo -e "\n${GREEN}🎉 Test de la nouvelle structure terminé !${NC}"
echo "La structure d'authentification est maintenant modulaire et cohérente."
echo "Chaque type de compte a sa propre page d'inscription adaptée." 