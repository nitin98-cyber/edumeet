# ⚡ EduMeet Quick Start Guide

## 🚀 Get Started in 5 Minutes!

### Prerequisites Check ✅
- [ ] Python 3.8+ installed
- [ ] MySQL Server installed and running
- [ ] pip installed

---

## 📝 Step-by-Step Setup

### 1️⃣ Install Dependencies (1 minute)
```cmd
cd Source_Code
pip install -r requirements.txt
```

### 2️⃣ Setup Database (1 minute)
```cmd
mysql -u root -p < ../Database/edumeet_database.sql
```
*Enter your MySQL password when prompted*

### 3️⃣ Configure Database (30 seconds)
Open `Source_Code/config.py` and update:
```python
'password': 'your_mysql_password_here'
```

### 4️⃣ Run Application (10 seconds)
```cmd
python app.py
```

### 5️⃣ Access Application (10 seconds)
Open browser: **http://localhost:5000**

---

## 🎯 First Time Usage

### Register as Student:
1. Click "Register as Student"
2. Fill in details
3. Login with your credentials
4. Start booking appointments!

### Test the System:
1. Register 2-3 student accounts
2. Create faculty accounts (see INSTALLATION_GUIDE.md)
3. Faculty: Add time slots
4. Students: Book appointments
5. Faculty: Approve/Reject
6. Admin: Monitor system

---

## 🔥 Quick Commands

### Windows:
```cmd
# Setup
cd Source_Code
setup.bat

# Run
run.bat
```

### Manual:
```cmd
# Install
pip install Flask mysql-connector-python Werkzeug

# Run
python app.py
```

---

## 🎨 What You'll See

### Home Page
- Welcome message
- Features overview
- Login/Register buttons

### Student Dashboard
- Book appointments
- View appointment status
- Cancel appointments

### Faculty Dashboard
- Manage time slots
- Approve/Reject requests
- View appointments

### Admin Dashboard
- System statistics
- Monitor all appointments
- User management

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't connect to database | Check MySQL is running |
| Module not found | Run `pip install -r requirements.txt` |
| Port 5000 in use | Change port in app.py |
| Login fails | Check database has data |

---

## 📱 Test Accounts

After setup, create accounts by:
1. **Students**: Use registration form
2. **Faculty**: Register then update database
3. **Admin**: Create in database directly

---

## ✨ Key Features to Try

- 📅 Book an appointment
- ⏰ View faculty availability
- ✅ Approve/Reject requests
- 📊 View statistics (Admin)
- 🔔 Track appointment status

---

## 📚 Need More Help?

- **Detailed Setup**: See INSTALLATION_GUIDE.md
- **Full Documentation**: See README.md
- **Project Info**: See PROJECT_SUMMARY.md
- **Technical Docs**: See Documentation/ folder

---

## 🎉 You're Ready!

Your EduMeet system is now running!

**Next Steps:**
1. Create test accounts
2. Explore all features
3. Customize as needed
4. Deploy to production (optional)

---

**Happy Scheduling! 🎓**
