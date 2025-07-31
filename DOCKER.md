# POKT.ai Portal - Docker Setup

This document provides instructions for running the POKT.ai Portal using Docker and Docker Compose.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd pokt-portal
```

### 2. Set Up Environment Variables

Copy the example environment file and configure your variables:

```bash
cp env.example .env
# Edit .env with your actual values
nano .env
```

### 3. Run the Application

#### Development Mode (with hot reloading)

```bash
# Using Makefile (recommended)
make dev

# Or directly with docker-compose
docker-compose -f docker-compose.dev.yml up --build
```

#### Production Mode

```bash
# Using Makefile (recommended)
make prod

# Or directly with docker-compose
docker-compose up --build
```

### 4. Access the Application

- **Development**: http://localhost:3001
- **Production**: http://localhost:3001

## Available Commands

### Using Makefile (Recommended)

```bash
# Show all available commands
make help

# Development
make dev              # Start development environment
make dev-detach       # Start development environment in background
make stop-dev         # Stop development containers
make logs-dev         # View development logs
make shell-dev        # Open shell in development container

# Production
make prod             # Start production environment
make prod-detach      # Start production environment in background
make stop             # Stop production containers
make logs             # View production logs
make shell            # Open shell in production container

# Maintenance
make clean            # Clean up all containers and images
make restart          # Restart all containers
make restart-dev      # Restart development containers

# Development Tools
make test             # Run tests
make test-dev         # Run tests in development container
make lint             # Run linting
make lint-dev         # Run linting in development container
make format           # Format code
make format-dev       # Format code in development container
```

### Using Docker Compose Directly

```bash
# Development
docker-compose -f docker-compose.dev.yml up --build
docker-compose -f docker-compose.dev.yml up -d --build
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml logs -f

# Production
docker-compose up --build
docker-compose up -d --build
docker-compose down
docker-compose logs -f
```

## Environment Variables

The following environment variables need to be configured in your `.env` file:

### Required Variables

```bash
# Node Environment
NODE_ENV=development
PORT=3001

# Auth0 Configuration
AUTH0_SECRET=your_auth0_secret_here
AUTH0_BASE_URL=http://localhost:3001
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
AUTH0_CLIENT_ID=your_client_id_here
AUTH0_CLIENT_SECRET=your_client_secret_here

# POKT.ai Backend Configuration
PORTAL_BACKEND_URL=https://backend.staging.portal.pokt.network
PORTAL_GRAPHQL_URL=https://backend.staging.portal.pokt.network/graphql
```

### Optional Variables

```bash
# Stripe Configuration (for payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Novu Notifications
NOVU_API_KEY=your_novu_api_key_here
NOVU_APP_ID=your_novu_app_id_here

# Redis/Upstash Configuration
UPSTASH_REDIS_REST_URL=your_upstash_redis_url_here
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token_here

# Vercel KV Configuration
VERCEL_KV_REST_API_URL=your_vercel_kv_url_here
VERCEL_KV_REST_API_TOKEN=your_vercel_kv_token_here
VERCEL_KV_REST_API_READ_ONLY_TOKEN=your_vercel_kv_readonly_token_here

# Email Configuration (Mailjet)
MAILJET_API_KEY=your_mailjet_api_key_here
MAILJET_API_SECRET=your_mailjet_api_secret_here

# Analytics and Monitoring
SENTRY_DSN=your_sentry_dsn_here

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_NOTIFICATIONS=true
```

## Docker Images

### Production Image (`Dockerfile`)

- **Base**: Node.js 22 Alpine
- **Package Manager**: pnpm 10.0.0
- **Multi-stage build** for optimized production image
- **Port**: 3001

### Development Image (`Dockerfile.dev`)

- **Base**: Node.js 22 Alpine
- **Package Manager**: pnpm 10.0.0
- **Hot reloading** enabled
- **Volume mounting** for live code changes
- **Port**: 3001

## Docker Compose Services

### Production (`docker-compose.yml`)

- **pokt-portal**: Main application service
- **Health checks** enabled
- **Restart policy**: unless-stopped
- **Volume mounting** for public assets

### Development (`docker-compose.dev.yml`)

- **pokt-portal-dev**: Development application service
- **Volume mounting** for live code changes
- **Hot reloading** enabled
- **Development dependencies** included

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using port 3001
   lsof -i :3001
   
   # Kill the process or change the port in docker-compose.yml
   ```

2. **Permission issues**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

3. **Container won't start**
   ```bash
   # Check logs
   docker-compose logs pokt-portal
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

4. **Environment variables not loading**
   ```bash
   # Check if .env file exists
   ls -la .env
   
   # Restart containers
   docker-compose down && docker-compose up --build
   ```

### Debugging

```bash
# View container logs
docker-compose logs -f pokt-portal

# Access container shell
docker-compose exec pokt-portal sh

# Check container status
docker-compose ps

# View resource usage
docker stats
```

## Performance Optimization

### Production Build

```bash
# Build optimized production image
docker-compose build --no-cache

# Run with resource limits
docker-compose up -d --scale pokt-portal=2
```

### Development Performance

```bash
# Use volume mounting for faster builds
docker-compose -f docker-compose.dev.yml up --build

# Enable Docker BuildKit for faster builds
export DOCKER_BUILDKIT=1
```

## Security Considerations

1. **Never commit `.env` files** - they contain sensitive information
2. **Use secrets management** in production environments
3. **Regular security updates** - keep base images updated
4. **Network isolation** - use Docker networks for service communication
5. **Resource limits** - set memory and CPU limits in production

## Production Deployment

For production deployment, consider:

1. **Reverse proxy** (nginx/traefik) for SSL termination
2. **Load balancer** for high availability
3. **Monitoring** (Prometheus/Grafana)
4. **Logging** (ELK stack)
5. **Backup strategies** for persistent data
6. **CI/CD pipeline** for automated deployments

## Support

For issues related to Docker setup:

1. Check the troubleshooting section above
2. Review container logs: `docker-compose logs`
3. Verify environment variables are correctly set
4. Ensure Docker and Docker Compose versions are compatible
5. Check system resources (memory, disk space) 