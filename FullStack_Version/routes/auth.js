// ========================================
// Authentication Routes
// ========================================

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/database');

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password, userType } = req.body;

        // Validate input
        if (!email || !password || !userType) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        // Get user from database
        const [users] = await db.query(
            'SELECT * FROM users WHERE email = ? AND user_type = ?',
            [email, userType]
        );

        if (users.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        const user = users[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        // Set session
        req.session.userId = user.user_id;
        req.session.email = user.email;
        req.session.userType = user.user_type;

        // Get additional user info
        let userData = {};
        if (userType === 'student') {
            const [students] = await db.query(
                'SELECT student_id, name FROM students WHERE user_id = ?',
                [user.user_id]
            );
            req.session.studentId = students[0].student_id;
            req.session.name = students[0].name;
            userData = { studentId: students[0].student_id, name: students[0].name };
        } else if (userType === 'faculty') {
            const [faculty] = await db.query(
                'SELECT faculty_id, name FROM faculty WHERE user_id = ?',
                [user.user_id]
            );
            req.session.facultyId = faculty[0].faculty_id;
            req.session.name = faculty[0].name;
            userData = { facultyId: faculty[0].faculty_id, name: faculty[0].name };
        } else if (userType === 'admin') {
            req.session.name = 'Admin';
            userData = { name: 'Admin' };
        }

        res.json({ 
            success: true, 
            message: 'Login successful',
            userType: user.user_type,
            ...userData
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during login' 
        });
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Logout failed' 
            });
        }
        res.json({ 
            success: true, 
            message: 'Logged out successfully' 
        });
    });
});

// Check session
router.get('/session', (req, res) => {
    if (req.session && req.session.userId) {
        res.json({
            success: true,
            isLoggedIn: true,
            authenticated: true,
            userType: req.session.userType,
            name: req.session.name,
            email: req.session.email
        });
    } else {
        res.json({
            success: true,
            isLoggedIn: false,
            authenticated: false
        });
    }
});

// Alias for session check
router.get('/check', (req, res) => {
    if (req.session && req.session.userId) {
        res.json({
            success: true,
            authenticated: true,
            userType: req.session.userType,
            name: req.session.name,
            email: req.session.email
        });
    } else {
        res.json({
            success: false,
            authenticated: false
        });
    }
});

module.exports = router;
