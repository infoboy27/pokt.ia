# Traefik Setup for POKT.ai Development Environment

This guide explains how to set up Traefik as a load balancer for your POKT.ai development environment, allowing you to access it via `pokt.ai` instead of `51.195.63.173:3001`.

## 🚀 Quick Setup

### 1. Create Traefik Network
```bash
docker network create traefik-network
```

### 2. Create ACME File for SSL Certificates
```bash
touch acme.json
chmod 600 acme.json
```

### 3. Start Traefik
```bash
docker-compose -f traefik-dev.yml up -d
```

### 4. Start Development Environment
```bash
docker-compose -f docker-compose-dev.yml up -d --build
```

## 🔧 Configuration Details

### **Traefik Configuration (`traefik.yml`)**
- **Dashboard**: Available at `https://traefik.pokt.ai`
- **SSL**: Automatic Let's Encrypt certificates
- **HTTP to HTTPS**: Automatic redirect
- **Network**: Uses `traefik-network`

### **Development Environment (`docker-compose-dev.yml`)**
- **Portal**: `https://pokt.ai` → Development login
- **Hasura**: `https://hasura.pokt.ai` → GraphQL console
- **Database**: Internal access only

## 🌐 Access Points

### **Development Environment**
- **Main Portal**: `https://pokt.ai`
- **Development Login**: `https://pokt.ai/dev-login`
- **Hasura Console**: `https://hasura.pokt.ai`
- **Traefik Dashboard**: `https://traefik.pokt.ai`

### **Direct Access (if needed)**
- **Portal**: `http://51.195.63.173:3001`
- **Hasura**: `http://51.195.63.173:8080`

## 🔐 SSL Certificates

Traefik will automatically:
- ✅ Request Let's Encrypt certificates for `pokt.ai`
- ✅ Handle certificate renewal
- ✅ Redirect HTTP to HTTPS
- ✅ Provide secure connections

## 🛠️ Troubleshooting

### **Check Traefik Status**
```bash
# View Traefik logs
docker-compose -f traefik-dev.yml logs -f

# Check Traefik dashboard
curl -I https://traefik.pokt.ai
```

### **Check Development Environment**
```bash
# View portal logs
docker-compose -f docker-compose-dev.yml logs -f pokt-portal-dev

# Check if containers are running
docker-compose -f docker-compose-dev.yml ps
```

### **SSL Certificate Issues**
```bash
# Check certificate status
docker exec traefik-dev cat /acme.json

# Restart Traefik if needed
docker-compose -f traefik-dev.yml restart
```

## 🔄 Update DNS

Make sure your DNS points `pokt.ai` to your server IP:
```
pokt.ai.          A       51.195.63.173
*.pokt.ai.        A       51.195.63.173
```

## 📋 Environment Variables

The development environment uses these key settings:
```bash
# Development mode (no Auth0)
NODE_ENV=development
AUTH0_CLIENT_ID=dev_auth0_client_id
AUTH0_DOMAIN=dev.auth0.com

# Traefik integration
TRAEFIK_ENABLED=true
TRAEFIK_NETWORK=traefik-network
```

## 🚀 Production Considerations

For production deployment:
1. **Change email** in `traefik.yml` to your admin email
2. **Use production** docker-compose files
3. **Enable monitoring** and logging
4. **Set up backup** for ACME certificates
5. **Configure firewall** rules

## 📝 Notes

- ✅ **HTTPS**: All traffic is automatically secured
- ✅ **Development Login**: No Auth0 required
- ✅ **Hot Reload**: Code changes reflect immediately
- ✅ **Database**: PostgreSQL with sample data
- ✅ **GraphQL**: Hasura console available
- ✅ **Monitoring**: Traefik dashboard for traffic monitoring

## 🆘 Support

If you encounter issues:
1. Check Traefik logs: `docker-compose -f traefik-dev.yml logs`
2. Check portal logs: `docker-compose -f docker-compose-dev.yml logs`
3. Verify DNS resolution: `nslookup pokt.ai`
4. Check SSL certificates: `curl -I https://pokt.ai` 