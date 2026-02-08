# 📖 EduMeet Installation Guide

## Quick Start (Windows)

### Method 1: Automated Setup

1. **Install Python** (if not already installed)
   - Download from: https://www.python.org/downloads/
   - During installation, check "Add Python to PATH"

2. **Install MySQL** (if not already installed)
   - Download from: https://dev.mysql.com/downloads/installer/
   - Remember your root password

3. **Run Setup Script**
   ```cmd
   cd Source_Code
   setup.bat
   ```

4. **Setup Database**
   ```cmd
   mysql -u root -p < ../Database/edumeet_database.sql
   ```
   Enter your MySQL password when prompted

5. **Configure Database**
   - Open `Source_Code/config.py`
   - Update the password field with your MySQL password

6. **Run Application**
   ```cmd
   run.bat
   ```

7. **Access Application**
   - Open browser: http://localhost:5000

---

## Method 2: Manual Setup

### Step 1: Install Python Dependencies

```cmd
cd Source_Code
pip install Flask==2.3.0
pip install mysql-connector-python==8.0.33
pip install Werkzeug==2.3.0
```

### Step 2: Create Database

1. Open MySQL Command Line Client or MySQL Workbench
2. Login with your credentials
3. Copy and paste the contents of `Database/edumeet_database.sql`
4. Execute the script

### Step 3: Configure Application

Edit `Source_Code/config.py`:

```python
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'YOUR_MYSQL_PASSWORD',  # Change this!
    'database': 'edumeet_db',
    'raise_on_warnings': True
}

SECRET_KEY = 'your-secret-key-change-in-production'  # Change this!
```

### Step 4: Run Application

```cmd
cd Source_Code
python app.py
```

### Step 5: Access Application

Open your browser and go to: **http://localhost:5000**

---

## 🔐 Test Accounts

After setting up the database, you need to create test accounts:

### Register as Student
1. Go to http://localhost:5000
2. Click "Register as Student"
3. Fill in your details
4. Login with your credentials

### Faculty & Admin Accounts
The database includes sample accounts, but passwords need to be set:

**To create a faculty account:**
```sql
-- Run in MySQL
USE edumeet_db;

-- Insert user (password will be 'faculty123')
INSERT INTO users (email, password, user_type) VALUES
('faculty@college.edu', 'pbkdf2:sha256:600000$salt$hash', 'faculty');

-- Get the user_id from above insert
INSERT INTO faculty (user_id, name, department, designation, phone) VALUES
(LAST_INSERT_ID(), 'Dr. John Doe', 'Computer Science', 'Professor', '9876543210');
```

**Or register through the application and manually update user_type in database:**
```sql
UPDATE users SET user_type = 'faculty' WHERE email = 'your@email.com';
INSERT INTO faculty (user_id, name, department, designation, phone) 
VALUES ((SELECT user_id FROM users WHERE email = 'your@email.com'), 
        'Your Name', 'Department', 'Designation', 'Phone');
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Module not found" error
**Solution:**
```cmd
pip install -r requirements.txt
```

### Issue 2: "Can't connect to MySQL server"
**Solution:**
- Ensure MySQL service is running
- Check Windows Services (services.msc) for MySQL
- Verify credentials in config.py

### Issue 3: "Database 'edumeet_db' doesn't exist"
**Solution:**
```cmd
mysql -u root -p < Database/edumeet_database.sql
```

### Issue 4: "Port 5000 already in use"
**Solution:**
Edit `app.py`, change the port:
```python
app.run(debug=True, host='0.0.0.0', port=5001)
```

### Issue 5: "Access denied for user 'root'@'localhost'"
**Solution:**
- Verify MySQL password
- Update password in `config.py`
- Reset MySQL root password if forgotten

---

## 📱 Testing the Application

### Test as Student:
1. Register a new student account
2. Login
3. View faculty list
4. Book an appointment
5. Check appointment status

### Test as Faculty:
1. Create faculty account (see above)
2. Login as faculty
3. Add time slots
4. View appointment requests
5. Approve/reject appointments

### Test as Admin:
1. Create admin account in database
2. Login as admin
3. View statistics
4. Monitor appointments

---

## 🔒 Security Notes

**For Production Deployment:**

1. Change SECRET_KEY in config.py to a strong random string
2. Set DEBUG = False in config.py
3. Use environment variables for sensitive data
4. Enable HTTPS
5. Use a production WSGI server (Gunicorn, uWSGI)
6. Implement rate limiting
7. Add CSRF protection
8. Regular security updates

---

## 📊 Database Schema

The application uses 5 main tables:
- **users**: Authentication data
- **students**: Student information
- **faculty**: Faculty information
- **time_slots**: Faculty availability
- **appointments**: Booking records

See `Documentation/08_Database_Schema.md` for detailed schema.

---

## 🎯 Next Steps

After successful installation:

1. ✅ Create test accounts
2. ✅ Test all features
3. ✅ Customize as needed
4. ✅ Deploy to production (optional)

---

## 📞 Need Help?

- Check documentation in `Documentation/` folder
- Review error messages carefully
- Ensure all prerequisites are installed
- Verify database connection

---

**Installation Complete! 🎉**

Your EduMeet application is ready to use!
