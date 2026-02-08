# EduMeet: Faculty Availability & Appointment System
from flask import Flask, render_template, request, redirect, url_for, session, flash
from werkzeug.security import generate_password_hash, check_password_hash
import mysql.connector
from datetime import datetime, date
from config import DB_CONFIG, SECRET_KEY

app = Flask(__name__)
app.secret_key = SECRET_KEY

def get_db_connection():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        return conn
    except mysql.connector.Error as err:
        print(f"Database connection error: {err}")
        return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user_type = request.form['user_type']
        
        conn = get_db_connection()
        if conn:
            cursor = conn.cursor(dictionary=True)
            query = "SELECT * FROM users WHERE email = %s AND user_type = %s"
            cursor.execute(query, (email, user_type))
            user = cursor.fetchone()
            
            if user and check_password_hash(user['password'], password):
                session['user_id'] = user['user_id']
                session['email'] = user['email']
                session['user_type'] = user['user_type']
                
                if user_type == 'student':
                    cursor.execute("SELECT student_id, name FROM students WHERE user_id = %s", (user['user_id'],))
                    student = cursor.fetchone()
                    session['student_id'] = student['student_id']
                    session['name'] = student['name']
                    cursor.close()
                    conn.close()
                    return redirect(url_for('student_dashboard'))
                elif user_type == 'faculty':
                    cursor.execute("SELECT faculty_id, name FROM faculty WHERE user_id = %s", (user['user_id'],))
                    faculty = cursor.fetchone()
                    session['faculty_id'] = faculty['faculty_id']
                    session['name'] = faculty['name']
                    cursor.close()
                    conn.close()
                    return redirect(url_for('faculty_dashboard'))
                elif user_type == 'admin':
                    session['name'] = 'Admin'
                    cursor.close()
                    conn.close()
                    return redirect(url_for('admin_dashboard'))
            else:
                flash('Invalid email or password', 'error')
            cursor.close()
            conn.close()
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    # Registration disabled - only admin can add students
    flash('Student registration is disabled. Please contact admin for account creation.', 'error')
    return redirect(url_for('login'))

@app.route('/logout')
def logout():
    session.clear()
    flash('Logged out successfully', 'success')
    return redirect(url_for('index'))

@app.route('/student/dashboard')
def student_dashboard():
    if 'user_id' not in session or session.get('user_type') != 'student':
        flash('Please login as student', 'error')
        return redirect(url_for('login'))
    
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        query = """SELECT a.appointment_id, f.name AS faculty_name, f.department, t.date, t.start_time, t.end_time, a.reason, a.status, a.created_at
                   FROM appointments a JOIN faculty f ON a.faculty_id = f.faculty_id JOIN time_slots t ON a.slot_id = t.slot_id
                   WHERE a.student_id = %s ORDER BY t.date DESC, t.start_time DESC"""
        cursor.execute(query, (session['student_id'],))
        appointments = cursor.fetchall()
        cursor.close()
        conn.close()
        return render_template('student_dashboard.html', appointments=appointments)
    return render_template('student_dashboard.html', appointments=[])

@app.route('/student/faculty')
def view_faculty():
    if 'user_id' not in session or session.get('user_type') != 'student':
        flash('Please login as student', 'error')
        return redirect(url_for('login'))
    
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT faculty_id, name, department, designation, phone FROM faculty")
        faculty_list = cursor.fetchall()
        cursor.close()
        conn.close()
        return render_template('book_appointment.html', faculty_list=faculty_list)
    return render_template('book_appointment.html', faculty_list=[])

@app.route('/student/slots/<int:faculty_id>')
def view_slots(faculty_id):
    if 'user_id' not in session or session.get('user_type') != 'student':
        return redirect(url_for('login'))
    
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT name, department FROM faculty WHERE faculty_id = %s", (faculty_id,))
        faculty = cursor.fetchone()
        query = "SELECT slot_id, date, start_time, end_time FROM time_slots WHERE faculty_id = %s AND is_available = TRUE AND date >= CURDATE() ORDER BY date, start_time"
        cursor.execute(query, (faculty_id,))
        slots = cursor.fetchall()
        cursor.close()
        conn.close()
        return render_template('view_slots.html', faculty=faculty, slots=slots, faculty_id=faculty_id)
    return redirect(url_for('view_faculty'))

@app.route('/student/book/<int:slot_id>', methods=['GET', 'POST'])
def book_appointment(slot_id):
    if 'user_id' not in session or session.get('user_type') != 'student':
        flash('Please login as student', 'error')
        return redirect(url_for('login'))
    
    if request.method == 'POST':
        reason = request.form['reason']
        conn = get_db_connection()
        if conn:
            cursor = conn.cursor(dictionary=True)
            try:
                cursor.execute("SELECT faculty_id, is_available FROM time_slots WHERE slot_id = %s", (slot_id,))
                slot = cursor.fetchone()
                if not slot or not slot['is_available']:
                    flash('Slot is no longer available', 'error')
                    return redirect(url_for('view_faculty'))
                cursor.execute("INSERT INTO appointments (student_id, faculty_id, slot_id, reason, status) VALUES (%s, %s, %s, %s, 'Pending')", (session['student_id'], slot['faculty_id'], slot_id, reason))
                cursor.execute("UPDATE time_slots SET is_available = FALSE WHERE slot_id = %s", (slot_id,))
                conn.commit()
                flash('Appointment booked successfully! Waiting for faculty approval.', 'success')
                cursor.close()
                conn.close()
                return redirect(url_for('student_dashboard'))
            except mysql.connector.Error as err:
                flash(f'Booking failed: {err}', 'error')
                conn.rollback()
            finally:
                cursor.close()
                conn.close()
    
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        query = "SELECT t.slot_id, t.date, t.start_time, t.end_time, f.name AS faculty_name FROM time_slots t JOIN faculty f ON t.faculty_id = f.faculty_id WHERE t.slot_id = %s"
        cursor.execute(query, (slot_id,))
        slot = cursor.fetchone()
        cursor.close()
        conn.close()
        return render_template('confirm_booking.html', slot=slot)
    return redirect(url_for('view_faculty'))

@app.route('/student/cancel/<int:appointment_id>')
def cancel_appointment(appointment_id):
    if 'user_id' not in session or session.get('user_type') != 'student':
        return redirect(url_for('login'))
    
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT slot_id FROM appointments WHERE appointment_id = %s AND student_id = %s", (appointment_id, session['student_id']))
            result = cursor.fetchone()
            if result:
                slot_id = result[0]
                cursor.execute("UPDATE appointments SET status = 'Cancelled' WHERE appointment_id = %s", (appointment_id,))
                cursor.execute("UPDATE time_slots SET is_available = TRUE WHERE slot_id = %s", (slot_id,))
                conn.commit()
                flash('Appointment cancelled successfully', 'success')
            else:
                flash('Appointment not found', 'error')
        except mysql.connector.Error as err:
            flash(f'Cancellation failed: {err}', 'error')
            conn.rollback()
        finally:
            cursor.close()
            conn.close()
    return redirect(url_for('student_dashboard'))

@app.route('/faculty/dashboard')
def faculty_dashboard():
    if 'user_id' not in session or session.get('user_type') != 'faculty':
        flash('Please login as faculty', 'error')
        return redirect(url_for('login'))
    
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        query = """SELECT a.appointment_id, s.name AS student_name, s.roll_number, s.department, t.date, t.start_time, t.end_time, a.reason, a.status, a.created_at
                   FROM appointments a JOIN students s ON a.student_id = s.student_id JOIN time_slots t ON a.slot_id = t.slot_id
                   WHERE a.faculty_id = %s ORDER BY t.date, t.start_time"""
        cursor.execute(query, (session['faculty_id'],))
        appointments = cursor.fetchall()
        cursor.execute("SELECT slot_id, date, start_time, end_time, is_available FROM time_slots WHERE faculty_id = %s AND date >= CURDATE() ORDER BY date, start_time", (session['faculty_id'],))
        slots = cursor.fetchall()
        cursor.close()
        conn.close()
        return render_template('faculty_dashboard.html', appointments=appointments, slots=slots)
    return render_template('faculty_dashboard.html', appointments=[], slots=[])

@app.route('/faculty/slots', methods=['GET', 'POST'])
def manage_slots():
    if 'user_id' not in session or session.get('user_type') != 'faculty':
        flash('Please login as faculty', 'error')
        return redirect(url_for('login'))
    
    if request.method == 'POST':
        date = request.form['date']
        start_time = request.form['start_time']
        end_time = request.form['end_time']
        conn = get_db_connection()
        if conn:
            cursor = conn.cursor()
            try:
                if start_time >= end_time:
                    flash('End time must be after start time', 'error')
                    return redirect(url_for('manage_slots'))
                cursor.execute("INSERT INTO time_slots (faculty_id, date, start_time, end_time, is_available) VALUES (%s, %s, %s, %s, TRUE)", (session['faculty_id'], date, start_time, end_time))
                conn.commit()
                flash('Time slot added successfully', 'success')
            except mysql.connector.Error as err:
                flash(f'Failed to add slot: {err}', 'error')
                conn.rollback()
            finally:
                cursor.close()
                conn.close()
        return redirect(url_for('faculty_dashboard'))
    return render_template('manage_slots.html')

@app.route('/faculty/delete_slot/<int:slot_id>')
def delete_slot(slot_id):
    if 'user_id' not in session or session.get('user_type') != 'faculty':
        return redirect(url_for('login'))
    
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT COUNT(*) FROM appointments WHERE slot_id = %s", (slot_id,))
            count = cursor.fetchone()[0]
            if count > 0:
                flash('Cannot delete slot with existing appointments', 'error')
            else:
                cursor.execute("DELETE FROM time_slots WHERE slot_id = %s AND faculty_id = %s", (slot_id, session['faculty_id']))
                conn.commit()
                flash('Slot deleted successfully', 'success')
        except mysql.connector.Error as err:
            flash(f'Failed to delete slot: {err}', 'error')
            conn.rollback()
        finally:
            cursor.close()
            conn.close()
    return redirect(url_for('faculty_dashboard'))

@app.route('/faculty/approve/<int:appointment_id>')
def approve_appointment(appointment_id):
    if 'user_id' not in session or session.get('user_type') != 'faculty':
        return redirect(url_for('login'))
    
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        try:
            cursor.execute("UPDATE appointments SET status = 'Approved' WHERE appointment_id = %s AND faculty_id = %s", (appointment_id, session['faculty_id']))
            conn.commit()
            flash('Appointment approved', 'success')
        except mysql.connector.Error as err:
            flash(f'Failed to approve: {err}', 'error')
            conn.rollback()
        finally:
            cursor.close()
            conn.close()
    return redirect(url_for('faculty_dashboard'))

@app.route('/faculty/reject/<int:appointment_id>')
def reject_appointment(appointment_id):
    if 'user_id' not in session or session.get('user_type') != 'faculty':
        return redirect(url_for('login'))
    
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT slot_id FROM appointments WHERE appointment_id = %s", (appointment_id,))
            result = cursor.fetchone()
            if result:
                slot_id = result[0]
                cursor.execute("UPDATE appointments SET status = 'Rejected' WHERE appointment_id = %s AND faculty_id = %s", (appointment_id, session['faculty_id']))
                cursor.execute("UPDATE time_slots SET is_available = TRUE WHERE slot_id = %s", (slot_id,))
                conn.commit()
                flash('Appointment rejected', 'success')
        except mysql.connector.Error as err:
            flash(f'Failed to reject: {err}', 'error')
            conn.rollback()
        finally:
            cursor.close()
            conn.close()
    return redirect(url_for('faculty_dashboard'))

@app.route('/admin/dashboard')
def admin_dashboard():
    if 'user_id' not in session or session.get('user_type') != 'admin':
        flash('Please login as admin', 'error')
        return redirect(url_for('login'))
    
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT COUNT(*) as count FROM students")
        student_count = cursor.fetchone()['count']
        cursor.execute("SELECT COUNT(*) as count FROM faculty")
        faculty_count = cursor.fetchone()['count']
        cursor.execute("SELECT COUNT(*) as count FROM appointments")
        appointment_count = cursor.fetchone()['count']
        cursor.execute("SELECT COUNT(*) as count FROM appointments WHERE status = 'Pending'")
        pending_count = cursor.fetchone()['count']
        query = """SELECT a.appointment_id, s.name AS student_name, f.name AS faculty_name, t.date, t.start_time, a.status
                   FROM appointments a JOIN students s ON a.student_id = s.student_id JOIN faculty f ON a.faculty_id = f.faculty_id
                   JOIN time_slots t ON a.slot_id = t.slot_id ORDER BY a.created_at DESC LIMIT 10"""
        cursor.execute(query)
        recent_appointments = cursor.fetchall()
        cursor.close()
        conn.close()
        stats = {'students': student_count, 'faculty': faculty_count, 'appointments': appointment_count, 'pending': pending_count}
        return render_template('admin_dashboard.html', stats=stats, appointments=recent_appointments)
    return render_template('admin_dashboard.html', stats={}, appointments=[])

@app.route('/admin/add_student', methods=['GET', 'POST'])
def admin_add_student():
    if 'user_id' not in session or session.get('user_type') != 'admin':
        flash('Please login as admin', 'error')
        return redirect(url_for('login'))
    
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        roll_number = request.form['roll_number']
        department = request.form['department']
        phone = request.form['phone']
        password = request.form['password']
        
        conn = get_db_connection()
        if conn:
            cursor = conn.cursor()
            try:
                cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
                if cursor.fetchone():
                    flash('Email already registered', 'error')
                    return redirect(url_for('admin_add_student'))
                
                hashed_password = generate_password_hash(password)
                cursor.execute("INSERT INTO users (email, password, user_type) VALUES (%s, %s, 'student')", (email, hashed_password))
                user_id = cursor.lastrowid
                cursor.execute("INSERT INTO students (user_id, name, roll_number, department, phone) VALUES (%s, %s, %s, %s, %s)", (user_id, name, roll_number, department, phone))
                
                conn.commit()
                flash(f'Student added! Login: {email} / Password: {password}', 'success')
                cursor.close()
                conn.close()
                return redirect(url_for('admin_manage_students'))
            except mysql.connector.Error as err:
                flash(f'Failed to add student: {err}', 'error')
                conn.rollback()
            finally:
                cursor.close()
                conn.close()
    
    return render_template('admin_add_student.html')

@app.route('/admin/students')
def admin_manage_students():
    if 'user_id' not in session or session.get('user_type') != 'admin':
        flash('Please login as admin', 'error')
        return redirect(url_for('login'))
    
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        query = """SELECT s.student_id, s.name, s.roll_number, s.department, s.phone, u.email, u.created_at
                   FROM students s JOIN users u ON s.user_id = u.user_id ORDER BY s.student_id DESC"""
        cursor.execute(query)
        students = cursor.fetchall()
        cursor.close()
        conn.close()
        return render_template('admin_manage_students.html', students=students)
    return render_template('admin_manage_students.html', students=[])

@app.route('/admin/delete_student/<int:student_id>')
def admin_delete_student(student_id):
    if 'user_id' not in session or session.get('user_type') != 'admin':
        return redirect(url_for('login'))
    
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT user_id FROM students WHERE student_id = %s", (student_id,))
            result = cursor.fetchone()
            if result:
                user_id = result[0]
                cursor.execute("DELETE FROM users WHERE user_id = %s", (user_id,))
                conn.commit()
                flash('Student deleted successfully', 'success')
            else:
                flash('Student not found', 'error')
        except mysql.connector.Error as err:
            flash(f'Failed to delete student: {err}', 'error')
            conn.rollback()
        finally:
            cursor.close()
            conn.close()
    return redirect(url_for('admin_manage_students'))

@app.route('/admin/add_faculty', methods=['GET', 'POST'])
def admin_add_faculty():
    if 'user_id' not in session or session.get('user_type') != 'admin':
        flash('Please login as admin', 'error')
        return redirect(url_for('login'))
    
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        department = request.form['department']
        designation = request.form['designation']
        phone = request.form['phone']
        password = request.form['password']
        
        conn = get_db_connection()
        if conn:
            cursor = conn.cursor()
            try:
                cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
                if cursor.fetchone():
                    flash('Email already registered', 'error')
                    return redirect(url_for('admin_add_faculty'))
                
                hashed_password = generate_password_hash(password)
                cursor.execute("INSERT INTO users (email, password, user_type) VALUES (%s, %s, 'faculty')", (email, hashed_password))
                user_id = cursor.lastrowid
                cursor.execute("INSERT INTO faculty (user_id, name, department, designation, phone) VALUES (%s, %s, %s, %s, %s)", (user_id, name, department, designation, phone))
                
                conn.commit()
                flash(f'Faculty added! Login: {email} / Password: {password}', 'success')
                cursor.close()
                conn.close()
                return redirect(url_for('admin_manage_faculty'))
            except mysql.connector.Error as err:
                flash(f'Failed to add faculty: {err}', 'error')
                conn.rollback()
            finally:
                cursor.close()
                conn.close()
    
    return render_template('admin_add_faculty.html')

@app.route('/admin/faculty')
def admin_manage_faculty():
    if 'user_id' not in session or session.get('user_type') != 'admin':
        flash('Please login as admin', 'error')
        return redirect(url_for('login'))
    
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        query = """SELECT f.faculty_id, f.name, f.department, f.designation, f.phone, u.email, u.created_at
                   FROM faculty f JOIN users u ON f.user_id = u.user_id ORDER BY f.faculty_id DESC"""
        cursor.execute(query)
        faculty_list = cursor.fetchall()
        cursor.close()
        conn.close()
        return render_template('admin_manage_faculty.html', faculty_list=faculty_list)
    return render_template('admin_manage_faculty.html', faculty_list=[])

@app.route('/admin/delete_faculty/<int:faculty_id>')
def admin_delete_faculty(faculty_id):
    if 'user_id' not in session or session.get('user_type') != 'admin':
        return redirect(url_for('login'))
    
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT user_id FROM faculty WHERE faculty_id = %s", (faculty_id,))
            result = cursor.fetchone()
            if result:
                user_id = result[0]
                cursor.execute("DELETE FROM users WHERE user_id = %s", (user_id,))
                conn.commit()
                flash('Faculty deleted successfully', 'success')
            else:
                flash('Faculty not found', 'error')
        except mysql.connector.Error as err:
            flash(f'Failed to delete faculty: {err}', 'error')
            conn.rollback()
        finally:
            cursor.close()
            conn.close()
    return redirect(url_for('admin_manage_faculty'))

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(e):
    return render_template('500.html'), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
