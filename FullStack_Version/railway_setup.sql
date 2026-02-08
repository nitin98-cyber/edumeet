-- ================================================
-- EduMeet Railway Database Setup
-- Run this in Railway MySQL Client
-- ================================================

-- Note: DO NOT include DROP DATABASE or CREATE DATABASE
-- Railway already created the database for you
-- Just run the table creation and sample data

-- ================================================
-- Table 1: users (Unified user table for all roles)
-- ================================================
CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'faculty', 'admin') NOT NULL,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    designation VARCHAR(50),
    phone VARCHAR(15),
    roll_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- ================================================
-- Table 2: time_slots
-- ================================================
CREATE TABLE IF NOT EXISTS time_slots (
    slot_id INT PRIMARY KEY AUTO_INCREMENT,
    faculty_id INT NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (faculty_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_faculty_date (faculty_id, date),
    INDEX idx_available (is_available)
);

-- ================================================
-- Table 3: appointments
-- ================================================
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    faculty_id INT NOT NULL,
    slot_id INT NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected', 'Cancelled', 'Completed') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (slot_id) REFERENCES time_slots(slot_id) ON DELETE CASCADE,
    INDEX idx_student (student_id),
    INDEX idx_faculty (faculty_id),
    INDEX idx_status (status)
);

-- ================================================
-- Table 4: notifications
-- ================================================
CREATE TABLE IF NOT EXISTS notifications (
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
-- Table 5: appointment_history
-- ================================================
CREATE TABLE IF NOT EXISTS appointment_history (
    history_id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_id INT NOT NULL,
    student_id INT NOT NULL,
    faculty_id INT NOT NULL,
    slot_id INT NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    action_by INT,
    action_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_appointment (appointment_id),
    INDEX idx_student_history (student_id),
    INDEX idx_faculty_history (faculty_id)
);

-- ================================================
-- Insert Sample Users with bcrypt hashed passwords
-- Password for all users: admin123
-- ================================================

-- Admin User
INSERT INTO users (email, password, role, name, department) VALUES
('admin@edumeet.com', '$2b$10$rBV2kWq7HFPvXZ8cGxUzqeYvXKp5vZxQJxYvXKp5vZxQJxYvXKp5v', 'admin', 'System Admin', 'Administration');

-- Faculty Users
INSERT INTO users (email, password, role, name, department, designation, phone) VALUES
('priya.sharma@college.edu', '$2b$10$rBV2kWq7HFPvXZ8cGxUzqeYvXKp5vZxQJxYvXKp5vZxQJxYvXKp5v', 'faculty', 'Dr. Priya Sharma', 'Computer Science', 'Professor', '9876543210'),
('rajesh.kumar@college.edu', '$2b$10$rBV2kWq7HFPvXZ8cGxUzqeYvXKp5vZxQJxYvXKp5vZxQJxYvXKp5v', 'faculty', 'Dr. Rajesh Kumar', 'Information Technology', 'Associate Professor', '9876543211'),
('anita.verma@college.edu', '$2b$10$rBV2kWq7HFPvXZ8cGxUzqeYvXKp5vZxQJxYvXKp5vZxQJxYvXKp5v', 'faculty', 'Dr. Anita Verma', 'Computer Science', 'Assistant Professor', '9876543212');

-- Student Users
INSERT INTO users (email, password, role, name, department, roll_number, phone) VALUES
('rahul.kumar@student.edu', '$2b$10$rBV2kWq7HFPvXZ8cGxUzqeYvXKp5vZxQJxYvXKp5vZxQJxYvXKp5v', 'student', 'Rahul Kumar', 'Computer Science', '2021001', '9876543213'),
('priya.singh@student.edu', '$2b$10$rBV2kWq7HFPvXZ8cGxUzqeYvXKp5vZxQJxYvXKp5vZxQJxYvXKp5v', 'student', 'Priya Singh', 'Information Technology', '2021002', '9876543214');

-- ================================================
-- Insert Sample Time Slots
-- ================================================
INSERT INTO time_slots (faculty_id, date, start_time, end_time, is_available) VALUES
-- Dr. Priya Sharma's slots (user_id = 2)
(2, '2026-02-10', '10:00:00', '11:00:00', TRUE),
(2, '2026-02-10', '14:00:00', '15:00:00', TRUE),
(2, '2026-02-11', '11:00:00', '12:00:00', TRUE),
(2, '2026-02-12', '10:00:00', '11:00:00', TRUE),
-- Dr. Rajesh Kumar's slots (user_id = 3)
(3, '2026-02-10', '09:00:00', '10:00:00', TRUE),
(3, '2026-02-10', '15:00:00', '16:00:00', TRUE),
(3, '2026-02-11', '14:00:00', '15:00:00', TRUE),
-- Dr. Anita Verma's slots (user_id = 4)
(4, '2026-02-11', '10:00:00', '11:00:00', TRUE),
(4, '2026-02-11', '14:00:00', '15:00:00', TRUE),
(4, '2026-02-12', '09:00:00', '10:00:00', TRUE);

-- ================================================
-- Insert Sample Appointments
-- ================================================
INSERT INTO appointments (student_id, faculty_id, slot_id, reason, status) VALUES
(5, 2, 1, 'Discussion about final year project topic', 'Pending'),
(6, 3, 5, 'Doubt clarification in Database Management', 'Approved');

-- ================================================
-- Insert Sample Notifications
-- ================================================
INSERT INTO notifications (user_id, user_type, message, type, is_read) VALUES
(5, 'student', 'Your appointment request has been submitted successfully', 'booking', FALSE),
(2, 'faculty', 'New appointment request from Rahul Kumar', 'booking', FALSE),
(6, 'student', 'Your appointment has been approved by Dr. Rajesh Kumar', 'approval', FALSE);

-- ================================================
-- Verification Queries (Uncomment to test)
-- ================================================

-- Check all users
-- SELECT user_id, email, role, name, department FROM users;

-- Check all time slots
-- SELECT ts.slot_id, u.name AS faculty_name, ts.date, ts.start_time, ts.end_time, ts.is_available
-- FROM time_slots ts
-- JOIN users u ON ts.faculty_id = u.user_id
-- ORDER BY ts.date, ts.start_time;

-- Check all appointments
-- SELECT a.appointment_id, 
--        s.name AS student_name, 
--        f.name AS faculty_name,
--        ts.date, ts.start_time, ts.end_time,
--        a.reason, a.status
-- FROM appointments a
-- JOIN users s ON a.student_id = s.user_id
-- JOIN users f ON a.faculty_id = f.user_id
-- JOIN time_slots ts ON a.slot_id = ts.slot_id;

-- ================================================
-- Setup Complete!
-- ================================================
-- Default Login Credentials:
-- 
-- Admin:
--   Email: admin@edumeet.com
--   Password: admin123
--
-- Faculty:
--   Email: priya.sharma@college.edu
--   Password: admin123
--
-- Student:
--   Email: rahul.kumar@student.edu
--   Password: admin123
-- ================================================
