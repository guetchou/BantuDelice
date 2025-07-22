# Guide de résolution des problèmes (Troubleshooting)

## 1. Problèmes de build Docker
- **Erreur : variable d'environnement non définie**
  - Solution : Vérifie que toutes les variables nécessaires sont bien renseignées dans `.env`.
- **Build échoue sur un service**
  - Solution : Vérifie le Dockerfile du service, les dépendances, et les logs détaillés (`make logs`).

## 2. Services qui ne démarrent pas
- **Conteneur en crashloop**
  - Solution : `make logs` puis corrige l’erreur (souvent un problème de config ou de variable).
- **Port déjà utilisé**
  - Solution : Change le port dans `docker-compose.yml` ou libère le port sur ta machine.

## 3. Accès aux services impossible
- **Impossible d’accéder au frontend/backend**
  - Solution : Vérifie que les services sont bien up (`docker compose ps`), que les ports sont bien exposés, et que le firewall ne bloque pas.
- **Erreur 502/504 (gateway)**
  - Solution : Vérifie la santé du backend, la config Nginx, et les logs.

## 4. Problèmes de base de données
- **Connexion refusée**
  - Solution : Vérifie les variables `POSTGRES_HOST`, `POSTGRES_PASSWORD`, et que le service `db` est bien up.
- **Erreur de migration ou de seed**
  - Solution : Vérifie les scripts SQL, les droits de l’utilisateur, et les logs du conteneur DB.

## 5. Variables d’environnement
- **Des variables ne sont pas synchronisées**
  - Solution : Lance `make sync-env` après chaque modification de `.env`.
- **Secrets exposés par erreur**
  - Solution : Change immédiatement les secrets, ne commit jamais de credentials.

## 6. Problèmes de backup/restore
- **Backup vide ou corrompu**
  - Solution : Vérifie que le conteneur DB tourne, que le nom de la base est correct, et que tu as les droits nécessaires.
- **Restore échoue**
  - Solution : Vérifie le format du fichier, la version de Postgres, et les logs du conteneur DB.

## 7. CI/CD échoue
- **Pipeline en erreur**
  - Solution : Consulte les logs GitHub Actions, vérifie les scripts, les versions de Node/Docker, et les variables d’environnement.

---

Pour tout problème non résolu, consulte la documentation officielle ou contacte l’équipe technique. 