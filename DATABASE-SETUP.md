# Database Setup Guide

## Overview

The POKT.ai Portal uses PostgreSQL with Hasura GraphQL engine. The database is automatically populated with tables and sample data when the containers start.

## 🚀 Quick Start

### 1. Start the Development Environment

```bash
# Start all services including database
docker compose -f docker-compose-dev.yml up -d

# Check if services are running
docker ps
```

### 2. Verify Database Initialization

```bash
# Check PostgreSQL logs
docker logs pokt-postgres

# Check Hasura logs
docker logs pokt-hasura

# Test database connection
docker exec pokt-postgres psql -U pokt_user -d pokt_portal -c "\dt"
```

## 📊 Database Schema

The database includes the following tables:

### Core Tables
- **`users`** - User accounts and profiles
- **`accounts`** - Organization/team accounts
- **`account_users`** - Many-to-many relationship between users and accounts
- **`portal_apps`** - Applications created by users
- **`blockchains`** - Supported blockchain networks
- **`app_blockchains`** - Apps' blockchain preferences

### Feature Tables
- **`aats`** - Application Authentication Tokens
- **`whitelists`** - App security configurations
- **`relay_stats`** - Usage statistics
- **`relay_logs`** - Request logs
- **`notifications`** - User notifications
- **`stripe_subscriptions`** - Payment subscriptions
- **`api_keys`** - API key management

## 🔧 Manual Database Setup

If you need to manually set up the database:

### 1. Connect to PostgreSQL

```bash
# Connect to the database container
docker exec -it pokt-postgres psql -U pokt_user -d pokt_portal
```

### 2. Run Initialization Script

```bash
# The init.sql script is automatically run on container start
# To manually run it:
docker exec -i pokt-postgres psql -U pokt_user -d pokt_portal < database/init.sql
```

### 3. Verify Sample Data

```sql
-- Check users
SELECT * FROM users;

-- Check accounts
SELECT * FROM accounts;

-- Check blockchains
SELECT * FROM blockchains;

-- Check portal apps
SELECT * FROM portal_apps;
```

## 🎯 Sample Data

The initialization script creates:

### Users
- `admin@pokt.ai` - Admin User
- `dev@pokt.ai` - Developer User  
- `test@pokt.ai` - Test User

### Accounts
- `POKT.ai Development` - Development account (unlimited plan)
- `POKT.ai Production` - Production account (paid plan)

### Blockchains
- Ethereum (Mainnet)
- Polygon (Mainnet)
- Arbitrum (Mainnet)
- Optimism (Mainnet)
- Base (Mainnet)

### Sample App
- One sample application linked to the development account

## 🔍 Hasura GraphQL

### Access Hasura Console

```bash
# Hasura console is available at:
http://51.195.63.173:8080

# Or if running locally:
http://localhost:8080
```

### GraphQL Endpoint

```bash
# GraphQL endpoint
http://51.195.63.173:8080/v1/graphql

# Or locally:
http://localhost:8080/v1/graphql
```

### Test GraphQL Queries

```graphql
# Query all users
query {
  users {
    id
    email
    name
    created_at
  }
}

# Query all accounts
query {
  accounts {
    id
    name
    plan_type
    relay_limit
    app_limit
  }
}

# Query all blockchains
query {
  blockchains {
    id
    name
    chain_id
    is_testnet
  }
}
```

## 🛠️ Database Management

### Reset Database

```bash
# Stop services
docker compose -f docker-compose-dev.yml down

# Remove volumes (this will delete all data)
docker volume rm grove-portal_postgres_data_dev

# Start fresh
docker compose -f docker-compose-dev.yml up -d
```

### Backup Database

```bash
# Create backup
docker exec pokt-postgres pg_dump -U pokt_user pokt_portal > backup.sql

# Restore from backup
docker exec -i pokt-postgres psql -U pokt_user pokt_portal < backup.sql
```

### Add Custom Data

```bash
# Connect to database
docker exec -it pokt-postgres psql -U pokt_user -d pokt_portal

# Add custom user
INSERT INTO users (email, name, portal_user_id) 
VALUES ('custom@example.com', 'Custom User', 'custom-user-123');

# Add custom account
INSERT INTO accounts (name, description, plan_type) 
VALUES ('My Account', 'Custom account', 'free');
```

## 🔐 Environment Variables

The database connection uses these environment variables:

```bash
# PostgreSQL
POSTGRES_DB=pokt_portal
POSTGRES_USER=pokt_user
POSTGRES_PASSWORD=pokt_password

# Hasura
HASURA_GRAPHQL_DATABASE_URL=postgres://pokt_user:pokt_password@postgres:5432/pokt_portal
HASURA_GRAPHQL_ADMIN_SECRET=pokt_admin_secret
```

## 🚨 Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check PostgreSQL logs
docker logs pokt-postgres

# Test connection
docker exec pokt-postgres pg_isready -U pokt_user -d pokt_portal
```

### Hasura Issues

```bash
# Check Hasura logs
docker logs pokt-hasura

# Check Hasura health
curl http://51.195.63.173:8080/healthz

# Restart Hasura
docker restart pokt-hasura
```

### Permission Issues

```bash
# Check database permissions
docker exec pokt-postgres psql -U pokt_user -d pokt_portal -c "\du"

# Grant permissions if needed
docker exec pokt-postgres psql -U pokt_user -d pokt_portal -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO pokt_user;"
```

## 📈 Monitoring

### Check Database Size

```bash
# Database size
docker exec pokt-postgres psql -U pokt_user -d pokt_portal -c "SELECT pg_size_pretty(pg_database_size('pokt_portal'));"

# Table sizes
docker exec pokt-postgres psql -U pokt_user -d pokt_portal -c "SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size FROM pg_tables WHERE schemaname = 'public' ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;"
```

### Check Active Connections

```bash
# Active connections
docker exec pokt-postgres psql -U pokt_user -d pokt_portal -c "SELECT count(*) FROM pg_stat_activity WHERE datname = 'pokt_portal';"
```

## ✅ Verification Checklist

- [ ] PostgreSQL container is running
- [ ] Hasura container is running
- [ ] Database tables are created
- [ ] Sample data is loaded
- [ ] Hasura console is accessible
- [ ] GraphQL queries work
- [ ] Development app can connect to database

## 🎉 Success!

Once the database is properly set up, you should be able to:

1. **Access the development portal** at `https://pokt.ai/dev-login`
2. **Log in with any email/password**
3. **See sample data** in the dashboard
4. **Use GraphQL queries** through Hasura
5. **Manage data** through the Hasura console 