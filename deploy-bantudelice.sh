#!/bin/bash

# Déplacement dans le dossier frontend
cd "$(dirname "$0")/frontend" || { echo "Erreur : dossier frontend introuvable"; exit 1; }

echo "🧹 Suppression de package-lock.json s'il existe..."
rm -f package-lock.json

echo "📦 Réinstallation des dépendances..."
npm install

echo "🛠️  Build local pour vérifier que tout fonctionne..."
npm run build || { echo "❌ Build local échoué"; exit 1; }

echo "🚀 Déploiement Vercel forcé (production)..."
vercel --prod --force

echo "✅ Déploiement terminé."
