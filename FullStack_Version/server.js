// ========================================
// EduMeet - Node.js Express Server
// ========================================

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Import routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const facultyRoutes = require('./routes/faculty');
const adminRoutes = require('./routes/admin');
const apiRoutes = require('./routes/api');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', apiRoutes);

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/student/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'student', 'dashboard.html'));
});

app.get('/faculty/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'faculty', 'dashboard.html'));
});

app.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'dashboard.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════╗
    ║   🎓 EduMeet Server Running          ║
    ║   Port: ${PORT}                         ║
    ║   URL: http://localhost:${PORT}         ║
    ║   Environment: ${process.env.NODE_ENV}           ║
    ╚═══════════════════════════════════════╝
    `);
    
    // Run cleanup on server start
    runCleanup();
    
    // Schedule cleanup every hour
    setInterval(runCleanup, 60 * 60 * 1000); // Every 1 hour
});

// Cleanup function
async function runCleanup() {
    try {
        const db = require('./config/database');
        
        const now = new Date();
        const currentDate = now.toISOString().split('T')[0];
        const currentTime = now.toTimeString().split(' ')[0];

        // Delete expired slots without bookings
        const [result] = await db.query(`
            DELETE FROM time_slots 
            WHERE (date < ? OR (date = ? AND end_time < ?))
            AND slot_id NOT IN (SELECT DISTINCT slot_id FROM appointments)
        `, [currentDate, currentDate, currentTime]);

        if (result.affectedRows > 0) {
            console.log(`🧹 Cleaned up ${result.affectedRows} expired slot(s)`);
        }
    } catch (error) {
        console.error('Cleanup error:', error.message);
    }
}

module.exports = app;
