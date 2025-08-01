# POKT.ai Portal - Development Setup Guide

## 🚀 **Quick Start (Local Development)**

### **Prerequisites**
- Node.js 18+ 
- pnpm
- Docker (for database services)

### **1. Install Dependencies**
```bash
pnpm install
```

### **2. Environment Setup**
Create a `.env.local` file with the following content:

```env
# Local Development Environment for POKT.ai Portal
NODE_ENV=development
PORT=3001
SESSION_SECRET=dev_session_secret_for_local_development_only_123456789

# Database Configuration (when Docker is available)
DATABASE_URL=postgres://pokt_user:pokt_password@localhost:5432/pokt_portal
HASURA_GRAPHQL_ENDPOINT=http://localhost:8080/v1/graphql
HASURA_GRAPHQL_ADMIN_SECRET=pokt_admin_secret

# Redis Configuration (when Docker is available)
KV_REST_API_URL=redis://localhost:6379
KV_REST_API_TOKEN=redis_token
KV_REST_API_READ_ONLY_TOKEN=redis_readonly_token

# Auth0 Configuration (for production)
AUTH0_CLIENT_ID=your_auth0_client_id_here
AUTH0_CLIENT_SECRET=your_auth0_client_secret_here
AUTH0_DOMAIN=your_auth0_domain_here
AUTH0_AUDIENCE=your_auth0_audience_here
AUTH0_BASE_URL=http://localhost:3001
AUTH0_SCOPE=openid profile email
AUTH0_CONNECTION=Username-Password-Authentication
AUTH0_SECRET=dev_auth0_secret_for_development_only
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com

# API Configuration
PORTAL_API_URL=http://localhost:8080/v1/graphql
RELAY_METER_API_URL=http://localhost:3001/mock-meter

# Feature Flags
FLAG_ENTERPRISE=false
FLAG_INFLUX_RELAY_ERROR=false
FLAG_LEGACY_MESSAGING=false
FLAG_MAINTENANCE_MODE_DASHBOARD=false
FLAG_MULTI_LANGUAGE=false
FLAG_ANNOUNCEMENT_ALERT=false
FLAG_MAINTENANCE_MODE=false
FLAG_STRIPE_PAYMENT=false

# Analytics and Monitoring
GOOGLE_ANALYTICS_ID=dev_analytics_id
SENTRY_DSN=your_sentry_dsn_here

# Notifications
NOVU_APP_IDENTIFIER=dev_novu_app_identifier
NOVU_API_KEY=dev_novu_api_key
NOVU_APP_ID=dev_novu_app_id

# Stripe Configuration (for production)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_PRICE_ID=prod_SmUxO9BbmmrCOL

# Admin Configuration
ADMIN_EMAIL=admin@pokt.ai
ADMIN_PASSWORD=your_admin_password_here
ADMIN_KEY=your_admin_key_here

# External Services
UPSTASH_REDIS_REST_URL=your_upstash_redis_url_here
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token_here
MAILJET_API_KEY=your_mailjet_api_key_here
MAILJET_API_SECRET=your_mailjet_api_secret_here

# Development Settings
VERCEL_ENV=development
DOCS_STATUS=dev_docs_status
GODMODE_ACCOUNTS=dev_godmode_accounts
ANNOUNCEMENT_ALERT_TITLE=dev_announcement_title
ANNOUNCEMENT_ALERT_BODY=dev_announcement_body
```

### **3. Development Modes**

#### **Mode A: Mock Data (No Database)**
```bash
# Run with mock data only
pnpm dev
```
- Uses mock data from `app/models/portal/portal.data.ts`
- No database required
- Access via: http://localhost:3001/dev-login

#### **Mode B: Full Database (With Docker)**
```bash
# Start database services
docker compose up -d postgres hasura redis

# Run application
pnpm dev
```
- Uses real PostgreSQL database
- Hasura GraphQL API available at http://localhost:8080
- Redis for caching
- Access via: http://localhost:3001

### **4. Database Setup**

#### **Install Docker**
**macOS:**
```bash
brew install --cask docker
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

#### **Start Database Services**
```bash
# Start all services
docker compose up -d

# Or start individual services
docker compose up -d postgres
docker compose up -d hasura
docker compose up -d redis
```

#### **Database Access**
- **PostgreSQL**: `localhost:5432`
  - Database: `pokt_portal`
  - User: `pokt_user`
  - Password: `pokt_password`

- **Hasura Console**: http://localhost:8080
  - Admin Secret: `pokt_admin_secret`

- **Redis**: `localhost:6379`

### **5. Development Features**

#### **Mock Authentication**
- Visit: http://localhost:3001/dev-login
- Use any email/password to login
- Redirects to development dashboard

#### **GraphQL API**
- Endpoint: http://localhost:8080/v1/graphql
- Console: http://localhost:8080
- Auto-generated types from schema

#### **Database Schema**
The database includes tables for:
- Users and authentication
- Accounts and memberships
- Portal applications
- Blockchain networks
- Relay statistics and logs
- Notifications and subscriptions
- API keys and whitelists

### **6. Production Deployment**

For production deployment with real data:

1. **Install Docker** on your production server
2. **Configure environment variables** with real values
3. **Set up external database** (optional)
4. **Configure Auth0** with real credentials
5. **Set up Stripe** for payments
6. **Configure monitoring** (Sentry, analytics)

### **7. Troubleshooting**

#### **Build Errors**
```bash
# Clear cache and rebuild
rm -rf node_modules/.cache
pnpm install
pnpm dev
```

#### **Database Connection Issues**
```bash
# Check if services are running
docker compose ps

# View logs
docker compose logs postgres
docker compose logs hasura
```

#### **Port Conflicts**
- Change ports in `docker-compose.yml` if needed
- Update environment variables accordingly

### **8. Development Workflow**

1. **Start database services**: `docker compose up -d`
2. **Run application**: `pnpm dev`
3. **Access development**: http://localhost:3001/dev-login
4. **View GraphQL console**: http://localhost:8080
5. **Make changes** and see hot reload
6. **Test with real data** in database

### **9. Database Schema**

The application uses a comprehensive database schema with:
- **Users**: Authentication and profiles
- **Accounts**: Organizations and teams
- **Portal Apps**: Applications and configurations
- **Blockchains**: Network configurations
- **Relay Stats**: Usage analytics
- **Notifications**: User notifications
- **Subscriptions**: Payment management

All tables are automatically created by the `database/init.sql` script when PostgreSQL starts. 