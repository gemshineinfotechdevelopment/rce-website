#!/bin/bash
# ==============================================================================
# RCE Website - VPS Automated Setup Script
# Domain: rce.gemshine.tech | Port: 5024 | MongoDB: rce_website
# ==============================================================================

set -e

echo "🚀 Starting RCE Website Server Configuration..."

APP_DIR="/var/www/rce-website"
cd "$APP_DIR" || exit 1

# ------------------------------------------------------------------------------
# 1. Create Backend .env
# ------------------------------------------------------------------------------
echo "⚙️ Creating server/.env configuration (Port 5024, MongoDB)..."
mkdir -p "$APP_DIR/server"
cat << 'EOF' > "$APP_DIR/server/.env"
# Backend Environment Variables
PORT=5024
NODE_ENV=production
CLIENT_URL=https://rce.gemshine.tech
MONGO_URI=mongodb://127.0.0.1:27017/rce_website
EOF
echo "✅ Backend .env created successfully!"

# ------------------------------------------------------------------------------
# 2. Create Frontend .env
# ------------------------------------------------------------------------------
echo "⚙️ Creating frontend .env configuration (rce.gemshine.tech)..."
cat << 'EOF' > "$APP_DIR/.env"
# Frontend Environment Variables (Vite)
VITE_API_BASE_URL=https://rce.gemshine.tech
VITE_PORT=5173
VITE_APP_NAME="RCE Website"
EOF
echo "✅ Frontend .env created successfully!"

# ------------------------------------------------------------------------------
# 3. Install & Start MongoDB on VPS
# ------------------------------------------------------------------------------
echo "🍃 Configuring MongoDB on VPS..."

# Check if mongod is already installed and running
if command -v mongod >/dev/null 2>&1 && systemctl is-active --quiet mongod; then
    echo "✅ MongoDB is already installed and running!"
else
    echo "📦 Installing MongoDB Official Community Edition (mongodb-org)..."
    sudo apt update
    sudo apt install -y curl gnupg lsb-release

    # Import GPG key
    curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
        sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor --yes

    # Add repository
    UBUNTU_CODENAME=$(lsb_release -cs 2>/dev/null || echo "jammy")
    if [ "$UBUNTU_CODENAME" = "noble" ]; then
        # For Ubuntu 24.04 fallback to jammy repo (compatible with libssl3)
        echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    else
        echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu ${UBUNTU_CODENAME}/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    fi

    sudo apt update
    sudo apt install -y mongodb-org

    # Enable and start
    sudo systemctl daemon-reload
    sudo systemctl enable --now mongod
    echo "✅ MongoDB service started!"
fi

# ------------------------------------------------------------------------------
# 4. Ensure ecosystem.config.cjs exists
# ------------------------------------------------------------------------------
cat << 'EOF' > "$APP_DIR/ecosystem.config.cjs"
module.exports = {
  apps: [
    {
      name: "rce-backend",
      cwd: "./server",
      script: "src/server.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 5024,
        MONGO_URI: "mongodb://127.0.0.1:27017/rce_website",
        CLIENT_URL: "https://rce.gemshine.tech"
      }
    }
  ]
};
EOF

# ------------------------------------------------------------------------------
# 5. Build Frontend & Dependencies
# ------------------------------------------------------------------------------
echo "📦 Installing dependencies..."
npm install
cd "$APP_DIR/server" && npm install && cd "$APP_DIR"

echo "⚡ Building frontend production bundle..."
npm run build

# ------------------------------------------------------------------------------
# 6. Start/Restart PM2 Backend (Port 5024)
# ------------------------------------------------------------------------------
echo "⚙️ Starting PM2 process on Port 5024..."
pm2 start ecosystem.config.cjs || pm2 restart rce-backend
pm2 save

echo "=========================================================="
echo "🎉 Setup Complete!"
echo "🌐 Frontend URL: https://rce.gemshine.tech"
echo "🔌 Backend API: http://127.0.0.1:5024"
echo "🍃 MongoDB: Active (Database: rce_website)"
echo "=========================================================="

