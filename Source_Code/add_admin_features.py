# Additional routes to add to app.py for admin student management

admin_routes = """
# Admin - Add Student
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
                # Check if email already exists
                cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
                if cursor.fetchone():
                    flash('Email already registered', 'error')
                    return redirect(url_for('admin_add_student'))
                
                # Hash password
                hashed_password = generate_password_hash(password)
                
                # Insert into users table
                cursor.execute("INSERT INTO users (email, password, user_type) VALUES (%s, %s, 'student')", (email, hashed_password))
                user_id = cursor.lastrowid
                
                # Insert into students table
                cursor.execute("INSERT INTO students (user_id, name, roll_number, department, phone) VALUES (%s, %s, %s, %s, %s)", (user_id, name, roll_number, department, phone))
                
                conn.commit()
                flash(f'Student added successfully! Credentials: {email} / {password}', 'success')
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

# Admin - Manage Students
@app.route('/admin/students')
def admin_manage_students():
    if 'user_id' not in session or session.get('user_type') != 'admin':
        flash('Please login as admin', 'error')
        return redirect(url_for('login'))
    
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        query = \"\"\"SELECT s.student_id, s.name, s.roll_number, s.department, s.phone, u.email, u.created_at
                   FROM students s JOIN users u ON s.user_id = u.user_id ORDER BY s.student_id DESC\"\"\"
        cursor.execute(query)
        students = cursor.fetchall()
        cursor.close()
        conn.close()
        return render_template('admin_manage_students.html', students=students)
    return render_template('admin_manage_students.html', students=[])

# Admin - Delete Student
@app.route('/admin/delete_student/<int:student_id>')
def admin_delete_student(student_id):
    if 'user_id' not in session or session.get('user_type') != 'admin':
        return redirect(url_for('login'))
    
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        try:
            # Get user_id first
            cursor.execute("SELECT user_id FROM students WHERE student_id = %s", (student_id,))
            result = cursor.fetchone()
            if result:
                user_id = result[0]
                # Delete student (will cascade delete user due to foreign key)
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

# Admin - Add Faculty
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
                flash(f'Faculty added successfully! Credentials: {email} / {password}', 'success')
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

# Admin - Manage Faculty
@app.route('/admin/faculty')
def admin_manage_faculty():
    if 'user_id' not in session or session.get('user_type') != 'admin':
        flash('Please login as admin', 'error')
        return redirect(url_for('login'))
    
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        query = \"\"\"SELECT f.faculty_id, f.name, f.department, f.designation, f.phone, u.email, u.created_at
                   FROM faculty f JOIN users u ON f.user_id = u.user_id ORDER BY f.faculty_id DESC\"\"\"
        cursor.execute(query)
        faculty_list = cursor.fetchall()
        cursor.close()
        conn.close()
        return render_template('admin_manage_faculty.html', faculty_list=faculty_list)
    return render_template('admin_manage_faculty.html', faculty_list=[])

# Admin - Delete Faculty
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
"""

print(admin_routes)
