# 🔔 Test Guide: Notification System

## Prerequisites
✅ Database updated with notifications table  
✅ Flask server running  
✅ XAMPP MySQL running

## Quick Test Steps

### Step 1: Test Faculty Notification (Student Books Appointment)

1. **Login as Student**
   - Email: `rahul.kumar@student.edu`
   - Password: `student123`

2. **Book an Appointment**
   - Click "📅 Book New Appointment"
   - Select any faculty (e.g., Dr. Priya Sharma)
   - Choose an available slot
   - Enter reason: "Project discussion"
   - Click "Book Appointment"

3. **Login as Faculty**
   - Logout from student account
   - Email: `priya.sharma@college.edu`
   - Password: `faculty123`

4. **Check Notification**
   - Look at the header - you should see 🔔 with a red badge showing "1"
   - Click the bell icon
   - You should see: "New appointment request from Rahul Kumar for [date] at [time]"
   - The notification should have a blue background (unread)

### Step 2: Test Student Notification (Faculty Approves)

1. **While logged in as Faculty**
   - Find the pending appointment from Rahul Kumar
   - Click "✓ Approve" button
   - You should see "Appointment approved" message

2. **Login as Student**
   - Logout from faculty account
   - Login as: `rahul.kumar@student.edu` / `student123`

3. **Check Notification**
   - Look at the header - you should see 🔔 with a red badge showing "1"
   - Click the bell icon
   - You should see: "Your appointment with Dr. Priya Sharma on [date] at [time] has been APPROVED! ✅"
   - The notification should have a blue background (unread)

### Step 3: Test Student Notification (Faculty Rejects)

1. **Login as Student and Book Another Appointment**
   - Login as: `rahul.kumar@student.edu` / `student123`
   - Book another appointment with any faculty

2. **Login as Faculty and Reject**
   - Login as the faculty you booked with
   - Find the pending appointment
   - Click "✗ Reject" button

3. **Login as Student and Check**
   - Login as: `rahul.kumar@student.edu` / `student123`
   - Check bell icon - should show notification count
   - Click bell to see rejection notification
   - Message: "Your appointment with [Faculty Name] on [date] at [time] has been REJECTED. ❌"

### Step 4: Test Mark as Read

1. **Click on Unread Notification**
   - Click on any notification with blue background
   - The blue background should disappear
   - Badge count should decrease by 1

2. **Test Mark All as Read**
   - Have multiple unread notifications
   - Click "Mark all as read" button
   - All blue backgrounds should disappear
   - Badge should disappear completely

### Step 5: Test Auto-Refresh

1. **Open Two Browser Windows**
   - Window 1: Login as student
   - Window 2: Login as faculty

2. **Create Notification**
   - In Window 1 (student): Book an appointment
   - In Window 2 (faculty): Wait 30 seconds
   - The badge should automatically update without page refresh

### Step 6: Test Notification Dropdown

1. **Test Dropdown Open/Close**
   - Click bell icon - dropdown should open
   - Click bell again - dropdown should close
   - Click outside dropdown - dropdown should close

2. **Test Notification List**
   - Should show last 20 notifications
   - Each notification shows:
     - Icon (📅, ✅, ❌)
     - Message text
     - Timestamp
   - Unread notifications have blue background

3. **Test Empty State**
   - Mark all notifications as read
   - Close and reopen dropdown
   - Should show "📭 No notifications yet" message

## Expected Results

### Faculty Notifications
- ✅ Receives notification when student books appointment
- ✅ Notification shows student name
- ✅ Notification shows date and time
- ✅ Badge shows unread count
- ✅ Badge pulses to draw attention

### Student Notifications
- ✅ Receives notification when appointment approved
- ✅ Receives notification when appointment rejected
- ✅ Notification shows faculty name
- ✅ Notification shows date and time
- ✅ Notification shows status (APPROVED/REJECTED)
- ✅ Badge shows unread count

### UI/UX
- ✅ Bell icon in header
- ✅ Red badge with count
- ✅ Pulsing animation on badge
- ✅ Dropdown opens on click
- ✅ Dropdown closes on outside click
- ✅ Unread notifications highlighted
- ✅ Click to mark as read
- ✅ Mark all as read button works
- ✅ Auto-refresh every 30 seconds
- ✅ Dark mode compatible

## Troubleshooting

### Badge Not Showing
- Check if notifications table exists in database
- Check browser console for JavaScript errors
- Verify Flask server is running
- Check if user is logged in

### Notifications Not Creating
- Check database connection
- Verify notifications table has correct structure
- Check app.py has updated approve/reject routes
- Look for errors in Flask console

### Dropdown Not Opening
- Check JavaScript console for errors
- Verify notification CSS is loaded
- Check if bell icon has onclick handler

### Count Not Updating
- Wait 30 seconds for auto-refresh
- Check network tab for API calls
- Verify `/api/notifications/count` endpoint works
- Check if session is valid

## API Testing (Optional)

Test API endpoints directly:

```bash
# Get notification count
curl http://localhost:5000/api/notifications/count

# Get all notifications
curl http://localhost:5000/api/notifications

# Mark notification as read
curl -X POST http://localhost:5000/api/notifications/mark-read/1

# Mark all as read
curl -X POST http://localhost:5000/api/notifications/mark-all-read
```

## Success Criteria

✅ Faculty receives notifications when students book  
✅ Students receive notifications when appointments approved/rejected  
✅ Badge shows correct unread count  
✅ Dropdown displays notifications properly  
✅ Mark as read functionality works  
✅ Auto-refresh updates count  
✅ UI is responsive and looks good  
✅ Dark mode works correctly  
✅ No JavaScript errors in console  
✅ No Python errors in Flask console

---

**Test Status**: Ready for Testing  
**Estimated Test Time**: 10-15 minutes  
**Difficulty**: Easy
