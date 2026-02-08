# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
## IEEE Standard Format

---

## 1. INTRODUCTION

### 1.1 Purpose
This Software Requirements Specification (SRS) document provides a complete description of the EduMeet: Faculty Availability & Appointment Management System. It describes the functional and non-functional requirements, system features, and interfaces for the software system.

**Intended Audience:**
- Developers
- Project Managers
- Testers
- Documentation Writers
- Users (Students, Faculty, Admin)

### 1.2 Scope
**Product Name:** EduMeet: Faculty Availability & Appointment System

**Product Features:**
- User authentication and authorization
- Faculty availability management
- Student appointment booking
- Appointment approval/rejection workflow
- Real-time conflict detection
- Appointment history tracking
- Administrative monitoring

**Benefits:**
- Reduces appointment coordination time
- Eliminates scheduling conflicts
- Improves communication efficiency
- Provides transparent tracking system

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|------------|
| **SRS** | Software Requirements Specification |
| **UI** | User Interface |
| **DBMS** | Database Management System |
| **HTTP** | Hypertext Transfer Protocol |
| **CRUD** | Create, Read, Update, Delete |
| **Admin** | Administrator |
| **Faculty** | Teacher/Professor |
| **Slot** | Time slot for appointment |
| **Session** | User login session |

### 1.4 References
- IEEE Std 830-1998: IEEE Recommended Practice for Software Requirements Specifications
- Python Flask Documentation
- MySQL Documentation
- HTML5, CSS3, JavaScript Standards

### 1.5 Overview
This document contains:
- Section 2: Overall Description (product perspective, functions, user characteristics)
- Section 3: Specific Requirements (functional and non-functional requirements)
- Section 4: System Features
- Section 5: External Interface Requirements

---

## 2. OVERALL DESCRIPTION

### 2.1 Product Perspective
EduMeet is a new, self-contained web-based system designed for educational institutions. It operates independently but can be integrated with existing student management systems in the future.

**System Interfaces:**
- Web Browser Interface (Chrome, Firefox, Edge, Safari)
- MySQL Database Server
- Flask Web Server

**User Interfaces:**
- Responsive web pages
- Forms for data entry
- Dashboards for different user roles
- Calendar view for availability

**Hardware Interfaces:**
- Standard computer/laptop with internet connection
- Minimum 4GB RAM
- Modern web browser

**Software Interfaces:**
- Operating System: Windows/Linux/MacOS
- Web Server: Flask Development Server / Apache / Nginx
- Database: MySQL 5.7 or higher
- Browser: Chrome 90+, Firefox 88+, Edge 90+

**Communication Interfaces:**
- HTTP/HTTPS protocol
- TCP/IP network communication

### 2.2 Product Functions
Major functions include:

1. **User Management**
   - Registration
   - Login/Logout
   - Profile management

2. **Availability Management**
   - Create time slots
   - Update time slots
   - Delete time slots

3. **Appointment Management**
   - Book appointment
   - View appointments
   - Cancel appointment
   - Approve/Reject appointment

4. **Notification System**
   - Status updates
   - Confirmation messages

5. **Administrative Functions**
   - User management
   - System monitoring
   - Report generation

### 2.3 User Characteristics

#### Student Users
- **Education Level:** Undergraduate/Postgraduate
- **Technical Expertise:** Basic computer and internet skills
- **Activities:** Book appointments, track status, view history

#### Faculty Users
- **Education Level:** Postgraduate/PhD
- **Technical Expertise:** Moderate computer skills
- **Activities:** Manage availability, approve/reject appointments

#### Admin Users
- **Education Level:** Graduate or above
- **Technical Expertise:** Good computer skills
- **Activities:** Manage users, monitor system, generate reports

### 2.4 Constraints
1. **Regulatory Constraints:** Must comply with data privacy regulations
2. **Hardware Limitations:** Requires internet connectivity
3. **Interface Requirements:** Must work on standard web browsers
4. **Security Requirements:** Password encryption mandatory
5. **Database Constraints:** MySQL database required

### 2.5 Assumptions and Dependencies
**Assumptions:**
- Users have basic internet knowledge
- Stable internet connection available
- Users have valid email addresses
- Faculty will regularly update availability

**Dependencies:**
- Python Flask framework
- MySQL database server
- Web browser compatibility
- Server uptime and availability

---

## 3. SPECIFIC REQUIREMENTS

### 3.1 Functional Requirements

#### 3.1.1 User Authentication Module

**FR-1.1: User Registration**
- **Description:** System shall allow students to register with valid credentials
- **Input:** Name, Email, Roll Number, Password, Department
- **Process:** Validate input, check duplicate email, hash password, store in database
- **Output:** Registration success/failure message
- **Priority:** High

**FR-1.2: User Login**
- **Description:** System shall authenticate users based on email and password
- **Input:** Email, Password, User Type
- **Process:** Verify credentials, create session
- **Output:** Redirect to respective dashboard
- **Priority:** High

**FR-1.3: User Logout**
- **Description:** System shall allow users to logout securely
- **Input:** Logout button click
- **Process:** Destroy session, clear cookies
- **Output:** Redirect to login page
- **Priority:** Medium

#### 3.1.2 Faculty Module

**FR-2.1: Define Availability**
- **Description:** Faculty can create available time slots
- **Input:** Date, Start Time, End Time, Duration
- **Process:** Validate time format, check conflicts, save to database
- **Output:** Slot created confirmation
- **Priority:** High

**FR-2.2: View Appointment Requests**
- **Description:** Faculty can view all pending appointment requests
- **Input:** Faculty ID (from session)
- **Process:** Query database for pending appointments
- **Output:** List of appointment requests with student details
- **Priority:** High

**FR-2.3: Approve Appointment**
- **Description:** Faculty can approve appointment requests
- **Input:** Appointment ID, Approval action
- **Process:** Update appointment status to "Approved"
- **Output:** Confirmation message
- **Priority:** High

**FR-2.4: Reject Appointment**
- **Description:** Faculty can reject appointment requests
- **Input:** Appointment ID, Rejection reason
- **Process:** Update appointment status to "Rejected"
- **Output:** Confirmation message
- **Priority:** High

**FR-2.5: View Appointment History**
- **Description:** Faculty can view past appointments
- **Input:** Faculty ID, Date range (optional)
- **Process:** Query database for completed appointments
- **Output:** List of past appointments
- **Priority:** Medium

#### 3.1.3 Student Module

**FR-3.1: View Faculty List**
- **Description:** Students can view all available faculty members
- **Input:** Department filter (optional)
- **Process:** Query database for faculty list
- **Output:** Display faculty names and departments
- **Priority:** High

**FR-3.2: View Faculty Availability**
- **Description:** Students can view available time slots for selected faculty
- **Input:** Faculty ID
- **Process:** Query available slots, exclude booked slots
- **Output:** Calendar view with available slots
- **Priority:** High

**FR-3.3: Book Appointment**
- **Description:** Students can book an available time slot
- **Input:** Faculty ID, Slot ID, Reason for appointment
- **Process:** Check slot availability, create appointment record
- **Output:** Booking confirmation
- **Priority:** High

**FR-3.4: Track Appointment Status**
- **Description:** Students can view status of their appointments
- **Input:** Student ID (from session)
- **Process:** Query appointments with status
- **Output:** List of appointments with status (Pending/Approved/Rejected)
- **Priority:** High

**FR-3.5: Cancel Appointment**
- **Description:** Students can cancel their appointments
- **Input:** Appointment ID
- **Process:** Update status to "Cancelled", free up slot
- **Output:** Cancellation confirmation
- **Priority:** Medium

#### 3.1.4 Admin Module

**FR-4.1: Manage Users**
- **Description:** Admin can add, edit, or delete users
- **Input:** User details, Action type
- **Process:** Perform CRUD operations on user table
- **Output:** Success/failure message
- **Priority:** High

**FR-4.2: View All Appointments**
- **Description:** Admin can view all appointments in system
- **Input:** Date range, Status filter (optional)
- **Process:** Query all appointments
- **Output:** Complete appointment list
- **Priority:** Medium

**FR-4.3: Generate Reports**
- **Description:** Admin can generate appointment statistics
- **Input:** Report type, Date range
- **Process:** Aggregate data, calculate statistics
- **Output:** Report with charts/tables
- **Priority:** Low

#### 3.1.5 Conflict Prevention

**FR-5.1: Check Slot Availability**
- **Description:** System shall prevent double booking
- **Input:** Faculty ID, Date, Time
- **Process:** Check if slot is already booked
- **Output:** Available/Not Available status
- **Priority:** Critical

**FR-5.2: Validate Time Slots**
- **Description:** System shall validate time slot logic
- **Input:** Start time, End time
- **Process:** Ensure end time > start time, reasonable duration
- **Output:** Valid/Invalid status
- **Priority:** High

### 3.2 Non-Functional Requirements

#### 3.2.1 Performance Requirements

**NFR-1.1: Response Time**
- Page load time: < 3 seconds
- Database query response: < 1 second
- Form submission: < 2 seconds

**NFR-1.2: Throughput**
- Support 100 concurrent users
- Handle 1000 appointments per day

**NFR-1.3: Capacity**
- Store data for 10,000 users
- Maintain 5 years of appointment history

#### 3.2.2 Security Requirements

**NFR-2.1: Authentication**
- Password must be hashed using secure algorithm
- Session timeout after 30 minutes of inactivity
- Failed login attempts limited to 5

**NFR-2.2: Authorization**
- Role-based access control implemented
- Users can only access authorized pages
- SQL injection prevention

**NFR-2.3: Data Privacy**
- Personal information encrypted
- Secure HTTPS connection (production)
- Password recovery through email verification

#### 3.2.3 Usability Requirements

**NFR-3.1: User Interface**
- Intuitive and easy to navigate
- Consistent design across all pages
- Clear error messages

**NFR-3.2: Learnability**
- New users can book appointment within 5 minutes
- No training required for basic operations

**NFR-3.3: Accessibility**
- Responsive design for mobile devices
- Compatible with screen readers
- Keyboard navigation support

#### 3.2.4 Reliability Requirements

**NFR-4.1: Availability**
- System uptime: 99% (excluding maintenance)
- Scheduled maintenance: < 2 hours per month

**NFR-4.2: Fault Tolerance**
- Graceful error handling
- Database backup daily
- Recovery time: < 4 hours

#### 3.2.5 Maintainability Requirements

**NFR-5.1: Code Quality**
- Well-commented code
- Modular design
- Follow PEP 8 style guide (Python)

**NFR-5.2: Documentation**
- Complete user manual
- Technical documentation
- API documentation

#### 3.2.6 Portability Requirements

**NFR-6.1: Platform Independence**
- Works on Windows, Linux, MacOS
- Browser compatibility: Chrome, Firefox, Edge, Safari

**NFR-6.2: Database Portability**
- Can migrate to other SQL databases with minimal changes

---

## 4. SYSTEM FEATURES

### 4.1 Feature: User Authentication
**Priority:** High
**Description:** Secure login system for all user types

**Functional Requirements:**
- FR-1.1: User Registration
- FR-1.2: User Login
- FR-1.3: User Logout

**Use Case:** Student registers and logs in to access system

### 4.2 Feature: Appointment Booking
**Priority:** High
**Description:** Students can book appointments with faculty

**Functional Requirements:**
- FR-3.1: View Faculty List
- FR-3.2: View Faculty Availability
- FR-3.3: Book Appointment

**Use Case:** Student selects faculty, views available slots, books appointment

### 4.3 Feature: Appointment Management
**Priority:** High
**Description:** Faculty can manage appointment requests

**Functional Requirements:**
- FR-2.2: View Appointment Requests
- FR-2.3: Approve Appointment
- FR-2.4: Reject Appointment

**Use Case:** Faculty reviews requests and approves/rejects them

### 4.4 Feature: Conflict Prevention
**Priority:** Critical
**Description:** System prevents double booking

**Functional Requirements:**
- FR-5.1: Check Slot Availability
- FR-5.2: Validate Time Slots

**Use Case:** System checks availability before confirming booking

---

## 5. EXTERNAL INTERFACE REQUIREMENTS

### 5.1 User Interfaces

**UI-1: Login Page**
- Fields: Email, Password, User Type
- Buttons: Login, Register
- Validation: Required fields, email format

**UI-2: Student Dashboard**
- Sections: Available Faculty, My Appointments, Profile
- Navigation: Book Appointment, View History, Logout

**UI-3: Faculty Dashboard**
- Sections: My Availability, Appointment Requests, History
- Navigation: Manage Slots, View Requests, Logout

**UI-4: Admin Dashboard**
- Sections: User Management, Appointments, Reports
- Navigation: Manage Users, View Appointments, Logout

### 5.2 Hardware Interfaces
- Standard keyboard and mouse
- Display resolution: Minimum 1024x768
- Internet connection: Minimum 1 Mbps

### 5.3 Software Interfaces

**Database Interface:**
- Database: MySQL 5.7+
- Connection: Flask-MySQL connector
- Operations: CRUD operations via SQL queries

**Web Server Interface:**
- Server: Flask Development Server
- Protocol: HTTP/HTTPS
- Port: 5000 (default)

### 5.4 Communication Interfaces
- Protocol: HTTP/HTTPS
- Data Format: JSON for AJAX requests
- Email: SMTP for notifications (optional)

---

## 6. OTHER REQUIREMENTS

### 6.1 Database Requirements
- MySQL database with proper indexing
- Foreign key constraints for data integrity
- Regular backups

### 6.2 Legal Requirements
- Comply with data protection regulations
- User consent for data collection
- Privacy policy displayed

### 6.3 Operational Requirements
- System administrator for maintenance
- Regular database backups
- Log file monitoring

---

## APPENDIX A: GLOSSARY

- **Appointment:** Scheduled meeting between student and faculty
- **Slot:** Time period available for appointment
- **Session:** User login session with timeout
- **Dashboard:** Main page after login showing overview

---

## APPENDIX B: ANALYSIS MODELS

### Use Case Diagram
(Refer to UML Diagrams document)

### Class Diagram
(Refer to UML Diagrams document)

### Sequence Diagram
(Refer to UML Diagrams document)

---

**Document Version:** 1.0  
**Date:** February 2026  
**Prepared By:** Software Engineering Team  
**Approved By:** Project Supervisor
