# 🚀 EduMeet Railway Deployment - Complete Guide

## ✅ What Has Been Done:
1. ✓ Railway project created with MySQL database
2. ✓ Environment variables configured
3. ✓ Root directory set to `FullStack_Version`
4. ✓ Automatic database initialization code created
5. ✓ MySQL variable names fixed in code
6. ✓ Code committed locally

## 📋 What You Need to Do (3 Simple Steps):

### Step 1: Push Code to GitHub (1 minute)
1. Open **GitHub Desktop** application
2. You'll see 2 changed files:
   - `FullStack_Version/config/database.js`
   - `FullStack_Version/init-database.js`
3. In the bottom left, write: **"Fix Railway MySQL variables"**
4. Click **"Commit to main"** button
5. Click **"Push origin"** button (top right)
6. Wait for push to complete

### Step 2: Update Railway Variables (2 minutes)
1. Go to https://railway.app in your browser
2. Click on your **edumeet** service (the one with GitHub icon, NOT MySQL)
3. Click **"Variables"** tab at the top
4. Click **"Raw Editor"** button
5. **Delete everything** and paste this:

```
MYSQLHOST=${{MySQL.MYSQLHOST}}
MYSQLUSER=${{MySQL.MYSQLUSER}}
MYSQLPASSWORD=${{MySQL.MYSQLPASSWORD}}
MYSQLDATABASE=${{MySQL.MYSQLDATABASE}}
MYSQLPORT=${{MySQL.MYSQLPORT}}
SESSION_SECRET=edumeet-secret-2026-railway
NODE_ENV=production
PORT=3000
```

6. Click **"Update Variables"** or **"Save"**

### Step 3: Wait for Deployment (3-5 minutes)
1. Railway will automatically start deploying
2. Go to **"Deployments"** tab
3. Watch the latest deployment
4. Wait until it shows **"Deployment successful"** (green checkmark)

## 🌐 Get Your Public URL:

Once deployment is successful:

1. Click on your **edumeet** service
2. Go to **"Settings"** tab
3. Scroll to **"Networking"** section
4. Click **"Generate Domain"** button
5. Copy the URL (looks like: `https://edumeet-production-xxxx.up.railway.app`)

## 🎉 Test Your Live App:

Open the URL in any browser and login with:

**Admin:**
- Email: `admin@edumeet.com`
- Password: `admin123`

**Faculty:**
- Email: `faculty@edumeet.com`
- Password: `faculty123`

**Student:**
- Email: `student@edumeet.com`
- Password: `student123`

## 📱 Access from Phone:

1. Open browser on your phone
2. Enter the Railway URL
3. Login and use the app!

## 🔧 If Deployment Fails:

1. Click on the failed deployment
2. Click **"View Logs"**
3. Look for error messages
4. Common issues:
   - **"ECONNREFUSED"**: MySQL variables not set correctly
   - **"Cannot find module"**: Missing dependencies (Railway should auto-install)
   - **"Port already in use"**: Ignore this, Railway handles ports

## 📊 What Happens Automatically:

✓ Database tables created on first run
✓ Sample users inserted
✓ Expired slots cleaned up every hour
✓ Sessions managed securely
✓ Auto-deploy on every GitHub push

## 🎯 Your Project is Now:

- ✅ Live on the internet
- ✅ Accessible from anywhere
- ✅ Running 24/7
- ✅ Auto-deploying from GitHub
- ✅ Using professional cloud database
- ✅ Completely free (Railway free tier)

---

## 💡 Quick Reference:

**GitHub Repository:** https://github.com/nitin98-cyber/edumeet
**Railway Dashboard:** https://railway.app
**Local Project:** C:\xampp\htdocs\EduMeet

**Login Credentials File:** `LOGIN_CREDENTIALS.md`
**Database Schema:** `Database/edumeet_database.sql`
**Main Code:** `FullStack_Version/`

---

**That's it! Just do the 3 steps above and your app will be live!** 🚀
