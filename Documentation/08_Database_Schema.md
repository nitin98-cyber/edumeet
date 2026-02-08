# DATABASE SCHEMA
## EduMeet: Faculty Availability & Appointment System

---

## 1. DATABASE OVERVIEW

### Database Name
`edumeet_db`

### Database Management System
MySQL 5.7 or higher

### Total Tables
5 tables

### Relationships
- Foreign Key constraints for data integrity
- One-to-Many relationships between tables

---

## 2. ER DIAGRAM (Entity-Relationship Diagram)

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│    users    │         │  students   │         │   faculty   │
├─────────────┤         ├─────────────┤         ├─────────────┤
│ user_id (PK)│◄────────│student_id(PK│         │faculty_id(PK│
│ email       │         │ user_id (FK)│         │ user_id (FK)│
│ password    │         │ name        │         │ name        │
│ user_type   │         │ roll_number │         │ department  │
│ created_at  │         │ department  │         │ designation │
└─────────────┘         │ phone       │         │ phone       │
                        └─────────────┘         └──────┬──────┘
                               │                       │
                               │                       │
                               │                       │
                        ┌──────▼───────────────────────▼──────┐
                        │        appointments                 │
                        ├─────────────────────────────────────┤
                        │ appointment_id (PK)                 │
                        │ student_id (FK)                     │
                        │ faculty_id (FK)                     │
                        │ slot_id (FK)                        │
                        │ reason                              │
                        │ status                              │
                        │ created_at                          │
                        │ updated_at                          │
                        └──────────────┬──────────────────────┘
                                       │
                                       │
                        ┌──────────────▼──────────────┐
                        │       time_slots            │
                        ├─────────────────────────────┤
                        │ slot_id (PK)                │
                        │ faculty_id (FK)             │
                        │ date                        │
                        │ start_time                  │
                        │ end_time                    │
                        │ is_available                │
                        │ created_at                  │
                        └─────────────────────────────┘
```

---

## 3. TABLE STRUCTURES

### Table 1: users

**Purpose:** Stores common information for all users (students, faculty, admin)

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| user_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| email | VARCHAR(100) | UNIQUE, NOT NULL | User email address |
| password | VARCHAR(255) | NOT NULL | Hashed password |
| user_type | ENUM('student', 'faculty', 'admin') | NOT NULL | Type of user |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation time |

**SQL Create Statement:**
```sql
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('student', 'faculty', 'admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### Table 2: students

**Purpose:** Stores student-specific information

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| student_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique student identifier |
| user_id | INT | FOREIGN KEY, UNIQUE, NOT NULL | Reference to users table |
| name | VARCHAR(100) | NOT NULL | Student full name |
| roll_number | VARCHAR(50) | UNIQUE, NOT NULL | Student roll number |
| department | VARCHAR(100) | NOT NULL | Department name |
| phone | VARCHAR(15) | NULL | Contact number |

**SQL Create Statement:**
```sql
CREATE TABLE students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    roll_number VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

---

### Table 3: faculty

**Purpose:** Stores faculty-specific information

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| faculty_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique faculty identifier |
| user_id | INT | FOREIGN KEY, UNIQUE, NOT NULL | Reference to users table |
| name | VARCHAR(100) | NOT NULL | Faculty full name |
| department | VARCHAR(100) | NOT NULL | Department name |
| designation | VARCHAR(50) | NOT NULL | Job title (Professor, Lecturer) |
| phone | VARCHAR(15) | NULL | Contact number |

**SQL Create Statement:**
```sql
CREATE TABLE faculty (
    faculty_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(50) NOT NULL,
    phone VARCHAR(15),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

---

### Table 4: time_slots

**Purpose:** Stores faculty availability time slots

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| slot_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique slot identifier |
| faculty_id | INT | FOREIGN KEY, NOT NULL | Reference to faculty table |
| date | DATE | NOT NULL | Slot date |
| start_time | TIME | NOT NULL | Slot start time |
| end_time | TIME | NOT NULL | Slot end time |
| is_available | BOOLEAN | DEFAULT TRUE | Availability status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Slot creation time |

**SQL Create Statement:**
```sql
CREATE TABLE time_slots (
    slot_id INT PRIMARY KEY AUTO_INCREMENT,
    faculty_id INT NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id) ON DELETE CASCADE
);
```

---

### Table 5: appointments

**Purpose:** Stores appointment booking information

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| appointment_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique appointment identifier |
| student_id | INT | FOREIGN KEY, NOT NULL | Reference to students table |
| faculty_id | INT | FOREIGN KEY, NOT NULL | Reference to faculty table |
| slot_id | INT | FOREIGN KEY, NOT NULL | Reference to time_slots table |
| reason | TEXT | NOT NULL | Purpose of appointment |
| status | ENUM('Pending', 'Approved', 'Rejected', 'Cancelled', 'Completed') | DEFAULT 'Pending' | Appointment status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Booking time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

**SQL Create Statement:**
```sql
CREATE TABLE appointments (
    appointment_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    faculty_id INT NOT NULL,
    slot_id INT NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected', 'Cancelled', 'Completed') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id) ON DELETE CASCADE,
    FOREIGN KEY (slot_id) REFERENCES time_slots(slot_id) ON DELETE CASCADE
);
```

---

## 4. RELATIONSHIPS

### 1. users → students (One-to-One)
- One user can be one student
- Foreign Key: students.user_id → users.user_id
- ON DELETE CASCADE: If user is deleted, student record is also deleted

### 2. users → faculty (One-to-One)
- One user can be one faculty
- Foreign Key: faculty.user_id → users.user_id
- ON DELETE CASCADE: If user is deleted, faculty record is also deleted

### 3. faculty → time_slots (One-to-Many)
- One faculty can have multiple time slots
- Foreign Key: time_slots.faculty_id → faculty.faculty_id
- ON DELETE CASCADE: If faculty is deleted, all their slots are deleted

### 4. students → appointments (One-to-Many)
- One student can have multiple appointments
- Foreign Key: appointments.student_id → students.student_id
- ON DELETE CASCADE: If student is deleted, all their appointments are deleted

### 5. faculty → appointments (One-to-Many)
- One faculty can have multiple appointments
- Foreign Key: appointments.faculty_id → faculty.faculty_id
- ON DELETE CASCADE: If faculty is deleted, all their appointments are deleted

### 6. time_slots → appointments (One-to-One)
- One time slot can have one appointment
- Foreign Key: appointments.slot_id → time_slots.slot_id
- ON DELETE CASCADE: If slot is deleted, appointment is also deleted

---

## 5. INDEXES

### Purpose of Indexes
Indexes improve query performance by allowing faster data retrieval.

### Recommended Indexes

```sql
-- Index on email for faster login queries
CREATE INDEX idx_email ON users(email);

-- Index on user_type for filtering users
CREATE INDEX idx_user_type ON users(user_type);

-- Index on roll_number for student search
CREATE INDEX idx_roll_number ON students(roll_number);

-- Index on faculty_id and date for slot queries
CREATE INDEX idx_faculty_date ON time_slots(faculty_id, date);

-- Index on student_id for appointment queries
CREATE INDEX idx_student_appointments ON appointments(student_id);

-- Index on faculty_id for appointment queries
CREATE INDEX idx_faculty_appointments ON appointments(faculty_id);

-- Index on status for filtering appointments
CREATE INDEX idx_appointment_status ON appointments(status);
```

---

## 6. SAMPLE DATA

### Sample Users
```sql
INSERT INTO users (email, password, user_type) VALUES
('student1@college.edu', 'hashed_password_1', 'student'),
('faculty1@college.edu', 'hashed_password_2', 'faculty'),
('admin@college.edu', 'hashed_password_3', 'admin');
```

### Sample Students
```sql
INSERT INTO students (user_id, name, roll_number, department, phone) VALUES
(1, 'Rahul Kumar', '2021001', 'Computer Science', '9876543210');
```

### Sample Faculty
```sql
INSERT INTO faculty (user_id, name, department, designation, phone) VALUES
(2, 'Dr. Priya Sharma', 'Computer Science', 'Professor', '9876543211');
```

### Sample Time Slots
```sql
INSERT INTO time_slots (faculty_id, date, start_time, end_time, is_available) VALUES
(1, '2026-02-10', '10:00:00', '11:00:00', TRUE),
(1, '2026-02-10', '14:00:00', '15:00:00', TRUE);
```

### Sample Appointments
```sql
INSERT INTO appointments (student_id, faculty_id, slot_id, reason, status) VALUES
(1, 1, 1, 'Project discussion', 'Pending');
```

---

## 7. DATABASE QUERIES

### Common Queries Used in Application

#### 1. User Login
```sql
SELECT user_id, email, user_type 
FROM users 
WHERE email = 'student1@college.edu' AND password = 'hashed_password';
```

#### 2. Get Faculty List
```sql
SELECT f.faculty_id, f.name, f.department, f.designation 
FROM faculty f
ORDER BY f.name;
```

#### 3. Get Available Slots for Faculty
```sql
SELECT slot_id, date, start_time, end_time 
FROM time_slots 
WHERE faculty_id = 1 
  AND date >= CURDATE() 
  AND is_available = TRUE
ORDER BY date, start_time;
```

#### 4. Book Appointment
```sql
-- First, check if slot is available
SELECT is_available FROM time_slots WHERE slot_id = 1;

-- If available, create appointment
INSERT INTO appointments (student_id, faculty_id, slot_id, reason, status) 
VALUES (1, 1, 1, 'Project discussion', 'Pending');

-- Mark slot as booked
UPDATE time_slots SET is_available = FALSE WHERE slot_id = 1;
```

#### 5. Get Student Appointments
```sql
SELECT a.appointment_id, f.name AS faculty_name, 
       t.date, t.start_time, t.end_time, a.reason, a.status
FROM appointments a
JOIN faculty f ON a.faculty_id = f.faculty_id
JOIN time_slots t ON a.slot_id = t.slot_id
WHERE a.student_id = 1
ORDER BY t.date DESC, t.start_time DESC;
```

#### 6. Get Faculty Appointment Requests
```sql
SELECT a.appointment_id, s.name AS student_name, s.roll_number,
       t.date, t.start_time, t.end_time, a.reason, a.status
FROM appointments a
JOIN students s ON a.student_id = s.student_id
JOIN time_slots t ON a.slot_id = t.slot_id
WHERE a.faculty_id = 1 AND a.status = 'Pending'
ORDER BY t.date, t.start_time;
```

#### 7. Approve Appointment
```sql
UPDATE appointments 
SET status = 'Approved', updated_at = CURRENT_TIMESTAMP 
WHERE appointment_id = 1;
```

#### 8. Cancel Appointment
```sql
-- Update appointment status
UPDATE appointments 
SET status = 'Cancelled', updated_at = CURRENT_TIMESTAMP 
WHERE appointment_id = 1;

-- Free up the slot
UPDATE time_slots 
SET is_available = TRUE 
WHERE slot_id = (SELECT slot_id FROM appointments WHERE appointment_id = 1);
```

---

## 8. DATA INTEGRITY CONSTRAINTS

### Primary Key Constraints
- Ensures each record has a unique identifier
- Automatically creates index for fast lookup

### Foreign Key Constraints
- Maintains referential integrity
- Prevents orphan records
- CASCADE delete ensures related records are removed

### Unique Constraints
- email in users table (no duplicate emails)
- roll_number in students table (no duplicate roll numbers)

### NOT NULL Constraints
- Ensures critical fields always have values
- Prevents incomplete records

### ENUM Constraints
- Restricts values to predefined options
- user_type: 'student', 'faculty', 'admin'
- status: 'Pending', 'Approved', 'Rejected', 'Cancelled', 'Completed'

---

## 9. DATABASE NORMALIZATION

### Normalization Level: 3NF (Third Normal Form)

#### 1NF (First Normal Form)
✓ All columns contain atomic values
✓ No repeating groups
✓ Each column has unique name

#### 2NF (Second Normal Form)
✓ Satisfies 1NF
✓ No partial dependencies
✓ All non-key attributes depend on entire primary key

#### 3NF (Third Normal Form)
✓ Satisfies 2NF
✓ No transitive dependencies
✓ All attributes depend only on primary key

### Benefits of Normalization
- Eliminates data redundancy
- Ensures data consistency
- Easier to maintain and update
- Reduces storage space

---

## 10. BACKUP AND RECOVERY

### Backup Strategy
```sql
-- Full database backup
mysqldump -u root -p edumeet_db > edumeet_backup.sql

-- Restore database
mysql -u root -p edumeet_db < edumeet_backup.sql
```

### Recommended Backup Schedule
- Daily: Incremental backup
- Weekly: Full backup
- Monthly: Archive backup

---

## 11. EXAM-ORIENTED QUESTIONS

**Q1: How many tables are in the database?**
**A:** 5 tables - users, students, faculty, time_slots, appointments

**Q2: What is the primary key of appointments table?**
**A:** appointment_id (INT, AUTO_INCREMENT)

**Q3: Explain the relationship between users and students table.**
**A:** One-to-One relationship. One user can be one student. Foreign key: students.user_id references users.user_id with CASCADE delete.

**Q4: What is the purpose of is_available field in time_slots?**
**A:** It indicates whether a time slot is available for booking (TRUE) or already booked (FALSE). It prevents double booking.

**Q5: What are the possible values for appointment status?**
**A:** Pending, Approved, Rejected, Cancelled, Completed

**Q6: Why do we use foreign keys?**
**A:** Foreign keys maintain referential integrity, ensure data consistency, and prevent orphan records. They establish relationships between tables.

**Q7: What is CASCADE delete?**
**A:** CASCADE delete automatically deletes related records in child tables when a parent record is deleted. For example, if a user is deleted, their student/faculty record is also deleted.

**Q8: What is normalization?**
**A:** Normalization is the process of organizing data to reduce redundancy and improve data integrity. Our database is in 3NF (Third Normal Form).

---

## 12. SUMMARY

The EduMeet database consists of 5 well-structured tables with proper relationships and constraints. The schema ensures data integrity, prevents conflicts, and supports all functional requirements of the appointment management system.

**Key Features:**
- Normalized to 3NF
- Foreign key constraints for integrity
- Indexes for performance
- ENUM types for data validation
- Timestamp tracking for audit trail
