// ========================================
// General API Routes
// ========================================

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');

// Get notifications
router.get('/notifications', isAuthenticated, async (req, res) => {
    try {
        let userId;
        if (req.session.userType === 'student') {
            userId = req.session.studentId;
        } else if (req.session.userType === 'faculty') {
            userId = req.session.facultyId;
        } else {
            return res.json({ success: true, notifications: [], count: 0 });
        }

        const [notifications] = await db.query(`
            SELECT notification_id, message, type, is_read, created_at 
            FROM notifications 
            WHERE user_id = ? AND user_type = ? 
            ORDER BY created_at DESC 
            LIMIT 20
        `, [userId, req.session.userType]);

        const [unreadCount] = await db.query(`
            SELECT COUNT(*) as count 
            FROM notifications 
            WHERE user_id = ? AND user_type = ? AND is_read = FALSE
        `, [userId, req.session.userType]);

        res.json({ 
            success: true, 
            notifications,
            count: unreadCount[0].count 
        });
    } catch (error) {
        console.error('Notifications error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to load notifications' 
        });
    }
});

// Mark notification as read
router.post('/notifications/:notificationId/read', isAuthenticated, async (req, res) => {
    try {
        const { notificationId } = req.params;

        await db.query(
            'UPDATE notifications SET is_read = TRUE WHERE notification_id = ?',
            [notificationId]
        );

        res.json({ 
            success: true, 
            message: 'Notification marked as read' 
        });
    } catch (error) {
        console.error('Mark read error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to mark notification as read' 
        });
    }
});

// Mark all notifications as read
router.post('/notifications/read-all', isAuthenticated, async (req, res) => {
    try {
        let userId;
        if (req.session.userType === 'student') {
            userId = req.session.studentId;
        } else if (req.session.userType === 'faculty') {
            userId = req.session.facultyId;
        } else {
            return res.json({ success: true });
        }

        await db.query(
            'UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND user_type = ?',
            [userId, req.session.userType]
        );

        res.json({ 
            success: true, 
            message: 'All notifications marked as read' 
        });
    } catch (error) {
        console.error('Mark all read error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to mark all notifications as read' 
        });
    }
});

module.exports = router;
