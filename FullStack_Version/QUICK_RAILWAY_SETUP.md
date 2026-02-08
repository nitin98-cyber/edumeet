# 🚀 Quick Railway Setup - 5 Minutes

## Step 1: Run SQL Script (2 minutes)

1. **Open Railway MySQL Client**
   - Go to your Railway project dashboard
   - Click on the **MySQL** service
   - Click the **"Database"** tab
   - Click **"Connect"** button (top right)

2. **Copy and Paste SQL**
   - Open `FullStack_Version/railway_setup.sql` in your code editor
   - Copy ALL the contents (Ctrl+A, Ctrl+C)
   - Paste into Railway's MySQL query editor
   - Click **"Run"** or press **Ctrl+Enter**

3. **Wait for Success**
   - You should see "Query executed successfully"
   - Tables created: users, time_slots, appointments, notifications, appointment_history
   - Sample data inserted: 1 admin, 3 faculty, 2 students

## Step 2: Add Environment Variables (1 minute)

1. **Go to Your Node.js Service**
   - In Railway dashboard, click on your **edumeet** service (not MySQL)
   - Click **"Variables"** tab

2. **Add These Variables**
   
   Click "+ New Variable" and add:
   
   **Variable 1:**
   - Name: `SESSION_SECRET`
   - Value: `edumeet-railway-secret-2024-xyz789`
   
   **Variable 2:**
   - Name: `NODE_ENV`
   - Value: `production`

3. **Save**
   - Click "Add" for each variable
   - Railway will automatically redeploy

## Step 3: Wait for Deployment (1-2 minutes)

1. **Watch Deployment**
   - Go to **"Deployments"** tab
   - Wait for the latest deployment to show **"Success"** (green checkmark)
   - This usually takes 1-2 minutes

2. **Check Logs** (Optional)
   - Click on the deployment
   - Look for:
     - ✅ Database connected successfully
     - ✓ Database initialized
     - 🎓 EduMeet Server Running

## Step 4: Test Your App! (30 seconds)

1. **Visit Your URL**
   ```
   https://edumeet-production.up.railway.app
   ```

2. **Login as Admin**
   - Email: `admin@edumeet.com`
   - Password: `admin123`
   - Role: Admin

3. **Success!** 🎉
   - If you can login, everything is working!
   - You should see the admin dashboard

## 🎯 Test Accounts

### Admin Account
- **Email:** admin@edumeet.com
- **Password:** admin123
- **Access:** Full system control

### Faculty Accounts
- **Email:** priya.sharma@college.edu
- **Password:** admin123
- **Department:** Computer Science

- **Email:** rajesh.kumar@college.edu
- **Password:** admin123
- **Department:** Information Technology

### Student Accounts
- **Email:** rahul.kumar@student.edu
- **Password:** admin123
- **Roll:** 2021001

- **Email:** priya.singh@student.edu
- **Password:** admin123
- **Roll:** 2021002

## ⚠️ Troubleshooting

### Still Getting "Server error during login"?

**Check 1: Database Tables Created?**
- In Railway MySQL, click "Data" tab
- You should see 5 tables listed
- If not, run the SQL script again

**Check 2: Environment Variables Set?**
- In your Node.js service, check "Variables" tab
- Should have: SESSION_SECRET, NODE_ENV
- Plus auto-generated: MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE, MYSQLPORT

**Check 3: Deployment Successful?**
- Check "Deployments" tab
- Latest deployment should be green (Success)
- If red (Failed), click it and check error logs

**Check 4: View Logs**
- In "Deployments", click latest deployment
- Look for errors in the logs
- Common issues:
  - "Database connection failed" → MySQL not running
  - "Cannot find module" → Dependency issue
  - "ECONNREFUSED" → Wrong database credentials

### Database Connection Issues?

Run this query in Railway MySQL to verify data:
```sql
SELECT COUNT(*) as user_count FROM users;
```
Should return: 6 users (1 admin + 3 faculty + 2 students)

### Need to Reset Database?

```sql
-- Drop all tables
DROP TABLE IF EXISTS appointment_history;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS time_slots;
DROP TABLE IF EXISTS users;

-- Then run railway_setup.sql again
```

## 🔐 Security Notes

**IMPORTANT:** After first login, change these passwords!

1. Login as admin
2. Go to user management
3. Update passwords for all accounts
4. Use strong, unique passwords

## 📊 What's Included

Your database now has:
- ✅ 1 Admin account
- ✅ 3 Faculty members with different departments
- ✅ 2 Student accounts
- ✅ 10 Sample time slots (next 3 days)
- ✅ 2 Sample appointments
- ✅ 3 Sample notifications

## 🎓 Next Steps

1. **Explore Admin Dashboard**
   - View all users
   - Monitor appointments
   - Check system statistics

2. **Test Faculty Features**
   - Login as faculty
   - Create new time slots
   - Manage appointments

3. **Test Student Features**
   - Login as student
   - Browse available slots
   - Book appointments

4. **Customize**
   - Add more users
   - Update departments
   - Configure settings

## 💡 Pro Tips

- **Bookmark your URL:** https://edumeet-production.up.railway.app
- **Monitor usage:** Check Railway dashboard for metrics
- **Free tier:** Railway gives you $5 credit/month (enough for testing)
- **Upgrade:** If you need more, upgrade to Pro plan
- **Backups:** Railway auto-backs up your MySQL database

---

**Need more help?** Check `RAILWAY_DATABASE_SETUP.md` for detailed instructions.

**Everything working?** Start using your app! 🚀
