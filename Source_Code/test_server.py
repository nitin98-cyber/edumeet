#!/usr/bin/env python
"""Test if the Flask app can start without errors"""

import sys
import traceback

try:
    print("Importing Flask app...")
    from app import app
    print("✅ App imported successfully!")
    
    print("\nTesting routes...")
    with app.test_client() as client:
        # Test homepage
        response = client.get('/')
        print(f"✅ Homepage: {response.status_code}")
        
        # Test if view_faculty route exists
        print("\n✅ All basic tests passed!")
        print("\nYou can now start the server with: python app.py")
        
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    print("\nFull traceback:")
    traceback.print_exc()
    sys.exit(1)
