"""Test the notification API endpoints"""
import requests

print("Testing Notification API...")
print("=" * 50)

# Test notification count endpoint
try:
    response = requests.get('http://localhost:5000/api/notifications/count')
    print(f"\n[1] GET /api/notifications/count")
    print(f"    Status: {response.status_code}")
    print(f"    Response: {response.json()}")
except Exception as e:
    print(f"    ❌ Error: {e}")
    print("    Make sure the server is running!")

# Test notifications list endpoint
try:
    response = requests.get('http://localhost:5000/api/notifications')
    print(f"\n[2] GET /api/notifications")
    print(f"    Status: {response.status_code}")
    data = response.json()
    print(f"    Notifications: {len(data.get('notifications', []))}")
    if data.get('notifications'):
        print(f"    First notification: {data['notifications'][0].get('message', 'N/A')[:50]}...")
except Exception as e:
    print(f"    ❌ Error: {e}")

print("\n" + "=" * 50)
