#!/bin/bash

echo "🔧 Nettoyage et redémarrage du serveur de développement..."

# Arrêter tous les processus sur le port 9595
echo "1️⃣ Arrêt des processus sur le port 9595..."
pkill -f "vite.*9595" 2>/dev/null || true
pkill -f "node.*9595" 2>/dev/null || true

# Attendre un peu
sleep 2

# Vérifier si le port est libre
if lsof -Pi :9595 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️ Le port 9595 est encore occupé, tentative de libération..."
    sudo lsof -ti:9595 | xargs kill -9 2>/dev/null || true
    sleep 1
fi

# Nettoyer le cache
echo "2️⃣ Nettoyage du cache..."
cd frontend
rm -rf node_modules/.vite 2>/dev/null || true
rm -rf dist 2>/dev/null || true

# Redémarrer le serveur
echo "3️⃣ Redémarrage du serveur de développement..."
npm run dev &

# Attendre que le serveur démarre
echo "4️⃣ Attente du démarrage du serveur..."
sleep 5

# Vérifier que le serveur fonctionne
if curl -s http://localhost:9595 > /dev/null; then
    echo "✅ Serveur redémarré avec succès sur http://localhost:9595"
    echo "🌐 URLs disponibles:"
    echo "   - Local: http://localhost:9595/"
    echo "   - Network: http://10.10.0.5:9595/"
else
    echo "❌ Erreur lors du redémarrage du serveur"
    exit 1
fi

echo "🎉 Nettoyage terminé !" 