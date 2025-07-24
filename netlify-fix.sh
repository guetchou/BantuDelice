#!/bin/bash
set -e

# 1. Vérifier dist/index.html
if [ ! -f frontend/dist/index.html ]; then
  echo "❌ frontend/dist/index.html absent !"
else
  echo "✅ frontend/dist/index.html existe."
fi

# 2. Lister les fichiers JS/CSS vides
echo "Fichiers JS/CSS vides dans dist/assets :"
find frontend/dist/assets -type f -size 0 || true

# 3. Supprimer les chunks JS vides
find frontend/dist/assets -type f -name "*.js" -size 0 -exec rm -v {} \; || true

# 4. Ajouter _redirects pour Netlify SPA
mkdir -p frontend/public
printf '/* /index.html 200\n' > frontend/public/_redirects

# 5. Ajouter .npmrc pour legacy peer deps
printf 'legacy-peer-deps=true\n' > frontend/.npmrc

# 6. (Optionnel) Patch vite.config.ts pour base: './' (affiche un message)
echo "⚠️  Vérifie que vite.config.ts contient bien base: './' dans defineConfig."

# 7. Rebuild
cd frontend
npm install
npm run build
cd ..

# 8. Commit & push (optionnel)
git add frontend/public/_redirects frontend/.npmrc frontend/dist || true
git commit -m "fix: Netlify SPA, clean empty chunks, legacy peer deps" || true
# git push <...>

echo "✅ Script terminé. Relance le déploiement Netlify !" 