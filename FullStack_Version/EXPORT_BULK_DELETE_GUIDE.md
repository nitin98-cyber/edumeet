# 📥 Export & Bulk Delete Features Guide

## 🎯 Overview

Two powerful new features have been added to EduMeet:
1. **Export/Download Reports** - CSV and PDF exports
2. **Bulk Delete Actions** - Delete multiple users at once

---

## 📊 Export Features

### 1. Admin - Export Students (CSV)
**Location:** Admin Dashboard → Students Tab

**Features:**
- Downloads complete student list as CSV file
- Includes: ID, Name, Roll Number, Department, Section, Course, Phone, Email, Join Date
- Perfect for Excel/Google Sheets
- File name: `students_list.csv`

**How to Use:**
1. Login as admin
2. Go to Students tab
3. Click "Export CSV" button
4. File downloads automatically

---

### 2. Admin - Export Faculty (CSV)
**Location:** Admin Dashboard → Faculty Tab

**Features:**
- Downloads complete faculty list as CSV file
- Includes: ID, Name, Department, Designation, Course, Phone, Email, Join Date
- Perfect for Excel/Google Sheets
- File name: `faculty_list.csv`

**How to Use:**
1. Login as admin
2. Go to Faculty tab
3. Click "Export CSV" button
4. File downloads automatically

---

### 3. Faculty - Export Booking History (PDF)
**Location:** Faculty Dashboard → Appointment Requests Section

**Features:**
- Professional PDF document with:
  - Faculty information (name, department, designation)
  - Summary statistics (total, pending, approved, rejected)
  - Complete appointment details
  - Student information for each booking
  - Date, time, reason, status
- File name: `booking_history.pdf`

**How to Use:**
1. Login as faculty
2. Click "Export PDF" button in Appointment Requests section
3. PDF downloads automatically

---

### 4. Student - Download Appointment Receipt (PDF)
**Location:** Student Dashboard → My Appointments

**Features:**
- Beautiful formatted receipt with:
  - Receipt ID and generation date
  - Color-coded status badge
  - Complete student information
  - Faculty details
  - Appointment date, time, reason
  - Professional layout with borders
- File name: `appointment_receipt_[ID].pdf`

**How to Use:**
1. Login as student
2. Go to My Appointments
3. Click download icon (📥) next to any appointment
4. PDF receipt downloads automatically

---

## 🗑️ Bulk Delete Features

### 1. Bulk Delete Students
**Location:** Admin Dashboard → Students Tab

**Features:**
- Select multiple students using checkboxes
- Delete all selected students at once
- Confirmation dialog shows count
- "Delete Selected" button appears when students are selected

**How to Use:**
1. Login as admin
2. Go to Students tab
3. Check boxes next to students you want to delete
4. Click "Delete Selected" button (appears when selections made)
5. Confirm deletion
6. All selected students deleted instantly

**Tips:**
- Use checkbox in header to select/deselect all
- Button only shows when at least one student is selected
- Deletes user account and all related data

---

### 2. Bulk Delete Faculty
**Location:** Admin Dashboard → Faculty Tab

**Features:**
- Select multiple faculty using checkboxes
- Delete all selected faculty at once
- Confirmation dialog shows count
- "Delete Selected" button appears when faculty are selected

**How to Use:**
1. Login as admin
2. Go to Faculty tab
3. Check boxes next to faculty you want to delete
4. Click "Delete Selected" button (appears when selections made)
5. Confirm deletion
6. All selected faculty deleted instantly

**Tips:**
- Use checkbox in header to select/deselect all
- Button only shows when at least one faculty is selected
- Deletes user account and all related data

---

## 🔧 Technical Details

### API Endpoints

**Admin Exports:**
- `GET /api/admin/export/students` - Download students CSV
- `GET /api/admin/export/faculty` - Download faculty CSV

**Admin Bulk Delete:**
- `POST /api/admin/students/bulk-delete` - Delete multiple students
- `POST /api/admin/faculty/bulk-delete` - Delete multiple faculty

**Faculty Export:**
- `GET /api/faculty/export/bookings` - Download booking history PDF

**Student Export:**
- `GET /api/student/receipt/:appointmentId` - Download appointment receipt PDF

### Dependencies
- `pdfkit` - PDF generation
- `json2csv` - CSV generation

---

## 📝 Use Cases

### For Admins:
- **End of Semester:** Export student/faculty lists for records
- **Data Analysis:** Import CSV into Excel for analysis
- **Cleanup:** Bulk delete graduated students or retired faculty
- **Backup:** Regular exports for data backup

### For Faculty:
- **Reports:** Generate booking history for department reports
- **Records:** Keep PDF records of all consultations
- **Analysis:** Review appointment patterns and statistics

### For Students:
- **Proof:** Download receipt as proof of appointment
- **Records:** Keep personal records of all meetings
- **Sharing:** Share receipt with parents/advisors if needed

---

## ⚠️ Important Notes

1. **Bulk Delete is Permanent:** Cannot be undone. Always confirm before deleting.

2. **CSV Format:** Opens in Excel, Google Sheets, or any spreadsheet software.

3. **PDF Quality:** Professional quality, suitable for printing or sharing.

4. **File Downloads:** Files download to your browser's default download folder.

5. **Permissions:** Only admins can export lists and bulk delete. Faculty and students can only export their own data.

---

## 🎨 UI Elements

### Admin Dashboard:
- **Export CSV Button:** Green button with CSV icon
- **Delete Selected Button:** Red button (appears when selections made)
- **Checkboxes:** In first column of tables
- **Select All:** Checkbox in table header

### Faculty Dashboard:
- **Export PDF Button:** Green button with PDF icon
- Located in Appointment Requests card header

### Student Dashboard:
- **Download Icon:** Green download button in Actions column
- One button per appointment

---

## 🚀 Quick Start

1. **Install dependencies** (already done):
   ```bash
   npm install
   ```

2. **Start server**:
   ```bash
   npm start
   ```

3. **Test features**:
   - Admin: http://localhost:3000/admin/dashboard
   - Faculty: http://localhost:3000/faculty/dashboard
   - Student: http://localhost:3000/student/dashboard

---

## 📞 Support

If you encounter any issues:
1. Check browser console for errors
2. Verify server is running
3. Ensure you're logged in with correct user type
4. Check file download permissions in browser

---

**Enjoy the new features! 🎉**
