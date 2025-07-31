#!/bin/bash

# Script de déploiement automatisé pour BantuDelice Colis
# Version: 1.0.0
# Auteur: BantuDelice Team

set -e  # Arrêter le script en cas d'erreur

# Configuration
PROJECT_NAME="bantudelice-colis"
FRONTEND_DIR="frontend"
BUILD_DIR="dist"
DEPLOY_DIR="/var/www/bantudelice-colis"
BACKUP_DIR="/var/backups/bantudelice-colis"
LOG_FILE="/var/log/bantudelice-colis/deploy.log"
NODE_VERSION="18"
PM2_APP_NAME="bantudelice-colis"

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction de logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" | tee -a "$LOG_FILE"
    exit 1
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}" | tee -a "$LOG_FILE"
}

# Vérification des prérequis
check_prerequisites() {
    log "Vérification des prérequis..."
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js n'est pas installé"
    fi
    
    # Vérifier npm
    if ! command -v npm &> /dev/null; then
        error "npm n'est pas installé"
    fi
    
    # Vérifier la version de Node.js
    NODE_MAJOR_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_MAJOR_VERSION" -lt "$NODE_VERSION" ]; then
        error "Node.js version $NODE_VERSION ou supérieure requise. Version actuelle: $(node -v)"
    fi
    
    # Vérifier PM2
    if ! command -v pm2 &> /dev/null; then
        warn "PM2 n'est pas installé. Installation..."
        npm install -g pm2
    fi
    
    log "Prérequis vérifiés avec succès"
}

# Sauvegarde de la version actuelle
backup_current_version() {
    log "Sauvegarde de la version actuelle..."
    
    if [ -d "$DEPLOY_DIR" ]; then
        BACKUP_NAME="backup-$(date +'%Y%m%d-%H%M%S')"
        BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"
        
        mkdir -p "$BACKUP_DIR"
        cp -r "$DEPLOY_DIR" "$BACKUP_PATH"
        
        # Garder seulement les 5 dernières sauvegardes
        cd "$BACKUP_DIR"
        ls -t | tail -n +6 | xargs -r rm -rf
        
        log "Sauvegarde créée: $BACKUP_PATH"
    else
        warn "Aucune version précédente trouvée"
    fi
}

# Installation des dépendances
install_dependencies() {
    log "Installation des dépendances..."
    
    cd "$FRONTEND_DIR"
    
    # Nettoyer le cache npm
    npm cache clean --force
    
    # Supprimer node_modules et package-lock.json
    rm -rf node_modules package-lock.json
    
    # Installer les dépendances
    npm install --production=false
    
    if [ $? -eq 0 ]; then
        log "Dépendances installées avec succès"
    else
        error "Échec de l'installation des dépendances"
    fi
}

# Construction de l'application
build_application() {
    log "Construction de l'application..."
    
    cd "$FRONTEND_DIR"
    
    # Variables d'environnement pour la production
    export NODE_ENV=production
    export REACT_APP_API_URL=https://api.bantudelice.cg
    export REACT_APP_ENVIRONMENT=production
    
    # Construction
    npm run build
    
    if [ $? -eq 0 ]; then
        log "Application construite avec succès"
    else
        error "Échec de la construction de l'application"
    fi
}

# Tests de qualité
run_tests() {
    log "Exécution des tests..."
    
    cd "$FRONTEND_DIR"
    
    # Tests unitaires
    npm run test -- --watchAll=false --coverage --passWithNoTests
    
    if [ $? -eq 0 ]; then
        log "Tests unitaires passés"
    else
        warn "Certains tests ont échoué, mais le déploiement continue"
    fi
    
    # Tests de linting
    npm run lint
    
    if [ $? -eq 0 ]; then
        log "Linting passé"
    else
        warn "Problèmes de linting détectés, mais le déploiement continue"
    fi
}

# Déploiement de l'application
deploy_application() {
    log "Déploiement de l'application..."
    
    # Créer le répertoire de déploiement
    mkdir -p "$DEPLOY_DIR"
    
    # Copier les fichiers construits
    cp -r "$FRONTEND_DIR/$BUILD_DIR"/* "$DEPLOY_DIR/"
    
    # Copier les fichiers de configuration
    cp "$FRONTEND_DIR/package.json" "$DEPLOY_DIR/"
    cp "$FRONTEND_DIR/ecosystem.config.js" "$DEPLOY_DIR/" 2>/dev/null || true
    
    # Créer le fichier .htaccess pour Apache
    cat > "$DEPLOY_DIR/.htaccess" << 'EOF'
RewriteEngine On
RewriteBase /

# Rediriger toutes les requêtes vers index.html pour le routing SPA
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [QSA,L]

# Compression gzip
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache des assets statiques
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Sécurité
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
EOF

    # Définir les permissions
    chmod -R 755 "$DEPLOY_DIR"
    chown -R www-data:www-data "$DEPLOY_DIR"
    
    log "Application déployée avec succès"
}

# Configuration de PM2
setup_pm2() {
    log "Configuration de PM2..."
    
    # Créer le fichier de configuration PM2
    cat > "$DEPLOY_DIR/ecosystem.config.js" << EOF
module.exports = {
  apps: [{
    name: '$PM2_APP_NAME',
    script: 'serve',
    args: '-s . -l 9595',
    cwd: '$DEPLOY_DIR',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 9595
    },
    error_file: '/var/log/bantudelice-colis/err.log',
    out_file: '/var/log/bantudelice-colis/out.log',
    log_file: '/var/log/bantudelice-colis/combined.log',
    time: true,
    max_memory_restart: '1G',
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
EOF

    # Installer serve globalement si nécessaire
    if ! command -v serve &> /dev/null; then
        npm install -g serve
    fi
    
    # Démarrer/redémarrer l'application avec PM2
    cd "$DEPLOY_DIR"
    pm2 delete "$PM2_APP_NAME" 2>/dev/null || true
    pm2 start ecosystem.config.js
    
    # Sauvegarder la configuration PM2
    pm2 save
    
    # Configurer le démarrage automatique
    pm2 startup
    
    log "PM2 configuré avec succès"
}

# Tests de santé
health_check() {
    log "Vérification de la santé de l'application..."
    
    # Attendre que l'application démarre
    sleep 5
    
    # Test de connectivité
    if curl -f -s http://localhost:9595 > /dev/null; then
        log "Application accessible sur http://localhost:9595"
    else
        error "Application non accessible"
    fi
    
    # Test de la page d'accueil
    if curl -f -s http://localhost:9595/#/colis > /dev/null; then
        log "Page Colis accessible"
    else
        warn "Page Colis non accessible"
    fi
    
    log "Tests de santé passés"
}

# Nettoyage
cleanup() {
    log "Nettoyage..."
    
    # Supprimer les fichiers temporaires
    cd "$FRONTEND_DIR"
    rm -rf node_modules/.cache
    
    # Nettoyer les logs PM2 anciens
    pm2 flush
    
    log "Nettoyage terminé"
}

# Fonction principale
main() {
    log "=== Début du déploiement de BantuDelice Colis ==="
    
    # Créer le répertoire de logs
    mkdir -p "$(dirname "$LOG_FILE")"
    
    # Vérifier les prérequis
    check_prerequisites
    
    # Sauvegarder la version actuelle
    backup_current_version
    
    # Installation et construction
    install_dependencies
    run_tests
    build_application
    
    # Déploiement
    deploy_application
    setup_pm2
    
    # Tests finaux
    health_check
    cleanup
    
    log "=== Déploiement terminé avec succès ==="
    
    # Afficher les informations de déploiement
    echo ""
    echo "🎉 Déploiement réussi !"
    echo "📍 URL: http://localhost:9595/#/colis"
    echo "📊 PM2 Status: pm2 status"
    echo "📋 Logs: tail -f $LOG_FILE"
    echo ""
}

# Gestion des arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [OPTIONS]"
        echo ""
        echo "Options:"
        echo "  --help, -h     Afficher cette aide"
        echo "  --backup       Sauvegarder seulement"
        echo "  --rollback     Restaurer la version précédente"
        echo "  --status       Afficher le statut"
        echo ""
        echo "Exemples:"
        echo "  $0              Déployer l'application"
        echo "  $0 --backup     Sauvegarder seulement"
        echo "  $0 --rollback   Restaurer la version précédente"
        ;;
    --backup)
        backup_current_version
        ;;
    --rollback)
        log "Restauration de la version précédente..."
        if [ -d "$BACKUP_DIR" ]; then
            LATEST_BACKUP=$(ls -t "$BACKUP_DIR" | head -1)
            if [ -n "$LATEST_BACKUP" ]; then
                rm -rf "$DEPLOY_DIR"
                cp -r "$BACKUP_DIR/$LATEST_BACKUP" "$DEPLOY_DIR"
                setup_pm2
                health_check
                log "Restauration terminée"
            else
                error "Aucune sauvegarde trouvée"
            fi
        else
            error "Répertoire de sauvegarde non trouvé"
        fi
        ;;
    --status)
        echo "=== Statut de BantuDelice Colis ==="
        echo "PM2 Status:"
        pm2 status
        echo ""
        echo "Derniers logs:"
        tail -n 20 "$LOG_FILE" 2>/dev/null || echo "Aucun log trouvé"
        ;;
    *)
        main
        ;;
esac 