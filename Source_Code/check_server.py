"""Check if server is running and test routes"""
import requests
import time

print("Checking EduMeet Server...")
print("=" * 50)

# Check if server is running
try:
    response = requests.get('http://localhost:5000/', timeout=2)
    print(f"✅ Server is running (Status: {response.status_code})")
except requests.exceptions.ConnectionError:
    print("❌ Server is NOT running!")
    print("   Start it with: AUTO_RESTART.bat")
    exit(1)
except Exception as e:
    print(f"❌ Error: {e}")
    exit(1)

# Test login page
try:
    response = requests.get('http://localhost:5000/login', timeout=2)
    print(f"✅ Login page works (Status: {response.status_code})")
except Exception as e:
    print(f"❌ Login page error: {e}")

print("\n" + "=" * 50)
print("Server is running. Check the command window for errors.")
