import mysql.connector
from config import DB_CONFIG
from datetime import datetime, timedelta

print("=" * 60)
print("DEBUG: Testing Appointment Booking & Notifications")
print("=" * 60)

conn = mysql.connector.connect(**DB_CONFIG)
cursor = conn.cursor(dictionary=True)

# Step 1: Check if we have students and faculty
print("\n[1] Checking users...")
cursor.execute("SELECT student_id, name FROM students LIMIT 1")
student = cursor.fetchone()
if student:
    print(f"✅ Found student: {student['name']} (ID: {student['student_id']})")
else:
    print("❌ No students found!")
    exit(1)

cursor.execute("SELECT faculty_id, name FROM faculty LIMIT 1")
faculty = cursor.fetchone()
if faculty:
    print(f"✅ Found faculty: {faculty['name']} (ID: {faculty['faculty_id']})")
else:
    print("❌ No faculty found!")
    exit(1)

# Step 2: Check if we have a future slot
print("\n[2] Checking available slots...")
cursor.execute("""
    SELECT slot_id, date, start_time, end_time 
    FROM time_slots 
    WHERE faculty_id = %s AND date >= CURDATE() 
    LIMIT 1
""", (faculty['faculty_id'],))
slot = cursor.fetchone()

if slot:
    print(f"✅ Found slot: {slot['date']} at {slot['start_time']}-{slot['end_time']}")
else:
    print("❌ No future slots found!")
    print("   Creating a test slot...")
    tomorrow = datetime.now().date() + timedelta(days=1)
    cursor.execute("""
        INSERT INTO time_slots (faculty_id, date, start_time, end_time, is_available)
        VALUES (%s, %s, '10:00:00', '11:00:00', TRUE)
    """, (faculty['faculty_id'], tomorrow))
    conn.commit()
    slot_id = cursor.lastrowid
    print(f"✅ Created test slot ID: {slot_id}")
    cursor.execute("SELECT slot_id, date, start_time, end_time FROM time_slots WHERE slot_id = %s", (slot_id,))
    slot = cursor.fetchone()

# Step 3: Simulate booking
print("\n[3] Simulating appointment booking...")
try:
    cursor.execute("""
        INSERT INTO appointments (student_id, faculty_id, slot_id, reason, status)
        VALUES (%s, %s, %s, 'Test booking', 'Pending')
    """, (student['student_id'], faculty['faculty_id'], slot['slot_id']))
    appointment_id = cursor.lastrowid
    print(f"✅ Created appointment ID: {appointment_id}")
    
    # Step 4: Create notification
    print("\n[4] Creating notification...")
    notification_msg = f"New appointment request from {student['name']} for {slot['date'].strftime('%d-%m-%Y')} at {slot['start_time']}"
    print(f"   Message: {notification_msg}")
    
    cursor.execute("""
        INSERT INTO notifications (user_id, user_type, message, type, is_read)
        VALUES (%s, 'faculty', %s, 'booking', FALSE)
    """, (faculty['faculty_id'], notification_msg))
    notification_id = cursor.lastrowid
    
    conn.commit()
    print(f"✅ Created notification ID: {notification_id}")
    
    # Step 5: Verify notification
    print("\n[5] Verifying notification...")
    cursor.execute("""
        SELECT * FROM notifications 
        WHERE notification_id = %s
    """, (notification_id,))
    notif = cursor.fetchone()
    
    if notif:
        print("✅ Notification verified in database:")
        print(f"   - ID: {notif['notification_id']}")
        print(f"   - User: faculty #{notif['user_id']}")
        print(f"   - Message: {notif['message']}")
        print(f"   - Type: {notif['type']}")
        print(f"   - Read: {notif['is_read']}")
        print(f"   - Created: {notif['created_at']}")
    else:
        print("❌ Notification not found in database!")
    
    # Step 6: Check notification count
    print("\n[6] Checking notification count for faculty...")
    cursor.execute("""
        SELECT COUNT(*) as count 
        FROM notifications 
        WHERE user_id = %s AND user_type = 'faculty' AND is_read = FALSE
    """, (faculty['faculty_id'],))
    count = cursor.fetchone()['count']
    print(f"✅ Unread notifications for faculty: {count}")
    
    print("\n" + "=" * 60)
    print("✅ TEST SUCCESSFUL!")
    print("=" * 60)
    print("\nNow login as faculty and check the bell icon!")
    print(f"Faculty: {faculty['name']}")
    print(f"Expected notifications: {count}")
    
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    conn.rollback()
    import traceback
    traceback.print_exc()

cursor.close()
conn.close()
