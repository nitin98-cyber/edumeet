import mysql.connector

# Connect to database
conn = mysql.connector.connect(
    host='localhost',
    user='root',
    password='',
    database='edumeet_db'
)

cursor = conn.cursor()

# Create notifications table
create_table_query = """
CREATE TABLE IF NOT EXISTS notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    user_type ENUM('student', 'faculty', 'admin') NOT NULL,
    message TEXT NOT NULL,
    type ENUM('booking', 'approval', 'rejection', 'cancellation', 'info') DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_notifications (user_id, user_type),
    INDEX idx_unread (is_read)
)
"""

try:
    cursor.execute(create_table_query)
    conn.commit()
    print("✅ Notifications table created successfully!")
    print("✅ Notification system is ready to use!")
except mysql.connector.Error as err:
    print(f"❌ Error: {err}")
finally:
    cursor.close()
    conn.close()
