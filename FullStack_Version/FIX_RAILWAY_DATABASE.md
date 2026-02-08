# 🔧 Fix: Server Error During Login

## Problem
Your app is deployed but showing "Server error during login" - this means the database tables don't exist yet.

## ✅ Quick Fix - Setup Database

### Option 1: Railway Dashboard (Easiest)

1. **Go to Railway Dashboard**
   - Open https://railway.app
   - Select your project
   - Click on your MySQL service

2. **Open Query Tab**
   - Click "Query" tab in MySQL service
   - You'll see a SQL editor

3. **Run Database Setup**
   - Open the file: `FullStack_Version/railway_setup.sql`
   - Copy ALL the content (Ctrl+A, Ctrl+C)
   - Paste into Railway Query editor
   - Click "Execute" or "Run"

4. **Verify Tables Created**
   - Run this query to check:
   ```sql
   SHOW TABLES;
   ```
   - You should see: users, slots, bookings, notifications, themes

5. **Refresh Your App**
   - Go back to your app URL
   - Try logging in again
   - Should work now!

---

### Option 2: Use Railway CLI

If you have Railway CLI installed:

```bash
cd FullStack_Version
railway login
railway link
railway run node setup-railway-db.js
```

---

## 🔐 Login Credentials

After database setup, use:

**Admin:**
- Email: admin@edumeet.com
- Password: admin123

**Faculty:**
- Email: priya.sharma@college.edu
- Password: admin123

**Student:**
- Email: rahul.kumar@student.edu
- Password: admin123

---

## 🔍 Check Railway Logs

If still having issues:

1. Go to Railway Dashboard
2. Click your Node.js service
3. Click "Deployments" tab
4. Click latest deployment
5. Check logs for errors

Common issues:
- Database connection error → Check MySQL service is running
- Missing environment variables → Add SESSION_SECRET
- Port issues → Railway auto-assigns PORT

---

## ✅ Verify Environment Variables

In Railway Dashboard → Your Node.js Service → Variables:

Make sure you have:
```
SESSION_SECRET=edumeet-railway-secret-2024
NODE_ENV=production
```

MySQL variables should be auto-linked from MySQL service.

---

## 🎯 Quick Test

After setting up database, test with:
- Visit your app URL
- Try admin login: admin@edumeet.com / admin123
- Should redirect to admin dashboard

---

## 📞 Still Not Working?

Check:
1. ✅ MySQL service is running in Railway
2. ✅ Database tables are created (run SHOW TABLES)
3. ✅ Environment variables are set
4. ✅ Node.js service is deployed and running
5. ✅ Check Railway logs for specific errors
