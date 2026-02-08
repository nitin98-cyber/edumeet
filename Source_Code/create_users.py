#!/usr/bin/env python
# Script to create test users with proper passwords
from werkzeug.security import generate_password_hash
import mysql.connector
from config import DB_CONFIG

# Connect to database
conn = mysql.connector.connect(**DB_CONFIG)
cursor = conn.cursor()

print("Creating test users...")

# Clear existing users (optional - comment out if you want to keep existing data)
# cursor.execute("DELETE FROM appointments")
# cursor.execute("DELETE FROM time_slots")
# cursor.execute("DELETE FROM students")
# cursor.execute("DELETE FROM faculty")
# cursor.execute("DELETE FROM users")

# Create Admin User
admin_password = generate_password_hash('admin123')
cursor.execute("INSERT INTO users (email, password, user_type) VALUES (%s, %s, 'admin') ON DUPLICATE KEY UPDATE password = %s",
               ('admin@edumeet.com', admin_password, admin_password))
print("✅ Admin created: admin@edumeet.com / admin123")

# Create Faculty Users
faculty_data = [
    ('priya.sharma@college.edu', 'faculty123', 'Dr. Priya Sharma', 'Computer Science', 'Professor', '9876543210'),
    ('rajesh.kumar@college.edu', 'faculty123', 'Dr. Rajesh Kumar', 'Information Technology', 'Associate Professor', '9876543211'),
    ('anita.verma@college.edu', 'faculty123', 'Dr. Anita Verma', 'Computer Science', 'Assistant Professor', '9876543212')
]

for email, password, name, dept, designation, phone in faculty_data:
    hashed_password = generate_password_hash(password)
    
    # Insert or update user
    cursor.execute("INSERT INTO users (email, password, user_type) VALUES (%s, %s, 'faculty') ON DUPLICATE KEY UPDATE password = %s",
                   (email, hashed_password, hashed_password))
    user_id = cursor.lastrowid
    
    # Get user_id if it already exists
    if user_id == 0:
        cursor.execute("SELECT user_id FROM users WHERE email = %s", (email,))
        user_id = cursor.fetchone()[0]
    
    # Insert or update faculty
    cursor.execute("""INSERT INTO faculty (user_id, name, department, designation, phone) 
                      VALUES (%s, %s, %s, %s, %s)
                      ON DUPLICATE KEY UPDATE name = %s, department = %s, designation = %s, phone = %s""",
                   (user_id, name, dept, designation, phone, name, dept, designation, phone))
    
    print(f"✅ Faculty created: {email} / faculty123")

# Create Student Users
student_data = [
    ('rahul.kumar@student.edu', 'student123', 'Rahul Kumar', '2021001', 'Computer Science', '9876543213'),
    ('priya.singh@student.edu', 'student123', 'Priya Singh', '2021002', 'Information Technology', '9876543214')
]

for email, password, name, roll, dept, phone in student_data:
    hashed_password = generate_password_hash(password)
    
    # Insert or update user
    cursor.execute("INSERT INTO users (email, password, user_type) VALUES (%s, %s, 'student') ON DUPLICATE KEY UPDATE password = %s",
                   (email, hashed_password, hashed_password))
    user_id = cursor.lastrowid
    
    # Get user_id if it already exists
    if user_id == 0:
        cursor.execute("SELECT user_id FROM users WHERE email = %s", (email,))
        user_id = cursor.fetchone()[0]
    
    # Insert or update student
    cursor.execute("""INSERT INTO students (user_id, name, roll_number, department, phone) 
                      VALUES (%s, %s, %s, %s, %s)
                      ON DUPLICATE KEY UPDATE name = %s, roll_number = %s, department = %s, phone = %s""",
                   (user_id, name, roll, dept, phone, name, roll, dept, phone))
    
    print(f"✅ Student created: {email} / student123")

conn.commit()
cursor.close()
conn.close()

print("\n" + "="*60)
print("✅ ALL TEST USERS CREATED SUCCESSFULLY!")
print("="*60)
print("\n📋 LOGIN CREDENTIALS:\n")
print("ADMIN:")
print("  Email: admin@edumeet.com")
print("  Password: admin123")
print("  User Type: Admin\n")
print("FACULTY:")
print("  Email: priya.sharma@college.edu")
print("  Password: faculty123")
print("  User Type: Faculty\n")
print("  Email: rajesh.kumar@college.edu")
print("  Password: faculty123")
print("  User Type: Faculty\n")
print("  Email: anita.verma@college.edu")
print("  Password: faculty123")
print("  User Type: Faculty\n")
print("STUDENTS:")
print("  Email: rahul.kumar@student.edu")
print("  Password: student123")
print("  User Type: Student\n")
print("  Email: priya.singh@student.edu")
print("  Password: student123")
print("  User Type: Student\n")
print("="*60)
print("🌐 Login at: http://localhost:5000/login")
print("="*60)
