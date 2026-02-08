# 🚀 Deploy EduMeet to Railway - Quick Guide

## ✅ Your Credentials Are Ready!

```
MYSQLHOST=mysql.railway.internal
MYSQLUSER=root
MYSQLPASSWORD=CLODVYkKYlXrPegsMYFQliFbkdeCJHJk
MYSQLDATABASE=railway
MYSQLPORT=3306
```

## 📋 Deployment Steps

### Step 1: Setup Database (One-Time)

Railway MySQL is already created. Now initialize the database:

**Option A: Use Railway CLI (Recommended)**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Run database setup
railway run node setup-railway-db.js
```

**Option B: Use Railway Dashboard**
1. Go to Railway Dashboard → MySQL Service
2. Click "Query" tab
3. Copy content from `railway_setup.sql`
4. Paste and execute

### Step 2: Configure Node.js Service

In Railway Dashboard → Your Node.js Service → Variables:

Add these variables:
```
SESSION_SECRET=edumeet-railway-secret-2024
NODE_ENV=production
PORT=3000
```

The MySQL variables are automatically shared from MySQL service.

### Step 3: Deploy Code

```bash
# Make sure you're in FullStack_Version directory
cd FullStack_Version

# Initialize git (if not done)
git init
git add .
git commit -m "Initial deployment"

# Add Railway remote (get URL from Railway Dashboard)
git remote add railway <your-railway-git-url>

# Push to deploy
git push railway main
```

### Step 4: Access Your App

Railway will provide a URL like:
```
https://edumeet-production.up.railway.app
```

## 🔐 Default Login Credentials

**Admin:**
- Email: admin@edumeet.com
- Password: admin123

**Faculty:**
- Email: priya.sharma@college.edu
- Password: admin123

**Student:**
- Email: rahul.kumar@student.edu
- Password: admin123

## 🎯 Quick Test Locally First

Before deploying, test with Railway database:

```bash
# Install dependencies
npm install

# Your .env is already configured with Railway credentials
# Start server
node server.js
```

Visit: http://localhost:3000

## ⚠️ Important Notes

1. **Database Connection**: `mysql.railway.internal` only works from Railway's network
2. **Local Testing**: Won't connect to Railway DB from local machine (use XAMPP locally)
3. **Environment**: Railway automatically uses production environment
4. **Auto-Deploy**: Push to git = automatic deployment

## 🔧 Troubleshooting

**Database Connection Error:**
- Check MySQL service is running in Railway
- Verify all MYSQL* variables are set
- Check Railway logs for details

**App Not Starting:**
- Check `package.json` has start script
- Verify `server.js` exists
- Check Railway build logs

**Can't Access App:**
- Wait 2-3 minutes after deployment
- Check Railway service status
- View deployment logs

## 📦 What's Included

✅ Complete database schema
✅ Sample users (admin, faculty, students)
✅ All features configured
✅ PWA support
✅ Theme system
✅ Bulk upload
✅ Charts and analytics

## 🎉 You're Ready!

Your app is production-ready. Just run the database setup and deploy!
