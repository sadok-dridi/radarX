# RadarX Deployment & Development Workflow

This document outlines the exact step-by-step process for making code changes on your local machine and deploying those updates to your live VPS.

---

## 1. Local Development (Your PC)

When you want to add new features or fix bugs, you do it here.

### Start the local development server:
Ensure you are in your project directory and run:
```bash
# Starts the local Next.js dev container
npm run dev
```

### Save and push your changes:
Once you are happy with your updates locally, commit them to your Git repository:
```bash
# 1. Add all changed files
git add .

# 2. Commit with a descriptive message
git commit -m "Describe what you changed"

# 3. Push to your repository (e.g., GitHub/GitLab)
git push origin main
```

---

## 2. Server Deployment (Your VPS)

Once your code is pushed from your local PC, SSH into your VPS to deploy the updates.

### SSH into your VPS:
```bash
ssh user@your_vps_ip
cd ~/radarX
```

### Pull the latest code:
```bash
# Get the changes you just pushed from your local PC
git pull origin main
```

### Rebuild and Restart the Container:
Run these commands to compile the new code and replace the running container. 
*(Note: Because the database `radar-postgres` is already running on the `radar_network`, we don't need to touch it).*

```bash
# 1. Build the new optimized Docker image
docker build -t opportunity-radar-web .

# 2. Stop and remove the old running container
docker rm -f radar-web

# 3. Start the new container 
# (Attached to radar_network, exposing port 3005 locally for Nginx)
docker run -d \
  --name radar-web \
  --network radar_network \
  -p 127.0.0.1:3005:3000 \
  --restart unless-stopped \
  --env-file .env.local \
  opportunity-radar-web
```

### Verify the deployment:
```bash
# Check that the container is "Up" and hasn't crashed
docker ps | grep radar-web

# If you need to view the logs to debug errors:
docker logs -f radar-web
```

---

## 3. Useful Reference Commands

### VPS Nginx Commands
If you ever need to tweak your domain routing:
```bash
# Edit Nginx configuration
sudo nano /etc/nginx/sites-available/radarx

# Test Nginx for syntax errors
sudo nginx -t

# Apply Nginx changes
sudo systemctl reload nginx
```

### Database Access
If you need to access the database directly on the VPS:
```bash
# Open a psql shell inside the postgres container
docker exec -it radar-postgres psql -U radar_app -d opportunity_radar
```
