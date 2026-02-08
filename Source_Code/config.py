# ================================================
# EduMeet: Configuration File
# ================================================

# Database Configuration
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',  # Change this to your MySQL password
    'database': 'edumeet_db',
    'raise_on_warnings': True
}

# Flask Secret Key (Change this in production)
SECRET_KEY = 'your-secret-key-change-in-production-12345'

# Application Settings
DEBUG = True
HOST = '0.0.0.0'
PORT = 5000
