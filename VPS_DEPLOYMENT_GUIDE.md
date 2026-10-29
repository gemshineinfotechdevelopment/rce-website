# 🚀 RCE Website - VPS Deployment Guide
**Subdomain:** `rce.gemshine.tech`  
**Backend Port:** `5024`  
**Database:** MongoDB (`rce_website`)  
**Stack:** Vite React + Node.js Express + PM2 + Nginx + Let's Encrypt SSL

---

## 📋 Pre-requisites Checklist
- Ubuntu 20.04 / 22.04 / 24.04 VPS with root or sudo access.
- Domain DNS setup: In your DNS management (Cloudflare / Hostinger / GoDaddy), add an **A Record**:
  - **Type:** `A`
  - **Name / Host:** `rce` (points to `rce.gemshine.tech`)
  - **Value / IP:** `<YOUR_VPS_PUBLIC_IP>`
  - **TTL:** Auto or 300s

---

## 🛠️ Step 1: Install Node.js, Git & PM2 on VPS

Run on your VPS terminal:
```bash
# Update server packages
sudo apt update && sudo apt upgrade -y

# Install Git & Curl
sudo apt install -y git curl ufw

# Install Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify versions
node -v   # Should show v20.x.x
npm -v

# Install PM2 globally
sudo npm install -g pm2
```

---

## 🍃 Step 2: Install & Start MongoDB on VPS

Ubuntu 20.04/22.04/24.04 requires the official **MongoDB Community Edition (mongodb-org)** repository:

```bash
# 1. Install curl & gnupg
sudo apt update && sudo apt install -y curl gnupg

# 2. Add MongoDB Official GPG Key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor --yes

# 3. Add MongoDB Repository (Auto-detects Ubuntu version)
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs 2>/dev/null || echo jammy)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# 4. Update apt packages & Install MongoDB
sudo apt update
sudo apt install -y mongodb-org

# 5. Start and enable MongoDB service
sudo systemctl daemon-reload
sudo systemctl enable --now mongod

# 6. Verify MongoDB is active
sudo systemctl status mongod --no-pager
```

> 💡 **Database Note:** The backend is configured to connect to `mongodb://127.0.0.1:27017/rce_website`.  
> The database `rce_website` and collections (`club_data`, `volunteers`, `donations`, `contact_messages`) will be **automatically created and seeded** with your club data on first run!

---

## 📂 Step 3: Clone & Setup Project in `/var/www/`

```bash
# Create directory and assign permissions
sudo mkdir -p /var/www/rce-website
sudo chown -R $USER:$USER /var/www/rce-website

# Clone your project repository into /var/www/rce-website
git clone <YOUR_GIT_REPO_URL> /var/www/rce-website
cd /var/www/rce-website

# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..

# Build the frontend production assets
npm run build
```

---

## ⚙️ Step 4: Start Backend with PM2 (Port 5024)

The project includes `ecosystem.config.cjs` configured for port **5024** and MongoDB.

```bash
cd /var/www/rce-website

# Start backend using PM2
pm2 start ecosystem.config.cjs

# Verify process status
pm2 status

# Save PM2 process list and configure auto-start on server reboot
pm2 save
pm2 startup
# (Copy and run the `sudo env PATH=...` command that pm2 outputs)
```

Test that the backend is responding locally on port 5024:
```bash
curl http://127.0.0.1:5024/api/health
# Expected Output: {"status":"healthy", "timestamp": ...}
```

---

## 🌐 Step 5: Install & Configure NGINX

```bash
# Install Nginx
sudo apt install -y nginx

# Copy initial Nginx configuration for rce.gemshine.tech
sudo cp /var/www/rce-website/nginx/rce.gemshine.tech.initial.conf /etc/nginx/sites-available/rce.gemshine.tech

# Enable the site configuration
sudo ln -sf /etc/nginx/sites-available/rce.gemshine.tech /etc/nginx/sites-enabled/

# Test Nginx syntax
sudo nginx -t

# Restart Nginx
sudo systemctl reload nginx
```

Now you can test opening `http://rce.gemshine.tech` in your browser!

---

## 🔒 Step 6: Install Free SSL Certificate (Certbot)

Run Certbot to secure `rce.gemshine.tech` with HTTPS:

```bash
# Install Certbot and Nginx plugin
sudo apt install -y certbot python3-certbot-nginx

# Request and configure SSL certificate automatically
sudo certbot --nginx -d rce.gemshine.tech

# Follow on-screen prompts:
# 1. Enter your email for expiry notifications
# 2. Agree to Terms of Service
# 3. Choose option to Redirect HTTP to HTTPS (Select '2')
```

Once Certbot finishes:
- HTTPS is automatically configured on `rce.gemshine.tech`.
- SSL auto-renewal is enabled automatically via systemd timer.

Test Nginx:
```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

## 🛡️ Step 7: Configure Firewall (UFW)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## 🔄 Future Updates (1-Click Deployment)

Whenever you push new changes to GitHub, deploy to your VPS with 1 command:

```bash
cd /var/www/rce-website
bash deploy.sh
```

Or manually:
```bash
cd /var/www/rce-website
git pull origin main
npm install && npm run build
pm2 reload rce-backend
sudo systemctl reload nginx
```

---

## 🔍 Useful Diagnostic Commands

| Action | Command |
| :--- | :--- |
| **Check PM2 logs** | `pm2 logs rce-backend` |
| **Restart backend** | `pm2 restart rce-backend` |
| **Check Nginx status** | `sudo systemctl status nginx` |
| **Check Nginx error log** | `sudo tail -f /var/log/nginx/error.log` |
| **Check MongoDB status** | `sudo systemctl status mongod` or `sudo systemctl status mongodb` |
| **Inspect MongoDB data** | `mongosh rce_website` then `db.club_data.find().pretty()` |
| **Test Port 5024 API** | `curl http://127.0.0.1:5024/api/health` |

