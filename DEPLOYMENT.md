# Deployment Guide

## How to Deploy Your Wedding Hall Website to Production

---

## Option 1: Vercel (Easiest - Free Tier Available)

Perfect for: Node.js backend with static frontend

### Steps:

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Configure**
   - Build Command: `npm install`
   - Output Directory: `.`
   - Install Command: `npm install`

5. **Set Environment Variables**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add variables from `.env.example`

**Note:** For SQLite database on Vercel, use Vercel Postgres or another cloud database instead.

---

## Option 2: Railway (Recommended for Full Stack)

Perfect for: Node.js/Python with database

### Steps:

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository

3. **Add Environment Variables**
   - Click on your service
   - Go to "Variables" tab
   - Add from `.env.example`

4. **Deploy**
   - Railway auto-deploys on git push
   - Your app will be live at: `your-app.railway.app`

**Database:** Railway includes PostgreSQL database for free

---

## Option 3: Render

Perfect for: Both Node.js and Python backends

### Steps:

1. **Create Render Account**
   - Go to https://render.com
   - Sign up

2. **New Web Service**
   - Click "New +" → "Web Service"
   - Connect your Git repository

3. **Configure**
   - **Name:** elegant-events-hall
   - **Environment:** Node or Python
   - **Build Command:** `npm install` or `pip install -r requirements.txt`
   - **Start Command:** `npm start` or `python server.py`

4. **Environment Variables**
   - Add variables from `.env.example`

5. **Deploy**
   - Click "Create Web Service"

---

## Option 4: DigitalOcean App Platform

Perfect for: Production with more control

### Steps:

1. **Create DigitalOcean Account**
   - Go to https://www.digitalocean.com

2. **Create App**
   - Go to Apps → "Create App"
   - Connect GitHub repository

3. **Configure**
   - Detect: Node.js or Python
   - Add environment variables
   - Choose pricing plan ($5/month basic)

4. **Database**
   - Add "Database" component
   - Choose PostgreSQL or MySQL
   - Connect to your app

---

## Option 5: Traditional VPS (DigitalOcean/Linode/AWS)

Perfect for: Full control and customization

### Steps:

1. **Create VPS**
   - Provider: DigitalOcean, Linode, AWS EC2
   - OS: Ubuntu 22.04 LTS
   - Size: Basic ($5-10/month)

2. **SSH into Server**
   ```bash
   ssh root@your-server-ip
   ```

3. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Install Git**
   ```bash
   sudo apt-get install git
   ```

5. **Clone Repository**
   ```bash
   cd /var/www
   git clone your-repo-url
   cd your-repo
   ```

6. **Install Dependencies**
   ```bash
   npm install
   ```

7. **Setup PM2 (Process Manager)**
   ```bash
   sudo npm install -g pm2
   pm2 start server.js
   pm2 startup
   pm2 save
   ```

8. **Setup Nginx**
   ```bash
   sudo apt-get install nginx
   ```

   Create config file `/etc/nginx/sites-available/your-site`:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/your-site /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

9. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## Database Migration (SQLite to PostgreSQL)

If deploying to production, migrate from SQLite to PostgreSQL:

### Install PostgreSQL Client
```bash
npm install pg
```

### Update database.js
```javascript
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Update queries to use PostgreSQL syntax
```

---

## Environment Variables for Production

Create `.env` file (never commit this):

```env
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Email
EMAIL_USER=your-email@domain.com
EMAIL_PASSWORD=your-password
ADMIN_EMAIL=admin@domain.com

# Payment (if using)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# Your domain
SITE_URL=https://your-domain.com
```

---

## DNS Configuration

After deploying, configure your domain:

1. **Buy Domain** (Namecheap, GoDaddy, Google Domains)

2. **Add DNS Records**
   ```
   Type: A
   Name: @
   Value: Your-Server-IP
   TTL: 3600

   Type: CNAME
   Name: www
   Value: your-domain.com
   TTL: 3600
   ```

3. **Wait for Propagation** (up to 48 hours)

---

## Pre-Deployment Checklist

Before going live, make sure:

- [ ] All test data removed from database
- [ ] Contact information updated (phone, email, address)
- [ ] Pricing is correct
- [ ] Environment variables set correctly
- [ ] Database backups configured
- [ ] SSL certificate installed (HTTPS)
- [ ] Payment gateway in production mode
- [ ] Email notifications working
- [ ] Admin panel secured (add authentication)
- [ ] Error logging setup (Sentry, LogRocket)
- [ ] Analytics added (Google Analytics)
- [ ] Mobile testing completed
- [ ] Cross-browser testing done
- [ ] Privacy policy & terms of service added
- [ ] GDPR compliance (if applicable)
- [ ] Backup strategy in place

---

## Monitoring & Maintenance

### Setup Monitoring

1. **Uptime Monitoring**
   - UptimeRobot (free)
   - Pingdom
   - StatusCake

2. **Error Tracking**
   - Sentry.io
   - LogRocket
   - Rollbar

3. **Analytics**
   - Google Analytics
   - Plausible (privacy-friendly)
   - Fathom

### Regular Maintenance

- **Daily:** Check for new bookings
- **Weekly:** Backup database
- **Monthly:** Update dependencies
- **Quarterly:** Review and optimize performance

### Backup Strategy

```bash
# Automated daily backups
0 2 * * * pg_dump your_database > backup_$(date +\%Y\%m\%d).sql
```

---

## Troubleshooting Production Issues

### Site Not Loading
1. Check server is running: `pm2 status`
2. Check Nginx: `sudo nginx -t`
3. Check logs: `pm2 logs`

### Database Connection Failed
1. Check DATABASE_URL is correct
2. Check database server is running
3. Verify network access

### 502 Bad Gateway
1. Backend server not running
2. Wrong port in Nginx config
3. Check `pm2 logs` for errors

---

## Cost Estimates

### Hobby/Small Business
- **Hosting:** $5-10/month (Railway, Render, DigitalOcean)
- **Domain:** $10-15/year
- **Email:** Free (Gmail) or $6/month (Google Workspace)
- **Total:** ~$15-25/month

### Professional
- **Hosting:** $20-50/month (more resources)
- **Database:** $15/month (managed database)
- **Email Service:** $15/month (SendGrid, Mailgun)
- **Payment Processing:** 2.9% + $0.30 per transaction
- **Total:** ~$50-100/month + transaction fees

---

## Support & Updates

After deployment:

1. **Monitor user feedback**
2. **Keep dependencies updated**
3. **Regular security patches**
4. **Add features based on user requests**

---

**Good luck with your deployment! 🚀**
