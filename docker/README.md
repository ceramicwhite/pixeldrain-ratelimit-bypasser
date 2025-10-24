# PixelDrain Bypasser - Self-Hosted Docker Setup

Run your own PixelDrain bypass frontend that connects to your Cloudflare proxy workers. This setup gives you complete control over your own server while leveraging your Cloudflare workers for the actual proxy functionality.

## 🏗️ Architecture

```
User → Your Server (Docker) → Nginx → Node.js App → Your Cloudflare Workers → PixelDrain
```

- **Your Server**: Hosts the frontend interface
- **Nginx**: Reverse proxy with rate limiting and SSL termination
- **Node.js App**: Serves the web interface and handles redirects
- **Cloudflare Workers**: Your deployed proxy workers (pd1-pd10)

## 📋 Prerequisites

### Required
1. **Cloudflare Account** with workers deployed
2. **Docker** and **Docker Compose** installed
3. **Server** with public IP (VPS, dedicated server, etc.)

### Cloudflare Workers Setup
Before using this Docker setup, you **must** deploy the Cloudflare workers:

1. **Deploy 10 Proxy Workers** using `proxy-worker.js`:
   - `pd1.your-domain.workers.dev`
   - `pd2.your-domain.workers.dev`
   - `pd3.your-domain.workers.dev`
   - ... up to `pd10.your-domain.workers.dev`

2. **Test Each Worker**:
   ```bash
   curl https://pd1.your-domain.workers.dev/api/file/test
   # Should return an error message (expected for invalid file ID)
   ```

## 🚀 Quick Start

### 1. Clone and Setup
```bash
# Clone the repository
git clone https://github.com/ceramicwhite/pixeldrain-ratelimit-bypasser.git
cd pixeldrain-ratelimit-bypasser/docker

# Copy environment configuration
cp .env.example .env
```

### 2. Configure Environment
Edit the `.env` file:

```bash
# Edit with your preferred editor
nano .env
```

**Required Configuration:**
```env
# Replace with your actual Cloudflare workers domain
CLOUDFLARE_DOMAIN=your-subdomain.workers.dev

# Optional: Set custom ports if needed
HTTP_PORT=8080
HTTPS_PORT=8443
```

### 3. Deploy
```bash
# Build and start the services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### 4. Access Your Service
- **Local Access**: `http://localhost:8080`
- **Server Access**: `http://your-server-ip:8080`

## 🌐 Domain Setup (Optional)

### Option A: Subdomain Setup
If you have a domain and want to use a subdomain:

1. **DNS Configuration**:
   ```
   A record: pixel.yourdomain.com → YOUR_SERVER_IP
   ```

2. **Update Environment**:
   ```env
   FRONTEND_DOMAIN=pixel.yourdomain.com
   HTTP_PORT=80
   HTTPS_PORT=443
   ```

3. **Restart Services**:
   ```bash
   docker-compose down && docker-compose up -d
   ```

### Option B: SSL/HTTPS Setup
For production use with SSL:

1. **Obtain SSL Certificate** (Let's Encrypt recommended):
   ```bash
   # Install certbot
   sudo apt install certbot

   # Get certificate
   sudo certbot certonly --standalone -d pixel.yourdomain.com
   ```

2. **Copy Certificates**:
   ```bash
   # Create SSL directory
   mkdir -p ssl

   # Copy certificates (adjust paths as needed)
   sudo cp /etc/letsencrypt/live/pixel.yourdomain.com/fullchain.pem ssl/cert.pem
   sudo cp /etc/letsencrypt/live/pixel.yourdomain.com/privkey.pem ssl/key.pem
   sudo chown $(whoami):$(whoami) ssl/*
   ```

3. **Enable HTTPS in nginx.conf**:
   Uncomment and configure the HTTPS server block in `nginx.conf`

4. **Restart**:
   ```bash
   docker-compose restart nginx
   ```

## 📊 Monitoring and Maintenance

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f pixeldrain-frontend
docker-compose logs -f nginx

# Live monitoring
docker-compose logs -f --tail=100
```

### Health Checks
```bash
# Check service health
docker-compose ps

# Manual health check
curl http://localhost:8080/
curl http://localhost:8080/health
```

### Performance Monitoring
```bash
# Resource usage
docker stats

# Container information
docker-compose exec pixeldrain-frontend top
```

## 🔧 Configuration Options

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `CLOUDFLARE_DOMAIN` | Your Cloudflare workers domain | `your-domain.workers.dev` | ✅ Yes |
| `FRONTEND_DOMAIN` | Custom domain for frontend | `pixel.localhost` | ❌ No |
| `HTTP_PORT` | HTTP port for nginx | `8080` | ❌ No |
| `HTTPS_PORT` | HTTPS port for nginx | `8443` | ❌ No |

### Nginx Configuration
The `nginx.conf` file includes:
- **Rate Limiting**: 10 requests/second for API, 5 requests/second for downloads
- **Security Headers**: XSS protection, content type options, etc.
- **Gzip Compression**: For better performance
- **Health Checks**: `/health` endpoint for monitoring

### Scaling Options

#### Add More Proxy Workers
1. Deploy additional workers (`pd11`, `pd12`, etc.)
2. Update `app.js` to include new workers in the `PROXY_SERVERS` array
3. Rebuild: `docker-compose up --build -d`

#### Horizontal Scaling
```yaml
# In docker-compose.yml, scale the frontend
services:
  pixeldrain-frontend:
    # ... existing config
    deploy:
      replicas: 3
```

## 🛠️ Troubleshooting

### Common Issues

**Container won't start:**
```bash
# Check logs
docker-compose logs pixeldrain-frontend

# Common fix: rebuild
docker-compose up --build -d
```

**"CLOUDFLARE_DOMAIN not set" errors:**
```bash
# Verify environment file
cat .env

# Ensure no extra spaces or quotes
CLOUDFLARE_DOMAIN=myname.workers.dev  # ✅ Correct
CLOUDFLARE_DOMAIN="myname.workers.dev"  # ❌ Incorrect
```

**Nginx 502 Bad Gateway:**
```bash
# Check if frontend is running
docker-compose ps

# Check network connectivity
docker-compose exec nginx ping pixeldrain-frontend
```

**High memory usage:**
```bash
# Monitor resources
docker stats

# Restart services
docker-compose restart
```

### Port Conflicts
If ports 8080/8443 are in use:

1. **Update .env**:
   ```env
   HTTP_PORT=9080
   HTTPS_PORT=9443
   ```

2. **Restart**:
   ```bash
   docker-compose down && docker-compose up -d
   ```

### Worker Connectivity Issues
Test your Cloudflare workers:
```bash
# Test each worker individually
for i in {1..10}; do
  echo "Testing pd$i..."
  curl -I "https://pd$i.your-domain.workers.dev/api/file/test"
done
```

## 🔒 Security Considerations

### Production Deployment
1. **Use HTTPS** in production
2. **Configure Firewall** to only allow necessary ports
3. **Regular Updates**: Keep Docker images updated
4. **Monitor Logs** for suspicious activity
5. **Rate Limiting**: Adjust nginx rate limits as needed

### Network Security
```bash
# Example iptables rules (adjust as needed)
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A INPUT -j DROP
```

## 📈 Performance Tuning

### For High Traffic
1. **Increase worker processes** in nginx.conf
2. **Add more proxy workers** on Cloudflare
3. **Use Redis** for session management (if implementing user features)
4. **Enable caching** for static assets

### Resource Limits
```yaml
# Add to docker-compose.yml
services:
  pixeldrain-frontend:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
```

## 🆕 Updates and Maintenance

### Updating the Application
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up --build -d
```

### Backup and Recovery
```bash
# Backup configuration
tar -czf pixeldrain-backup-$(date +%Y%m%d).tar.gz .env nginx.conf ssl/

# Restore
tar -xzf pixeldrain-backup-YYYYMMDD.tar.gz
```

## 📞 Support

### Getting Help
1. **Check Logs**: Always start with `docker-compose logs -f`
2. **GitHub Issues**: Report bugs or ask questions
3. **Community**: Join discussions in the repository

### Useful Commands
```bash
# Complete reset
docker-compose down -v --remove-orphans
docker system prune -f
docker-compose up --build -d

# Update only specific service
docker-compose up -d --no-deps pixeldrain-frontend

# Shell access
docker-compose exec pixeldrain-frontend sh
docker-compose exec nginx sh
```

---

## 🎉 Success!

If everything is working correctly:
1. ✅ Your frontend is accessible at your server's address
2. ✅ URL conversion works properly
3. ✅ Downloads redirect through your Cloudflare workers
4. ✅ Health checks pass

**Example Test:**
1. Visit: `http://your-server:8080`
2. Enter: `https://pixeldrain.com/u/abc123`
3. Convert and test the generated download link

🚀 **You now have your own self-hosted PixelDrain bypasser!**