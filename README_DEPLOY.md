# Déploiement Bantudelice (Easypanel / CapRover)

## 1. Prérequis
- Docker installé sur le serveur
- (Optionnel) Easypanel ou CapRover installé

## 2. Build & Images Docker
```bash
./deploy-bantudelice.sh
```
Cela crée deux images Docker :
- `bantudelice-frontend` (Vite/React, servi par Nginx)
- `bantudelice-backend` (NestJS)

## 3. Déploiement sur Easypanel ou CapRover
- **Frontend** :
  - Ajoute une app Docker, utilise l'image `bantudelice-frontend`
  - Ou mode Static (pointe sur `frontend/dist`)
- **Backend** :
  - Ajoute une app Docker, utilise l'image `bantudelice-backend`
  - Ou mode Node.js (pointe sur `backend-nestjs`)

## 4. Variables d'environnement
- Configure-les dans l'interface de ton panel (voir `.env.example` ou `.env.production`)

## 5. Domaines & SSL
- Ajoute tes domaines personnalisés
- Active SSL via l'interface

## 6. Mise à jour
- Rebuild les images et redeploie si tu fais des changements

---

**Support :**
- Easypanel : https://docs.easypanel.io/
- CapRover : https://caprover.com/docs/ 