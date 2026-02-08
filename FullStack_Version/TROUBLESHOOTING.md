# 🔧 EduMeet Troubleshooting Guide

## Common Issues and Solutions

### ❌ Issue: "Failed to load dashboard data"

#### ✅ Solution 1: Hard Refresh Browser
```
Windows: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

#### ✅ Solution 2: Clear Browser Cache
1. Press `F12` (Developer Tools)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

#### ✅ Solution 3: Check Browser Console
1. Press `F12`
2. Click "Console" tab
3. Look for red error messages
4. Common errors:
   - `401 Unauthorized` → Session expired, login again
   - `500 Internal Server Error` → Check server logs
   - `Failed to fetch` → Server not running

#### ✅ Solution 4: Verify Session
1. Logout completely
2. Close all browser tabs
3. Open new tab
4. Login again

---

### ❌ Issue: CSS/Animations Not Loading

#### ✅ Solution: Check File Paths
All CSS/JS files should use absolute paths:
```html
<!-- ✅ CORRECT -->
<link rel="stylesheet" href="/css/style.css">
<script src="/js/main.js"></script>

<!-- ❌ WRONG -->
<link rel="stylesheet" href="../css/style.css">
<script src="../js/main.js"></script>
```

#### ✅ Test Static Files:
```
http://localhost:3000/css/style.css (should show CSS code)
http://localhost:3000/js/main.js (should show JavaScript code)
```

---

### ❌ Issue: Server Not Starting

#### ✅ Check Port 3000:
```bash
netstat -ano | findstr :3000
```

If port is in use:
```bash
# Kill the process
taskkill /F /PID [PID_NUMBER]

# Or change port in .env file
PORT=3001
```

#### ✅ Check Database Connection:
```bash
# Test MySQL connection
mysql -u root -p
```

Verify `.env` file:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=edumeet_db
```

---

### ❌ Issue: Login Not Working

#### ✅ Verify Credentials:
```
Admin: admin@edumeet.com / admin123
Faculty: priya.sharma@college.edu / faculty123
Student: rahul.kumar@student.edu / student123
```

#### ✅ Check Database Users:
```sql
SELECT email, user_type FROM users;
```

#### ✅ Recreate Users:
```bash
cd FullStack_Version
node create_users.js
```

---

### ❌ Issue: Charts Not Displaying

#### ✅ Check Chart.js CDN:
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

#### ✅ Verify Internet Connection:
Charts require Chart.js from CDN. Check if you can access:
```
https://cdn.jsdelivr.net/npm/chart.js
```

#### ✅ Check Console for Errors:
```
F12 > Console > Look for "Chart is not defined"
```

---

### ❌ Issue: Notifications Not Working

#### ✅ Check Notifications Table:
```sql
SHOW TABLES LIKE 'notifications';
```

If missing, create it:
```sql
CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    user_type ENUM('student', 'faculty', 'admin') NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### ❌ Issue: Appointments Not Showing

#### ✅ Check Database Data:
```sql
SELECT * FROM appointments;
SELECT * FROM time_slots;
```

#### ✅ Create Test Data:
1. Login as Faculty
2. Add time slots
3. Login as Student
4. Book appointment

---

### ❌ Issue: Dark Mode Not Working

#### ✅ Check localStorage:
```javascript
// In browser console (F12)
localStorage.getItem('theme')
```

#### ✅ Clear and Reset:
```javascript
// In browser console
localStorage.clear()
location.reload()
```

---

## Debugging Steps

### 1. Check Server Status
```bash
cd FullStack_Version
npm run dev
```

Expected output:
```
╔═══════════════════════════════════════╗
║   🎓 EduMeet Server Running          ║
║   Port: 3000                         ║
║   URL: http://localhost:3000         ║
║   Environment: development           ║
╚═══════════════════════════════════════╝
✅ Database connected successfully
```

### 2. Check Database Connection
```bash
mysql -u root -p
USE edumeet_db;
SHOW TABLES;
```

Expected tables:
- users
- students
- faculty
- admin
- time_slots
- appointments
- notifications

### 3. Check Browser Console
```
F12 > Console
```

Look for:
- ✅ No red errors
- ✅ API calls returning 200 status
- ✅ Data being logged

### 4. Check Network Tab
```
F12 > Network > XHR
```

Look for:
- `/api/student/dashboard` → 200 OK
- `/api/faculty/dashboard` → 200 OK
- `/api/admin/dashboard` → 200 OK

---

## Quick Fixes

### Reset Everything:
```bash
# 1. Stop server (Ctrl+C)
# 2. Clear sessions
# 3. Restart server
cd FullStack_Version
npm run dev
```

### Recreate Database:
```bash
mysql -u root -p < Database/edumeet_database.sql
cd FullStack_Version
node create_users.js
```

### Clear Browser Data:
```
1. Press Ctrl + Shift + Delete
2. Select "Cookies and other site data"
3. Select "Cached images and files"
4. Click "Clear data"
5. Restart browser
```

---

## Getting Help

### Check Logs:
1. **Server logs**: Terminal where `npm run dev` is running
2. **Browser console**: F12 > Console
3. **Network errors**: F12 > Network

### Common Error Messages:

#### "Cannot GET /api/..."
- Route not defined
- Check `server.js` for route imports

#### "401 Unauthorized"
- Not logged in
- Session expired
- Login again

#### "500 Internal Server Error"
- Database error
- Check server logs
- Verify database connection

#### "Failed to fetch"
- Server not running
- Wrong URL
- CORS issue

---

## Performance Tips

### Speed Up Loading:
1. Use Chrome/Edge (best performance)
2. Enable hardware acceleration
3. Close unnecessary tabs
4. Clear cache regularly

### Optimize Database:
```sql
-- Add indexes for faster queries
CREATE INDEX idx_appointments_student ON appointments(student_id);
CREATE INDEX idx_appointments_faculty ON appointments(faculty_id);
CREATE INDEX idx_slots_faculty ON time_slots(faculty_id);
```

---

## Contact & Support

If issues persist:
1. Check all files in `FullStack_Version/` folder
2. Verify all dependencies installed: `npm install`
3. Check Node.js version: `node --version` (should be 14+)
4. Check MySQL version: `mysql --version` (should be 5.7+)

---

**Most issues are resolved by:**
1. Hard refresh browser (Ctrl + Shift + R)
2. Clear cache and cookies
3. Restart server
4. Re-login

🎉 **Your application should work smoothly after following these steps!**
