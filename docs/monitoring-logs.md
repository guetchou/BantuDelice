# Monitoring et centralisation des logs

## 1. Monitoring des conteneurs avec Portainer

Portainer est une interface web simple pour surveiller, gérer et dépanner tes conteneurs Docker.

### Installation rapide :
```bash
docker volume create portainer_data
docker run -d -p 9000:9000 --name=portainer --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce
```

- Accès : http://localhost:9000 (crée un compte admin à la première connexion)
- Tu peux voir l’état, les logs, les stats de chaque conteneur, redémarrer/arrêter, etc.

## 2. Centralisation des logs avec Loki + Grafana

Loki (par Grafana Labs) permet de centraliser et rechercher les logs de tous tes conteneurs.

### a. Ajoute Loki et Grafana à ton docker-compose.yml :

```yaml
loki:
  image: grafana/loki:2.9.3
  ports:
    - "3100:3100"
  command: -config.file=/etc/loki/local-config.yaml
  volumes:
    - ./volumes/loki:/loki

grafana:
  image: grafana/grafana:10.2.2
  ports:
    - "3001:3000"
  environment:
    - GF_SECURITY_ADMIN_PASSWORD=admin
  volumes:
    - ./volumes/grafana:/var/lib/grafana
```

### b. Ajoute Promtail pour collecter les logs Docker :

```yaml
promtail:
  image: grafana/promtail:2.9.3
  volumes:
    - /var/log:/var/log
    - /var/lib/docker/containers:/var/lib/docker/containers:ro
    - ./promtail-config.yaml:/etc/promtail/config.yaml
  command: -config.file=/etc/promtail/config.yaml
```

Crée un fichier `promtail-config.yaml` adapté à Docker (voir doc Grafana).

### c. Accès :
- Grafana : http://localhost:3001 (admin/admin)
- Loki : http://localhost:3100 (API)

Dans Grafana, configure une source de données Loki pour visualiser et rechercher les logs de tous tes services.

## 3. Bonnes pratiques
- Change les mots de passe par défaut (Grafana, Portainer)
- Restreins l’accès aux interfaces web (firewall, VPN, reverse proxy)
- Sauvegarde les volumes de logs et de monitoring
- Surveille les alertes et configure des notifications (Slack, mail, etc.)

## 4. Liens utiles
- [Portainer](https://www.portainer.io/)
- [Grafana Loki](https://grafana.com/oss/loki/)
- [Promtail](https://grafana.com/docs/loki/latest/clients/promtail/)
- [Grafana](https://grafana.com/) 