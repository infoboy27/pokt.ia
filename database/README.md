# POKT.ai Portal Database Setup

This directory contains the database setup for the POKT.ai portal with PostgreSQL and Hasura GraphQL Engine.

## 🗄️ Database Architecture

### Services
- **PostgreSQL 15**: Main database
- **Hasura GraphQL Engine**: GraphQL API layer
- **Redis**: Caching layer

### Tables
- `users`: User accounts and authentication
- `accounts`: Portal accounts/organizations
- `account_users`: Many-to-many relationship between users and accounts
- `portal_apps`: Applications within accounts
- `blockchains`: Supported blockchain networks
- `app_blockchains`: Many-to-many relationship between apps and blockchains
- `whitelists`: Security whitelists for apps
- `aats`: Application Authentication Tokens
- `relay_stats`: Relay usage statistics
- `relay_logs`: Detailed relay request logs
- `notifications`: User notifications
- `stripe_subscriptions`: Payment subscriptions
- `api_keys`: API key management

## 🚀 Quick Start

1. **Start the database services:**
   ```bash
   docker-compose up postgres hasura redis -d
   ```

2. **Access Hasura Console:**
   - Open: http://localhost:8080
   - Admin Secret: `pokt_admin_secret`

3. **Generate GraphQL Types:**
   ```bash
   pnpm generate:types
   ```

## 🔧 Configuration

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `HASURA_GRAPHQL_ENDPOINT`: Hasura GraphQL endpoint
- `HASURA_GRAPHQL_ADMIN_SECRET`: Hasura admin secret

### Database Credentials
- **Database**: `pokt_portal`
- **User**: `pokt_user`
- **Password**: `pokt_password`
- **Port**: `5432`

## 📊 Sample Data

The database is initialized with:
- Sample users (admin@pokt.ai, dev@pokt.ai, test@pokt.ai)
- Sample accounts (Development, Production)
- Popular blockchains (Ethereum, Polygon, Arbitrum, Optimism, Base)
- Sample portal app

## 🔍 GraphQL Queries

### Get Users
```graphql
query GetUsers {
  users {
    id
    email
    name
    portal_user_id
    created_at
  }
}
```

### Get Accounts with Apps
```graphql
query GetAccounts {
  accounts {
    id
    name
    description
    plan_type
    portal_apps {
      id
      name
      description
      app_emoji
    }
  }
}
```

### Get Blockchains
```graphql
query GetBlockchains {
  blockchains {
    id
    name
    chain_id
    logo_url
    rpc_url
    is_testnet
  }
}
```

## 🛠️ Development

### Adding New Tables
1. Add table definition to `init.sql`
2. Update `hasura-metadata.json`
3. Restart services: `docker-compose restart postgres hasura`

### Database Migrations
For production, consider using a migration tool like:
- Hasura CLI
- Prisma
- TypeORM

## 🔒 Security

- All sensitive data uses UUIDs
- Passwords are hashed (implement in application layer)
- API keys are hashed in database
- Row-level security can be configured in Hasura

## 📈 Performance

- Indexes on frequently queried columns
- Connection pooling configured
- Redis caching for session data
- Query optimization through Hasura 