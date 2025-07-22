#!/bin/bash
# Synchronise les variables critiques de .env vers .env.
# Usage : ./scripts/sync-env.sh

SRC=".env"
DEST=".env."

# Liste des variables à synchroniser (ajoute ici si besoin)
VARS=(
  _URL
  _PUBLIC_URL
  _ANON_KEY
  _SERVICE_ROLE_KEY
  ANON_KEY
  SERVICE_ROLE_KEY
  POSTGRES_PASSWORD
  POSTGRES_DB
  POSTGRES_HOST
  POSTGRES_PORT
  JWT_SECRET
)

# Ajoute dynamiquement toutes les variables VITE_ et REACT_APP_
VARS+=( $(grep -Eo '^(VITE_[A-Z0-9_]+)=' "$SRC" | cut -d= -f1) )
VARS+=( $(grep -Eo '^(REACT_APP_[A-Z0-9_]+)=' "$SRC" | cut -d= -f1) )

# Nettoie le fichier destination
> "$DEST"

for VAR in "${VARS[@]}"; do
  # Récupère la ligne correspondante dans .env
  LINE=$(grep -E "^$VAR=" "$SRC")
  if [ ! -z "$LINE" ]; then
    echo "$LINE" >> "$DEST"
  fi
done

echo "Synchronisation terminée : $DEST est à jour avec les variables critiques de $SRC." 