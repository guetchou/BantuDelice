#!/bin/bash

echo "🧹 Nettoyage du cache Vite..."
rm -rf node_modules/.vite
rm -rf .vite
rm -rf dist

echo "📦 Réinstallation des dépendances..."
pnpm install

echo "🔄 Redémarrage du serveur de développement..."
echo "Le serveur va redémarrer automatiquement..."
echo "Attendez quelques secondes pour que les dépendances soient optimisées..."

# Redémarrer le serveur en arrière-plan
pnpm run dev & 