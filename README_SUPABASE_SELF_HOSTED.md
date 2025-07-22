# Supabase Self-Hosted – Procédure d’équipe

## 1. Architecture recommandée

```
/opt/bantudelice/
├── supabase-project/         # Stack Supabase officielle (docker-compose.yml, .env)
├── backend/                 # Ton backend (Node.js, etc.)
├── frontend/                # Ton frontend (React, etc.)
└── docker-compose.yml       # Compose principal pour backend/frontend
```

- **Supabase** tourne dans son propre dossier, stack officielle, ports personnalisés.
- **Backend/Frontend** sont indépendants, communiquent avec Supabase via les ports exposés.

---

## 2. Installation et configuration

### A. Stack Supabase

1. Cloner le repo officiel et préparer le dossier projet :
   ```bash
   git clone --depth 1 https://github.com/supabase/supabase
   mkdir supabase-project
   cp -rf supabase/docker/* supabase-project
   cp supabase/docker/.env.example supabase-project/.env
   ```
2. Adapter les ports dans `docker-compose.yml` et `.env` (voir mapping personnalisé)
3. Générer des secrets forts dans `.env` :
   ```bash
   openssl rand -base64 32
   ```
4. Corriger la ligne du volume docker.sock :
   ```yaml
   - /var/run/docker.sock:/var/run/docker.sock:ro,z
   ```
5. Lancer la stack :
   ```bash
   cd supabase-project
   docker compose --env-file .env up -d
   ```

### B. Backend/Frontend

- Adapter les variables d’environnement :
  - **Backend** (`backend/.env`) :
    ```
    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=postgres
    DB_PASSWORD=<mot de passe généré>
    DB_NAME=postgres
    ```
  - **Frontend** (`frontend/.env`) :
    ```
    VITE_SUPABASE_URL=http://localhost:58000
    VITE_SUPABASE_ANON_KEY=<clé ANON générée>
    ```
- Lancer la stack applicative :
  ```bash
  cd /opt/bantudelice
  docker compose up -d
  ```

---

## 3. Vérification et debug

- **Vérifier les services Supabase** :
  ```bash
  cd supabase-project
  docker compose ps
  ```
- **Accéder à Supabase Studio** :
  http://localhost:53000
- **Tester l’API REST** :
  ```bash
  curl http://localhost:58000/rest/v1/
  ```
- **Vérifier le backend** :
  ```bash
  curl http://localhost:5000/api/health
  ```
- **Vérifier le frontend** :
  Naviguer sur l’URL du frontend, tester l’authentification, etc.

---

## 4. Bonnes pratiques

- **Ne jamais mélanger les services Supabase dans le compose principal**.
- **Toujours utiliser les variables d’environnement pour la connexion**.
- **Changer tous les secrets par défaut avant la mise en production**.
- **Restreindre l’accès aux ports exposés en production (firewall, reverse proxy, etc.)**.
- **Sauvegarder régulièrement la base et les volumes**.

---

## 5. Mise à jour Supabase

- Pour mettre à jour la stack Supabase :
  ```bash
  cd supabase-project
  docker compose pull
  docker compose up -d
  ```
- Pour mettre à jour le backend/frontend :
  ```bash
  cd /opt/bantudelice
  docker compose pull
  docker compose up -d
  ```

---

## 6. Ressources
- [Documentation Supabase Self-Hosting](https://supabase.com/docs/guides/self-hosting/docker)
- [Variables d’environnement Supabase](https://supabase.com/docs/guides/self-hosting/env-vars)
- [Bonnes pratiques sécurité](https://supabase.com/docs/guides/security) 