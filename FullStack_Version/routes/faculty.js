// ========================================
// Faculty Routes
// ========================================

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { isAuthenticated, isFaculty } = require('../middleware/auth');
const PDFDocument = require('pdfkit');

// Get faculty dashboard data
router.get('/dashboard', isAuthenticated, isFaculty, async (req, res) => {
    try {
        // Get appointments
        const [appointments] = await db.query(`
            SELECT a.appointment_id, s.name AS student_name, s.roll_number, s.department, 
                   t.date, t.start_time, t.end_time, a.reason, a.status, a.created_at
            FROM appointments a 
            JOIN students s ON a.student_id = s.student_id 
            JOIN time_slots t ON a.slot_id = t.slot_id
            WHERE a.faculty_id = ?
            ORDER BY t.date, t.start_time
        `, [req.session.facultyId]);

        // Get slots
        const [slots] = await db.query(`
            SELECT slot_id, date, start_time, end_time,
                   (SELECT COUNT(*) FROM appointments WHERE slot_id = time_slots.slot_id) as booking_count
            FROM time_slots 
            WHERE faculty_id = ? AND date >= CURDATE() 
            ORDER BY date, start_time
        `, [req.session.facultyId]);

        // Calculate statistics
        const stats = {
            total: appointments.length,
            pending: appointments.filter(a => a.status === 'Pending').length,
            approved: appointments.filter(a => a.status === 'Approved').length,
            rejected: appointments.filter(a => a.status === 'Rejected').length,
            slots: slots.length
        };

        res.json({ 
            success: true, 
            appointments,
            slots,
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

// Add time slot
router.post('/slots', isAuthenticated, isFaculty, async (req, res) => {
    try {
        const { date, startTime, endTime } = req.body;

        if (!date || !startTime || !endTime) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        if (startTime >= endTime) {
            return res.status(400).json({ 
                success: false, 
                message: 'End time must be after start time' 
            });
        }

        await db.query(
            'INSERT INTO time_slots (faculty_id, date, start_time, end_time, is_available) VALUES (?, ?, ?, ?, ?)',
            [req.session.facultyId, date, startTime, endTime, true]
        );

        res.json({ 
            success: true, 
            message: 'Time slot added successfully' 
        });
    } catch (error) {
        console.error('Add slot error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to add time slot' 
        });
    }
});

// Delete time slot
router.delete('/slots/:slotId', isAuthenticated, isFaculty, async (req, res) => {
    try {
        const { slotId } = req.params;

        // Check if slot has appointments
        const [appointments] = await db.query(
            'SELECT COUNT(*) as count FROM appointments WHERE slot_id = ?',
            [slotId]
        );

        if (appointments[0].count > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Cannot delete slot with existing appointments' 
            });
        }

        await db.query(
            'DELETE FROM time_slots WHERE slot_id = ? AND faculty_id = ?',
            [slotId, req.session.facultyId]
        );

        res.json({ 
            success: true, 
            message: 'Slot deleted successfully' 
        });
    } catch (error) {
        console.error('Delete slot error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete slot' 
        });
    }
});

// Approve appointment
router.post('/appointments/:appointmentId/approve', isAuthenticated, isFaculty, async (req, res) => {
    try {
        const { appointmentId } = req.params;

        await db.query(
            'UPDATE appointments SET status = ? WHERE appointment_id = ? AND faculty_id = ?',
            ['Approved', appointmentId, req.session.facultyId]
        );

        res.json({ 
            success: true, 
            message: 'Appointment approved' 
        });
    } catch (error) {
        console.error('Approve error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to approve appointment' 
        });
    }
});

// Reject appointment
router.post('/appointments/:appointmentId/reject', isAuthenticated, isFaculty, async (req, res) => {
    try {
        const { appointmentId } = req.params;

        await db.query(
            'UPDATE appointments SET status = ? WHERE appointment_id = ? AND faculty_id = ?',
            ['Rejected', appointmentId, req.session.facultyId]
        );

        res.json({ 
            success: true, 
            message: 'Appointment rejected' 
        });
    } catch (error) {
        console.error('Reject error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to reject appointment' 
        });
    }
});

module.exports = router;


// Get bookings for a specific slot
router.get('/slots/:slotId/bookings', isAuthenticated, isFaculty, async (req, res) => {
    try {
        const { slotId } = req.params;

        // Get slot info
        const [slots] = await db.query(
            'SELECT date, start_time, end_time FROM time_slots WHERE slot_id = ? AND faculty_id = ?',
            [slotId, req.session.facultyId]
        );

        if (slots.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Slot not found' 
            });
        }

        // Get all bookings for this slot
        const [bookings] = await db.query(`
            SELECT a.appointment_id, a.reason, a.status, a.created_at,
                   s.name AS student_name, s.roll_number, s.department, s.section, s.course, s.phone
            FROM appointments a
            JOIN students s ON a.student_id = s.student_id
            WHERE a.slot_id = ?
            ORDER BY a.created_at DESC
        `, [slotId]);

        res.json({ 
            success: true, 
            bookings,
            slotInfo: slots[0]
        });
    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to load bookings' 
        });
    }
});

// Export booking history as PDF
router.get('/export/bookings', isAuthenticated, isFaculty, async (req, res) => {
    try {
        // Get faculty info
        const [faculty] = await db.query(
            'SELECT name, department, designation FROM faculty WHERE faculty_id = ?',
            [req.session.facultyId]
        );

        // Get all appointments
        const [appointments] = await db.query(`
            SELECT a.appointment_id, s.name AS student_name, s.roll_number, s.department, 
                   t.date, t.start_time, t.end_time, a.reason, a.status, 
                   DATE_FORMAT(a.created_at, '%Y-%m-%d %H:%i') as booked_at
            FROM appointments a 
            JOIN students s ON a.student_id = s.student_id 
            JOIN time_slots t ON a.slot_id = t.slot_id
            WHERE a.faculty_id = ?
            ORDER BY t.date DESC, t.start_time DESC
        `, [req.session.facultyId]);

        // Create PDF
        const doc = new PDFDocument({ margin: 50 });
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=booking_history.pdf');
        
        doc.pipe(res);

        // Header
        doc.fontSize(20).text('EduMeet - Booking History', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Faculty: ${faculty[0].name}`, { align: 'left' });
        doc.text(`Department: ${faculty[0].department}`);
        doc.text(`Designation: ${faculty[0].designation}`);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`);
        doc.moveDown();
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();

        // Statistics
        const stats = {
            total: appointments.length,
            pending: appointments.filter(a => a.status === 'Pending').length,
            approved: appointments.filter(a => a.status === 'Approved').length,
            rejected: appointments.filter(a => a.status === 'Rejected').length
        };

        doc.fontSize(14).text('Summary Statistics', { underline: true });
        doc.fontSize(10);
        doc.text(`Total Appointments: ${stats.total}`);
        doc.text(`Pending: ${stats.pending}`);
        doc.text(`Approved: ${stats.approved}`);
        doc.text(`Rejected: ${stats.rejected}`);
        doc.moveDown();
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();

        // Appointments list
        doc.fontSize(14).text('Appointment Details', { underline: true });
        doc.moveDown();

        if (appointments.length === 0) {
            doc.fontSize(10).text('No appointments found.');
        } else {
            appointments.forEach((apt, index) => {
                if (doc.y > 700) {
                    doc.addPage();
                }

                doc.fontSize(11).text(`${index + 1}. ${apt.student_name} (${apt.roll_number})`, { bold: true });
                doc.fontSize(9);
                doc.text(`   Department: ${apt.department}`);
                doc.text(`   Date: ${new Date(apt.date).toLocaleDateString()} | Time: ${apt.start_time} - ${apt.end_time}`);
                doc.text(`   Reason: ${apt.reason}`);
                doc.text(`   Status: ${apt.status}`);
                doc.text(`   Booked At: ${apt.booked_at}`);
                doc.moveDown(0.5);
            });
        }

        doc.end();
    } catch (error) {
        console.error('Export PDF error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to export PDF' 
        });
    }
});
