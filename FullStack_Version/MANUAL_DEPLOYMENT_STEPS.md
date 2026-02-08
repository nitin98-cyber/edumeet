# 🚀 Manual Railway Deployment Steps

Railway CLI isn't installed. Here are your options:

## Option 1: Install Railway CLI (Recommended)

### Step 1: Install CLI
```bash
npm install -g @railway/cli
```

Or run: `INSTALL_RAILWAY_CLI.bat`

### Step 2: Login & Setup Database
```bash
railway login
railway link
railway run node setup-railway-db.js
```

### Step 3: Deploy
```bash
railway up
```

---

## Option 2: Use Railway Dashboard (No CLI Needed)

### Step 1: Setup Database via Dashboard

1. Go to Railway Dashboard
2. Click your MySQL service
3. Click "Query" tab
4. Open `railway_setup.sql` file
5. Copy all SQL content
6. Paste into Query tab
7. Click "Execute"

### Step 2: Deploy via GitHub

1. **Create GitHub Repository:**
   ```bash
   cd FullStack_Version
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Push to GitHub:**
   - Create new repo on GitHub
   - Copy the git URL
   ```bash
   git remote add origin <your-github-url>
   git branch -M main
   git push -u origin main
   ```

3. **Connect Railway to GitHub:**
   - Go to Railway Dashboard
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will auto-deploy

### Step 3: Configure Environment Variables

In Railway Dashboard → Your Service → Variables:

Add these:
```
SESSION_SECRET=edumeet-railway-secret-2024
NODE_ENV=production
PORT=3000
```

MySQL variables are auto-shared from MySQL service.

---

## Option 3: Quick Database Setup Script

If you just want to setup the database without CLI:

### Get Railway MySQL Public URL

1. Go to Railway Dashboard → MySQL Service
2. Click "Connect" tab
3. Look for "Public Networking" section
4. Copy the public host (if available)

### Update and Run Setup

If Railway provides a public host, update `setup-railway-public.js` with the public host and run:
```bash
node setup-railway-public.js
```

---

## ✅ After Deployment

Your app will be at: `https://your-app.up.railway.app`

**Login Credentials:**
- Admin: admin@edumeet.com / admin123
- Faculty: priya.sharma@college.edu / admin123
- Student: rahul.kumar@student.edu / admin123

---

## 🎯 Recommended: Option 2 (GitHub)

This is the easiest and most reliable method:
1. Push code to GitHub
2. Connect Railway to GitHub
3. Setup database via Railway Query tab
4. Done!

---

## Need Help?

Check Railway documentation: https://docs.railway.app/
