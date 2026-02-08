# 🎓 EduMeet - Full Stack JavaScript Version

## Modern Faculty Appointment System

A complete rewrite of EduMeet using **Node.js, Express, MySQL, HTML5, CSS3, and Vanilla JavaScript** with advanced animations and modern UI/UX.

---

## ✨ Features

### 🎨 Modern UI/UX
- **Advanced Animations**: Smooth transitions, hover effects, and micro-interactions
- **Dark Mode**: Toggle between light and dark themes
- **Glassmorphism Design**: Modern card designs with blur effects
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Animated Charts**: Interactive data visualization with Chart.js

### 👥 User Roles

#### Students
- View faculty list and availability
- Book appointments with faculty
- Track appointment status (Pending/Approved/Rejected)
- Cancel pending appointments
- Real-time notifications

#### Faculty
- Manage time slot availability
- View appointment requests
- Approve/Reject appointments
- View appointment history
- Delete unused time slots

#### Admin
- View system statistics
- Manage students and faculty
- Add new users
- Monitor all appointments
- System-wide analytics

---

## 🛠️ Technology Stack

| Component | Technology |
|-----------|-----------|
| **Backend** | Node.js + Express.js |
| **Database** | MySQL 8.0+ |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Charts** | Chart.js |
| **Authentication** | Express-session + bcryptjs |
| **API** | RESTful API |

---

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm
- MySQL 8.0+
- Git (optional)

### Step 1: Install Dependencies
```bash
cd FullStack_Version
npm install
```

### Step 2: Setup Database
```bash
# Login to MySQL
mysql -u root -p

# Run the database script
source ../Database/edumeet_database.sql
```

### Step 3: Configure Environment
Edit `.env` file:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=edumeet_db
PORT=3000
SESSION_SECRET=change-this-secret-key
```

### Step 4: Start Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

### Step 5: Access Application
Open browser: `http://localhost:3000`

---

## 🔐 Default Login Credentials

### Admin
- **Email**: admin@edumeet.com
- **Password**: admin123

### Faculty
- **Email**: priya.sharma@college.edu
- **Password**: faculty123

### Student
- **Email**: rahul.kumar@student.edu
- **Password**: student123

---

## 📁 Project Structure

```
FullStack_Version/
├── config/
│   └── database.js          # Database connection
├── middleware/
│   └── auth.js              # Authentication middleware
├── routes/
│   ├── auth.js              # Login/logout routes
│   ├── student.js           # Student routes
│   ├── faculty.js           # Faculty routes
│   ├── admin.js             # Admin routes
│   └── api.js               # General API routes
├── public/
│   ├── css/
│   │   └── style.css        # Main stylesheet
│   ├── js/
│   │   ├── main.js          # Core JavaScript
│   │   ├── student.js       # Student dashboard logic
│   │   ├── faculty.js       # Faculty dashboard logic
│   │   └── admin.js         # Admin dashboard logic
│   ├── index.html           # Landing page
│   ├── login.html           # Login page
│   ├── student/
│   │   ├── dashboard.html   # Student dashboard
│   │   └── book.html        # Book appointment
│   ├── faculty/
│   │   └── dashboard.html   # Faculty dashboard
│   └── admin/
│       └── dashboard.html   # Admin dashboard
├── .env                     # Environment variables
├── package.json             # Dependencies
├── server.js                # Main server file
└── README.md                # This file
```

---

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Check session

### Student
- `GET /api/student/dashboard` - Get appointments
- `GET /api/student/faculty` - Get faculty list
- `GET /api/student/slots/:facultyId` - Get available slots
- `POST /api/student/book` - Book appointment
- `POST /api/student/cancel/:appointmentId` - Cancel appointment

### Faculty
- `GET /api/faculty/dashboard` - Get dashboard data
- `POST /api/faculty/slots` - Add time slot
- `DELETE /api/faculty/slots/:slotId` - Delete slot
- `POST /api/faculty/appointments/:id/approve` - Approve appointment
- `POST /api/faculty/appointments/:id/reject` - Reject appointment

### Admin
- `GET /api/admin/dashboard` - Get statistics
- `GET /api/admin/students` - Get all students
- `POST /api/admin/students` - Add student
- `DELETE /api/admin/students/:id` - Delete student
- `GET /api/admin/faculty` - Get all faculty
- `POST /api/admin/faculty` - Add faculty
- `DELETE /api/admin/faculty/:id` - Delete faculty

### Notifications
- `GET /api/notifications` - Get notifications
- `POST /api/notifications/:id/read` - Mark as read
- `POST /api/notifications/read-all` - Mark all as read

---

## 🎨 Features Showcase

### 1. Animated Statistics Cards
- Count-up animation from 0 to actual value
- Progress bars with smooth fill animation
- Hover effects with scale and shadow
- Icon bounce animation

### 2. Interactive Charts
- Doughnut charts for status distribution
- Line charts for trends
- Smooth animations on load
- Responsive and theme-aware

### 3. Dark Mode
- Smooth theme transition
- Persistent preference (localStorage)
- All components adapt to theme
- Easy toggle button in navbar

### 4. Glassmorphism Cards
- Frosted glass effect
- Backdrop blur
- Semi-transparent backgrounds
- Modern and elegant

### 5. Smooth Animations
- Fade in/out effects
- Slide animations
- Scale transformations
- Hover interactions

---

## 🔧 Development

### Run in Development Mode
```bash
npm run dev
```
Uses nodemon for auto-reload on file changes.

### Environment Variables
- `DB_HOST` - MySQL host
- `DB_USER` - MySQL username
- `DB_PASSWORD` - MySQL password
- `DB_NAME` - Database name
- `PORT` - Server port (default: 3000)
- `SESSION_SECRET` - Session encryption key

---

## 📊 Database Schema

The application uses the same MySQL database as the original Python version:

- **users** - Common user information
- **students** - Student-specific data
- **faculty** - Faculty-specific data
- **time_slots** - Faculty availability
- **appointments** - Booking information
- **notifications** - User notifications

---

## 🎯 Key Improvements Over Python Version

1. **Modern Tech Stack**: Full JavaScript (Node.js + Vanilla JS)
2. **Better Performance**: Async/await, connection pooling
3. **RESTful API**: Clean separation of frontend and backend
4. **Advanced Animations**: CSS3 animations and transitions
5. **Better UX**: Smooth interactions and feedback
6. **Scalable**: Easy to add features and scale
7. **No Template Engine**: Pure HTML + JavaScript for flexibility

---

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check MySQL is running
mysql -u root -p

# Verify database exists
SHOW DATABASES;
USE edumeet_db;
```

### Port Already in Use
Change PORT in `.env` file:
```env
PORT=3001
```

### Module Not Found
```bash
npm install
```

### Session Issues
Clear browser cookies and restart server.

---

## 📝 Scripts

```json
{
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

---

## 🔒 Security Features

- Password hashing with bcryptjs
- Session-based authentication
- SQL injection prevention (prepared statements)
- XSS protection
- CORS configuration
- Input validation and sanitization

---

## 🌟 Future Enhancements

- [ ] Email notifications
- [ ] SMS alerts
- [ ] Calendar integration (Google Calendar)
- [ ] Video conferencing integration
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Export to PDF
- [ ] Multi-language support

---

## 📄 License

MIT License - Educational purposes

---

## 👥 Contributors

EduMeet Development Team - 2026

---

## 📞 Support

For issues and questions:
1. Check this README
2. Review API documentation
3. Check browser console for errors
4. Verify database connection

---

## 🎉 Enjoy Your Modern EduMeet!

**Built with ❤️ using Node.js, Express, and Vanilla JavaScript**

No Python. No PHP. Pure JavaScript Full Stack! 🚀
