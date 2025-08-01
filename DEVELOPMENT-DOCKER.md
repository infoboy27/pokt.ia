# POKT.ai Portal - Development Docker Setup

This guide explains how to run the POKT.ai Portal in development mode using Docker, **without Auth0 authentication requirements**.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Git (to clone the repository)

### 1. Clone the Repository
```bash
git clone https://github.com/infoboy27/pokt.ia.git
cd pokt.ia
```

### 2. Start Development Environment
```bash
# Start all services (postgres, hasura, redis, portal)
docker-compose -f docker-compose-dev.yml up --build

# Or run in detached mode
docker-compose -f docker-compose-dev.yml up -d --build
```

### 3. Access the Portal
- **Portal**: http://localhost:3001
- **Hasura Console**: http://localhost:8080
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 🔧 Development Features

### ✅ No Auth0 Required
The development setup uses mock authentication instead of Auth0:
- Visit: http://localhost:3001/dev-login
- Use any email and password to login
- No external authentication service needed

### ✅ Full Database Support
- PostgreSQL database with sample data
- Hasura GraphQL API for data access
- Redis for caching and sessions

### ✅ Mock Services
All external services are mocked:
- Stripe payments disabled
- Novu notifications disabled
- Email services disabled
- Analytics disabled

### ✅ Hot Reload
The development container includes:
- Volume mounting for live code changes
- Hot reload with `pnpm dev`
- Source code changes reflect immediately

## 📁 File Structure

```
docker-compose-dev.yml    # Development docker configuration
Dockerfile.dev           # Development dockerfile
DEVELOPMENT-DOCKER.md    # This file
```

## 🔄 Development Workflow

### Starting Services
```bash
# Start all services
docker-compose -f docker-compose-dev.yml up

# Start specific service
docker-compose -f docker-compose-dev.yml up postgres hasura

# View logs
docker-compose -f docker-compose-dev.yml logs -f pokt-portal-dev
```

### Stopping Services
```bash
# Stop all services
docker-compose -f docker-compose-dev.yml down

# Stop and remove volumes
docker-compose -f docker-compose-dev.yml down -v
```

### Rebuilding
```bash
# Rebuild after code changes
docker-compose -f docker-compose-dev.yml up --build

# Rebuild specific service
docker-compose -f docker-compose-dev.yml up --build pokt-portal-dev
```

## 🗄️ Database Management

### Access PostgreSQL
```bash
# Connect to database
docker exec -it pokt-postgres-dev psql -U pokt_user -d pokt_portal

# View database logs
docker-compose -f docker-compose-dev.yml logs postgres
```

### Access Hasura Console
- URL: http://localhost:8080
- Admin Secret: `pokt_admin_secret`

### Database Credentials
- **Database**: `pokt_portal`
- **User**: `pokt_user`
- **Password**: `pokt_password`
- **Port**: `5432`

## 🔐 Authentication

### Development Login
The portal automatically redirects to development login in development mode:
1. Visit: http://localhost:3001
2. You'll be redirected to: http://localhost:3001/dev-login
3. Use any email/password combination
4. Access the development dashboard

### Mock User Session
The development mode creates a mock user session with:
- User ID: `dev-user-123`
- Email: `dev@pokt.ai`
- Portal User ID: `dev-portal-user-123`

## 🛠️ Troubleshooting

### Port Conflicts
If you get port conflicts, modify the ports in `docker-compose-dev.yml`:
```yaml
ports:
  - "3002:3000"  # Change 3001 to 3002
```

### Database Issues
```bash
# Reset database
docker-compose -f docker-compose-dev.yml down -v
docker-compose -f docker-compose-dev.yml up --build
```

### Build Issues
```bash
# Clean build
docker-compose -f docker-compose-dev.yml build --no-cache
docker-compose -f docker-compose-dev.yml up
```

### Memory Issues
If you encounter memory issues, increase Docker memory allocation:
- Docker Desktop: Settings → Resources → Memory (increase to 4GB+)

## 🔧 Environment Variables

The development setup uses these key environment variables:

```bash
# Development Mode
NODE_ENV=development

# Disabled Auth0 (uses mock values)
AUTH0_CLIENT_ID=dev_auth0_client_id
AUTH0_CLIENT_SECRET=dev_auth0_client_secret
AUTH0_DOMAIN=dev.auth0.com

# Database
DATABASE_URL=postgres://pokt_user:pokt_password@postgres:5432/pokt_portal
HASURA_GRAPHQL_ENDPOINT=http://localhost:8080/v1/graphql

# Disabled Features
FLAG_STRIPE_PAYMENT=false
FLAG_ENTERPRISE=false
```

## 🚀 Production vs Development

| Feature | Development | Production |
|---------|-------------|------------|
| Auth0 | ❌ Disabled | ✅ Required |
| Database | ✅ Local PostgreSQL | ✅ External |
| Payments | ❌ Mocked | ✅ Stripe |
| Notifications | ❌ Mocked | ✅ Novu |
| Analytics | ❌ Disabled | ✅ Enabled |
| Hot Reload | ✅ Enabled | ❌ Disabled |

## 📝 Notes

- This setup is designed for **development and testing only**
- **Do not use in production** - it has disabled security features
- All external services are mocked to avoid dependencies
- The development login bypasses all authentication requirements
- Database data persists between container restarts

## 🤝 Contributing

When contributing to the development setup:
1. Test your changes with `docker-compose -f docker-compose-dev.yml up --build`
2. Ensure the development login still works
3. Update this README if you add new features
4. Keep the mock services disabled for external dependencies

## 📞 Support

If you encounter issues:
1. Check the logs: `docker-compose -f docker-compose-dev.yml logs`
2. Verify all services are healthy: `docker-compose -f docker-compose-dev.yml ps`
3. Try rebuilding: `docker-compose -f docker-compose-dev.yml up --build`
4. Check the [main DEVELOPMENT.md](DEVELOPMENT.md) for additional troubleshooting 