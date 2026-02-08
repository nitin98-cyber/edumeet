# 🚀 Quick Start: Notification System

## Setup (One-Time)

### Step 1: Update Database
```bash
python Source_Code/add_notifications_table.py
```
Expected output: ✅ Notifications table created successfully!

### Step 2: Start Server
```bash
cd Source_Code
python app.py
```
Server should start on: http://localhost:5000

## Quick Test (2 Minutes)

### Test 1: Faculty Notification
1. Open browser: http://localhost:5000
2. Login as student: `rahul.kumar@student.edu` / `student123`
3. Click "📅 Book New Appointment"
4. Select any faculty and book a slot
5. Logout and login as faculty: `priya.sharma@college.edu` / `faculty123`
6. **Check**: Bell icon 🔔 should show red badge with "1"
7. **Click bell**: Should see notification about booking

### Test 2: Student Notification
1. While logged in as faculty, approve the appointment
2. Logout and login as student: `rahul.kumar@student.edu` / `student123`
3. **Check**: Bell icon 🔔 should show red badge with "1"
4. **Click bell**: Should see approval notification

## What You Should See

### Bell Icon Features:
- 🔔 White bell icon in header (top-right)
- Red badge with number when unread notifications exist
- Badge pulses to draw attention
- Click to open dropdown

### Notification Dropdown:
- Modern card design with shadow
- Shows last 20 notifications
- Unread notifications have blue background
- Each shows: icon, message, timestamp
- "Mark all as read" button at top
- Click notification to mark as read

### Notification Messages:

**Faculty sees:**
```
📅 New appointment request from Rahul Kumar for 10-02-2026 at 10:00:00
```

**Student sees (Approval):**
```
✅ Your appointment with Dr. Priya Sharma on 10-02-2026 at 10:00:00 has been APPROVED! ✅
```

**Student sees (Rejection):**
```
❌ Your appointment with Dr. Priya Sharma on 10-02-2026 at 10:00:00 has been REJECTED. ❌
```

## Troubleshooting

### Badge Not Showing?
- Wait 30 seconds (auto-refresh interval)
- Refresh page manually
- Check if notification was created in database

### Dropdown Not Opening?
- Check browser console for errors (F12)
- Verify JavaScript is enabled
- Try different browser

### No Notifications?
- Verify database table exists: `SHOW TABLES LIKE 'notifications';`
- Check Flask console for errors
- Ensure you're logged in as correct user

## Quick Commands

### Check Database Table:
```sql
USE edumeet_db;
SHOW TABLES LIKE 'notifications';
SELECT * FROM notifications;
```

### Check Notification Count:
```sql
SELECT COUNT(*) FROM notifications WHERE is_read = FALSE;
```

### Clear All Notifications (Testing):
```sql
DELETE FROM notifications;
```

## Features at a Glance

✅ Real-time notification bell icon  
✅ Red badge showing unread count  
✅ Pulsing animation on badge  
✅ Modern dropdown with notifications  
✅ Faculty notified when students book  
✅ Students notified when approved/rejected  
✅ Mark as read functionality  
✅ Mark all as read button  
✅ Auto-refresh every 30 seconds  
✅ Dark mode compatible  
✅ Mobile responsive  

## Next Steps

1. ✅ Test with multiple users
2. ✅ Test mark as read functionality
3. ✅ Test auto-refresh (wait 30 seconds)
4. ✅ Test in dark mode
5. ✅ Test on mobile device

## Need Help?

- 📖 Full Documentation: `NOTIFICATION_SYSTEM.md`
- 🧪 Testing Guide: `TEST_NOTIFICATION_SYSTEM.md`
- 📊 Feature Summary: `NOTIFICATION_FEATURES_SUMMARY.md`

---

**Status**: ✅ Ready to Use  
**Setup Time**: 2 minutes  
**Test Time**: 2 minutes  
**Total Time**: 4 minutes
