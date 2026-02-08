# 🎓 EduMeet: Faculty Availability & Appointment Management System

A web-based application that streamlines the process of scheduling appointments between students and faculty members.

## 📋 Features

- **User Authentication**: Secure login for Students, Faculty, and Admin
- **Student Features**:
  - View faculty list and availability
  - Book appointments with faculty
  - Track appointment status
  - Cancel appointments
  
- **Faculty Features**:
  - Manage time slot availability
  - View appointment requests
  - Approve/Reject appointments
  - View appointment history
  
- **Admin Features**:
  - View system statistics
  - Monitor all appointments
  - Manage users

## 🛠️ Technology Stack

- **Backend**: Python Flask
- **Database**: MySQL
- **Frontend**: HTML5, CSS3, JavaScript
- **Security**: Werkzeug password hashing

## 📦 Installation

### Prerequisites
- Python 3.8 or higher
- MySQL Server 5.7 or higher
- pip (Python package manager)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd EduMeet
```

### Step 2: Install Dependencies
```bash
cd Source_Code
pip install -r requirements.txt
```

### Step 3: Setup Database
1. Start MySQL server
2. Open MySQL command line or workbench
3. Run the database script:
```bash
mysql -u root -p < ../Database/edumeet_database.sql
```

### Step 4: Configure Database Connection
Edit `Source_Code/config.py` and update database credentials:
```python
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'your_mysql_password',  # Change this
    'database': 'edumeet_db',
    'raise_on_warnings': True
}
```

### Step 5: Run the Application
```bash
python app.py
```

The application will start on `http://localhost:5000`

## 🔐 Default Login Credentials

### Admin
- Email: `admin@edumeet.com`
- Password: `admin123`

### Faculty
- Email: `priya.sharma@college.edu`
- Password: `faculty123`

### Student
- Email: `rahul.kumar@student.edu`
- Password: `student123`

**Note**: Default passwords are hashed in the database. For testing, you'll need to register new users or update the database with properly hashed passwords.

## 📁 Project Structure

```
EduMeet/
├── Documentation/          # Project documentation
├── Database/              # SQL database scripts
├── Source_Code/
│   ├── app.py            # Main Flask application
│   ├── config.py         # Configuration file
│   ├── requirements.txt  # Python dependencies
│   ├── templates/        # HTML templates
│   │   ├── index.html
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── student_dashboard.html
│   │   ├── faculty_dashboard.html
│   │   ├── admin_dashboard.html
│   │   └── ...
│   └── static/           # Static files
│       ├── css/
│       │   └── style.css
│       └── js/
│           └── script.js
└── README.md
```

## 🚀 Usage

### For Students:
1. Register with your details
2. Login with your credentials
3. Browse faculty members
4. View available time slots
5. Book an appointment
6. Track appointment status

### For Faculty:
1. Login with faculty credentials
2. Add your available time slots
3. View appointment requests
4. Approve or reject appointments
5. Manage your schedule

### For Admin:
1. Login with admin credentials
2. View system statistics
3. Monitor all appointments
4. Manage users

## 🔧 Configuration

### Change Secret Key
In `config.py`, update the SECRET_KEY for production:
```python
SECRET_KEY = 'your-secure-random-secret-key'
```

### Database Configuration
Update `DB_CONFIG` in `config.py` with your MySQL credentials.

## 📝 API Endpoints

- `/` - Home page
- `/login` - User login
- `/register` - Student registration
- `/logout` - User logout
- `/student/dashboard` - Student dashboard
- `/student/faculty` - View faculty list
- `/student/slots/<faculty_id>` - View faculty slots
- `/student/book/<slot_id>` - Book appointment
- `/student/cancel/<appointment_id>` - Cancel appointment
- `/faculty/dashboard` - Faculty dashboard
- `/faculty/slots` - Manage time slots
- `/faculty/approve/<appointment_id>` - Approve appointment
- `/faculty/reject/<appointment_id>` - Reject appointment
- `/admin/dashboard` - Admin dashboard

## 🐛 Troubleshooting

### Database Connection Error
- Ensure MySQL server is running
- Check database credentials in `config.py`
- Verify database `edumeet_db` exists

### Module Not Found Error
```bash
pip install -r requirements.txt
```

### Port Already in Use
Change the port in `app.py`:
```python
app.run(debug=True, host='0.0.0.0', port=5001)
```

## 📄 License

This project is created for educational purposes.

## 👥 Contributors

Software Engineering Team - 2026

## 📞 Support

For issues and questions, please refer to the documentation in the `Documentation/` folder.

---

**Made with ❤️ for educational institutions**
