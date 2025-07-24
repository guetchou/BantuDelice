#!/bin/bash
set -e

# Build frontend
cd frontend
npm install
npm run build
# Build Docker image for frontend
if [ -f Dockerfile ]; then
  docker build -t bantudelice-frontend .
fi
cd ..

# Build backend
cd backend-nestjs
npm install
npm run build
# Build Docker image for backend
if [ -f Dockerfile ]; then
  docker build -t bantudelice-backend .
fi
cd ..

echo "Build terminé. Images Docker : bantudelice-frontend, bantudelice-backend"
# Pour déployer sur un serveur Docker distant, ajoutez :
# docker tag ... && docker push ...
