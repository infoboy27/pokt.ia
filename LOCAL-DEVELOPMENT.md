# Local Development Setup on Mac

## 🚀 Quick Start

### 1. Prerequisites

Make sure you have these installed on your Mac:
- Docker Desktop
- Git
- VS Code (recommended)

### 2. Clone and Setup

```bash
# You're already in the project directory
# Make sure you're on the latest version
git pull origin main

# Check if Docker is running
docker --version
docker compose version
```

### 3. Start Local Development Environment

```bash
# Start all services locally
docker compose -f docker-compose-dev.yml up -d

# Check if services are running
docker ps
```

## 🔧 Local Development Workflow

### **Development Cycle:**

1. **Make changes** to code locally
2. **Test changes** with local Docker setup
3. **Commit and push** to GitHub
4. **Deploy** to server (optional)

### **Local URLs:**

- **Development Portal:** `http://localhost:3001/dev-login`
- **Hasura Console:** `http://localhost:8080`
- **GraphQL Endpoint:** `http://localhost:8080/v1/graphql`
- **PostgreSQL:** `localhost:5432`

## 🛠️ Local Development Commands

### **Start Development Environment:**
```bash
# Start all services
docker compose -f docker-compose-dev.yml up -d

# Start with logs
docker compose -f docker-compose-dev.yml up

# Rebuild and start
docker compose -f docker-compose-dev.yml up --build -d
```

### **Stop Development Environment:**
```bash
# Stop all services
docker compose -f docker-compose-dev.yml down

# Stop and remove volumes (fresh start)
docker compose -f docker-compose-dev.yml down -v
```

### **View Logs:**
```bash
# All services
docker compose -f docker-compose-dev.yml logs

# Specific service
docker compose -f docker-compose-dev.yml logs pokt-portal
docker compose -f docker-compose-dev.yml logs postgres
docker compose -f docker-compose-dev.yml logs hasura
```

### **Database Operations:**
```bash
# Connect to PostgreSQL
docker exec -it pokt-postgres psql -U pokt_user -d pokt_portal

# Check tables
docker exec pokt-postgres psql -U pokt_user -d pokt_portal -c "\dt"

# Check sample data
docker exec pokt-postgres psql -U pokt_user -d pokt_portal -c "SELECT * FROM users;"

# Reset database
docker compose -f docker-compose-dev.yml down -v
docker compose -f docker-compose-dev.yml up -d
```

## 🧪 Testing Workflow

### **1. Code Changes**
```bash
# Make changes to your code
# The app will auto-reload thanks to volume mounting
```

### **2. Test Database**
```bash
# Check if database is working
curl http://localhost:8080/healthz

# Test GraphQL
curl -H "Content-Type: application/json" \
  -d '{"query": "query { users { id email name } }"}' \
  http://localhost:8080/v1/graphql
```

### **3. Test Development Login**
```bash
# Open in browser
open http://localhost:3001/dev-login

# Or test with curl
curl -X POST http://localhost:3001/api/dev-login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=test@example.com&password=test123"
```

## 🔄 Git Workflow

### **Before Making Changes:**
```bash
# Ensure you're on main branch
git checkout main

# Pull latest changes
git pull origin main

# Create feature branch (optional)
git checkout -b feature/your-feature-name
```

### **After Making Changes:**
```bash
# Check what changed
git status

# Add changes
git add .

# Commit changes
git commit -m "feat: your change description"

# Push to GitHub
git push origin main
```

### **Deploy to Server (Optional):**
```bash
# SSH to your server
ssh ubuntu@51.195.63.173

# Pull latest changes
cd ~/pokt.ia
git pull origin main

# Rebuild and restart
docker compose -f docker-compose-dev.yml up --build -d
```

## 🎯 Development Tips

### **Hot Reloading:**
- The app code is mounted as a volume, so changes are reflected immediately
- Database changes require container restart
- Hasura changes require metadata reload

### **Debugging:**
```bash
# View real-time logs
docker compose -f docker-compose-dev.yml logs -f pokt-portal

# Access container shell
docker exec -it pokt-portal sh

# Check container health
docker ps
```

### **Database Debugging:**
```bash
# Connect to PostgreSQL
docker exec -it pokt-postgres psql -U pokt_user -d pokt_portal

# Check Hasura metadata
curl -H "X-Hasura-Admin-Secret: pokt_admin_secret" \
  http://localhost:8080/v1/metadata
```

## 🚨 Troubleshooting

### **Port Conflicts:**
```bash
# Check what's using port 3001
lsof -i :3001

# Kill process if needed
kill -9 [PID]
```

### **Docker Issues:**
```bash
# Restart Docker Desktop
# Then restart containers
docker compose -f docker-compose-dev.yml down
docker compose -f docker-compose-dev.yml up -d
```

### **Database Issues:**
```bash
# Reset database completely
docker compose -f docker-compose-dev.yml down -v
docker compose -f docker-compose-dev.yml up -d

# Manually run init script
docker cp database/init.sql pokt-postgres:/tmp/init.sql
docker exec pokt-postgres psql -U pokt_user -d pokt_portal -f /tmp/init.sql
```

### **Hasura Issues:**
```bash
# Restart Hasura
docker restart pokt-hasura

# Check Hasura logs
docker logs pokt-hasura
```

## ✅ Verification Checklist

After setting up locally, verify:

- [ ] `http://localhost:3001/dev-login` loads
- [ ] `http://localhost:8080` (Hasura console) loads
- [ ] Database tables exist (`\dt` in PostgreSQL)
- [ ] Sample data is loaded (users, accounts, blockchains)
- [ ] GraphQL queries work
- [ ] Development login works
- [ ] Code changes auto-reload

## 🎉 Success!

Once everything is working locally:

1. **Make your changes** to the code
2. **Test thoroughly** with local Docker setup
3. **Commit and push** to GitHub
4. **Deploy to server** when ready

This workflow will be much faster than testing on the server! 🚀 