# 👨‍💼 Admin Guide - User Management

## 🎯 New Features Added

### ✅ What Changed:
1. **Public student registration is DISABLED**
2. **Only Admin can add students and faculty**
3. **Admin sets passwords and provides credentials**

---

## 🔐 Admin Login

**URL:** http://localhost:5000/login

| Field | Value |
|-------|-------|
| Email | admin@edumeet.com |
| Password | admin123 |
| User Type | Admin |

---

## 👨‍🎓 How to Add Students

### Step 1: Login as Admin
Go to http://localhost:5000/login and login with admin credentials

### Step 2: Navigate to Student Management
- Click **"Manage Students"** button on the dashboard
- Or go directly to: http://localhost:5000/admin/students

### Step 3: Add New Student
1. Click **"➕ Add New Student"** button
2. Fill in the form:
   - **Full Name** (required)
   - **Email** (required) - This will be their login username
   - **Roll Number** (required)
   - **Department** (required)
   - **Phone Number** (optional)
   - **Password** (required) - Set a password for the student

3. Click **"Add Student"**

### Step 4: Provide Credentials to Student
After adding, you'll see a success message with the login credentials:
```
Student added! Login: student@email.com / Password: password123
```

**IMPORTANT:** Copy these credentials and provide them to the student!

---

## 👨‍🏫 How to Add Faculty

### Step 1: Navigate to Faculty Management
- Click **"Manage Faculty"** button on the dashboard
- Or go to: http://localhost:5000/admin/faculty

### Step 2: Add New Faculty
1. Click **"➕ Add New Faculty"** button
2. Fill in the form:
   - **Full Name** (required) - e.g., "Dr. John Doe"
   - **Email** (required) - Login username
   - **Department** (required)
   - **Designation** (required) - Professor, Associate Professor, etc.
   - **Phone Number** (optional)
   - **Password** (required) - Set a password

3. Click **"Add Faculty"**

### Step 3: Provide Credentials
Copy the credentials from the success message and give them to the faculty member.

---

## 🗑️ How to Delete Users

### Delete Student:
1. Go to **Manage Students**
2. Find the student in the list
3. Click **"Delete"** button
4. Confirm deletion

**Warning:** This will delete:
- Student account
- All their appointments
- Cannot be undone!

### Delete Faculty:
1. Go to **Manage Faculty**
2. Find the faculty in the list
3. Click **"Delete"** button
4. Confirm deletion

**Warning:** This will delete:
- Faculty account
- All their time slots
- All appointments with them
- Cannot be undone!

---

## 📋 View All Users

### View Students:
- Go to: http://localhost:5000/admin/students
- See complete list with:
  - ID, Name, Roll Number
  - Email, Department, Phone
  - Registration date

### View Faculty:
- Go to: http://localhost:5000/admin/faculty
- See complete list with:
  - ID, Name, Email
  - Department, Designation, Phone
  - Registration date

---

## 🎯 Quick Workflow Example

### Adding a New Student:

1. **Login as Admin**
   - Email: admin@edumeet.com
   - Password: admin123

2. **Add Student**
   - Name: "John Smith"
   - Email: "john.smith@student.edu"
   - Roll: "2026001"
   - Department: "Computer Science"
   - Password: "john123"

3. **Copy Credentials**
   ```
   Email: john.smith@student.edu
   Password: john123
   User Type: Student
   ```

4. **Provide to Student**
   - Send via email, or
   - Print and hand over, or
   - Share securely

5. **Student Can Now Login**
   - Go to http://localhost:5000/login
   - Use provided credentials
   - Start booking appointments!

---

## 🔒 Security Best Practices

1. **Strong Passwords**
   - Use minimum 8 characters
   - Mix letters, numbers, symbols
   - Don't use common passwords

2. **Secure Credential Sharing**
   - Don't share passwords via unsecured channels
   - Ask users to change password after first login (future feature)
   - Keep a secure record of credentials

3. **Regular Cleanup**
   - Remove inactive student accounts
   - Delete graduated students
   - Archive old data

---

## ❓ FAQ

**Q: Can students register themselves?**
A: No, only admin can create student accounts.

**Q: What if a student forgets their password?**
A: Admin needs to delete the old account and create a new one with a new password (or implement password reset feature).

**Q: Can I edit user details after creation?**
A: Currently no, you need to delete and recreate. (Edit feature can be added later)

**Q: How many users can I add?**
A: Unlimited! The system can handle thousands of users.

**Q: Can faculty add other faculty?**
A: No, only admin can add faculty members.

---

## 📞 Support

For issues or questions:
- Check the main README.md
- Review LOGIN_CREDENTIALS.md for test accounts
- Check the application logs

---

**Last Updated:** February 6, 2026
**Version:** 2.0 (Admin-Controlled Registration)
