// ========================================
// Admin Routes
// ========================================

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { Parser } = require('json2csv');

// Get admin dashboard data
router.get('/dashboard', isAuthenticated, isAdmin, async (req, res) => {
    try {
        // Get statistics
        const [studentCount] = await db.query('SELECT COUNT(*) as count FROM students');
        const [facultyCount] = await db.query('SELECT COUNT(*) as count FROM faculty');
        const [appointmentCount] = await db.query('SELECT COUNT(*) as count FROM appointments');
        const [pendingCount] = await db.query('SELECT COUNT(*) as count FROM appointments WHERE status = ?', ['Pending']);
        const [approvedCount] = await db.query('SELECT COUNT(*) as count FROM appointments WHERE status = ?', ['Approved']);
        const [rejectedCount] = await db.query('SELECT COUNT(*) as count FROM appointments WHERE status = ?', ['Rejected']);

        // Get appointment trends for the last 7 days
        const [trendsData] = await db.query(`
            SELECT DATE_FORMAT(t.date, '%a') as day_name, COUNT(*) as count
            FROM appointments a
            JOIN time_slots t ON a.slot_id = t.slot_id
            WHERE t.date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY t.date, day_name
            ORDER BY t.date
        `);

        // Prepare trends data
        const labels = trendsData.map(d => d.day_name);
        const data = trendsData.map(d => d.count);

        // Get recent appointments
        const [appointments] = await db.query(`
            SELECT a.appointment_id, s.name AS student_name, f.name AS faculty_name, 
                   t.date, t.start_time, a.status
            FROM appointments a 
            JOIN students s ON a.student_id = s.student_id 
            JOIN faculty f ON a.faculty_id = f.faculty_id
            JOIN time_slots t ON a.slot_id = t.slot_id 
            ORDER BY a.created_at DESC 
            LIMIT 10
        `);

        res.json({ 
            success: true, 
            stats: {
                students: studentCount[0].count,
                faculty: facultyCount[0].count,
                appointments: appointmentCount[0].count,
                pending: pendingCount[0].count,
                approved: approvedCount[0].count,
                rejected: rejectedCount[0].count
            },
            trends: {
                labels: labels.length > 0 ? labels : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                data: data.length > 0 ? data : [0, 0, 0, 0, 0, 0, 0]
            },
            appointments 
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to load dashboard' 
        });
    }
});

// Get all students
router.get('/students', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const [students] = await db.query(`
            SELECT s.student_id, s.name, s.roll_number, s.department, s.phone, u.email, u.created_at
            FROM students s 
            JOIN users u ON s.user_id = u.user_id 
            ORDER BY s.student_id DESC
        `);

        res.json({ 
            success: true, 
            students 
        });
    } catch (error) {
        console.error('Students error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to load students' 
        });
    }
});

// Add student
router.post('/students', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { name, email, rollNumber, department, section, course, phone, password } = req.body;

        if (!name || !email || !rollNumber || !department || !section || !course || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'All required fields must be filled' 
            });
        }

        // Check if email exists
        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already registered' 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const [userResult] = await db.query(
            'INSERT INTO users (email, password, user_type) VALUES (?, ?, ?)',
            [email, hashedPassword, 'student']
        );

        // Insert student
        await db.query(
            'INSERT INTO students (user_id, name, roll_number, department, section, course, phone) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userResult.insertId, name, rollNumber, department, section, course, phone]
        );

        res.json({ 
            success: true, 
            message: 'Student added successfully' 
        });
    } catch (error) {
        console.error('Add student error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to add student' 
        });
    }
});

// Delete student
router.delete('/students/:studentId', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { studentId } = req.params;

        // Get user_id
        const [students] = await db.query('SELECT user_id FROM students WHERE student_id = ?', [studentId]);
        
        if (students.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Student not found' 
            });
        }

        // Delete user (cascade will delete student)
        await db.query('DELETE FROM users WHERE user_id = ?', [students[0].user_id]);

        res.json({ 
            success: true, 
            message: 'Student deleted successfully' 
        });
    } catch (error) {
        console.error('Delete student error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete student' 
        });
    }
});

// Get all faculty
router.get('/faculty', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const [faculty] = await db.query(`
            SELECT f.faculty_id, f.name, f.department, f.designation, f.phone, u.email, u.created_at
            FROM faculty f 
            JOIN users u ON f.user_id = u.user_id 
            ORDER BY f.faculty_id DESC
        `);

        res.json({ 
            success: true, 
            faculty 
        });
    } catch (error) {
        console.error('Faculty error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to load faculty' 
        });
    }
});

// Add faculty
router.post('/faculty', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { name, email, department, designation, course, phone, password } = req.body;

        if (!name || !email || !department || !designation || !course || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'All required fields must be filled' 
            });
        }

        // Check if email exists
        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already registered' 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const [userResult] = await db.query(
            'INSERT INTO users (email, password, user_type) VALUES (?, ?, ?)',
            [email, hashedPassword, 'faculty']
        );

        // Insert faculty
        await db.query(
            'INSERT INTO faculty (user_id, name, department, designation, course, phone) VALUES (?, ?, ?, ?, ?, ?)',
            [userResult.insertId, name, department, designation, course, phone]
        );

        res.json({ 
            success: true, 
            message: 'Faculty added successfully' 
        });
    } catch (error) {
        console.error('Add faculty error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to add faculty' 
        });
    }
});

// Delete faculty
router.delete('/faculty/:facultyId', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { facultyId } = req.params;

        // Get user_id
        const [faculty] = await db.query('SELECT user_id FROM faculty WHERE faculty_id = ?', [facultyId]);
        
        if (faculty.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Faculty not found' 
            });
        }

        // Delete user (cascade will delete faculty)
        await db.query('DELETE FROM users WHERE user_id = ?', [faculty[0].user_id]);

        res.json({ 
            success: true, 
            message: 'Faculty deleted successfully' 
        });
    } catch (error) {
        console.error('Delete faculty error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete faculty' 
        });
    }
});

// Bulk delete students
router.post('/students/bulk-delete', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { studentIds } = req.body;

        if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'No students selected' 
            });
        }

        // Get user_ids for all students
        const [students] = await db.query(
            'SELECT user_id FROM students WHERE student_id IN (?)',
            [studentIds]
        );

        if (students.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'No students found' 
            });
        }

        const userIds = students.map(s => s.user_id);

        // Delete users (cascade will delete students)
        await db.query('DELETE FROM users WHERE user_id IN (?)', [userIds]);

        res.json({ 
            success: true, 
            message: `${students.length} student(s) deleted successfully` 
        });
    } catch (error) {
        console.error('Bulk delete students error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete students' 
        });
    }
});

// Bulk delete faculty
router.post('/faculty/bulk-delete', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { facultyIds } = req.body;

        if (!facultyIds || !Array.isArray(facultyIds) || facultyIds.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'No faculty selected' 
            });
        }

        // Get user_ids for all faculty
        const [faculty] = await db.query(
            'SELECT user_id FROM faculty WHERE faculty_id IN (?)',
            [facultyIds]
        );

        if (faculty.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'No faculty found' 
            });
        }

        const userIds = faculty.map(f => f.user_id);

        // Delete users (cascade will delete faculty)
        await db.query('DELETE FROM users WHERE user_id IN (?)', [userIds]);

        res.json({ 
            success: true, 
            message: `${faculty.length} faculty member(s) deleted successfully` 
        });
    } catch (error) {
        console.error('Bulk delete faculty error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete faculty' 
        });
    }
});

// Export students as CSV
router.get('/export/students', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const [students] = await db.query(`
            SELECT s.student_id, s.name, s.roll_number, s.department, s.section, s.course, 
                   s.phone, u.email, DATE_FORMAT(u.created_at, '%Y-%m-%d') as joined_date
            FROM students s 
            JOIN users u ON s.user_id = u.user_id 
            ORDER BY s.student_id
        `);

        const fields = ['student_id', 'name', 'roll_number', 'department', 'section', 'course', 'phone', 'email', 'joined_date'];
        const opts = { fields };
        const parser = new Parser(opts);
        const csv = parser.parse(students);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=students_list.csv');
        res.send(csv);
    } catch (error) {
        console.error('Export students error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to export students' 
        });
    }
});

// Export faculty as CSV
router.get('/export/faculty', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const [faculty] = await db.query(`
            SELECT f.faculty_id, f.name, f.department, f.designation, f.course, 
                   f.phone, u.email, DATE_FORMAT(u.created_at, '%Y-%m-%d') as joined_date
            FROM faculty f 
            JOIN users u ON f.user_id = u.user_id 
            ORDER BY f.faculty_id
        `);

        const fields = ['faculty_id', 'name', 'department', 'designation', 'course', 'phone', 'email', 'joined_date'];
        const opts = { fields };
        const parser = new Parser(opts);
        const csv = parser.parse(faculty);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=faculty_list.csv');
        res.send(csv);
    } catch (error) {
        console.error('Export faculty error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to export faculty' 
        });
    }
});

// Get all appointments
router.get('/appointments', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const [appointments] = await db.query(`
            SELECT a.appointment_id, s.name AS student_name, f.name AS faculty_name, 
                   t.date, t.start_time, t.end_time, a.status, a.created_at
            FROM appointments a 
            JOIN students s ON a.student_id = s.student_id 
            JOIN faculty f ON a.faculty_id = f.faculty_id
            JOIN time_slots t ON a.slot_id = t.slot_id 
            ORDER BY t.date DESC, t.start_time DESC
        `);

        res.json({ 
            success: true, 
            appointments 
        });
    } catch (error) {
        console.error('Appointments error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to load appointments' 
        });
    }
});

// Bulk upload students
router.post('/students/bulk', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { students } = req.body;
        
        if (!students || !Array.isArray(students) || students.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No students data provided'
            });
        }
        
        let successful = 0;
        let failed = 0;
        const errors = [];
        
        for (let i = 0; i < students.length; i++) {
            const student = students[i];
            const rowNum = i + 2; // +2 because row 1 is header and array is 0-indexed
            
            try {
                // Validate required fields
                if (!student.name || !student.email || !student.roll_number || 
                    !student.department || !student.section || !student.course || !student.password) {
                    errors.push({
                        row: rowNum,
                        message: 'Missing required fields'
                    });
                    failed++;
                    continue;
                }
                
                // Check if email exists
                const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [student.email]);
                if (existing.length > 0) {
                    errors.push({
                        row: rowNum,
                        message: `Email ${student.email} already exists`
                    });
                    failed++;
                    continue;
                }
                
                // Hash password
                const hashedPassword = await bcrypt.hash(student.password, 10);
                
                // Insert user
                const [userResult] = await db.query(
                    'INSERT INTO users (email, password, user_type) VALUES (?, ?, ?)',
                    [student.email, hashedPassword, 'student']
                );
                
                // Insert student
                await db.query(
                    'INSERT INTO students (user_id, name, roll_number, department, section, course, phone) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [userResult.insertId, student.name, student.roll_number, student.department, 
                     student.section, student.course, student.phone || null]
                );
                
                successful++;
            } catch (error) {
                console.error(`Error adding student row ${rowNum}:`, error);
                errors.push({
                    row: rowNum,
                    message: error.message || 'Database error'
                });
                failed++;
            }
        }
        
        res.json({
            success: true,
            message: `Uploaded ${successful} student(s), ${failed} failed`,
            successful,
            failed,
            errors
        });
    } catch (error) {
        console.error('Bulk upload students error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload students'
        });
    }
});

// Bulk upload faculty
router.post('/faculty/bulk', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { faculty } = req.body;
        
        if (!faculty || !Array.isArray(faculty) || faculty.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No faculty data provided'
            });
        }
        
        let successful = 0;
        let failed = 0;
        const errors = [];
        
        for (let i = 0; i < faculty.length; i++) {
            const fac = faculty[i];
            const rowNum = i + 2; // +2 because row 1 is header and array is 0-indexed
            
            try {
                // Validate required fields
                if (!fac.name || !fac.email || !fac.department || 
                    !fac.designation || !fac.course || !fac.password) {
                    errors.push({
                        row: rowNum,
                        message: 'Missing required fields'
                    });
                    failed++;
                    continue;
                }
                
                // Check if email exists
                const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [fac.email]);
                if (existing.length > 0) {
                    errors.push({
                        row: rowNum,
                        message: `Email ${fac.email} already exists`
                    });
                    failed++;
                    continue;
                }
                
                // Hash password
                const hashedPassword = await bcrypt.hash(fac.password, 10);
                
                // Insert user
                const [userResult] = await db.query(
                    'INSERT INTO users (email, password, user_type) VALUES (?, ?, ?)',
                    [fac.email, hashedPassword, 'faculty']
                );
                
                // Insert faculty
                await db.query(
                    'INSERT INTO faculty (user_id, name, department, designation, course, phone) VALUES (?, ?, ?, ?, ?, ?)',
                    [userResult.insertId, fac.name, fac.department, fac.designation, 
                     fac.course, fac.phone || null]
                );
                
                successful++;
            } catch (error) {
                console.error(`Error adding faculty row ${rowNum}:`, error);
                errors.push({
                    row: rowNum,
                    message: error.message || 'Database error'
                });
                failed++;
            }
        }
        
        res.json({
            success: true,
            message: `Uploaded ${successful} faculty member(s), ${failed} failed`,
            successful,
            failed,
            errors
        });
    } catch (error) {
        console.error('Bulk upload faculty error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload faculty'
        });
    }
});

module.exports = router;
