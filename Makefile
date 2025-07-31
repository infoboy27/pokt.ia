# POKT.ai Portal Makefile

.PHONY: help build dev prod clean logs stop restart

help: ## Show this help message
	@echo "POKT.ai Portal - Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

build: ## Build the production Docker image
	docker-compose build

dev: ## Start development environment with hot reloading
	docker-compose -f docker-compose.dev.yml up --build

dev-detach: ## Start development environment in detached mode
	docker-compose -f docker-compose.dev.yml up -d --build

prod: ## Start production environment
	docker-compose up --build

prod-detach: ## Start production environment in detached mode
	docker-compose up -d --build

clean: ## Stop and remove all containers, networks, and images
	docker-compose down --rmi all --volumes --remove-orphans
	docker system prune -f

logs: ## Show logs from all containers
	docker-compose logs -f

logs-dev: ## Show logs from development containers
	docker-compose -f docker-compose.dev.yml logs -f

stop: ## Stop all containers
	docker-compose down

stop-dev: ## Stop development containers
	docker-compose -f docker-compose.dev.yml down

restart: ## Restart all containers
	docker-compose restart

restart-dev: ## Restart development containers
	docker-compose -f docker-compose.dev.yml restart

shell: ## Open shell in the production container
	docker-compose exec pokt-portal sh

shell-dev: ## Open shell in the development container
	docker-compose -f docker-compose.dev.yml exec pokt-portal-dev sh

test: ## Run tests
	docker-compose exec pokt-portal pnpm test

test-dev: ## Run tests in development container
	docker-compose -f docker-compose.dev.yml exec pokt-portal-dev pnpm test

lint: ## Run linting
	docker-compose exec pokt-portal pnpm lint

lint-dev: ## Run linting in development container
	docker-compose -f docker-compose.dev.yml exec pokt-portal-dev pnpm lint

format: ## Format code
	docker-compose exec pokt-portal pnpm format

format-dev: ## Format code in development container
	docker-compose -f docker-compose.dev.yml exec pokt-portal-dev pnpm format 