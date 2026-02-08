# 🔐 EduMeet Login Credentials

## 🌐 Login URL
**http://localhost:5000/login**

---

## 👨‍💼 ADMIN ACCOUNT

| Field | Value |
|-------|-------|
| **Email** | admin@edumeet.com |
| **Password** | admin123 |
| **User Type** | Admin |

**Admin Features:**
- View system statistics
- Monitor all appointments
- View all users
- System dashboard

---

## 👨‍🏫 FACULTY ACCOUNTS

### Faculty 1 - Dr. Priya Sharma
| Field | Value |
|-------|-------|
| **Email** | priya.sharma@college.edu |
| **Password** | faculty123 |
| **User Type** | Faculty |
| **Department** | Computer Science |
| **Designation** | Professor |

### Faculty 2 - Dr. Rajesh Kumar
| Field | Value |
|-------|-------|
| **Email** | rajesh.kumar@college.edu |
| **Password** | faculty123 |
| **User Type** | Faculty |
| **Department** | Information Technology |
| **Designation** | Associate Professor |

### Faculty 3 - Dr. Anita Verma
| Field | Value |
|-------|-------|
| **Email** | anita.verma@college.edu |
| **Password** | faculty123 |
| **User Type** | Faculty |
| **Department** | Computer Science |
| **Designation** | Assistant Professor |

**Faculty Features:**
- Add/manage time slots
- View appointment requests
- Approve/reject appointments
- View appointment history

---

## 👨‍🎓 STUDENT ACCOUNTS

### Student 1 - Rahul Kumar
| Field | Value |
|-------|-------|
| **Email** | rahul.kumar@student.edu |
| **Password** | student123 |
| **User Type** | Student |
| **Roll Number** | 2021001 |
| **Department** | Computer Science |

### Student 2 - Priya Singh
| Field | Value |
|-------|-------|
| **Email** | priya.singh@student.edu |
| **Password** | student123 |
| **User Type** | Student |
| **Roll Number** | 2021002 |
| **Department** | Information Technology |

**Student Features:**
- View faculty list
- View available time slots
- Book appointments
- Track appointment status
- Cancel appointments

---

## 🎯 Quick Test Workflow

1. **Login as Faculty** (priya.sharma@college.edu / faculty123)
   - Add some time slots for future dates
   - Logout

2. **Login as Student** (rahul.kumar@student.edu / student123)
   - View faculty list
   - Select Dr. Priya Sharma
   - View available slots
   - Book an appointment
   - Logout

3. **Login as Faculty** (priya.sharma@college.edu / faculty123)
   - View appointment requests
   - Approve or reject the appointment
   - Logout

4. **Login as Admin** (admin@edumeet.com / admin123)
   - View system statistics
   - Monitor all appointments

---

## 📝 Notes

- All passwords are hashed using Werkzeug's password hashing
- You can register new student accounts through the registration page
- Faculty and Admin accounts must be created through the database
- Default passwords are for testing only - change them in production

---

## 🔄 Reset Passwords

If you need to reset passwords, run:
```bash
cd Source_Code
python create_users.py
```

This will update all test accounts with the default passwords.

---

**Last Updated:** February 6, 2026
