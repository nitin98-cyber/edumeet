# 🎓 EduMeet - Faculty Appointment System

<div align="center">

![EduMeet Logo](https://img.shields.io/badge/EduMeet-Faculty%20Appointments-667eea?style=for-the-badge&logo=graduation-cap)

**Modern, Progressive Web Application for Managing Faculty-Student Appointments**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue.svg)](https://www.mysql.com/)
[![PWA](https://img.shields.io/badge/PWA-Enabled-purple.svg)](https://web.dev/progressive-web-apps/)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 About

EduMeet is a comprehensive faculty appointment booking system designed for educational institutions. It streamlines the process of scheduling meetings between students and faculty members, featuring a modern interface, real-time updates, and mobile-first design.

### 🎯 Problem Statement

Traditional appointment booking systems are often:
- ❌ Difficult to use on mobile devices
- ❌ Lack real-time availability
- ❌ Require manual coordination
- ❌ Don't work offline

### ✅ Our Solution

EduMeet provides:
- ✅ Progressive Web App (installable)
- ✅ Real-time slot management
- ✅ Automated notifications
- ✅ Mobile-responsive design
- ✅ Offline support
- ✅ Beautiful, themeable interface

---

## ✨ Features

### 🎨 User Interface
- **10 Premium Themes** - Ocean, Sakura, Forest, Sunset, Midnight, and more
- **Mobile Responsive** - Works perfectly on all devices
- **Dark/Light Modes** - Multiple theme options
- **Smooth Animations** - Modern, fluid user experience

### 📱 Progressive Web App
- **Installable** - Add to home screen on any device
- **Offline Support** - Works without internet connection
- **Fast Loading** - Service worker caching
- **Push Notifications** - Real-time updates (ready)

### 👥 User Roles

#### Students
- Browse available faculty slots
- Book appointments
- View booking history
- Receive notifications
- Cancel/reschedule appointments

#### Faculty
- Create time slots
- Manage availability
- Approve/reject requests
- View appointment schedule
- Bulk slot creation

#### Admin
- Manage users (students & faculty)
- Bulk upload via CSV
- View analytics & charts
- System configuration
- Export reports

### 📊 Admin Dashboard
- **Real-time Charts** - Appointment trends and statistics
- **User Management** - Add, edit, delete users
- **Bulk Operations** - CSV upload for multiple users
- **Export Data** - Download reports as CSV
- **Analytics** - Visual insights into system usage

### 📤 Bulk Upload
- Upload multiple students/faculty via CSV
- Template download
- Preview before upload
- Error reporting with row numbers
- Partial success handling

### 🔔 Notifications
- Email notifications (ready)
- In-app notifications
- Push notifications (PWA ready)
- Appointment reminders

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with themes
- **JavaScript (ES6+)** - Vanilla JS, no frameworks
- **Chart.js** - Data visualization
- **Font Awesome** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **bcrypt** - Password hashing
- **express-session** - Session management

### PWA
- **Service Worker** - Offline support
- **Web App Manifest** - Installability
- **Cache API** - Asset caching
- **Background Sync** - Offline actions

---

## 📸 Screenshots

### Desktop View
![Dashboard](screenshots/desktop-dashboard.png)
*Admin dashboard with charts and statistics*

### Mobile View
![Mobile](screenshots/mobile-view.png)
*Responsive mobile interface*

### Themes
![Themes](screenshots/themes.png)
*10 beautiful themes to choose from*

---

## 🚀 Installation

### Prerequisites

- Node.js 16+ ([Download](https://nodejs.org/))
- MySQL 8.0+ ([Download](https://www.mysql.com/))
- Git ([Download](https://git-scm.com/))

### Quick Start

```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/EduMeet.git
cd EduMeet

# 2. Install dependencies
cd FullStack_Version
npm install

# 3. Create database
mysql -u root -p < ../Database/edumeet_database.sql

# 4. Configure environment
cp .env.example .env
# Edit .env with your database credentials

# 5. Start server
node server.js

# 6. Open browser
# Navigate to: http://localhost:3000
```

### Default Login Credentials

**Admin:**
- Email: `admin@edumeet.com`
- Password: `admin123`

**Student:**
- Email: `student@example.com`
- Password: `student123`

**Faculty:**
- Email: `faculty@example.com`
- Password: `faculty123`

---

## 📁 Project Structure

```
EduMeet/
├── FullStack_Version/          # Main application
│   ├── public/                 # Static files
│   │   ├── css/               # Stylesheets
│   │   ├── js/                # JavaScript files
│   │   ├── icons/             # PWA icons
│   │   ├── admin/             # Admin pages
│   │   ├── faculty/           # Faculty pages
│   │   └── student/           # Student pages
│   ├── routes/                # API routes
│   │   ├── admin.js
│   │   ├── faculty.js
│   │   ├── student.js
│   │   └── auth.js
│   ├── config/                # Configuration
│   │   └── database.js
│   ├── middleware/            # Middleware
│   │   └── auth.js
│   ├── server.js              # Main server file
│   ├── package.json
│   └── .env                   # Environment variables
├── Database/                  # Database files
│   └── edumeet_database.sql
├── Documentation/             # Project documentation
└── README.md
```

---

## 📚 Documentation

### User Guides
- [Installation Guide](INSTALLATION_GUIDE.md)
- [Admin Guide](ADMIN_GUIDE.md)
- [Bulk Upload Guide](FullStack_Version/BULK_UPLOAD_GUIDE.md)
- [Theme System](FullStack_Version/THEMES_COMPLETE.md)
- [PWA Guide](FullStack_Version/PWA_COMPLETE.md)

### Technical Documentation
- [Database Schema](Documentation/08_Database_Schema.md)
- [API Documentation](Documentation/API_DOCS.md)
- [SRS Document](Documentation/05_SRS_Document.md)
- [UML Diagrams](Documentation/07_UML_Diagrams.md)

---

## 🎨 Themes

EduMeet includes 10 beautiful themes:

1. 🌊 **Ocean Breeze** - Professional Blue (Default)
2. 🌸 **Sakura** - Soft Pink
3. 🌲 **Forest Green** - Nature
4. 🔥 **Sunset Orange** - Energetic
5. 🌙 **Midnight** - Dark Premium
6. ☀️ **Sunshine Yellow** - Cheerful
7. 💜 **Royal Purple** - Elegant
8. 🌈 **Rainbow** - Vibrant
9. 🏔️ **Arctic** - Minimal White
10. 🎓 **Academic** - Traditional

---

## 🔧 Configuration

### Environment Variables

Create `.env` file in `FullStack_Version/`:

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=edumeet_db
DB_PORT=3306

# Server
PORT=3000
NODE_ENV=development

# Session
SESSION_SECRET=your-secret-key-here
```

### Database Setup

```sql
-- Create database
CREATE DATABASE edumeet_db;

-- Import schema
mysql -u root -p edumeet_db < Database/edumeet_database.sql

-- Create sample users
node FullStack_Version/create_users.js
```

---

## 🧪 Testing

### Run Tests

```bash
# Test database connection
node FullStack_Version/test_dashboard.js

# Test PWA features
# Open: http://localhost:3000/pwa-test.html

# Test bulk upload
# Use sample CSV files in FullStack_Version/
```

### Browser Testing

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers

---

## 🤝 Contributing

We welcome contributions! Here's how:

### 1. Fork the Repository

Click "Fork" button on GitHub

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/EduMeet.git
cd EduMeet
```

### 3. Create Branch

```bash
git checkout -b feature/your-feature-name
```

### 4. Make Changes

- Write clean code
- Follow existing style
- Add comments
- Test thoroughly

### 5. Commit Changes

```bash
git add .
git commit -m "Add: Your feature description"
```

### 6. Push to GitHub

```bash
git push origin feature/your-feature-name
```

### 7. Create Pull Request

Go to GitHub and create a Pull Request

### Contribution Guidelines

- Follow code style
- Write clear commit messages
- Update documentation
- Add tests if applicable
- Be respectful and collaborative

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 EduMeet

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

See also the list of [contributors](https://github.com/yourusername/EduMeet/contributors) who participated in this project.

---

## 🙏 Acknowledgments

- Font Awesome for icons
- Chart.js for data visualization
- Node.js and Express.js communities
- All contributors and testers

---

## 📞 Support

### Get Help

- 📧 Email: support@edumeet.com
- 💬 Issues: [GitHub Issues](https://github.com/yourusername/EduMeet/issues)
- 📖 Docs: [Documentation](Documentation/)
- 💡 Discussions: [GitHub Discussions](https://github.com/yourusername/EduMeet/discussions)

### Report Bugs

Found a bug? [Open an issue](https://github.com/yourusername/EduMeet/issues/new)

### Request Features

Have an idea? [Start a discussion](https://github.com/yourusername/EduMeet/discussions/new)

---

## 🗺️ Roadmap

### Version 2.0 (Planned)

- [ ] Video call integration
- [ ] Calendar sync (Google, Outlook)
- [ ] Mobile apps (React Native)
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] API for third-party integration

### Version 1.5 (In Progress)

- [x] PWA support
- [x] Bulk upload
- [x] Theme system
- [x] Mobile responsive menu
- [ ] Email notifications
- [ ] SMS notifications

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/EduMeet?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/EduMeet?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/EduMeet)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/EduMeet)

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/EduMeet&type=Date)](https://star-history.com/#yourusername/EduMeet&Date)

---

<div align="center">

**Made with ❤️ for Education**

[⬆ Back to Top](#-edumeet---faculty-appointment-system)

</div>
