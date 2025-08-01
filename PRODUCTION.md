# POKT.ai Portal - Production Deployment Guide

## 🚀 **Ubuntu Server Production Deployment**

This guide will help you deploy the POKT.ai Portal to an Ubuntu server with full database integration.

## 📋 **Prerequisites**

### **Server Requirements:**
- Ubuntu 20.04 LTS or later
- Minimum 2GB RAM (4GB recommended)
- 20GB+ disk space
- Root or sudo access

### **Domain Setup:**
- Domain name pointing to your server
- SSL certificate (Let's Encrypt recommended)

## 🔧 **Step 1: Server Setup**

### **1.1 Update System**
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release
```

### **1.2 Install Docker & Docker Compose**
```bash
# Install Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
docker compose version
```

### **1.3 Install Node.js 22.x**
```bash
# Install Node.js 22.x
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
npm install -g pnpm

# Verify installation
node --version
pnpm --version
```

### **1.4 Install Nginx (Optional for reverse proxy)**
```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

## 📦 **Step 2: Application Deployment**

### **2.1 Clone Repository**
```bash
# Create application directory
sudo mkdir -p /opt/pokt-portal
sudo chown $USER:$USER /opt/pokt-portal
cd /opt/pokt-portal

# Clone your repository
git clone https://github.com/infoboy27/pokt.ia.git .
```

### **2.2 Environment Configuration**
```bash
# Create production environment file
cat > .env.production << 'EOF'
# Production Environment Variables
NODE_ENV=production
PORT=3001
SESSION_SECRET=your_very_secure_session_secret_here_make_it_long_and_random

# Database Configuration
DATABASE_URL=postgres://pokt_user:pokt_password@postgres:5432/pokt_portal
HASURA_GRAPHQL_ENDPOINT=http://localhost:8080/v1/graphql
HASURA_GRAPHQL_ADMIN_SECRET=pokt_admin_secret

# Redis Configuration
KV_REST_API_URL=redis://redis:6379
KV_REST_API_TOKEN=redis_token
KV_REST_API_READ_ONLY_TOKEN=redis_readonly_token

# Auth0 Configuration (Replace with your real values)
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_AUDIENCE=your_auth0_audience
AUTH0_BASE_URL=https://your-domain.com
AUTH0_SCOPE=openid profile email
AUTH0_CONNECTION=Username-Password-Authentication
AUTH0_SECRET=your_auth0_secret
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com

# API Configuration
PORTAL_API_URL=http://localhost:8080/v1/graphql
RELAY_METER_API_URL=https://your-domain.com/mock-meter

# Feature Flags
FLAG_ENTERPRISE=false
FLAG_INFLUX_RELAY_ERROR=false
FLAG_LEGACY_MESSAGING=false
FLAG_MAINTENANCE_MODE_DASHBOARD=false
FLAG_MULTI_LANGUAGE=false
FLAG_ANNOUNCEMENT_ALERT=false
FLAG_MAINTENANCE_MODE=false
FLAG_STRIPE_PAYMENT=true

# Analytics and Monitoring
GOOGLE_ANALYTICS_ID=your_google_analytics_id
SENTRY_DSN=your_sentry_dsn

# Notifications
NOVU_APP_IDENTIFIER=your_novu_app_identifier
NOVU_API_KEY=your_novu_api_key
NOVU_APP_ID=your_novu_app_id

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_PRICE_ID=prod_your_stripe_price_id

# Admin Configuration
ADMIN_EMAIL=admin@your-domain.com
ADMIN_PASSWORD=your_secure_admin_password
ADMIN_KEY=your_admin_key

# External Services
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
MAILJET_API_KEY=your_mailjet_api_key
MAILJET_API_SECRET=your_mailjet_api_secret

# Production Settings
VERCEL_ENV=production
DOCS_STATUS=live
GODMODE_ACCOUNTS=your_godmode_accounts
ANNOUNCEMENT_ALERT_TITLE=your_announcement_title
ANNOUNCEMENT_ALERT_BODY=your_announcement_body
EOF
```

### **2.3 Update Docker Compose for Production**
```bash
# Create production docker-compose file
cat > docker-compose.prod.yml << 'EOF'
version: "3.9"

services:
  postgres:
    image: postgres:15-alpine
    container_name: pokt-postgres-prod
    restart: unless-stopped
    environment:
      POSTGRES_DB: pokt_portal
      POSTGRES_USER: pokt_user
      POSTGRES_PASSWORD: pokt_password
    ports:
      - "127.0.0.1:5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U pokt_user -d pokt_portal"]
      interval: 10s
      timeout: 5s
      retries: 5

  hasura:
    image: hasura/graphql-engine:v2.33.4
    container_name: pokt-hasura-prod
    restart: unless-stopped
    ports:
      - "127.0.0.1:8080:8080"
    environment:
      HASURA_GRAPHQL_DATABASE_URL: postgres://pokt_user:pokt_password@postgres:5432/pokt_portal
      HASURA_GRAPHQL_ENABLE_CONSOLE: "false"
      HASURA_GRAPHQL_DEV_MODE: "false"
      HASURA_GRAPHQL_ENABLED_LOG_TYPES: startup, http-log, webhook-log, websocket-log, query-log
      HASURA_GRAPHQL_ADMIN_SECRET: pokt_admin_secret
      HASURA_GRAPHQL_JWT_SECRET: '{"type":"HS256", "key":"your_jwt_secret_key_for_production"}'
      HASURA_GRAPHQL_UNAUTHORIZED_ROLE: anonymous
      HASURA_GRAPHQL_ENABLE_TELEMETRY: "false"
    depends_on:
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/healthz"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:7-alpine
    container_name: pokt-redis-prod
    restart: unless-stopped
    ports:
      - "127.0.0.1:6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  pokt-portal:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: pokt-portal-prod
    restart: unless-stopped
    ports:
      - "127.0.0.1:3001:3000"
    env_file:
      - .env.production
    volumes:
      - ./public:/app/public
    depends_on:
      postgres:
        condition: service_healthy
      hasura:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
EOF
```

## 🌐 **Step 3: Nginx Configuration (Optional)**

### **3.1 Create Nginx Configuration**
```bash
sudo tee /etc/nginx/sites-available/pokt-portal << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Configuration (replace with your certificate paths)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Proxy to application
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Hasura GraphQL endpoint
    location /graphql {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable the site
sudo ln -s /etc/nginx/sites-available/pokt-portal /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### **3.2 Install SSL Certificate (Let's Encrypt)**
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Set up auto-renewal
sudo crontab -e
# Add this line:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🚀 **Step 4: Deploy Application**

### **4.1 Build and Start Services**
```bash
cd /opt/pokt-portal

# Build the application
docker compose -f docker-compose.prod.yml build --no-cache

# Start all services
docker compose -f docker-compose.prod.yml up -d

# Check status
docker compose -f docker-compose.prod.yml ps
```

### **4.2 Verify Deployment**
```bash
# Check application logs
docker compose -f docker-compose.prod.yml logs pokt-portal

# Check database
docker compose -f docker-compose.prod.yml logs postgres

# Check Hasura
docker compose -f docker-compose.prod.yml logs hasura

# Test application
curl -I http://localhost:3001
```

## 🔧 **Step 5: Production Configuration**

### **5.1 Set Up Monitoring**
```bash
# Install monitoring tools
sudo apt install -y htop iotop nethogs

# Set up log rotation
sudo tee /etc/logrotate.d/pokt-portal << 'EOF'
/opt/pokt-portal/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 root root
}
EOF
```

### **5.2 Create Systemd Service (Alternative to Docker)**
```bash
sudo tee /etc/systemd/system/pokt-portal.service << 'EOF'
[Unit]
Description=POKT.ai Portal
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/pokt-portal
Environment=NODE_ENV=production
ExecStart=/usr/bin/pnpm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
sudo systemctl enable pokt-portal
sudo systemctl start pokt-portal
```

## 📊 **Step 6: Database Management**

### **6.1 Database Backup Script**
```bash
# Create backup script
cat > /opt/pokt-portal/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/pokt-portal/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="pokt_portal_$DATE.sql"

mkdir -p $BACKUP_DIR

# Backup PostgreSQL
docker compose -f docker-compose.prod.yml exec -T postgres pg_dump -U pokt_user pokt_portal > $BACKUP_DIR/$BACKUP_FILE

# Compress backup
gzip $BACKUP_DIR/$BACKUP_FILE

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/$BACKUP_FILE.gz"
EOF

chmod +x /opt/pokt-portal/backup.sh

# Add to crontab for daily backups
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/pokt-portal/backup.sh") | crontab -
```

### **6.2 Database Restore**
```bash
# Restore from backup
docker compose -f docker-compose.prod.yml exec -T postgres psql -U pokt_user pokt_portal < backup_file.sql
```

## 🔒 **Step 7: Security Hardening**

### **7.1 Firewall Configuration**
```bash
# Install UFW
sudo apt install -y ufw

# Configure firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### **7.2 Fail2ban Setup**
```bash
# Install fail2ban
sudo apt install -y fail2ban

# Configure fail2ban
sudo tee /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 3
EOF

sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## 📈 **Step 8: Monitoring & Maintenance**

### **8.1 Health Check Script**
```bash
cat > /opt/pokt-portal/health-check.sh << 'EOF'
#!/bin/bash

# Check if application is responding
if ! curl -f http://localhost:3001 > /dev/null 2>&1; then
    echo "Application is down, restarting..."
    docker compose -f docker-compose.prod.yml restart pokt-portal
fi

# Check database
if ! docker compose -f docker-compose.prod.yml exec -T postgres pg_isready -U pokt_user > /dev/null 2>&1; then
    echo "Database is down, restarting..."
    docker compose -f docker-compose.prod.yml restart postgres
fi

# Check Hasura
if ! curl -f http://localhost:8080/healthz > /dev/null 2>&1; then
    echo "Hasura is down, restarting..."
    docker compose -f docker-compose.prod.yml restart hasura
fi
EOF

chmod +x /opt/pokt-portal/health-check.sh

# Add to crontab
(crontab -l 2>/dev/null; echo "*/5 * * * * /opt/pokt-portal/health-check.sh") | crontab -
```

### **8.2 Log Monitoring**
```bash
# Install log monitoring
sudo apt install -y logwatch

# Configure logwatch
sudo tee /etc/logwatch/conf/logwatch.conf << 'EOF'
LogDir = /var/log
TmpDir = /tmp
MailFrom = logwatch@your-domain.com
MailTo = admin@your-domain.com
Range = yesterday
Detail = Low
Service = All
EOF
```

## 🚀 **Step 9: Deployment Commands**

### **Quick Deployment Commands:**
```bash
# Deploy application
cd /opt/pokt-portal
git pull origin main
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d

# Check status
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f

# Update application
git pull origin main
docker compose -f docker-compose.prod.yml restart pokt-portal

# Backup database
./backup.sh

# Monitor resources
htop
docker stats
```

## 📋 **Production Checklist**

- ✅ **Server Setup**: Ubuntu 20.04+ with Docker
- ✅ **Environment Variables**: All production values configured
- ✅ **Database**: PostgreSQL with Hasura GraphQL
- ✅ **Caching**: Redis configured
- ✅ **SSL Certificate**: Let's Encrypt installed
- ✅ **Firewall**: UFW configured
- ✅ **Monitoring**: Health checks and backups
- ✅ **Security**: Fail2ban and security headers
- ✅ **Logging**: Log rotation and monitoring

## 🆘 **Troubleshooting**

### **Common Issues:**

1. **Application won't start:**
   ```bash
   docker compose -f docker-compose.prod.yml logs pokt-portal
   ```

2. **Database connection issues:**
   ```bash
   docker compose -f docker-compose.prod.yml logs postgres
   ```

3. **SSL certificate issues:**
   ```bash
   sudo certbot renew --dry-run
   ```

4. **Memory issues:**
   ```bash
   docker system prune -a
   ```

Your POKT.ai Portal is now ready for production deployment! 🚀 