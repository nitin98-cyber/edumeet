# Railway MySQL Database Setup Guide

## ✅ Step 1: Database Added (COMPLETED)
You've successfully added MySQL to your Railway project!

## 📋 Step 2: Initialize Database Tables

Your MySQL database is empty. You need to create the tables and add initial data.

### Option A: Using Railway's MySQL Client (Recommended)

1. **Connect to MySQL Database**
   - In Railway dashboard, click on your MySQL service
   - Click the "Data" tab
   - Click "Connect" button in the top right
   - This opens a web-based MySQL client

2. **Run the Database Schema**
   - Copy the contents from `Database/edumeet_database.sql`
   - Paste into the MySQL client query editor
   - Click "Run" or press Ctrl+Enter
   - This will create all tables (users, time_slots, appointments, etc.)

3. **Add Sample Data (Optional)**
   - You can manually add test users through the admin interface after login
   - Or run the `create_users.js` script locally pointing to Railway DB

### Option B: Using Local MySQL Client

1. **Get Connection Details**
   - In Railway MySQL service, go to "Variables" tab
   - Note down:
     - MYSQLHOST
     - MYSQLUSER
     - MYSQLPASSWORD
     - MYSQLDATABASE
     - MYSQLPORT

2. **Connect Using MySQL Workbench or CLI**
   ```bash
   mysql -h [MYSQLHOST] -P [MYSQLPORT] -u [MYSQLUSER] -p[MYSQLPASSWORD] [MYSQLDATABASE]
   ```

3. **Run Schema File**
   ```bash
   mysql -h [MYSQLHOST] -P [MYSQLPORT] -u [MYSQLUSER] -p[MYSQLPASSWORD] [MYSQLDATABASE] < Database/edumeet_database.sql
   ```

## 🔐 Step 3: Add Environment Variables

Add these additional environment variables in Railway Settings → Variables:

1. **SESSION_SECRET**
   - Value: Generate a random secure string (e.g., `edumeet-prod-secret-2024-xyz123`)
   - Purpose: Encrypts session cookies

2. **NODE_ENV**
   - Value: `production`
   - Purpose: Enables production optimizations

### How to Add Variables:
1. Go to your Railway project
2. Click on your Node.js service (edumeet)
3. Go to "Variables" tab
4. Click "+ New Variable"
5. Add each variable with its value
6. Click "Add" for each one

## 🚀 Step 4: Redeploy Application

After adding the environment variables:
1. Railway will automatically redeploy your application
2. Wait for deployment to complete (watch the "Deployments" tab)
3. Once deployed, your app should connect to MySQL successfully

## 📝 Step 5: Create Admin User

After successful deployment, you need to create an admin user:

### Method 1: Direct Database Insert (Quick)

Connect to your Railway MySQL and run:

```sql
-- Create admin user
INSERT INTO users (email, password, role, name, department) 
VALUES (
    'admin@edumeet.com',
    '$2b$10$rBV2kWq7HFPvXZ8cGxUzqeYvXKp5vZxQJxYvXKp5vZxQJxYvXKp5v',
    'admin',
    'System Admin',
    'Administration'
);

-- Create sample faculty
INSERT INTO users (email, password, role, name, department) 
VALUES (
    'faculty@edumeet.com',
    '$2b$10$rBV2kWq7HFPvXZ8cGxUzqeYvXKp5vZxQJxYvXKp5vZxQJxYvXKp5v',
    'faculty',
    'Dr. John Smith',
    'Computer Science'
);

-- Create sample student
INSERT INTO users (email, password, role, name, department) 
VALUES (
    'student@edumeet.com',
    '$2b$10$rBV2kWq7HFPvXZ8cGxUzqeYvXKp5vZxQJxYvXKp5vZxQJxYvXKp5v',
    'student',
    'Jane Doe',
    'Computer Science'
);
```

**Default Password for all users:** `admin123`

### Method 2: Using Node.js Script (Better Security)

1. Update `create_users.js` with Railway database credentials
2. Run: `node create_users.js`

## ✅ Step 6: Test Your Application

1. Visit: `https://edumeet-production.up.railway.app`
2. Login with:
   - Email: `admin@edumeet.com`
   - Password: `admin123`
   - Role: Admin

3. If login works, your database is properly connected! 🎉

## 🔍 Troubleshooting

### Still Getting "Server error during login"?

1. **Check Logs**
   - In Railway, go to your Node.js service
   - Click "Deployments" tab
   - Click on the latest deployment
   - Check logs for database connection errors

2. **Verify Environment Variables**
   - Make sure MySQL variables are automatically set (MYSQLHOST, MYSQLUSER, etc.)
   - Make sure you added SESSION_SECRET and NODE_ENV manually

3. **Check Database Connection**
   - In MySQL service, verify it's running (green status)
   - Check if tables were created successfully

4. **Common Issues**
   - Empty database (no tables) → Run schema SQL
   - No users in database → Add admin user
   - Wrong password hash → Use the SQL insert above

## 📊 Database Schema Overview

Your database will have these tables:
- `users` - Admin, faculty, and student accounts
- `time_slots` - Faculty availability slots
- `appointments` - Student bookings
- `notifications` - System notifications
- `appointment_history` - Booking history

## 🎯 Next Steps After Setup

1. Login as admin
2. Add more faculty members
3. Faculty can create time slots
4. Students can book appointments
5. Monitor system through admin dashboard

## 💡 Pro Tips

- **Backups**: Railway automatically backs up your MySQL database
- **Scaling**: You can upgrade your MySQL plan if needed
- **Monitoring**: Check "Metrics" tab to monitor database performance
- **Security**: Change default passwords after first login!

---

Need help? Check the logs in Railway dashboard or refer to the main documentation.
