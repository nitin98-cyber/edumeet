# 🚀 Complete Setup Guide - EduMeet Full Stack

## Modern Faculty Appointment System (Node.js + MySQL + HTML/CSS/JS)

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation Steps](#installation-steps)
3. [Configuration](#configuration)
4. [Running the Application](#running-the-application)
5. [Default Credentials](#default-credentials)
6. [Features Overview](#features-overview)
7. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/)
- **Git** (optional) - [Download](https://git-scm.com/)

### Check Installations
```bash
node --version    # Should show v16.x.x or higher
npm --version     # Should show 8.x.x or higher
mysql --version   # Should show 8.0.x or higher
```

---

## 📦 Installation Steps

### Step 1: Navigate to Project Directory
```bash
cd FullStack_Version
```

### Step 2: Install Node.js Dependencies
```bash
npm install
```

This will install:
- express (Web framework)
- mysql2 (MySQL driver)
- bcryptjs (Password hashing)
- express-session (Session management)
- dotenv (Environment variables)
- body-parser (Request parsing)
- cors (Cross-origin resource sharing)

### Step 3: Setup MySQL Database

#### Option A: Using MySQL Command Line
```bash
# Login to MySQL
mysql -u root -p

# Run the database script
source ../Database/edumeet_database.sql

# Verify database creation
SHOW DATABASES;
USE edumeet_db;
SHOW TABLES;
```

#### Option B: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to your MySQL server
3. File → Open SQL Script
4. Select `../Database/edumeet_database.sql`
5. Execute the script (⚡ icon)

### Step 4: Configure Environment Variables

Create or edit the `.env` file in `FullStack_Version` folder:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=edumeet_db
DB_PORT=3306

# Server Configuration
PORT=3000
NODE_ENV=development

# Session Secret (Change this to a random string)
SESSION_SECRET=your-super-secret-key-change-this-in-production
```

**Important:** Replace `your_mysql_password_here` with your actual MySQL password!

---

## 🎯 Running the Application

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Expected Output
```
╔═══════════════════════════════════════╗
║   🎓 EduMeet Server Running          ║
║   Port: 3000                         ║
║   URL: http://localhost:3000         ║
║   Environment: development           ║
╚═══════════════════════════════════════╝
```

### Access the Application
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🔐 Default Login Credentials

### Admin Account
- **Email:** admin@edumeet.com
- **Password:** admin123
- **Access:** Full system control, manage users, view all data

### Faculty Accounts
1. **Dr. Priya Sharma**
   - Email: priya.sharma@college.edu
   - Password: faculty123
   - Department: Computer Science

2. **Dr. Rajesh Kumar**
   - Email: rajesh.kumar@college.edu
   - Password: faculty123
   - Department: Information Technology

3. **Dr. Anita Verma**
   - Email: anita.verma@college.edu
   - Password: faculty123
   - Department: Computer Science

### Student Accounts
1. **Rahul Kumar**
   - Email: rahul.kumar@student.edu
   - Password: student123
   - Roll: 2021001

2. **Priya Singh**
   - Email: priya.singh@student.edu
   - Password: student123
   - Roll: 2021002

---

## ✨ Features Overview

### 🎨 Modern UI/UX
- **Advanced Animations:** Smooth transitions, hover effects, scale animations
- **Dark Mode:** Toggle between light and dark themes (persistent)
- **Glassmorphism:** Modern frosted glass card designs
- **Responsive:** Works on desktop, tablet, and mobile
- **Interactive Charts:** Real-time data visualization with Chart.js

### 👨‍🎓 Student Features
- View faculty list with details
- Browse available time slots
- Book appointments with reason
- Track appointment status (Pending/Approved/Rejected)
- Cancel pending appointments
- Real-time notifications
- Dashboard with statistics and charts

### 👨‍🏫 Faculty Features
- Create and manage time slots
- View appointment requests
- Approve/Reject appointments
- Delete unused time slots
- Dashboard with analytics
- Real-time notifications
- View appointment history

### 👨‍💼 Admin Features
- System-wide statistics
- Manage students (Add/Delete)
- Manage faculty (Add/Delete)
- View all appointments
- Interactive charts and analytics
- User management dashboard

---

## 🔧 Troubleshooting

### Issue: Database Connection Error

**Error Message:** `Error: connect ECONNREFUSED`

**Solutions:**
1. Check if MySQL is running:
   ```bash
   # Windows
   net start MySQL80
   
   # Linux/Mac
   sudo systemctl start mysql
   ```

2. Verify database credentials in `.env` file
3. Test MySQL connection:
   ```bash
   mysql -u root -p
   ```

### Issue: Port Already in Use

**Error Message:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solutions:**
1. Change port in `.env` file:
   ```env
   PORT=3001
   ```

2. Or kill the process using port 3000:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # Linux/Mac
   lsof -ti:3000 | xargs kill -9
   ```

### Issue: Module Not Found

**Error Message:** `Error: Cannot find module 'express'`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Session Not Working

**Symptoms:** Login works but redirects back to login page

**Solutions:**
1. Clear browser cookies
2. Check SESSION_SECRET in `.env`
3. Restart the server
4. Try incognito/private browsing mode

### Issue: Charts Not Displaying

**Solutions:**
1. Check browser console for errors (F12)
2. Ensure Chart.js CDN is loading
3. Clear browser cache (Ctrl+Shift+Delete)
4. Check if data is being fetched from API

### Issue: Animations Not Working

**Solutions:**
1. Check if CSS file is loading properly
2. Clear browser cache
3. Ensure JavaScript files are loaded
4. Check browser console for errors

---

## 📁 Project Structure

```
FullStack_Version/
├── config/
│   └── database.js          # MySQL connection pool
├── middleware/
│   └── auth.js              # Authentication middleware
├── routes/
│   ├── auth.js              # Login/logout routes
│   ├── student.js           # Student API routes
│   ├── faculty.js           # Faculty API routes
│   ├── admin.js             # Admin API routes
│   └── api.js               # General API routes
├── public/
│   ├── css/
│   │   └── style.css        # Main stylesheet (animations, themes)
│   ├── js/
│   │   ├── main.js          # Core JavaScript functions
│   │   ├── student.js       # Student dashboard logic
│   │   ├── faculty.js       # Faculty dashboard logic
│   │   └── admin.js         # Admin dashboard logic
│   ├── student/
│   │   ├── dashboard.html   # Student dashboard
│   │   └── book.html        # Book appointment page
│   ├── faculty/
│   │   └── dashboard.html   # Faculty dashboard
│   ├── admin/
│   │   └── dashboard.html   # Admin dashboard
│   ├── index.html           # Landing page
│   └── login.html           # Login page
├── .env                     # Environment variables
├── package.json             # Dependencies
├── server.js                # Main server file
└── README.md                # Documentation
```

---

## 🎨 Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Backend** | Node.js + Express.js | Server and API |
| **Database** | MySQL 8.0+ | Data storage |
| **Frontend** | HTML5, CSS3, JavaScript | User interface |
| **Charts** | Chart.js | Data visualization |
| **Authentication** | express-session + bcryptjs | Security |
| **Styling** | Custom CSS3 | Animations & themes |

---

## 🔒 Security Features

- ✅ Password hashing with bcryptjs (10 rounds)
- ✅ Session-based authentication
- ✅ SQL injection prevention (prepared statements)
- ✅ XSS protection (input sanitization)
- ✅ CORS configuration
- ✅ Secure session cookies
- ✅ Environment variable protection

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Check session status

### Student
- `GET /api/student/dashboard` - Get dashboard data
- `GET /api/student/faculty` - Get faculty list
- `GET /api/student/slots/:facultyId` - Get available slots
- `POST /api/student/book` - Book appointment
- `POST /api/student/cancel/:id` - Cancel appointment

### Faculty
- `GET /api/faculty/dashboard` - Get dashboard data
- `POST /api/faculty/slots` - Add time slot
- `DELETE /api/faculty/slots/:id` - Delete slot
- `POST /api/faculty/appointments/:id/approve` - Approve
- `POST /api/faculty/appointments/:id/reject` - Reject

### Admin
- `GET /api/admin/dashboard` - Get statistics
- `GET /api/admin/students` - Get all students
- `POST /api/admin/students` - Add student
- `DELETE /api/admin/students/:id` - Delete student
- `GET /api/admin/faculty` - Get all faculty
- `POST /api/admin/faculty` - Add faculty
- `DELETE /api/admin/faculty/:id` - Delete faculty

---

## 🎯 Quick Start Commands

```bash
# Install dependencies
npm install

# Setup database
mysql -u root -p < ../Database/edumeet_database.sql

# Configure .env file
# Edit .env with your MySQL password

# Start development server
npm run dev

# Open browser
# Navigate to http://localhost:3000
```

---

## 🌟 Key Features Showcase

### 1. Animated Statistics Cards
- Count-up animation from 0 to actual value
- Progress bars with smooth fill animation
- Hover effects with scale and shadow
- Icon bounce animation

### 2. Interactive Charts
- Doughnut charts for status distribution
- Line charts for appointment trends
- Smooth animations on load
- Theme-aware colors

### 3. Dark Mode
- Smooth theme transition (0.3s)
- Persistent preference (localStorage)
- All components adapt automatically
- Easy toggle in navbar

### 4. Glassmorphism Design
- Frosted glass effect on cards
- Backdrop blur filter
- Semi-transparent backgrounds
- Modern and elegant look

### 5. Responsive Design
- Mobile-first approach
- Breakpoints: 768px, 1024px, 1400px
- Touch-friendly buttons
- Optimized for all screen sizes

---

## 📝 Development Tips

### Hot Reload
Use `npm run dev` for automatic server restart on file changes.

### Debugging
- Check browser console (F12) for frontend errors
- Check terminal for backend errors
- Use `console.log()` for debugging
- Enable detailed error messages in development

### Database Changes
After modifying database schema:
```bash
mysql -u root -p edumeet_db < your_changes.sql
```

### Adding New Features
1. Create route in `routes/` folder
2. Add API endpoint in server.js
3. Create frontend HTML/JS
4. Test thoroughly

---

## 🎉 Success Checklist

- [ ] Node.js and MySQL installed
- [ ] Dependencies installed (`npm install`)
- [ ] Database created and populated
- [ ] `.env` file configured
- [ ] Server starts without errors
- [ ] Can access http://localhost:3000
- [ ] Can login with default credentials
- [ ] Dashboard loads with animations
- [ ] Charts display correctly
- [ ] Dark mode toggle works
- [ ] Can book appointments
- [ ] Notifications work

---

## 📞 Support

If you encounter issues:
1. Check this guide thoroughly
2. Review error messages in terminal
3. Check browser console (F12)
4. Verify database connection
5. Ensure all dependencies are installed
6. Try restarting the server

---

## 🎊 Congratulations!

You've successfully set up EduMeet Full Stack! 

**Enjoy your modern, animated, full-featured appointment management system!** 🚀

---

**Built with ❤️ using Node.js, Express, MySQL, and Vanilla JavaScript**

**No Python. No PHP. Pure JavaScript Full Stack!** ✨

