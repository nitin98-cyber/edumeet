-- ================================================
-- EduMeet: Faculty Availability & Appointment System
-- Database Creation Script
-- ================================================

-- Drop database if exists (for fresh installation)
DROP DATABASE IF EXISTS edumeet_db;

-- Create database
CREATE DATABASE edumeet_db;

-- Use the database
USE edumeet_db;

-- ================================================
-- Table 1: users
-- Purpose: Stores common information for all users
-- ================================================
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('student', 'faculty', 'admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- Table 2: students
-- Purpose: Stores student-specific information
-- ================================================
CREATE TABLE students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    roll_number VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ================================================
-- Table 3: faculty
-- Purpose: Stores faculty-specific information
-- ================================================
CREATE TABLE faculty (
    faculty_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(50) NOT NULL,
    phone VARCHAR(15),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ================================================
-- Table 4: time_slots
-- Purpose: Stores faculty availability time slots
-- ================================================
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

-- ================================================
-- Table 5: appointments
-- Purpose: Stores appointment booking information
-- ================================================
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

-- ================================================
-- Table 6: notifications
-- Purpose: Stores notification messages for users
-- ================================================
CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    user_type ENUM('student', 'faculty', 'admin') NOT NULL,
    message TEXT NOT NULL,
    type ENUM('booking', 'approval', 'rejection', 'cancellation', 'info') DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_notifications (user_id, user_type),
    INDEX idx_unread (is_read)
);

-- ================================================
-- Create Indexes for Performance
-- ================================================

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

-- ================================================
-- Insert Sample Data for Testing
-- ================================================

-- Insert Admin User
INSERT INTO users (email, password, user_type) VALUES
('admin@edumeet.com', 'pbkdf2:sha256:260000$salt$hash', 'admin');

-- Insert Sample Faculty Users
INSERT INTO users (email, password, user_type) VALUES
('priya.sharma@college.edu', 'pbkdf2:sha256:260000$salt$hash', 'faculty'),
('rajesh.kumar@college.edu', 'pbkdf2:sha256:260000$salt$hash', 'faculty'),
('anita.verma@college.edu', 'pbkdf2:sha256:260000$salt$hash', 'faculty');

-- Insert Faculty Details
INSERT INTO faculty (user_id, name, department, designation, phone) VALUES
(2, 'Dr. Priya Sharma', 'Computer Science', 'Professor', '9876543210'),
(3, 'Dr. Rajesh Kumar', 'Information Technology', 'Associate Professor', '9876543211'),
(4, 'Dr. Anita Verma', 'Computer Science', 'Assistant Professor', '9876543212');

-- Insert Sample Student Users
INSERT INTO users (email, password, user_type) VALUES
('rahul.kumar@student.edu', 'pbkdf2:sha256:260000$salt$hash', 'student'),
('priya.singh@student.edu', 'pbkdf2:sha256:260000$salt$hash', 'student');

-- Insert Student Details
INSERT INTO students (user_id, name, roll_number, department, phone) VALUES
(5, 'Rahul Kumar', '2021001', 'Computer Science', '9876543213'),
(6, 'Priya Singh', '2021002', 'Information Technology', '9876543214');

-- Insert Sample Time Slots for Faculty
INSERT INTO time_slots (faculty_id, date, start_time, end_time, is_available) VALUES
-- Dr. Priya Sharma's slots
(1, '2026-02-10', '10:00:00', '11:00:00', TRUE),
(1, '2026-02-10', '14:00:00', '15:00:00', TRUE),
(1, '2026-02-11', '11:00:00', '12:00:00', TRUE),
-- Dr. Rajesh Kumar's slots
(2, '2026-02-10', '09:00:00', '10:00:00', TRUE),
(2, '2026-02-10', '15:00:00', '16:00:00', TRUE),
-- Dr. Anita Verma's slots
(3, '2026-02-11', '10:00:00', '11:00:00', TRUE),
(3, '2026-02-11', '14:00:00', '15:00:00', TRUE);

-- Insert Sample Appointments
INSERT INTO appointments (student_id, faculty_id, slot_id, reason, status) VALUES
(1, 1, 1, 'Discussion about final year project topic', 'Pending'),
(2, 2, 4, 'Doubt clarification in Database Management', 'Approved');

-- ================================================
-- Verification Queries
-- ================================================

-- View all users
-- SELECT * FROM users;

-- View all faculty with details
-- SELECT f.faculty_id, f.name, f.department, f.designation, u.email 
-- FROM faculty f 
-- JOIN users u ON f.user_id = u.user_id;

-- View all students with details
-- SELECT s.student_id, s.name, s.roll_number, s.department, u.email 
-- FROM students s 
-- JOIN users u ON s.user_id = u.user_id;

-- View all available time slots
-- SELECT t.slot_id, f.name AS faculty_name, t.date, t.start_time, t.end_time 
-- FROM time_slots t 
-- JOIN faculty f ON t.faculty_id = f.faculty_id 
-- WHERE t.is_available = TRUE 
-- ORDER BY t.date, t.start_time;

-- View all appointments with details
-- SELECT a.appointment_id, s.name AS student_name, f.name AS faculty_name, 
--        t.date, t.start_time, t.end_time, a.reason, a.status 
-- FROM appointments a 
-- JOIN students s ON a.student_id = s.student_id 
-- JOIN faculty f ON a.faculty_id = f.faculty_id 
-- JOIN time_slots t ON a.slot_id = t.slot_id;

-- ================================================
-- Database Setup Complete
-- ================================================

-- Note: Password hashes shown above are placeholders
-- In actual implementation, use proper password hashing
-- Example: werkzeug.security.generate_password_hash('password123')
