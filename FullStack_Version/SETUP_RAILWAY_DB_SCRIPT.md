# 🚀 Automated Railway Database Setup

This script automatically sets up your Railway MySQL database with all tables and sample data.

## ✅ Prerequisites

- Node.js installed on your computer
- Railway MySQL service running
- Railway MySQL connection details

## 📋 Step 1: Get Railway MySQL Credentials

1. Go to your Railway project dashboard
2. Click on the **MySQL** service
3. Click the **"Variables"** tab
4. Copy these values:
   - `MYSQLHOST`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`
   - `MYSQLPORT`

## 🔧 Step 2: Set Environment Variables

### On Windows (Command Prompt):
```cmd
set MYSQLHOST=your-host-here
set MYSQLUSER=your-user-here
set MYSQLPASSWORD=your-password-here
set MYSQLDATABASE=your-database-here
set MYSQLPORT=your-port-here
```

### On Windows (PowerShell):
```powershell
$env:MYSQLHOST="your-host-here"
$env:MYSQLUSER="your-user-here"
$env:MYSQLPASSWORD="your-password-here"
$env:MYSQLDATABASE="your-database-here"
$env:MYSQLPORT="your-port-here"
```

### On Mac/Linux:
```bash
export MYSQLHOST=your-host-here
export MYSQLUSER=your-user-here
export MYSQLPASSWORD=your-password-here
export MYSQLDATABASE=your-database-here
export MYSQLPORT=your-port-here
```

**Replace** `your-host-here`, `your-user-here`, etc. with the actual values from Railway!

## ▶️ Step 3: Run the Setup Script

```cmd
cd FullStack_Version
node setup-railway-db.js
```

## ✨ What This Script Does

1. ✅ Connects to your Railway MySQL database
2. ✅ Creates all required tables (users, time_slots, appointments, notifications, appointment_history)
3. ✅ Inserts sample data:
   - 1 Admin user
   - 3 Faculty members
   - 2 Students
   - 10 Time slots
   - 2 Sample appointments
   - 3 Notifications
4. ✅ Verifies everything was created successfully

## 🎯 Expected Output

```
🚀 Starting Railway Database Setup...

📡 Connecting to Railway MySQL...
   Host: yamabiko.proxy.rlwy.net
   Database: railway
   Port: 38571

✅ Connected to Railway MySQL!

📄 Reading railway_setup.sql...
⚙️  Executing SQL statements...

✅ Database setup complete!

🔍 Verifying tables...
   Found 5 tables:
   ✓ users
   ✓ time_slots
   ✓ appointments
   ✓ notifications
   ✓ appointment_history

👥 Checking users...
   Total users: 6
   - admin: 1
   - faculty: 3
   - student: 2

🎉 Setup successful!
```

## 🔐 Default Login Credentials

After setup, you can login with:

### Admin
- **Email:** admin@edumeet.com
- **Password:** admin123

### Faculty
- **Email:** priya.sharma@college.edu
- **Password:** admin123

### Student
- **Email:** rahul.kumar@student.edu
- **Password:** admin123

## 🌐 Step 4: Add Environment Variables to Railway

After database setup, add these to your **Node.js service** (not MySQL):

1. Go to Railway → Your Node.js service → Variables tab
2. Add:
   - `SESSION_SECRET` = `edumeet-railway-secret-2024-xyz789`
   - `NODE_ENV` = `production`
3. Railway will auto-redeploy

## 🎉 Step 5: Test Your App!

Visit: **https://edumeet-production.up.railway.app**

Login with admin credentials and you're done!

## ⚠️ Troubleshooting

### Error: "Missing Railway MySQL environment variables"
- Make sure you set all environment variables in Step 2
- Check for typos in variable names
- Variables are case-sensitive!

### Error: "Connection refused" (ECONNREFUSED)
- Check Railway MySQL service is running (green status)
- Verify MYSQLHOST and MYSQLPORT are correct
- Try again in a few seconds

### Error: "Access denied" (ER_ACCESS_DENIED_ERROR)
- Double-check MYSQLUSER and MYSQLPASSWORD
- Copy them exactly from Railway (no extra spaces)
- Password might contain special characters - copy carefully

### Error: "Cannot find module 'mysql2'"
- Run: `npm install` in the FullStack_Version directory
- This installs required dependencies

### Script runs but app still shows "Server error during login"
- Make sure you added SESSION_SECRET and NODE_ENV to your Node.js service
- Wait for Railway to finish redeploying (check Deployments tab)
- Check deployment logs for errors

## 💡 Alternative: Manual Setup

If the script doesn't work, you can:
1. Install MySQL Workbench
2. Use the connection details from Railway Public Network tab
3. Connect and run `railway_setup.sql` manually

---

**Need help?** Check the logs output by the script for specific error messages.
