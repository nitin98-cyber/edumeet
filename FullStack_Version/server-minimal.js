// Minimal EduMeet Server - Guaranteed to start
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/setup.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'setup.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Setup endpoint
app.post('/api/setup/initialize', async (req, res) => {
    try {
        const mysql = require('mysql2/promise');
        const bcrypt = require('bcryptjs');
        
        const pool = mysql.createPool({
            host: process.env.MYSQLHOST || 'localhost',
            user: process.env.MYSQLUSER || 'root',
            password: process.env.MYSQLPASSWORD || '',
            database: process.env.MYSQLDATABASE || 'railway',
            port: process.env.MYSQLPORT || 3306
        });

        // Create tables
        await pool.query(`CREATE TABLE IF NOT EXISTS users (
            user_id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            user_type ENUM('student', 'faculty', 'admin') NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        await pool.query(`CREATE TABLE IF NOT EXISTS students (
            student_id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT UNIQUE NOT NULL,
            name VARCHAR(100) NOT NULL,
            roll_number VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) NOT NULL,
            phone VARCHAR(20),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
        )`);

        await pool.query(`CREATE TABLE IF NOT EXISTS faculty (
            faculty_id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT UNIQUE NOT NULL,
            name VARCHAR(100) NOT NULL,
            department VARCHAR(100),
            email VARCHAR(100) NOT NULL,
            phone VARCHAR(20),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
        )`);

        await pool.query(`CREATE TABLE IF NOT EXISTS time_slots (
            slot_id INT AUTO_INCREMENT PRIMARY KEY,
            faculty_id INT NOT NULL,
            date DATE NOT NULL,
            start_time TIME NOT NULL,
            end_time TIME NOT NULL,
            is_available BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id) ON DELETE CASCADE
        )`);

        await pool.query(`CREATE TABLE IF NOT EXISTS appointments (
            appointment_id INT AUTO_INCREMENT PRIMARY KEY,
            student_id INT NOT NULL,
            slot_id INT NOT NULL,
            purpose TEXT,
            status ENUM('pending', 'approved', 'rejected', 'completed', 'cancelled') DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
            FOREIGN KEY (slot_id) REFERENCES time_slots(slot_id) ON DELETE CASCADE
        )`);

        // Check if users exist
        const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
        if (users[0].count > 0) {
            return res.json({ success: true, message: 'Already initialized' });
        }

        // Create users
        const adminPwd = await bcrypt.hash('admin123', 10);
        const facultyPwd = await bcrypt.hash('faculty123', 10);
        const studentPwd = await bcrypt.hash('student123', 10);

        await pool.query(`INSERT INTO users (email, password, user_type) VALUES (?,?,'admin'),(?,?,'faculty'),(?,?,'student')`,
            ['admin@edumeet.com', adminPwd, 'faculty@edumeet.com', facultyPwd, 'student@edumeet.com', studentPwd]);

        const [admin] = await pool.query("SELECT user_id FROM users WHERE email='admin@edumeet.com'");
        const [faculty] = await pool.query("SELECT user_id FROM users WHERE email='faculty@edumeet.com'");
        const [student] = await pool.query("SELECT user_id FROM users WHERE email='student@edumeet.com'");

        await pool.query(`INSERT INTO faculty (user_id,name,department,email,phone) VALUES (?,'Dr. John Smith','Computer Science','faculty@edumeet.com','1234567890')`, [faculty[0].user_id]);
        await pool.query(`INSERT INTO students (user_id,name,roll_number,email,phone) VALUES (?,'Alice Johnson','CS2024001','student@edumeet.com','0987654321')`, [student[0].user_id]);

        await pool.end();
        res.json({ success: true, message: 'Setup complete!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
