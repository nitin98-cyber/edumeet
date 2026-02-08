// ========================================
// Student Routes
// ========================================

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { isAuthenticated, isStudent } = require('../middleware/auth');
const PDFDocument = require('pdfkit');

// Get student dashboard data
router.get('/dashboard', isAuthenticated, isStudent, async (req, res) => {
    try {
        const [appointments] = await db.query(`
            SELECT a.appointment_id, f.name AS faculty_name, f.department, 
                   t.date, t.start_time, t.end_time, a.reason, a.status, a.created_at
            FROM appointments a 
            JOIN faculty f ON a.faculty_id = f.faculty_id 
            JOIN time_slots t ON a.slot_id = t.slot_id
            WHERE a.student_id = ?
            ORDER BY t.date DESC, t.start_time DESC
        `, [req.session.studentId]);

        // Calculate statistics
        const stats = {
            total: appointments.length,
            approved: appointments.filter(a => a.status === 'Approved').length,
            pending: appointments.filter(a => a.status === 'Pending').length,
            rejected: appointments.filter(a => a.status === 'Rejected').length
        };

        res.json({ 
            success: true, 
            appointments,
            stats
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to load dashboard' 
        });
    }
});

// Get faculty list
router.get('/faculty', isAuthenticated, isStudent, async (req, res) => {
    try {
        const [faculty] = await db.query(
            'SELECT faculty_id, name, department, designation, phone FROM faculty ORDER BY name'
        );

        res.json({ 
            success: true, 
            faculty 
        });
    } catch (error) {
        console.error('Faculty list error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to load faculty list' 
        });
    }
});

// Get available slots for a faculty
router.get('/slots/:facultyId', isAuthenticated, isStudent, async (req, res) => {
    try {
        const { facultyId } = req.params;

        // Get faculty info
        const [faculty] = await db.query(
            'SELECT name, department FROM faculty WHERE faculty_id = ?',
            [facultyId]
        );

        if (faculty.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Faculty not found' 
            });
        }

        // Get available slots
        const [slots] = await db.query(`
            SELECT slot_id, date, start_time, end_time,
                   (SELECT COUNT(*) FROM appointments WHERE slot_id = time_slots.slot_id) as booking_count
            FROM time_slots 
            WHERE faculty_id = ? AND date >= CURDATE() 
            ORDER BY date, start_time
        `, [facultyId]);

        res.json({ 
            success: true, 
            faculty: faculty[0],
            slots 
        });
    } catch (error) {
        console.error('Slots error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to load slots' 
        });
    }
});

// Book appointment
router.post('/book', isAuthenticated, isStudent, async (req, res) => {
    try {
        const { slotId, reason } = req.body;

        if (!slotId || !reason) {
            return res.status(400).json({ 
                success: false, 
                message: 'Slot ID and reason are required' 
            });
        }

        // Get slot details
        const [slots] = await db.query(
            'SELECT faculty_id, date, start_time FROM time_slots WHERE slot_id = ?',
            [slotId]
        );

        if (slots.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Slot not found' 
            });
        }

        const slot = slots[0];

        // Check if slot time has passed
        const slotDateTime = new Date(`${slot.date.toISOString().split('T')[0]} ${slot.start_time}`);
        if (slotDateTime < new Date()) {
            return res.status(400).json({ 
                success: false, 
                message: 'This slot time has already passed' 
            });
        }

        // Book appointment
        await db.query(
            'INSERT INTO appointments (student_id, faculty_id, slot_id, reason, status) VALUES (?, ?, ?, ?, ?)',
            [req.session.studentId, slot.faculty_id, slotId, reason, 'Pending']
        );

        // Create notification for faculty
        const notificationMsg = `New appointment request from ${req.session.name} for ${slot.date.toLocaleDateString()} at ${slot.start_time}`;
        await db.query(
            'INSERT INTO notifications (user_id, user_type, message, type, is_read) VALUES (?, ?, ?, ?, ?)',
            [slot.faculty_id, 'faculty', notificationMsg, 'booking', false]
        );

        res.json({ 
            success: true, 
            message: 'Appointment booked successfully! Waiting for faculty approval.' 
        });
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to book appointment' 
        });
    }
});

// Cancel appointment
router.post('/cancel/:appointmentId', isAuthenticated, isStudent, async (req, res) => {
    try {
        const { appointmentId } = req.params;

        // Verify appointment belongs to student
        const [appointments] = await db.query(
            'SELECT * FROM appointments WHERE appointment_id = ? AND student_id = ?',
            [appointmentId, req.session.studentId]
        );

        if (appointments.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Appointment not found' 
            });
        }

        // Cancel appointment
        await db.query(
            'UPDATE appointments SET status = ? WHERE appointment_id = ?',
            ['Cancelled', appointmentId]
        );

        res.json({ 
            success: true, 
            message: 'Appointment cancelled successfully' 
        });
    } catch (error) {
        console.error('Cancel error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to cancel appointment' 
        });
    }
});

module.exports = router;

// Download appointment receipt as PDF
router.get('/receipt/:appointmentId', isAuthenticated, isStudent, async (req, res) => {
    try {
        const { appointmentId } = req.params;

        // Get appointment details
        const [appointments] = await db.query(`
            SELECT a.appointment_id, a.reason, a.status, 
                   DATE_FORMAT(a.created_at, '%Y-%m-%d %H:%i') as booked_at,
                   s.name AS student_name, s.roll_number, s.department, s.section, s.course, s.phone,
                   f.name AS faculty_name, f.department AS faculty_dept, f.designation, f.phone AS faculty_phone,
                   t.date, t.start_time, t.end_time
            FROM appointments a 
            JOIN students s ON a.student_id = s.student_id
            JOIN faculty f ON a.faculty_id = f.faculty_id 
            JOIN time_slots t ON a.slot_id = t.slot_id
            WHERE a.appointment_id = ? AND a.student_id = ?
        `, [appointmentId, req.session.studentId]);

        if (appointments.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Appointment not found' 
            });
        }

        const apt = appointments[0];

        // Create PDF
        const doc = new PDFDocument({ margin: 50 });
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=appointment_receipt_${appointmentId}.pdf`);
        
        doc.pipe(res);

        // Header with border
        doc.rect(40, 40, 515, 720).stroke();
        
        // Title
        doc.fontSize(24).fillColor('#2563eb').text('EduMeet', { align: 'center' });
        doc.fontSize(16).fillColor('#000').text('Appointment Receipt', { align: 'center' });
        doc.moveDown();
        doc.moveTo(70, doc.y).lineTo(540, doc.y).stroke();
        doc.moveDown();

        // Receipt ID and Status
        doc.fontSize(10).fillColor('#666').text(`Receipt ID: APT-${appointmentId}`, { align: 'right' });
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'right' });
        doc.moveDown();

        // Status Badge
        let statusColor = apt.status === 'Approved' ? '#10b981' : 
                         apt.status === 'Pending' ? '#f59e0b' : 
                         apt.status === 'Rejected' ? '#ef4444' : '#6b7280';
        doc.fontSize(14).fillColor(statusColor).text(`Status: ${apt.status}`, { align: 'center' });
        doc.moveDown();
        doc.moveTo(70, doc.y).lineTo(540, doc.y).stroke();
        doc.moveDown();

        // Student Information
        doc.fontSize(14).fillColor('#000').text('Student Information', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(11);
        doc.fillColor('#333').text(`Name: ${apt.student_name}`);
        doc.text(`Roll Number: ${apt.roll_number}`);
        doc.text(`Department: ${apt.department}`);
        doc.text(`Section: ${apt.section} | Course: ${apt.course}`);
        doc.text(`Phone: ${apt.phone}`);
        doc.moveDown();

        // Faculty Information
        doc.fontSize(14).fillColor('#000').text('Faculty Information', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(11);
        doc.fillColor('#333').text(`Name: ${apt.faculty_name}`);
        doc.text(`Designation: ${apt.designation}`);
        doc.text(`Department: ${apt.faculty_dept}`);
        doc.text(`Phone: ${apt.faculty_phone}`);
        doc.moveDown();

        // Appointment Details
        doc.fontSize(14).fillColor('#000').text('Appointment Details', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(11);
        doc.fillColor('#333').text(`Date: ${new Date(apt.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`);
        doc.text(`Time: ${apt.start_time} - ${apt.end_time}`);
        doc.text(`Reason: ${apt.reason}`);
        doc.text(`Booked At: ${apt.booked_at}`);
        doc.moveDown();

        // Footer
        doc.moveTo(70, doc.y).lineTo(540, doc.y).stroke();
        doc.moveDown();
        doc.fontSize(9).fillColor('#666').text('This is a computer-generated receipt and does not require a signature.', { align: 'center' });
        doc.text('For any queries, please contact the faculty or administration.', { align: 'center' });
        doc.moveDown();
        doc.fontSize(8).text('EduMeet - Faculty Appointment System', { align: 'center' });

        doc.end();
    } catch (error) {
        console.error('Receipt PDF error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to generate receipt' 
        });
    }
});
