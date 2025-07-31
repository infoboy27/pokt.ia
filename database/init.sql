-- POKT.ai Portal Database Schema
-- This script initializes the PostgreSQL database with all necessary tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    portal_user_id VARCHAR(255) UNIQUE,
    auth0_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted BOOLEAN DEFAULT FALSE
);

-- Accounts table
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    plan_type VARCHAR(50) DEFAULT 'free',
    relay_limit INTEGER DEFAULT 150000,
    app_limit INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted BOOLEAN DEFAULT FALSE
);

-- Account Users (many-to-many relationship)
CREATE TABLE account_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    accepted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(account_id, user_id)
);

-- Portal Apps table
CREATE TABLE portal_apps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    app_emoji VARCHAR(10),
    environment VARCHAR(50) DEFAULT 'production',
    secret_key VARCHAR(255),
    secret_key_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted BOOLEAN DEFAULT FALSE
);

-- Blockchains table
CREATE TABLE blockchains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    chain_id VARCHAR(255) UNIQUE NOT NULL,
    logo_url VARCHAR(500),
    rpc_url VARCHAR(500),
    explorer_url VARCHAR(500),
    is_testnet BOOLEAN DEFAULT FALSE,
    is_archival BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- App Blockchains (many-to-many relationship)
CREATE TABLE app_blockchains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_id UUID REFERENCES portal_apps(id) ON DELETE CASCADE,
    blockchain_id UUID REFERENCES blockchains(id) ON DELETE CASCADE,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(app_id, blockchain_id)
);

-- Whitelists table
CREATE TABLE whitelists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_id UUID REFERENCES portal_apps(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'origins', 'user_agents', 'blockchains', 'contracts', 'methods'
    value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AATs (Application Authentication Tokens)
CREATE TABLE aats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_id UUID REFERENCES portal_apps(id) ON DELETE CASCADE,
    protocol_app_id VARCHAR(255) UNIQUE NOT NULL,
    public_key VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    client_public_key VARCHAR(255),
    signature TEXT,
    version VARCHAR(50) DEFAULT '0.0.1',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Relay Stats table
CREATE TABLE relay_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_id UUID REFERENCES portal_apps(id) ON DELETE CASCADE,
    blockchain_id UUID REFERENCES blockchains(id) ON DELETE CASCADE,
    relay_count INTEGER DEFAULT 0,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(app_id, blockchain_id, date)
);

-- Relay Logs table
CREATE TABLE relay_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_id UUID REFERENCES portal_apps(id) ON DELETE CASCADE,
    blockchain_id UUID REFERENCES blockchains(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    method VARCHAR(255),
    params JSONB,
    response JSONB,
    status_code INTEGER,
    response_time INTEGER, -- in milliseconds
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    read BOOLEAN DEFAULT FALSE,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stripe Subscriptions table
CREATE TABLE stripe_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    stripe_subscription_id VARCHAR(255) UNIQUE NOT NULL,
    stripe_customer_id VARCHAR(255),
    plan_type VARCHAR(50),
    status VARCHAR(50),
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Keys table
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_id UUID REFERENCES portal_apps(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) UNIQUE NOT NULL,
    permissions JSONB,
    last_used TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_auth0_id ON users(auth0_id);
CREATE INDEX idx_accounts_name ON accounts(name);
CREATE INDEX idx_portal_apps_account_id ON portal_apps(account_id);
CREATE INDEX idx_portal_apps_name ON portal_apps(name);
CREATE INDEX idx_relay_stats_app_date ON relay_stats(app_id, date);
CREATE INDEX idx_relay_logs_app_created ON relay_logs(app_id, created_at);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);

-- Insert sample data
INSERT INTO users (id, email, name, portal_user_id) VALUES
    (uuid_generate_v4(), 'admin@pokt.ai', 'Admin User', 'admin-portal-user-123'),
    (uuid_generate_v4(), 'dev@pokt.ai', 'Developer User', 'dev-portal-user-456'),
    (uuid_generate_v4(), 'test@pokt.ai', 'Test User', 'test-portal-user-789');

INSERT INTO accounts (id, name, description, plan_type, relay_limit, app_limit) VALUES
    (uuid_generate_v4(), 'POKT.ai Development', 'Development account for testing', 'unlimited', 999999999, 10),
    (uuid_generate_v4(), 'POKT.ai Production', 'Production account', 'paid', 1000000, 5);

INSERT INTO blockchains (id, name, chain_id, logo_url, rpc_url, explorer_url, is_testnet) VALUES
    (uuid_generate_v4(), 'Ethereum', 'ethereum', '/chain-logos/ethereum.svg', 'https://eth-mainnet.pokt.network', 'https://etherscan.io', false),
    (uuid_generate_v4(), 'Polygon', 'polygon', '/chain-logos/polygon.svg', 'https://polygon-mainnet.pokt.network', 'https://polygonscan.com', false),
    (uuid_generate_v4(), 'Arbitrum', 'arbitrum', '/chain-logos/arbitrum.svg', 'https://arbitrum-mainnet.pokt.network', 'https://arbiscan.io', false),
    (uuid_generate_v4(), 'Optimism', 'optimism', '/chain-logos/optimism.svg', 'https://optimism-mainnet.pokt.network', 'https://optimistic.etherscan.io', false),
    (uuid_generate_v4(), 'Base', 'base', '/chain-logos/base.svg', 'https://base-mainnet.pokt.network', 'https://basescan.org', false);

-- Insert sample portal apps
INSERT INTO portal_apps (id, account_id, name, description, app_emoji, environment) 
SELECT 
    uuid_generate_v4(),
    a.id,
    'Sample App',
    'A sample application for testing',
    '🚀',
    'production'
FROM accounts a LIMIT 1; 