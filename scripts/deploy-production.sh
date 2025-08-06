#!/bin/bash

# Script de déploiement pour l'environnement de production
# Configure les URLs et les variables d'environnement

set -e

echo "🚀 Déploiement en production - Configuration des URLs"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration par défaut
DEFAULT_API_URL="https://api.bantudelice.com"
DEFAULT_APP_URL="https://bantudelice.com"
DEFAULT_WS_URL="wss://api.bantudelice.com/ws"

# Fonction pour afficher les messages
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérification des prérequis
check_prerequisites() {
    log_info "Vérification des prérequis..."
    
    # Vérifier que nous sommes dans le bon répertoire
    if [ ! -f "package.json" ]; then
        log_error "Ce script doit être exécuté depuis la racine du projet"
        exit 1
    fi
    
    # Vérifier que le frontend existe
    if [ ! -d "frontend" ]; then
        log_error "Le dossier frontend n'existe pas"
        exit 1
    fi
    
    log_success "Prérequis vérifiés"
}

# Configuration des variables d'environnement
setup_environment() {
    log_info "Configuration des variables d'environnement..."
    
    # Demander les URLs si elles ne sont pas définies
    if [ -z "$API_URL" ]; then
        read -p "URL de l'API (défaut: $DEFAULT_API_URL): " API_URL
        API_URL=${API_URL:-$DEFAULT_API_URL}
    fi
    
    if [ -z "$APP_URL" ]; then
        read -p "URL de l'application (défaut: $DEFAULT_APP_URL): " APP_URL
        APP_URL=${APP_URL:-$DEFAULT_APP_URL}
    fi
    
    if [ -z "$WS_URL" ]; then
        read -p "URL WebSocket (défaut: $DEFAULT_WS_URL): " WS_URL
        WS_URL=${WS_URL:-$DEFAULT_WS_URL}
    fi
    
    # Créer le fichier .env.production
    cat > frontend/.env.production << EOF
# Configuration de production
VITE_MODE=production
VITE_API_URL=${API_URL}/api
VITE_WS_URL=${WS_URL}
VITE_APP_URL=${APP_URL}

# Configuration des services
VITE_COLIS_API_KEY=prod_api_key_$(date +%s)
VITE_MAPBOX_TOKEN=pk.eyJ1IjoicHJvZCIsImEiOiJleGFtcGxlIn0.production

# Configuration des notifications
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_GEOLOCATION=true

# Configuration du debug
VITE_DEBUG=false
VITE_LOG_LEVEL=error
EOF
    
    log_success "Variables d'environnement configurées"
}

# Test de connectivité
test_connectivity() {
    log_info "Test de connectivité..."
    
    # Test de l'API
    if curl -s --max-time 10 "${API_URL}/api/health" > /dev/null 2>&1; then
        log_success "API accessible: ${API_URL}/api"
    else
        log_warning "API non accessible: ${API_URL}/api"
        log_warning "Assurez-vous que le backend est déployé et accessible"
    fi
    
    # Test de l'application
    if curl -s --max-time 10 "${APP_URL}" > /dev/null 2>&1; then
        log_success "Application accessible: ${APP_URL}"
    else
        log_warning "Application non accessible: ${APP_URL}"
        log_warning "Assurez-vous que le frontend est déployé"
    fi
}

# Build de production
build_production() {
    log_info "Build de production..."
    
    cd frontend
    
    # Nettoyer les builds précédents
    rm -rf dist/
    
    # Installer les dépendances si nécessaire
    if [ ! -d "node_modules" ]; then
        log_info "Installation des dépendances..."
        npm install
    fi
    
    # Build de production
    log_info "Compilation pour la production..."
    npm run build
    
    cd ..
    
    log_success "Build de production terminé"
}

# Configuration du serveur web
setup_web_server() {
    log_info "Configuration du serveur web..."
    
    # Créer la configuration Nginx
    cat > nginx.conf << EOF
server {
    listen 80;
    server_name ${APP_URL#https://};
    
    # Redirection HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ${APP_URL#https://};
    
    # Configuration SSL (à adapter selon votre certificat)
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    # Configuration de sécurité
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Headers de sécurité
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Configuration CORS pour l'API
    location /api/ {
        proxy_pass ${API_URL}/api/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Configuration CORS
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "Content-Type, Authorization";
        
        if (\$request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
            add_header Access-Control-Allow-Headers "Content-Type, Authorization";
            add_header Content-Length 0;
            add_header Content-Type text/plain;
            return 200;
        }
    }
    
    # Configuration WebSocket
    location /ws/ {
        proxy_pass ${WS_URL}/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Configuration du frontend
    location / {
        root /var/www/bantudelice;
        try_files \$uri \$uri/ /index.html;
        
        # Cache statique
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Gestion des erreurs
    error_page 404 /index.html;
    error_page 500 502 503 504 /50x.html;
}
EOF
    
    log_success "Configuration Nginx créée"
    log_warning "N'oubliez pas de:"
    log_warning "1. Configurer vos certificats SSL"
    log_warning "2. Adapter les chemins dans nginx.conf"
    log_warning "3. Redémarrer Nginx après configuration"
}

# Génération du rapport de déploiement
generate_deployment_report() {
    log_info "Génération du rapport de déploiement..."
    
    cat > deployment-report.md << EOF
# Rapport de Déploiement - BantuDelice

## Configuration

- **Date**: $(date)
- **API URL**: ${API_URL}
- **App URL**: ${APP_URL}
- **WebSocket URL**: ${WS_URL}

## URLs de Test

### API Endpoints
- Health Check: ${API_URL}/api/health
- Colis: ${API_URL}/api/colis
- Notifications: ${API_URL}/api/colis/notifications
- Stats: ${API_URL}/api/colis/stats

### Frontend
- Application: ${APP_URL}
- Tracking: ${APP_URL}/#/colis/tracking
- Dashboard: ${APP_URL}/#/colis/dashboard

## Checklist de Déploiement

- [ ] Backend déployé et accessible
- [ ] Frontend buildé et déployé
- [ ] Certificats SSL configurés
- [ ] Nginx configuré et redémarré
- [ ] Variables d'environnement configurées
- [ ] Tests de connectivité passés
- [ ] Monitoring configuré

## Commandes Utiles

\`\`\`bash
# Vérifier le statut du backend
curl ${API_URL}/api/health

# Vérifier le frontend
curl ${APP_URL}

# Tester WebSocket
wscat -c ${WS_URL}

# Vérifier les logs Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
\`\`\`

## Support

En cas de problème, vérifiez:
1. Les logs du serveur
2. La configuration Nginx
3. Les certificats SSL
4. La connectivité réseau
EOF
    
    log_success "Rapport de déploiement généré: deployment-report.md"
}

# Fonction principale
main() {
    echo "🚀 Déploiement BantuDelice en Production"
    echo "========================================"
    
    check_prerequisites
    setup_environment
    test_connectivity
    build_production
    setup_web_server
    generate_deployment_report
    
    echo ""
    log_success "Déploiement terminé avec succès !"
    echo ""
    log_info "Prochaines étapes:"
    log_info "1. Déployer le backend sur ${API_URL}"
    log_info "2. Configurer Nginx avec le fichier nginx.conf"
    log_info "3. Configurer les certificats SSL"
    log_info "4. Tester l'application complète"
    echo ""
    log_info "Consultez deployment-report.md pour plus de détails"
}

# Exécution du script
main "$@" 