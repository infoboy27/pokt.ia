# Troubleshooting Guide

## Issue: pokt.ai redirects to Heroku

If `pokt.ai` is redirecting to Heroku instead of your development server, follow these steps:

### 1. Check DNS Configuration

Verify that `pokt.ai` points to your server IP (51.195.63.173):

```bash
# Check DNS resolution
nslookup pokt.ai
dig pokt.ai
```

Expected result:
```
pokt.ai.    IN  A   51.195.63.173
```

### 2. Check Traefik Status

```bash
# Check if Traefik is running
docker ps | grep traefik

# Check Traefik logs
docker logs traefik-dev

# Check Traefik dashboard
curl -I http://51.195.63.173:8080
```

### 3. Check Development Environment

```bash
# Check if development containers are running
docker ps | grep pokt-portal

# Check development logs
docker logs pokt-portal

# Check if the app is accessible locally
curl -I http://localhost:3000
```

### 4. Verify Network Configuration

```bash
# Check if traefik-network exists
docker network ls | grep traefik-network

# If not, create it
docker network create traefik-network
```

### 5. Restart Services

```bash
# Stop all services
docker compose -f traefik-dev.yml down
docker compose -f docker-compose-dev.yml down

# Start Traefik first
docker compose -f traefik-dev.yml up -d

# Start development environment
docker compose -f docker-compose-dev.yml up -d --build
```

### 6. Check Traefik Configuration

```bash
# Check Traefik configuration
docker exec traefik-dev cat /etc/traefik/traefik.yml

# Check if pokt.ai route is configured
curl -s http://51.195.63.173:8080/api/http/routers | jq .
```

### 7. Test Direct Access

```bash
# Test direct access to the development server
curl -I http://51.195.63.173:3001

# Test with Host header
curl -I -H "Host: pokt.ai" http://51.195.63.173
```

### 8. Check SSL Certificate

```bash
# Check if SSL certificate is valid
openssl s_client -connect pokt.ai:443 -servername pokt.ai

# Check certificate details
echo | openssl s_client -connect pokt.ai:443 -servername pokt.ai 2>/dev/null | openssl x509 -text
```

### 9. Common Issues and Solutions

#### Issue: "No such network: traefik-network"
```bash
docker network create traefik-network
```

#### Issue: "Certificate not found"
```bash
# Check acme.json permissions
ls -la acme.json
chmod 600 acme.json
```

#### Issue: "Service not found"
```bash
# Check if pokt-portal container is running
docker ps | grep pokt-portal

# Restart the development environment
docker compose -f docker-compose-dev.yml up -d --build
```

#### Issue: "Port already in use"
```bash
# Check what's using port 80/443
sudo lsof -i :80
sudo lsof -i :443

# Stop conflicting services
sudo systemctl stop nginx  # if nginx is running
sudo systemctl stop apache2  # if apache is running
```

### 10. Debug Traefik Labels

Check if the Traefik labels are correctly applied:

```bash
# Check container labels
docker inspect pokt-portal | jq '.[0].Config.Labels'

# Expected labels:
# - traefik.enable=true
# - traefik.http.routers.poktportal.rule=Host(`pokt.ai`)
# - traefik.http.routers.poktportal.entrypoints=websecure
# - traefik.http.routers.poktportal.tls.certresolver=letsencrypt
# - traefik.http.services.poktportal.loadbalancer.server.port=3000
```

### 11. Alternative: Use Different Domain

If `pokt.ai` is still redirecting to Heroku, try using a subdomain:

```bash
# Update docker-compose-dev.yml labels
- "traefik.http.routers.poktportal.rule=Host(`dev.pokt.ai`)"
```

Then update your DNS to point `dev.pokt.ai` to `51.195.63.173`.

### 12. Check Firewall

```bash
# Check if ports 80, 443, 8080 are open
sudo ufw status
sudo iptables -L

# If needed, open ports
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 8080
```

### 13. Final Test

After fixing the issues:

```bash
# Test the complete setup
curl -I -H "Host: pokt.ai" https://pokt.ai

# Expected: 200 OK with your development server
```

If you're still getting redirected to Heroku, the issue might be:
1. DNS caching (wait 5-10 minutes)
2. CDN caching (clear browser cache)
3. Heroku still has control over the domain
4. DNS propagation delay 