# Makefile pour gestion complète du projet Docker/

# Variables
ENV_FILE=.env
COMPOSE=docker compose --env-file $(ENV_FILE)
BACKUP_FILE=backup.sql
DB_CONTAINER=-db
DB_NAME=$(shell grep POSTGRES_DB $(ENV_FILE) | cut -d= -f2)
DB_USER=postgres

.PHONY: help
help:
	@echo "Commandes disponibles :"
	@echo "  make build        : Build tous les services Docker"
	@echo "  make up           : Lance tous les services en arrière-plan"
	@echo "  make down         : Arrête tous les services"
	@echo "  make logs         : Affiche les logs en temps réel"
	@echo "  make sync-env     : Synchronise .env et .env."
	@echo "  make test         : Lint & test backend et frontend"
	@echo "  make backup       : Sauvegarde la base de données Postgres"
	@echo "  make restore      : Restaure la base de données Postgres depuis backup.sql"

build:
	$(COMPOSE) build

up:
	$(COMPOSE) up -d

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f

sync-env:
	bash scripts/sync-env.sh

test:
	cd backend && npm ci && npm run lint || true
	cd frontend && npm ci && npm run lint || true

backup:
	docker exec $(DB_CONTAINER) pg_dump -U $(DB_USER) $(DB_NAME) > $(BACKUP_FILE)

restore:
	cat $(BACKUP_FILE) | docker exec -i $(DB_CONTAINER) psql -U $(DB_USER) $(DB_NAME) 