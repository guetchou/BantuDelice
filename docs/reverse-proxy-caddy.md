# Reverse proxy sécurisé avec Caddy (HTTPS automatique)

Caddy est un reverse proxy moderne qui gère automatiquement les certificats HTTPS (Let's Encrypt) et simplifie la sécurisation de tes services Docker.

## 1. Exemple de Caddyfile (à adapter)

```Caddyfile
# Frontend (React via Nginx)
www.mondomaine.com {
  reverse_proxy frontend:80
  encode gzip
  header {
    Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    X-Content-Type-Options nosniff
    X-Frame-Options DENY
    X-XSS-Protection "1; mode=block"
  }
}

# Backend API
api.mondomaine.com {
  reverse_proxy backend:5000
  encode gzip
  header {
    Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    X-Content-Type-Options nosniff
    X-Frame-Options DENY
    X-XSS-Protection "1; mode=block"
  }
}

#  Studio (optionnel)
studio.mondomaine.com {
  reverse_proxy -studio:3000
  encode gzip
  header {
    Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    X-Content-Type-Options nosniff
    X-Frame-Options DENY
    X-XSS-Protection "1; mode=block"
  }
}
```

- Remplace `mondomaine.com` par ton vrai domaine.
- Les noms de service (`frontend`, `backend`, `-studio`) doivent correspondre à ceux de ton `docker-compose.yml`.

## 2. Lancer Caddy en mode Docker

Ajoute ce service à ton `docker-compose.yml` :

```yaml
caddy:
  image: caddy:2.7.6
  restart: unless-stopped
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./Caddyfile:/etc/caddy/Caddyfile:ro
    - caddy_data:/data
    - caddy_config:/config
  depends_on:
    - frontend
    - backend
```

Déclare les volumes en bas de ton `docker-compose.yml` :
```yaml
volumes:
  caddy_data:
  caddy_config:
```

Lance Caddy avec :
```bash
docker compose up -d caddy
```

## 3. Bonnes pratiques
- Ouvre uniquement les ports 80 et 443 sur ton serveur (firewall).
- Change les emails de contact dans Caddyfile si besoin.
- Utilise des sous-domaines clairs pour chaque service.
- Surveille les logs de Caddy pour détecter les erreurs SSL ou d’accès.
- Restreins l’accès à l’interface admin de Caddy (si activée).

## 4. Liens utiles
- [Caddy Server](https://caddyserver.com/)
- [Caddy Docker Hub](https://hub.docker.com/_/caddy)
- [Caddyfile Docs](https://caddyserver.com/docs/caddyfile) 