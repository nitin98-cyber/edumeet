// Create Users with Proper Passwords
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function createUsers() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'edumeet_db'
        });

        console.log('Connected to database...');

        // Hash passwords
        const adminPass = await bcrypt.hash('admin123', 10);
        const facultyPass = await bcrypt.hash('faculty123', 10);
        const studentPass = await bcrypt.hash('student123', 10);

        // Clear existing users
        await connection.execute('DELETE FROM users');
        console.log('Cleared existing users...');

        // Insert Admin
        await connection.execute(
            'INSERT INTO users (email, password, user_type) VALUES (?, ?, ?)',
            ['admin@edumeet.com', adminPass, 'admin']
        );
        console.log('✓ Admin created');

        // Insert Faculty
        const [facultyResult] = await connection.execute(
            'INSERT INTO users (email, password, user_type) VALUES (?, ?, ?)',
            ['priya.sharma@college.edu', facultyPass, 'faculty']
        );
        await connection.execute(
            'INSERT INTO faculty (user_id, name, department, designation, phone) VALUES (?, ?, ?, ?, ?)',
            [facultyResult.insertId, 'Dr. Priya Sharma', 'Computer Science', 'Professor', '9876543210']
        );
        console.log('✓ Faculty created');

        // Insert Student
        const [studentResult] = await connection.execute(
            'INSERT INTO users (email, password, user_type) VALUES (?, ?, ?)',
            ['rahul.kumar@student.edu', studentPass, 'student']
        );
        await connection.execute(
            'INSERT INTO students (user_id, name, roll_number, department, phone) VALUES (?, ?, ?, ?, ?)',
            [studentResult.insertId, 'Rahul Kumar', '2021001', 'Computer Science', '9876543213']
        );
        console.log('✓ Student created');

        await connection.end();

        console.log('\n========================================');
        console.log('Users created successfully!');
        console.log('========================================');
        console.log('\nLogin Credentials:');
        console.log('Admin: admin@edumeet.com / admin123');
        console.log('Faculty: priya.sharma@college.edu / faculty123');
        console.log('Student: rahul.kumar@student.edu / student123');
        console.log('========================================\n');

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

createUsers();
