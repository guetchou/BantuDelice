#!/bin/bash

# Dossier du projet
PROJECT_DIR="/opt/bantudelice-242"
PORT=24224

# Vérifier si le dossier existe
if [ ! -d "$PROJECT_DIR" ]; then
  echo "Le dossier $PROJECT_DIR n'existe pas !"
  exit 1
fi

# Tuer tout processus qui utilise le port
PID=$(lsof -ti tcp:$PORT)
if [ ! -z "$PID" ]; then
  echo "Un processus utilise le port $PORT (PID: $PID), on le termine..."
  kill -9 $PID
fi

# Aller dans le dossier du projet
cd "$PROJECT_DIR" || exit 1

# Lancer le preview Vite sur toutes les interfaces et le port 24224
npm run preview 