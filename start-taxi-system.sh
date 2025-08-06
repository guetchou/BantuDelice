#!/bin/bash

echo "🚕 Démarrage du système de taxi BantuDelice..."
echo "================================================"

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez installer Docker d'abord."
    exit 1
fi

# Vérifier si Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez installer Docker Compose d'abord."
    exit 1
fi

# Arrêter les conteneurs existants
echo "🛑 Arrêt des conteneurs existants..."
docker-compose down

# Construire et démarrer les services
echo "🔨 Construction et démarrage des services..."
docker-compose up --build -d

# Attendre que les services soient prêts
echo "⏳ Attente que les services soient prêts..."
sleep 30

# Vérifier l'état des services
echo "🔍 Vérification de l'état des services..."
docker-compose ps

# Afficher les logs du backend
echo "📋 Logs du backend:"
docker-compose logs backend | tail -20

# Afficher les logs du frontend
echo "📋 Logs du frontend:"
docker-compose logs frontend | tail -20

echo ""
echo "✅ Système de taxi démarré avec succès!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:3001"
echo "📊 Swagger API: http://localhost:3001/api"
echo ""
echo "🚀 Fonctionnalités disponibles:"
echo "   • Réservation de taxi en temps réel"
echo "   • Suivi GPS des chauffeurs"
echo "   • Calcul automatique des tarifs"
echo "   • Système de paiement intégré"
echo "   • Notifications WebSocket"
echo "   • Interface chauffeur"
echo "   • Dashboard administrateur"
echo ""
echo "📱 Pour tester l'application:"
echo "   1. Ouvrez http://localhost:3000"
echo "   2. Créez un compte ou connectez-vous"
echo "   3. Allez dans la section Taxi"
echo "   4. Réservez votre course!"
echo ""
echo "🔧 Pour arrêter le système: docker-compose down"
echo "📋 Pour voir les logs: docker-compose logs -f" 