import mysql.connector
from config import DB_CONFIG

# Test the view_slots query
conn = mysql.connector.connect(**DB_CONFIG)
cursor = conn.cursor(dictionary=True)

faculty_id = 1

# Test query
query = """SELECT slot_id, date, start_time, end_time, 
           (SELECT COUNT(*) FROM appointments WHERE slot_id = time_slots.slot_id) as booking_count
           FROM time_slots 
           WHERE faculty_id = %s AND date >= CURDATE() 
           ORDER BY date, start_time"""

cursor.execute(query, (faculty_id,))
slots = cursor.fetchall()

print(f"Found {len(slots)} slots for faculty_id {faculty_id}")
print("\nSlot details:")
for slot in slots:
    print(f"  Slot ID: {slot['slot_id']}")
    print(f"  Date: {slot['date']}")
    print(f"  Time: {slot['start_time']} - {slot['end_time']}")
    print(f"  Booking Count: {slot['booking_count']}")
    print(f"  Type: {type(slot)}")
    print(f"  Keys: {slot.keys()}")
    print("  ---")

cursor.close()
conn.close()

print("\n✅ Query executed successfully!")
print("✅ All slots have 'booking_count' field")
