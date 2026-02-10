// One-time database setup route
const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const bcrypt = require('bcryptjs');

// Initialize database endpoint - POST request
router.post('/initialize', async (req, res) => {
    // Add CORS headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    try {
        console.log('🔧 Manual database initialization requested');
        
        // Test database connection first
        try {
            await pool.query('SELECT 1');
            console.log('✓ Database connection OK');
        } catch (dbError) {
            console.error('❌ Database connection failed:', dbError.message);
            return res.status(500).json({
                success: false,
                message: 'Cannot connect to database: ' + dbError.message
            });
        }
        
        // Create tables
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                user_id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                user_type ENUM('student', 'faculty', 'admin') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS students (
                student_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT UNIQUE NOT NULL,
                name VARCHAR(100) NOT NULL,
                roll_number VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) NOT NULL,
                phone VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS faculty (
                faculty_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT UNIQUE NOT NULL,
                name VARCHAR(100) NOT NULL,
                department VARCHAR(100),
                email VARCHAR(100) NOT NULL,
                phone VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS time_slots (
                slot_id INT AUTO_INCREMENT PRIMARY KEY,
                faculty_id INT NOT NULL,
                date DATE NOT NULL,
                start_time TIME NOT NULL,
                end_time TIME NOT NULL,
                is_available BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id) ON DELETE CASCADE
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS appointments (
                appointment_id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL,
                slot_id INT NOT NULL,
                purpose TEXT,
                status ENUM('pending', 'approved', 'rejected', 'completed', 'cancelled') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
                FOREIGN KEY (slot_id) REFERENCES time_slots(slot_id) ON DELETE CASCADE
            )
        `);

        console.log('✓ Tables created');

        // Check if users already exist
        const [existingUsers] = await pool.query('SELECT COUNT(*) as count FROM users');
        
        if (existingUsers[0].count > 0) {
            return res.json({
                success: true,
                message: 'Database already initialized',
                usersCount: existingUsers[0].count
            });
        }

        // Create users
        const adminPassword = await bcrypt.hash('admin123', 10);
        const facultyPassword = await bcrypt.hash('faculty123', 10);
        const studentPassword = await bcrypt.hash('student123', 10);

        await pool.query(`
            INSERT INTO users (email, password, user_type) VALUES
            ('admin@edumeet.com', ?, 'admin'),
            ('faculty@edumeet.com', ?, 'faculty'),
            ('student@edumeet.com', ?, 'student')
        `, [adminPassword, facultyPassword, studentPassword]);

        // Get user IDs
        const [adminUser] = await pool.query("SELECT user_id FROM users WHERE email = 'admin@edumeet.com'");
        const [facultyUser] = await pool.query("SELECT user_id FROM users WHERE email = 'faculty@edumeet.com'");
        const [studentUser] = await pool.query("SELECT user_id FROM users WHERE email = 'student@edumeet.com'");

        // Insert faculty
        await pool.query(`
            INSERT INTO faculty (user_id, name, department, email, phone)
            VALUES (?, 'Dr. John Smith', 'Computer Science', 'faculty@edumeet.com', '1234567890')
        `, [facultyUser[0].user_id]);

        // Insert student
        await pool.query(`
            INSERT INTO students (user_id, name, roll_number, email, phone)
            VALUES (?, 'Alice Johnson', 'CS2024001', 'student@edumeet.com', '0987654321')
        `, [studentUser[0].user_id]);

        console.log('✓ Users created successfully');

        res.json({
            success: true,
            message: 'Database initialized successfully',
            users: ['admin@edumeet.com', 'faculty@edumeet.com', 'student@edumeet.com']
        });

    } catch (error) {
        console.error('Setup error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Unknown error occurred'
        });
    }
});

// Handle OPTIONS request for CORS
router.options('/initialize', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.sendStatus(200);
});

module.exports = router;
