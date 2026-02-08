import mysql.connector
from config import DB_CONFIG

print("Testing Notification System...")
print("=" * 50)

conn = mysql.connector.connect(**DB_CONFIG)
cursor = conn.cursor(dictionary=True)

# Check if notifications table exists
cursor.execute("SHOW TABLES LIKE 'notifications'")
if cursor.fetchone():
    print("✅ Notifications table exists")
    
    # Count notifications
    cursor.execute("SELECT COUNT(*) as count FROM notifications")
    count = cursor.fetchone()['count']
    print(f"✅ Total notifications in database: {count}")
    
    # Show recent notifications
    cursor.execute("SELECT * FROM notifications ORDER BY created_at DESC LIMIT 5")
    notifications = cursor.fetchall()
    
    if notifications:
        print(f"\n📋 Recent Notifications:")
        for notif in notifications:
            print(f"  - ID: {notif['notification_id']}")
            print(f"    User: {notif['user_type']} #{notif['user_id']}")
            print(f"    Type: {notif['type']}")
            print(f"    Message: {notif['message']}")
            print(f"    Read: {'Yes' if notif['is_read'] else 'No'}")
            print(f"    Created: {notif['created_at']}")
            print()
    else:
        print("\n📭 No notifications yet")
        print("   Book an appointment to create a notification!")
else:
    print("❌ Notifications table does NOT exist!")
    print("   Run: python Source_Code/add_notifications_table.py")

cursor.close()
conn.close()

print("=" * 50)
print("Test complete!")
