#!/bin/bash
# ==============================================================================
# RCE Website - 1-Click Deployment Script for VPS
# Domain: rce.gemshine.tech | Port: 5024 | Database: MongoDB (rce_website)
# ==============================================================================

set -e

echo "🚀 Starting RCE Website Deployment..."

# 1. Pull latest code (if git repository)
if [ -d ".git" ]; then
    echo "📥 Pulling latest git changes..."
    git pull origin main || git pull
fi

# 2. Install Root & Server Dependencies
echo "📦 Installing root & server dependencies..."
npm install
cd server && npm install && cd ..
mkdir -p server/uploads
chmod 775 server/uploads 2>/dev/null || true

# 3. Build Frontend
echo "⚡ Building frontend with Vite..."
npm run build

# 4. Copy build to /var/www/rce-website/dist (if different directory)
DEPLOY_DIR="/var/www/rce-website"
if [ "$PWD" != "$DEPLOY_DIR" ] && [ -d "$DEPLOY_DIR" ]; then
    echo "📂 Syncing dist to $DEPLOY_DIR/dist..."
    mkdir -p "$DEPLOY_DIR/dist"
    cp -r dist/* "$DEPLOY_DIR/dist/"
fi

# 5. Check MongoDB status
echo "🍃 Checking MongoDB service..."
if systemctl is-active --quiet mongod; then
    echo "✅ MongoDB (mongod) is active and running."
elif systemctl is-active --quiet mongodb; then
    echo "✅ MongoDB (mongodb) is active and running."
else
    echo "⚠️ MongoDB is not active! Starting MongoDB..."
    sudo systemctl enable --now mongod 2>/dev/null || sudo systemctl enable --now mongodb 2>/dev/null || echo "Please verify MongoDB service status."
fi

# 6. Start or Reload PM2
echo "⚙️ Reloading PM2 backend process on Port 5024..."
if pm2 describe rce-backend > /dev/null 2>&1; then
    pm2 reload ecosystem.config.cjs
else
    pm2 start ecosystem.config.cjs
fi
pm2 save

# 7. Test and reload Nginx
echo "🌐 Reloading Nginx..."
if sudo nginx -t; then
    sudo systemctl reload nginx
    echo "✅ Nginx reloaded successfully!"
else
    echo "❌ Nginx configuration check failed. Please check /etc/nginx/sites-available/"
fi

echo "=========================================================="
echo "🎉 Deployment Complete!"
echo "🌐 Website: https://rce.gemshine.tech"
echo "🔌 API Port: http://127.0.0.1:5024"
echo "🍃 Database: mongodb://127.0.0.1:27017/rce_website"
echo "=========================================================="

